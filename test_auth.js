import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://iqmlenxldsdrxsbegkwf.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlxbWxlbnhsZHNkcnhzYmVna3dmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5NzQ4MTQsImV4cCI6MjA2NjU1MDgxNH0.5HMLnYcMjYEwNaiKXLFA9Y0xyte89Nql4pcMsBidj9Y';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testAuth() {
  console.log('Intentando registrar usuario de prueba...');
  const { data, error } = await supabase.auth.signUp({
    email: 'floralbafallaotalora+test@gmail.com', // agregamos +test para no quemar el correo
    password: 'passwordSeguro123!',
  });

  if (error) {
    console.error('ERROR DE SUPABASE:', error);
  } else {
    console.log('EXITO. DATA:', data);
  }
}

testAuth();
