import { supabase } from '@/lib/supabase';

export async function storeEmailVerificationToken(token: string, email: string): Promise<void> {
  const normalizedEmail = email.toLowerCase();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  // Invalidate all previous tokens for this email so old links stop working
  await supabase.from('email_verification_tokens').delete().eq('email', normalizedEmail);

  const { error } = await supabase.from('email_verification_tokens').insert({
    token,
    email: normalizedEmail,
    expires_at: expiresAt.toISOString(),
  });
  if (error) throw new Error(error.message);
}

export async function consumeEmailVerificationToken(token: string): Promise<string | null> {
  const { data, error } = await supabase
    .from('email_verification_tokens')
    .delete()
    .eq('token', token)
    .gt('expires_at', new Date().toISOString())
    .select('email')
    .single();

  if (error && error.code !== 'PGRST116') throw new Error(error.message);
  return data?.email ?? null;
}
