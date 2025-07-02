import { createClient } from '@supabase/supabase-js';

// Reemplaza con tus propias credenciales de Supabase
const supabaseUrl = 'https://iqmlenxldsdrxsbegkwf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlxbWxlbnhsZHNkcnhzYmVna3dmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5NzQ4MTQsImV4cCI6MjA2NjU1MDgxNH0.5HMLnYcMjYEwNaiKXLFA9Y0xyte89Nql4pcMsBidj9Y';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);