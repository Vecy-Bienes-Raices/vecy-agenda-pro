import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  // Ponemos toda la lógica en un gran try...catch para capturar cualquier error.
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Método no permitido.' });
    }

    // --- PASO 1: VERIFICAR LAS LLAVES SECRETAS ---
    // Leemos las variables de entorno. Vite las hace disponibles a través de process.env.
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("Error Crítico: Las variables de entorno de Supabase no están definidas.");
      return res.status(500).json({ message: 'Error de configuración del servidor: faltan las claves de API.' });
    }

    // --- PASO 2: INTENTAR CONECTARSE A SUPABASE ---
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    const submissionData = req.body;
    console.log("Datos recibidos en la API para insertar:", submissionData);

    // --- PASO 3: INTENTAR INSERTAR LOS DATOS ---
    const { data, error } = await supabase
      .from('solicitudes_con_hora_bogota')
      .insert([submissionData])
      .select();

    if (error) {
      // Si Supabase devuelve un error, lo registramos y lo enviamos.
      console.error('Error de Supabase al insertar:', error);
      return res.status(400).json({ message: `Error en la base de datos: ${error.message}` });
    }

    // --- PASO 4: ÉXITO TOTAL ---
    // Si todo va bien, enviamos la respuesta de éxito.
    res.status(200).json({ message: 'Solicitud recibida con éxito', data: data });

  } catch (e) {
    // Si algo explota, lo capturamos y enviamos un error claro.
    console.error("Error catastrófico en la función API:", e);
    res.status(500).json({ message: 'Error interno del servidor.', error: e.message });
  }
}