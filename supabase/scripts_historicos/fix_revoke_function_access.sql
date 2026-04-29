-- ============================================================
-- REVOCAR ACCESO PÚBLICO A get_next_solicitud_id
-- Ahora la función solo la llama la Edge Function via service_role.
-- El frontend ya NO la necesita.
-- ============================================================

REVOKE EXECUTE ON FUNCTION public.get_next_solicitud_id() FROM anon;
REVOKE EXECUTE ON FUNCTION public.get_next_solicitud_id() FROM authenticated;

-- Solo el service_role (Edge Functions) puede ejecutarla
GRANT EXECUTE ON FUNCTION public.get_next_solicitud_id() TO service_role;
