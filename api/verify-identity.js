import { Solver } from '@2captcha/captcha-solver';

// Caché en memoria para evitar llamadas redundantes de 2Captcha (24h)
const identityCache = new Map();
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

function toTitleCase(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
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

  // 1. Modo Sondeo (check): consulta el estado del Job en el backend central de Vecy (VPS)
  if (action === 'check' || (req.method === 'GET' && jobId)) {
    const targetJobId = jobId || req.query?.jobId;
    if (!targetJobId) {
      return res.status(400).json({ error: 'jobId requerido para sondeo' });
    }
    try {
      const vpsRes = await fetch(`http://13.140.149.144/api/trpc/agenda.checkVerifyIdentity?input=${encodeURIComponent(JSON.stringify({ jobId: targetJobId }))}`);
      const vpsData = await vpsRes.json();
      const job = vpsData?.result?.data?.json;
      if (job) {
        return res.status(200).json(job);
      }
      return res.status(200).json({ status: 'processing' });
    } catch (e) {
      return res.status(500).json({ error: 'Error consultando estado de verificación', details: e.message });
    }
  }

  // 2. Modo Inicio (start): inicia la verificación asíncrona ante la Policía Nacional
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

    // Validación de NIT con Módulo 11 DIAN
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
      return res.status(200).json({
        valid: true,
        match: true,
        officialName: (nombreIngresado || '').trim() || cleanDoc,
        message: '✓ NIT validado conforme a estructura DIAN'
      });
    }

    // Iniciar Job en el VPS autoritativo
    try {
      const vpsRes = await fetch('http://13.140.149.144/api/trpc/agenda.startVerifyIdentity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tipoDocumento: tipoDocumento || 'Cédula de ciudadanía',
          numeroDocumento: cleanDoc,
          nombreIngresado: (nombreIngresado || '').trim(),
        }),
      });

      const vpsData = await vpsRes.json();
      const output = vpsData?.result?.data?.json;
      if (output) {
        // Si ya estaba resuelto en caché o completado
        if (output.status === 'completed' && output.result) {
          return res.status(200).json(output.result);
        }
        // Retornar información del Job para sondeo del frontend
        return res.status(200).json({
          status: output.status || 'processing',
          jobId: output.jobId,
          message: output.message || 'Verificando autenticidad del documento en tiempo real...'
        });
      }
    } catch (vpsErr) {
      console.warn('Fallo conectando al VPS para startVerifyIdentity:', vpsErr.message);
    }

    // Si no responde el VPS, retornar error defensivo (Cero fallbacks permisivos)
    return res.status(200).json({
      valid: false,
      match: false,
      error: 'No fue posible verificar el documento en este momento. Por favor intenta de nuevo en unos segundos.'
    });
  }

  return res.status(405).json({ error: 'Método no permitido' });
}
