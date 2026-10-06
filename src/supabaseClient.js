import { createClient } from "@supabase/supabase-js";

// Accede a las variables de entorno de Vite con fallback autoritativo idéntico a vecy-network
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://knzmpoprlmbonejshfys.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtuem1wb3BybG1ib25lanNoZnlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYwMjYyMjQsImV4cCI6MjA5MTYwMjIyNH0.yZ3AV1Rt2rmDuP61CA2rJRILpw__vwAJWp3xJUNj_FY";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
