import { createClient } from '@supabase/supabase-js';
import { config } from '@/config';

const supabaseUrl = config.SUPABASE_URL;
const supabaseServiceKey = config.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || supabaseUrl === 'SUPABASE_URL') {
  throw new Error('Missing environment variable: SUPABASE_URL');
}
if (!supabaseServiceKey || supabaseServiceKey === 'SUPABASE_SERVICE_ROLE_KEY') {
  throw new Error('Missing environment variable: SUPABASE_SERVICE_ROLE_KEY');
}

// Service-role client — server-side only, bypasses RLS.
// Never import this in client components or expose the key to the browser.
export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false },
});
