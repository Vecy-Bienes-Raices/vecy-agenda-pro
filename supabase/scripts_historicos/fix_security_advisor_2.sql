-- ============================================================
-- CORRECCIÓN DE ALERTAS SECURITY ADVISOR - RONDA 2
-- Vecy Agenda Pro | 2026-04-29
-- ============================================================

-- ============================================================
-- ALERTA 1: Extension `http` en schema public
-- Solución: Moverla al schema `extensions`
-- ⚠️ NOTA: En Supabase el schema `extensions` ya existe por defecto
-- ============================================================
-- No podemos mover la extensión directamente, pero sí podemos
-- recrearla en el schema correcto:
DROP EXTENSION IF EXISTS http;
CREATE EXTENSION IF NOT EXISTS http SCHEMA extensions;


-- ============================================================
-- ALERTA 2: get_next_solicitud_id ejecutable por `authenticated`
-- Solución: Revocar EXECUTE para authenticated y solo dejarlo para anon
-- (El formulario público usa el rol 'anon', no 'authenticated')
-- ============================================================
REVOKE EXECUTE ON FUNCTION public.get_next_solicitud_id() FROM authenticated;
-- Nos aseguramos de que 'anon' sí pueda ejecutarla (para el formulario público)
GRANT EXECUTE ON FUNCTION public.get_next_solicitud_id() TO anon;


-- ============================================================
-- FIN DEL SCRIPT
-- ============================================================
-- La Alerta 3 (Leaked Password Protection) se activa desde el 
-- Dashboard de Supabase:
--   Authentication → Settings → Password Security
--   → Activar "Enable leaked password protection"
-- ============================================================
