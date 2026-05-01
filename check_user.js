import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://iqmlenxldsdrxsbegkwf.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlxbWxlbnhsZHNkcnhzYmVna3dmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5NzQ4MTQsImV4cCI6MjA2NjU1MDgxNH0.5HMLnYcMjYEwNaiKXLFA9Y0xyte89Nql4pcMsBidj9Y';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkUser() {
  console.log('Intentando registrar de nuevo para ver el error...');
  const { data, error } = await supabase.auth.signUp({
    email: 'floralbafallaotalora@gmail.com',
    password: 'passwordSeguro123!',
  });

  if (error) {
    console.log('ERROR (probablemente ya existe):', error.message);
  } else {
    console.log('EXITO. DATA:', data);
  }
}

checkUser();
