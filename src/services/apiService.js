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
    celular: formData.solicitante_celular
      ? formData.solicitante_celular.replace(/^\+?57/, '').slice(0, 10)
      : '',
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

/**
 * Envía el payload completo a la Edge Function.
 * La Edge Function genera el ID, inserta el registro y envía notificaciones.
 * El frontend ya NO llama a get_next_solicitud_id ni inserta directamente en la BD.
 */
export const submitSolicitud = async (payload, session) => {
  // Actualizar perfil del usuario autenticado en paralelo (sin bloquear el envío)
  if (session) {
    updateProfile(session, payload); // Fire and forget
  }

  // Invocar la Edge Function que orquesta TODO el proceso servidor
  const { data, error } = await supabase.functions.invoke('send-confirmation-email', {
    body: payload,
  });

  if (error) {
    console.error('❌ Error al invocar la Edge Function:', error);
    throw new Error(error.message || 'No se pudo procesar la solicitud. Inténtalo de nuevo.');
  }

  console.log('✅ Solicitud procesada exitosamente en el servidor.');
  return data;
};
