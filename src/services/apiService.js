import { supabase } from '../supabaseClient';

export const fetchProfile = async (session) => {
  try {
    const { user } = session;
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }
    
    return { data, user };
  } catch (error) {
    console.error('Error cargando perfil:', error.message);
    return { data: null, user: session.user };
  }
};

export const updateProfile = async (session, formData) => {
  if (!session?.user) return;

  const updates = {
    id: session.user.id,
    full_name: formData.solicitante_nombre,
    celular: formData.solicitante_celular,
    tipo_documento: formData.solicitante_tipo_documento,
    numero_documento: formData.solicitante_numero_documento,
    perfil: formData.solicitante_perfil,
    updated_at: new Date(),
  };

  try {
    const { error } = await supabase.from('profiles').upsert(updates);
    if (error) throw error;
  } catch (error) {
    console.error('Error actualizando perfil:', error.message);
  }
};

export const submitSolicitud = async (payload, session, timeoutPromise) => {
  // --- Paso 1: Obtener el ID consecutivo (Con Timeout) ---
  const { data: newSolicitudId, error: idError } = await Promise.race([
    supabase.rpc('get_next_solicitud_id'),
    timeoutPromise
  ]);
  
  if (idError) {
    console.error("Error al obtener el ID de la solicitud:", idError);
    throw new Error('No se pudo generar un ID para la solicitud. Inténtalo de nuevo.');
  }

  // --- Paso 2: Preparar el payload definitivo ---
  const finalPayload = { ...payload, solicitud_id: newSolicitudId };

  // --- Paso 3: Insertar en la base de datos ---
  const { data: insertedData, error: supabaseError } = await supabase
    .from('solicitudes')
    .insert([finalPayload])
    .select();

  if (supabaseError) throw supabaseError;

  // Obtener el ID de base de datos (PK) del registro insertado
  const dbId = insertedData && insertedData[0] ? insertedData[0].id : null;

  // --- Paso 4: Actualizar perfil del usuario si está autenticado ---
  if (session) {
    // Reconstruimos un mini formData compatible con updateProfile
    const profileData = {
      solicitante_nombre: finalPayload.solicitante_nombre,
      solicitante_celular: finalPayload.solicitante_celular,
      solicitante_tipo_documento: finalPayload.solicitante_tipo_documento,
      solicitante_numero_documento: finalPayload.solicitante_numero_documento,
      solicitante_perfil: finalPayload.solicitante_perfil,
    };
    await updateProfile(session, profileData);
  }

  return { dbId, finalPayload };
};

export const invokeConfirmationEmail = async (payloadForFunction) => {
  try {
    const { error: functionError } = await supabase.functions.invoke('send-confirmation-email', {
      body: payloadForFunction,
    });
    if (functionError) {
      console.error("❌ Error en segundo plano al invocar la Edge Function:", functionError);
    } else {
      console.log("✅ Solicitud de envío de correo procesada exitosamente en segundo plano.");
    }
  } catch (error) {
    console.error("❌ Error en la petición de segundo plano a la Edge Function:", error);
  }
};
