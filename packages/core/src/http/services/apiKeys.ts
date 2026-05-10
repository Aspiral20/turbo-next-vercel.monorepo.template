import crypto from 'crypto';
import { supabase } from '@/lib/supabase';

export type ApiKeyRow = {
  id: string;
  workspace_id: string;
  name: string;
  key_hash?: string;
  key_prefix: string;
  scopes: string[];
  expires_at: string | null;
  ip_whitelist: string[] | null;
  last_used_at: string | null;
  created_at: string;
};

const KEY_FIELDS = 'id, workspace_id, name, key_prefix, scopes, expires_at, ip_whitelist, last_used_at, created_at';

export async function listApiKeys(workspaceId: string): Promise<ApiKeyRow[]> {
  const { data, error } = await supabase
    .from('api_keys')
    .select(KEY_FIELDS)
    .eq('workspace_id', workspaceId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function createApiKey(
  workspaceId: string,
  name: string,
  scopes: string[],
): Promise<{ plainKey: string; record: ApiKeyRow }> {
  const raw = crypto.randomBytes(36).toString('hex');
  const plainKey = `sk_live_${raw}`;
  const keyHash = crypto.createHash('sha256').update(plainKey).digest('hex');
  const keyPrefix = `sk_live_${raw.slice(0, 8)}`;

  const { data, error } = await supabase
    .from('api_keys')
    .insert({ workspace_id: workspaceId, name, key_hash: keyHash, key_prefix: keyPrefix, scopes })
    .select(KEY_FIELDS)
    .single();

  if (error) throw new Error(error.message);
  return { plainKey, record: data };
}

export async function revokeApiKey(id: string, workspaceId: string): Promise<void> {
  const { error } = await supabase
    .from('api_keys')
    .delete()
    .eq('id', id)
    .eq('workspace_id', workspaceId);

  if (error) throw new Error(error.message);
}
