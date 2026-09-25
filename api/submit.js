// Handler serverless para envío de solicitudes conectado al backend autoritativo de Vecy Network (VPS)
// Garantiza persistencia inmediata en la base de datos de producción y generación oficial de contratos

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Método no permitido.' });
    }

    const submissionData = req.body;
    console.log("[AGENDA-PRO-SUBMIT] Despachando al servidor autoritativo VPS:", submissionData?.solicitante_nombre);

    // 1. Despachar al backend autoritativo en el VPS de Vecy Bienes Raíces
    const vpsRes = await fetch('http://13.140.149.144/api/agenda/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(submissionData),
    });

    const vpsData = await vpsRes.json();

    if (!vpsRes.ok || vpsData.success === false) {
      console.error("[AGENDA-PRO-SUBMIT] Error del VPS:", vpsData);
      return res.status(vpsRes.status || 400).json(vpsData);
    }

    console.log("[AGENDA-PRO-SUBMIT] Solicitud registrada con éxito en VPS:", vpsData.solicitudId);
    return res.status(200).json({
      message: 'Solicitud recibida con éxito',
      data: vpsData.data,
      solicitudId: vpsData.solicitudId,
    });
  } catch (e) {
    console.error("Error en submit.js:", e);
    return res.status(500).json({ message: 'Error interno del servidor.', error: e.message });
  }
}
