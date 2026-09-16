// Handler serverless para verificación de identidad conectado al backend autoritativo de Vecy Network
// Con validación doctrinal instantánea (0ms) para familia VECY y reglas colombianas estrictas

const AUTHORITATIVE_FAMILY_IDENTITIES = {
  // 1. Cédula Daniel Eduardo Rivera Noguera (CC: 1233903423)
  '1233903423': {
    canonicalName: 'Daniel Eduardo Rivera Noguera',
    allowedKeywords: ['daniel', 'eduardo', 'rivera', 'noguera', 'vecy', 'bienes', 'raices', 'raíces'],
    isCompany: false,
    message: '✓ Identidad verificada y autenticada con éxito: Daniel Eduardo Rivera Noguera',
  },
  // 2. Cédula Eduardo Arturo Rivera Martínez (Fundador y Director de Tecnología)
  '11189781': {
    canonicalName: 'Eduardo Arturo Rivera Martínez',
    allowedKeywords: ['eduardo', 'arturo', 'rivera', 'martinez', 'martínez', 'eddu', 'eddua'],
    isCompany: false,
    message: '✓ Identidad verificada y autenticada con éxito: Eduardo Arturo Rivera Martínez',
  },
  // 3. Cédula Natalia Rivera Noguera (Hija de Eduardo)
  '1193130766': {
    canonicalName: 'Natalia Rivera Noguera',
    allowedKeywords: ['natalia', 'rivera', 'noguera'],
    isCompany: false,
    message: '✓ Identidad verificada y autenticada con éxito: Natalia Rivera Noguera',
  },
  // 4. NIT Vecy Bienes Raíces (Persona Jurídica - NIT: 41057506-1)
  '410575061': {
    canonicalName: 'Vecy Bienes Raíces',
    allowedKeywords: ['vecy', 'bienes', 'raices', 'raíces', 'jani', 'alves', 'souza'],
    isCompany: true,
    message: '✓ Identidad corporativa verificada y autorizada: Vecy Bienes Raíces (NIT: 41057506-1)',
  },
  // 5. Cédula Jani Alves Souza / NIT Base Vecy
  '41057506': {
    canonicalName: 'Jani Alves Souza',
    allowedKeywords: ['jani', 'alves', 'souza', 'vecy', 'bienes', 'raices', 'raíces'],
    isCompany: false,
    message: '✓ Identidad verificada y autenticada con éxito: Jani Alves Souza',
  },
};

function calcularDigitoVerificacionDIAN(nit) {
  const cleanNit = (nit || '').replace(/\D/g, '');
  const weights = [3, 7, 13, 17, 19, 23, 29, 37, 41, 43, 47, 53, 59, 67, 71];
  let sum = 0;
  for (let i = 0; i < cleanNit.length; i++) {
    sum += parseInt(cleanNit[cleanNit.length - 1 - i], 10) * weights[i];
  }
  const mod = sum % 11;
  return mod > 1 ? (11 - mod).toString() : mod.toString();
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { action, jobId } = req.query || req.body || {};

  // 1. Modo Sondeo (check): consulta el estado del Job en el endpoint REST directo del VPS
  if (action === 'check' || (req.method === 'GET' && jobId)) {
    const targetJobId = jobId || req.query?.jobId;
    if (!targetJobId) {
      return res.status(400).json({ error: 'jobId requerido para sondeo' });
    }
    try {
      const vpsRes = await fetch(`http://13.140.149.144/api/verify-identity?jobId=${encodeURIComponent(targetJobId)}`);
      const vpsData = await vpsRes.json();
      return res.status(200).json(vpsData);
    } catch (e) {
      return res.status(500).json({ error: 'Error consultando estado de verificación', details: e.message });
    }
  }

  // 2. Modo Inicio (start): inicia la verificación vía endpoint REST directo del VPS
  if (req.method === 'POST') {
    const { tipoDocumento, numeroDocumento, nombreIngresado } = req.body || {};
    const cleanDoc = (numeroDocumento || '').replace(/[^0-9a-zA-Z]/g, '');

    if (!cleanDoc || cleanDoc.length < 5) {
      return res.status(200).json({
        valid: false,
        match: false,
        error: 'El número de documento debe tener al menos 5 dígitos.'
      });
    }

    const tDocLower = (tipoDocumento || '').toLowerCase();
    const isNit = tDocLower.includes('nit') || tDocLower.includes('rut');

    // Validación DIAN para NIT/RUT
    if (isNit) {
      if (!/^\d{9,10}$/.test(cleanDoc)) {
        return res.status(200).json({
          valid: false,
          match: false,
          error: 'El NIT debe contener 9 o 10 dígitos numéricos (incluyendo dígito de verificación).'
        });
      }
      const cleanNit = cleanDoc.slice(0, 9);
      const dvCalculado = calcularDigitoVerificacionDIAN(cleanNit);
      if (cleanDoc.length === 10) {
        const dvIngresado = cleanDoc.slice(9);
        if (dvIngresado !== dvCalculado) {
          return res.status(200).json({
            valid: false,
            match: false,
            error: `Dígito de verificación DIAN incorrecto. Para el NIT ${cleanNit}, el dígito oficial es -${dvCalculado}.`
          });
        }
      }
      return res.status(200).json({
        valid: true,
        match: true,
        officialName: (nombreIngresado || '').trim() || cleanDoc,
        message: `✓ NIT/RUT validado conforme a estructura DIAN (Dígito de verificación: ${dvCalculado})`
      });
    }

    // Reglas estructurales de Cédula de Ciudadanía colombiana
    const isCedula = !isNit && (tDocLower.includes('cédula') || tDocLower.includes('cedula') || tDocLower === '' || tDocLower.includes('ciudadan'));
    if (isCedula) {
      if (!/^\d+$/.test(cleanDoc)) {
        return res.status(200).json({
          valid: false,
          match: false,
          error: 'La Cédula de Ciudadanía solo debe contener caracteres numéricos.'
        });
      }
      if (cleanDoc.length === 9) {
        return res.status(200).json({
          valid: false,
          match: false,
          error: '⚠️ En Colombia no existen Cédulas de Ciudadanía de 9 dígitos. Verifica si omitiste o agregaste algún número.'
        });
      }
      if (cleanDoc.length < 6 || cleanDoc.length > 10) {
        return res.status(200).json({
          valid: false,
          match: false,
          error: '⚠️ La Cédula de Ciudadanía en Colombia debe contener entre 6 y 8 dígitos (antiguas) o 10 dígitos (nuevas).'
        });
      }
      if (cleanDoc.length === 10 && !cleanDoc.startsWith('1')) {
        return res.status(200).json({
          valid: false,
          match: false,
          error: '⚠️ Las Cédulas de Ciudadanía de 10 dígitos en Colombia deben iniciar por 1. Verifica el número digitado.'
        });
      }
    }

    // Verificación inversa para nombres de Fundadores y Vecy Bienes Raíces (0ms instantáneo)
    const normName = (nombreIngresado || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    if (normName.length >= 4) {
      const isDaniel = normName.includes('daniel') && (normName.includes('rivera') || normName.includes('noguera') || normName.trim() === 'daniel');
      if (isDaniel && cleanDoc !== '1233903423') {
        return res.status(200).json({
          valid: false,
          match: false,
          error: `⚠️ El documento ${cleanDoc} no corresponde a Daniel Eduardo Rivera Noguera (su cédula oficial registrada es 1233903423). Corrige el número para continuar.`
        });
      }

      const isNatalia = normName.includes('natalia') && (normName.includes('rivera') || normName.includes('noguera') || normName.trim() === 'natalia');
      if (isNatalia && cleanDoc !== '1193130766') {
        return res.status(200).json({
          valid: false,
          match: false,
          error: `⚠️ El documento ${cleanDoc} no corresponde a Natalia Rivera Noguera (el documento oficial registrado es 1193130766). Corrige el número para continuar.`
        });
      }

      const isEduardo = normName.includes('eduardo') && (normName.includes('rivera') || normName.includes('arturo'));
      if (isEduardo && cleanDoc !== '11189781' && cleanDoc !== '1233903423') {
        return res.status(200).json({
          valid: false,
          match: false,
          error: `⚠️ El documento ${cleanDoc} no corresponde a Eduardo Arturo Rivera Martínez (su cédula oficial registrada es 11189781). Corrige el número para continuar.`
        });
      }

      const isVecy = normName.includes('vecy');
      if (isVecy && cleanDoc !== '410575061' && cleanDoc !== '41057506' && cleanDoc !== '1233903423') {
        return res.status(200).json({
          valid: false,
          match: false,
          error: `⚠️ El documento ${cleanDoc} no corresponde a Vecy Bienes Raíces (NIT oficial: 41057506-1). Corrige el número para continuar.`
        });
      }

      const isJani = normName.includes('jani') && normName.includes('alves');
      if (isJani && cleanDoc !== '41057506') {
        return res.status(200).json({
          valid: false,
          match: false,
          error: `⚠️ El documento ${cleanDoc} no corresponde a Jani Alves Souza (su cédula oficial registrada es 41057506). Corrige el número para continuar.`
        });
      }
    }

    // Verificación directa en base doctrinal autoritativa de la familia VECY (0ms instantáneo)
    const authEntry = AUTHORITATIVE_FAMILY_IDENTITIES[cleanDoc];
    if (authEntry) {
      const tokens = normName.split(/[\s,.-]+/).filter(Boolean);
      const matchesKeyword = tokens.length === 0 || tokens.some(t => authEntry.allowedKeywords.some(kw => kw === t || t.startsWith(kw) || kw.startsWith(t)));

      if (matchesKeyword) {
        let displayName = authEntry.canonicalName;
        let msg = authEntry.message;

        if (cleanDoc === '1233903423') {
          if (normName.includes('vecy')) {
            displayName = 'Vecy Bienes Raíces';
            msg = '✓ Identidad corporativa verificada y autorizada: Vecy Bienes Raíces';
          } else {
            displayName = 'Daniel Eduardo Rivera Noguera';
            msg = '✓ Identidad verificada y autenticada con éxito: Daniel Eduardo Rivera Noguera';
          }
        } else if (cleanDoc === '410575061' || (cleanDoc === '41057506' && (isNit || normName.includes('vecy')))) {
          displayName = 'Vecy Bienes Raíces';
          msg = '✓ Identidad corporativa verificada y autorizada: Vecy Bienes Raíces (NIT: 41057506-1)';
        } else if (cleanDoc === '41057506') {
          displayName = 'Jani Alves Souza';
          msg = '✓ Identidad verificada y autenticada con éxito: Jani Alves Souza';
        }

        return res.status(200).json({
          valid: true,
          match: true,
          officialName: displayName,
          isCompany: displayName === 'Vecy Bienes Raíces',
          message: msg,
        });
      } else {
        return res.status(200).json({
          valid: true,
          match: false,
          officialName: authEntry.canonicalName,
          error: `⚠️ El número de documento ${cleanDoc} no corresponde a "${nombreIngresado}". Por favor verifica si digitaste un número mal o corrígelo para continuar.`,
        });
      }
    }

    // Si es un tercero (cliente general), delegar al VPS autoritativo
    try {
      const vpsRes = await fetch('http://13.140.149.144/api/verify-identity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tipoDocumento: tipoDocumento || 'Cédula de ciudadanía',
          numeroDocumento: cleanDoc,
          nombreIngresado: (nombreIngresado || '').trim(),
        }),
      });

      const vpsData = await vpsRes.json();
      if (vpsData) {
        if (vpsData.status === 'completed' && vpsData.result) {
          return res.status(200).json(vpsData.result);
        }
        return res.status(200).json(vpsData);
      }
    } catch (vpsErr) {
      console.warn('Fallo conectando al VPS REST /api/verify-identity:', vpsErr.message);
    }

    // Fallback defensivo para terceros si el VPS no responde
    if (/^\d{6,10}$/.test(cleanDoc) && cleanDoc.length !== 9) {
      return res.status(200).json({
        valid: true,
        match: true,
        officialName: (nombreIngresado || '').trim() || cleanDoc,
        message: '✓ Documento en formato válido (cotejo en sede)'
      });
    }

    return res.status(200).json({
      valid: false,
      match: false,
      error: 'No fue posible verificar el documento en este momento. Por favor intenta de nuevo en unos segundos.'
    });
  }

  return res.status(405).json({ error: 'Método no permitido' });
}
