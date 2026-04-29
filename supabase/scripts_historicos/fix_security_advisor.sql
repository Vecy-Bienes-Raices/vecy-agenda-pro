-- ==========================================
-- SCRIPT PARA SOLUCIONAR ADVERTENCIAS DE SEGURIDAD EN SUPABASE
-- ==========================================

-- 1. SOLUCIONAR "Function Search Path Mutable"
-- Esto evita problemas de seguridad obligando a la función a no depender del search_path por defecto.
ALTER FUNCTION public.handle_new_user() SET search_path = '';
ALTER FUNCTION public.get_next_solicitud_id() SET search_path = '';


-- 2. SOLUCIONAR "Public Can Execute SECURITY DEFINER Function"
-- Revocar el acceso público general a estas funciones críticas que corren con privilegios elevados.
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.get_next_solicitud_id() FROM PUBLIC;

-- Otorgar permiso solo a los roles que realmente necesitan ejecutar estas funciones.
-- Para la función que genera el ID de solicitud (asumo que se llama desde la app autenticada):
GRANT EXECUTE ON FUNCTION public.get_next_solicitud_id() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_next_solicitud_id() TO service_role;

-- Para handle_new_user (usualmente un trigger de auth, lo ejecuta el sistema de Supabase):
-- En la mayoría de los casos, darle permiso a los roles de administración de Supabase es suficiente.
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO postgres;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO supabase_admin;


-- 3. SOLUCIONAR "Extension in 'public'" (pg_net, http)
-- IMPORTANTE: La extensión 'pg_net' NO soporta cambiar de esquema con ALTER.
-- Para solucionar esto, tienes dos opciones:
-- OPCIÓN A (Recomendada): Ignorar esta advertencia específica, ya que pg_net suele instalarse en public en proyectos más antiguos de Supabase y es seguro dejarlo ahí.
-- OPCIÓN B (Si realmente quieres limpiar 'public'): Ve al panel de Supabase -> Database -> Extensions. Busca "pg_net", apágala (OFF), cambia el esquema (schema) a "extensions" en la configuración de la extensión, y vuelve a encenderla (ON).
-- Para 'http', a veces también requiere ser reinstalada. 

-- Por lo tanto, comentamos estas líneas que fallaron:
/*
CREATE SCHEMA IF NOT EXISTS extensions;
-- ALTER EXTENSION pg_net SET SCHEMA extensions; -- Esto falla porque no soporta SET SCHEMA
-- ALTER EXTENSION http SET SCHEMA extensions;
*/


-- 4. SOLUCIONAR "RLS Policy Always True" (counters, auth_links, auth_codes)
-- Tienes políticas de seguridad (RLS) en estas tablas que están configuradas como "USING (true)", lo que permite a cualquier usuario anónimo leer, insertar o modificar datos.
-- Debes ir al panel de Supabase -> Authentication -> Policies y restringir el acceso.

-- Por ejemplo, si la tabla "counters" solo la lee/escribe tu función get_next_solicitud_id (la cual es SECURITY DEFINER):
-- NO necesitas una política pública en "counters". Puedes eliminarla y la función igual podrá acceder.
-- Solo el service_role debería tener acceso directo a la tabla.

-- Puedes ejecutar esto para crear una política que solo permita al servidor backend/admin acceder:
-- (Asegúrate de eliminar las políticas anteriores que tienen USING(true))
/*
CREATE POLICY "Solo acceso de administrador a counters" ON public.counters AS PERMISSIVE FOR ALL TO service_role USING (true);
*/
