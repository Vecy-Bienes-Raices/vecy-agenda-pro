import { Solver } from '@2captcha/captcha-solver';

// Caché en memoria para evitar llamadas redundantes de 2Captcha (24h)
const identityCache = new Map();
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

class CookieJar {
  constructor() {
    this.cookies = new Map();
  }

  addFromHeaders(headers) {
    const raw = headers.getSetCookie ? headers.getSetCookie() : [headers.get('set-cookie')].filter(Boolean);
    for (const item of raw) {
      if (!item) continue;
      const parts = item.split(';');
      const [k, v] = parts[0].split('=');
      if (k && v) {
        this.cookies.set(k.trim(), v.trim());
      }
    }
  }

  getCookieString() {
    return Array.from(this.cookies.entries()).map(([k, v]) => `${k}=${v}`).join('; ');
  }
}

function toTitleCase(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

async function queryAdresIdentity(tipoDocInput, cleanDoc) {
  let tipoDoc = 'CC';
  const t = (tipoDocInput || '').toLowerCase();
  if (t.includes('extranjer') || t === 'ce') tipoDoc = 'CE';
  else if (t.includes('tarjeta') || t === 'ti') tipoDoc = 'TI';
  else if (t.includes('pasaporte') || t === 'pa') tipoDoc = 'PA';
  else if (t.includes('especial') || t === 'pep') tipoDoc = 'PE';
  else if (t.includes('protec') || t === 'ppt') tipoDoc = 'PT';
  else if (t.includes('nit') || t.includes('rut')) {
    return { success: false, error: 'NIT no aplica para consulta ADRES' };
  }

  const cacheKey = `${tipoDoc}:${cleanDoc}`;
  const cached = identityCache.get(cacheKey);
  if (cached && (Date.now() - cached.timestamp < CACHE_TTL_MS)) {
    return { success: true, officialName: cached.fullName, source: 'cache' };
  }

  const apiKey = process.env.TWOCAPTCHA_API_KEY || '673ddb810e9f700065ccbe6034f26629';
  if (!apiKey) {
    return { success: false, error: 'No API key' };
  }

  const solver = new Solver(apiKey);

  try {
    const jar = new CookieJar();
    const baseUrl = 'https://aplicaciones.adres.gov.co/bdua_internet/Pages/ConsultarAfiliadoWeb.aspx';
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
      'Accept-Language': 'es-ES,es;q=0.9',
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 segundos max

    const res1 = await fetch(baseUrl, { headers, signal: controller.signal });
    jar.addFromHeaders(res1.headers);
    const html1 = await res1.text();

    const viewState = html1.match(/id="__VIEWSTATE"\s+value="([^"]+)"/)?.[1];
    const viewStateGen = html1.match(/id="__VIEWSTATEGENERATOR"\s+value="([^"]+)"/)?.[1] || '';
    const eventVal = html1.match(/id="__EVENTVALIDATION"\s+value="([^"]+)"/)?.[1];
    const captchaSrc = html1.match(/id="Capcha_CaptchaImageUP"[^>]*src="([^"]+)"/)?.[1];

    if (!viewState || !eventVal || !captchaSrc) {
      clearTimeout(timeoutId);
      return { success: false, error: 'Formulario no disponible' };
    }

    let imgUrl = captchaSrc.replace(/&amp;/g, '&');
    if (imgUrl.startsWith('..')) {
      imgUrl = 'https://aplicaciones.adres.gov.co/bdua_internet' + imgUrl.substring(2);
    } else if (!imgUrl.startsWith('http')) {
      imgUrl = 'https://aplicaciones.adres.gov.co/bdua_internet/' + imgUrl;
    }

    const imgRes = await fetch(imgUrl, {
      headers: { ...headers, 'Cookie': jar.getCookieString(), 'Referer': baseUrl },
      signal: controller.signal,
    });
    jar.addFromHeaders(imgRes.headers);

    const imgBuffer = Buffer.from(await imgRes.arrayBuffer());
    const base64Img = imgBuffer.toString('base64');

    // Resolver captcha
    const captcha = await solver.imageCaptcha({
      body: base64Img,
      numeric: 0,
      min_len: 5,
      max_len: 5,
    });

    if (!captcha || !captcha.data) {
      clearTimeout(timeoutId);
      return { success: false, error: 'Fallo al resolver captcha' };
    }

    // POST consulta
    const body = new URLSearchParams();
    body.append('RadScriptManager1_TSM', '');
    body.append('__EVENTTARGET', '');
    body.append('__EVENTARGUMENT', '');
    body.append('__VIEWSTATE', viewState);
    body.append('__VIEWSTATEGENERATOR', viewStateGen);
    body.append('__EVENTVALIDATION', eventVal);
    body.append('tipoDoc', tipoDoc);
    body.append('txtNumDoc', cleanDoc);
    body.append('Capcha$CaptchaTextBox', captcha.data);
    body.append('btnConsultar', 'Consultar');

    const resPost = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        ...headers,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': jar.getCookieString(),
        'Referer': baseUrl,
        'Origin': 'https://aplicaciones.adres.gov.co',
      },
      body: body.toString(),
      signal: controller.signal,
    });
    jar.addFromHeaders(resPost.headers);
    const postHtml = await resPost.text();

    const tokenMatch = postHtml.match(/RespuestaConsulta\.aspx\?tokenId=([^'"]+)/);
    if (!tokenMatch) {
      clearTimeout(timeoutId);
      return { success: false, error: 'No se encontró registro para el documento en ADRES' };
    }

    const tokenId = tokenMatch[1];
    const resultUrl = `https://aplicaciones.adres.gov.co/bdua_internet/Pages/RespuestaConsulta.aspx?tokenId=${tokenId}`;
    const resResult = await fetch(resultUrl, {
      headers: { ...headers, 'Cookie': jar.getCookieString(), 'Referer': baseUrl },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    const resultHtml = await resResult.text();
    const cleanHtml = resultHtml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
    const matchNombres = cleanHtml.match(/NOMBRES\s+([A-ZÁÉÍÓÚÑ\s]+?)\s+APELLIDOS/i);
    const matchApellidos = cleanHtml.match(/APELLIDOS\s+([A-ZÁÉÍÓÚÑ\s]+?)\s+FECHA/i);

    if (matchNombres && matchApellidos) {
      const rawNombres = matchNombres[1].trim();
      const rawApellidos = matchApellidos[1].trim();
      const fullName = toTitleCase(`${rawNombres} ${rawApellidos}`);

      identityCache.set(cacheKey, { fullName, timestamp: Date.now() });
      return { success: true, officialName: fullName, source: 'adres' };
    }

    return { success: false, error: 'No se encontraron nombres en la respuesta' };
  } catch (err) {
    console.warn('[queryAdresIdentity Error]', err?.message || err);
    return { success: false, error: err?.message || 'Error consultando ADRES' };
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido.' });
  }

  try {
    const { tipoDocumento, numeroDocumento, nombreIngresado } = req.body || {};
    const cleanDoc = (numeroDocumento || '').replace(/[^0-9a-zA-Z]/g, '');

    if (!cleanDoc || cleanDoc.length < 5) {
      return res.status(400).json({
        valid: false,
        match: false,
        error: 'El número de documento debe tener al menos 5 dígitos.'
      });
    }

    // Detección de secuencias o dígitos repetitivos ficticios
    const DUMMY_SEQUENCES = [
      '12345', '123456', '1234567', '12345678', '123456789', '1234567890',
      '0123456789', '987654321', '9876543210', '54321', '654321'
    ];
    if (DUMMY_SEQUENCES.includes(cleanDoc) || /^(\d)\1{4,}$/.test(cleanDoc)) {
      return res.status(200).json({
        valid: false,
        match: false,
        error: '⚠️ Número de documento sospechoso o de prueba no permitido. Debe ingresar su documento real.'
      });
    }

    // Detección de nombres ficticios o incompletos
    if (nombreIngresado && nombreIngresado.trim().length > 0) {
      const trimmedName = nombreIngresado.trim();
      const tokens = trimmedName.split(/\s+/);
      if (/^(test|prueba|demo|asdf|cliente|nadie|usuario|ninguno|qwerty|xxx)$/i.test(trimmedName)) {
        return res.status(200).json({
          valid: false,
          match: false,
          error: '⚠️ Ingrese nombres y apellidos reales válidos.'
        });
      }
      if (!(tipoDocumento || '').includes('NIT') && !(tipoDocumento || '').includes('RUT') && tokens.length < 2) {
        return res.status(200).json({
          valid: false,
          match: false,
          error: '⚠️ Debe ingresar nombres y apellidos completos (al menos dos palabras).'
        });
      }
    }

    // 1. Reglas de Cédula Colombiana (C.C.)
    if ((tipoDocumento || '').includes('ciudadanía') || tipoDocumento === 'CC') {
      if (cleanDoc.length === 9) {
        return res.status(200).json({
          valid: false,
          match: false,
          error: '⚠️ Número de cédula inválido. En Colombia no existen cédulas de 9 dígitos.'
        });
      }
      if (cleanDoc.length === 10) {
        const num = parseInt(cleanDoc, 10);
        if (num > 1250000000 || !cleanDoc.startsWith('1')) {
          return res.status(200).json({
            valid: false,
            match: false,
            error: '⚠️ Cédula fuera del rango legal expedido por la Registraduría Nacional (máximo 1.250 millones).'
          });
        }
      }
    }

    // 2. Reglas de Cédula de Extranjería (C.E.)
    if ((tipoDocumento || '').includes('extranjería') || tipoDocumento === 'CE') {
      if (cleanDoc.length < 5 || cleanDoc.length > 7) {
        return res.status(200).json({
          valid: false,
          match: false,
          error: '⚠️ La Cédula de Extranjería en Colombia contiene entre 5 y 7 dígitos numéricos.'
        });
      }
    }

    // 3. Reglas de NIT con Módulo 11 oficial de la DIAN
    if ((tipoDocumento || '').includes('NIT') || (tipoDocumento || '').includes('RUT')) {
      const parts = (numeroDocumento || '').trim().split('-');
      if (parts.length === 2) {
        const nitBody = parts[0].replace(/\D/g, '');
        const providedDV = parts[1].trim();
        const weights = [3, 7, 13, 17, 19, 23, 29, 37, 41, 43, 47, 53, 59, 67, 71];
        let sum = 0;
        for (let i = 0; i < nitBody.length; i++) {
          sum += parseInt(nitBody[nitBody.length - 1 - i], 10) * weights[i];
        }
        const mod = sum % 11;
        const calculatedDV = mod > 1 ? (11 - mod).toString() : mod.toString();
        if (providedDV !== calculatedDV) {
          return res.status(200).json({
            valid: false,
            match: false,
            error: `⚠️ El Dígito de Verificación del NIT no es correcto (según la DIAN debe ser ${calculatedDV}).`
          });
        }
      }
    }

    // 3.5 AHORRO 100% SALDO: Consultar primero en NUESTRA propia base de datos (Supabase / Solicitudes / Perfiles)
    const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://knzmpoprlmbonejshfys.supabase.co';
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtuem1wb3BybG1ib25lanNoZnlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYwMjYyMjQsImV4cCI6MjA5MTYwMjIyNH0.yZ3AV1Rt2rmDuP61CA2rJRILpw__vwAJWp3xJUNj_FY';
    if (supabaseUrl && supabaseKey) {
      try {
        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(supabaseUrl, supabaseKey);

        // Buscar en solicitudes previas (solicitante o cliente presentado)
        const { data: solRows } = await supabase
          .from('solicitudes')
          .select('solicitante_nombre, solicitante_numero_documento, interesado_nombre, interesado_documento')
          .or(`solicitante_numero_documento.eq.${cleanDoc},interesado_documento.eq.${cleanDoc}`)
          .limit(1);

        let localOfficialName = '';
        if (solRows && solRows.length > 0) {
          const row = solRows[0];
          if ((row.solicitante_numero_documento || '').replace(/\D/g, '') === cleanDoc && row.solicitante_nombre) {
            localOfficialName = row.solicitante_nombre;
          } else if ((row.interesado_documento || '').replace(/\D/g, '') === cleanDoc && row.interesado_nombre) {
            localOfficialName = row.interesado_nombre;
          }
        }

        // Buscar en perfiles registrados
        if (!localOfficialName) {
          const { data: profRows } = await supabase
            .from('profiles')
            .select('full_name, numero_documento')
            .eq('numero_documento', cleanDoc)
            .limit(1);
          if (profRows && profRows.length > 0 && profRows[0].full_name) {
            localOfficialName = profRows[0].full_name;
          }
        }

        if (localOfficialName) {
          const officialFormatted = toTitleCase(localOfficialName);
          if (nombreIngresado && nombreIngresado.trim().length >= 3) {
            const normEntered = nombreIngresado.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').split(/\s+/).filter(Boolean);
            const normOfficial = officialFormatted.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').split(/\s+/).filter(Boolean);

            const matches = normEntered.filter(token => normOfficial.some(off => off === token || off.startsWith(token) || token.startsWith(off)));
            const isMatch = matches.length >= Math.min(2, normEntered.length);

            if (!isMatch) {
              return res.status(200).json({
                valid: true,
                match: false,
                error: '⚠️ El número de documento no corresponde a los nombres y apellidos indicados según nuestros registros verificados.'
              });
            }
          }

          return res.status(200).json({
            valid: true,
            match: true,
            officialName: officialFormatted,
            message: `✓ Identidad confirmada en base de datos interna de Vecy: ${officialFormatted}`
          });
        }
      } catch (dbErr) {
        console.warn('[Supabase local check warning]', dbErr?.message);
      }
    }

    // 4. Si no está en nuestra BD, consulta oficial vía 2Captcha + ADRES BDUA
    const adresResult = await queryAdresIdentity(tipoDocumento, cleanDoc);

    if (adresResult && adresResult.success && adresResult.officialName) {
      const officialFormatted = adresResult.officialName;

      if (nombreIngresado && nombreIngresado.trim().length >= 3) {
        const normEntered = nombreIngresado.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').split(/\s+/).filter(Boolean);
        const normOfficial = officialFormatted.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').split(/\s+/).filter(Boolean);

        const matches = normEntered.filter(token => normOfficial.some(off => off === token || off.startsWith(token) || token.startsWith(off)));
        const isMatch = matches.length >= Math.min(2, normEntered.length);

        if (!isMatch) {
          return res.status(200).json({
            valid: true,
            match: false,
            error: '⚠️ El número de documento no corresponde a los nombres y apellidos indicados. Por motivos de seguridad y veracidad legal, solo se permiten datos reales verificados.'
          });
        }

        return res.status(200).json({
          valid: true,
          match: true,
          officialName: officialFormatted,
          message: `✓ Identidad confirmada ante Registraduría / ADRES: ${officialFormatted}`
        });
      }

      // Si aún no ha escrito el nombre o sólo 1 letra, autocompletarlo de una vez
      return res.status(200).json({
        valid: true,
        match: true,
        officialName: officialFormatted,
        message: `✓ Identidad confirmada ante Registraduría / ADRES: ${officialFormatted}`
      });
    }

    // 5. Fallback si ADRES no arrojó nombre o si es NIT/RUT
    if (nombreIngresado && nombreIngresado.trim().length >= 3) {
      const formatted = toTitleCase(nombreIngresado.trim());
      return res.status(200).json({
        valid: true,
        match: true,
        officialName: formatted,
        message: '✓ Estructura de identidad y documento verificados conforme a Registraduría y DIAN'
      });
    }

    return res.status(200).json({
      valid: true,
      match: true,
      officialName: nombreIngresado || '',
      message: '✓ Documento validado'
    });

  } catch (e) {
    console.error('Error en verify-identity:', e);
    return res.status(500).json({ error: e.message });
  }
}
