import { supabase } from '@/lib/supabase';

const TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

export async function storeResetToken(token: string, email: string): Promise<void> {
  const { error } = await supabase.from('reset_tokens').insert({
    token,
    email: email.toLowerCase(),
    expires_at: new Date(Date.now() + TOKEN_TTL_MS).toISOString(),
  });
  if (error) throw new Error(error.message);
}

/** Atomically deletes the token and returns its email. Returns null if invalid or expired. */
export async function consumeResetToken(token: string): Promise<string | null> {
  const { data, error } = await supabase
    .from('reset_tokens')
    .delete()
    .eq('token', token)
    .gt('expires_at', new Date().toISOString())
    .select('email')
    .single();

  // PGRST116 = 0 rows deleted — token doesn't exist or is already expired
  if (error && error.code !== 'PGRST116') throw new Error(error.message);
  return data?.email ?? null;
}
