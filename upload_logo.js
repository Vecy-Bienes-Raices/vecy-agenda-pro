import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabase = createClient(
  'https://iqmlenxldsdrxsbegkwf.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlxbWxlbnhsZHNkcnhzYmVna3dmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5NzQ4MTQsImV4cCI6MjA2NjU1MDgxNH0.5HMLnYcMjYEwNaiKXLFA9Y0xyte89Nql4pcMsBidj9Y'
);

async function run() {
  const fileData = fs.readFileSync('public/vecy_nuevo_logo.png');
  
  // List buckets to find a public one
  const { data: buckets } = await supabase.storage.listBuckets();
  const bucketName = buckets && buckets.length > 0 ? buckets[0].name : 'propiedades';
  
  // Upload to the bucket
  const { data, error } = await supabase.storage.from(bucketName).upload('vecy_nuevo_logo.png', fileData, {
    contentType: 'image/png',
    upsert: true
  });
  
  if (error) {
    console.error('Error uploading:', error);
    return;
  }
  
  const { data: publicUrlData } = supabase.storage.from(bucketName).getPublicUrl('vecy_nuevo_logo.png');
  console.log('PUBLIC URL:', publicUrlData.publicUrl);
}

run();
