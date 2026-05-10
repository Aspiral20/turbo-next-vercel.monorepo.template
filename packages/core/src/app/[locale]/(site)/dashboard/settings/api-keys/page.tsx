'use client';
import { useState, useEffect } from 'react';
import { Copy, Plus, Trash2, KeyRound, BookOpen, Check, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { SettingsSectionSidebar, type SidebarItem } from '@/_components/settings/SettingsSectionSidebar';
import { ModalShell, modalCls } from '@/_components/ui/ModalShell';
import { apiInterceptor, endpoints } from '@/lib/axios';
import type { ApiKeyRow } from '@/http/services/apiKeys';

const SIDEBAR_ITEMS: SidebarItem[] = [
  { id: 'all', label: 'All Keys', icon: KeyRound },
  { id: 'docs', label: 'Documentation', icon: BookOpen },
];

const ALL_SCOPES = [
  { value: 'leads:read',       label: 'Leads — Read' },
  { value: 'leads:write',      label: 'Leads — Write' },
  { value: 'campaigns:read',   label: 'Campaigns — Read' },
  { value: 'campaigns:write',  label: 'Campaigns — Write' },
  { value: 'sources:read',     label: 'Sources — Read' },
  { value: 'sources:write',    label: 'Sources — Write' },
];

export default function APIKeysPage() {
  const [keys, setKeys] = useState<ApiKeyRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [revealedKey, setRevealedKey] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string | null>('all');

  const load = async () => {
    try {
      const api = apiInterceptor();
      const res = await api.getApiData(endpoints.intern.axiosNextInstance.settings.apiKeys);
      setKeys(res.keys ?? []);
    } catch {
      toast.error('Failed to load API keys.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleRevoke = async (id: string) => {
    try {
      const api = apiInterceptor();
      await api.deleteApiData(`${endpoints.intern.axiosNextInstance.settings.apiKeys}/${id}`);
      setKeys((prev) => prev.filter((k) => k.id !== id));
      toast.success('Key revoked.');
    } catch {
      toast.error('Failed to revoke key.');
    }
  };

  return (
    <div className="flex gap-6">
      <div className="flex-1 min-w-0 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg text-gray-900 dark:text-white mb-1">API Keys</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Manage programmatic access to your workspace</p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-[#1A6FFF] px-4 py-2 text-sm text-white hover:bg-[#1557CC] transition-colors"
          >
            <Plus className="h-4 w-4" />
            Create New Key
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-[#1A6FFF]" />
          </div>
        ) : keys.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-300 dark:border-gray-700 p-12 text-center">
            <KeyRound className="h-8 w-8 text-gray-400 mx-auto mb-3" />
            <p className="text-sm text-gray-600 dark:text-gray-400">No API keys yet. Create one to get started.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {keys.map((key) => (
              <KeyCard key={key.id} apiKey={key} onRevoke={handleRevoke} />
            ))}
          </div>
        )}
      </div>

      <SettingsSectionSidebar items={SIDEBAR_ITEMS} activeId={activeSection} onChange={setActiveSection} />

      {modalOpen && (
        <CreateKeyModal
          onClose={() => setModalOpen(false)}
          onCreated={(newKey, plain) => {
            setKeys((prev) => [newKey, ...prev]);
            setRevealedKey(plain);
            setModalOpen(false);
          }}
        />
      )}

      {revealedKey && (
        <RevealKeyModal plainKey={revealedKey} onClose={() => setRevealedKey(null)} />
      )}
    </div>
  );
}

function KeyCard({ apiKey, onRevoke }: { apiKey: ApiKeyRow; onRevoke: (id: string) => void }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(apiKey.key_prefix + '…');
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-[#0D1117]/50 p-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="text-sm text-gray-900 dark:text-white mb-2">{apiKey.name}</div>
          <div className="flex items-center gap-2">
            <code className="rounded bg-gray-900 px-2 py-1 text-xs text-white font-mono">
              {apiKey.key_prefix}…
            </code>
            <button onClick={copy} className="rounded p-1 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
              {copied
                ? <Check className="h-4 w-4 text-[#00D97E]" />
                : <Copy className="h-4 w-4 text-gray-600 dark:text-gray-400" />}
            </button>
          </div>
        </div>
        <button
          onClick={() => onRevoke(apiKey.id)}
          className="rounded-lg p-2 text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 transition-colors"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {apiKey.scopes.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {apiKey.scopes.map((s) => (
            <span key={s} className="rounded-full bg-[#1A6FFF]/10 px-2 py-0.5 text-xs text-[#1A6FFF]">{s}</span>
          ))}
        </div>
      )}

      <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
        <span>Created {new Date(apiKey.created_at).toLocaleDateString()}</span>
        {apiKey.last_used_at && (
          <>
            <span>•</span>
            <span>Last used {new Date(apiKey.last_used_at).toLocaleDateString()}</span>
          </>
        )}
        {!apiKey.last_used_at && <><span>•</span><span>Never used</span></>}
      </div>
    </div>
  );
}

function CreateKeyModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (key: ApiKeyRow, plain: string) => void;
}) {
  const [name, setName] = useState('');
  const [scopes, setScopes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const toggle = (scope: string) =>
    setScopes((prev) => prev.includes(scope) ? prev.filter((s) => s !== scope) : [...prev, scope]);

  const submit = async () => {
    if (!name.trim()) { toast.error('Key name is required.'); return; }
    if (scopes.length === 0) { toast.error('Select at least one scope.'); return; }
    setIsLoading(true);
    try {
      const api = apiInterceptor();
      const res = await api.postApiData(endpoints.intern.axiosNextInstance.settings.apiKeys, { name: name.trim(), scopes });
      onCreated(res.key, res.plainKey);
    } catch (err: any) {
      toast.error(err?.error ?? 'Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ModalShell isOpen onClose={onClose} className="max-w-md">
      <div className={modalCls.header}>
        <div className="flex items-center justify-between">
          <h2 className={`text-base font-semibold ${modalCls.title}`}>Create API Key</h2>
          <button onClick={onClose} className={modalCls.closeBtn}><X className="h-4 w-4" /></button>
        </div>
      </div>

      <div className={`${modalCls.body} space-y-5`}>
        <div>
          <label className={`block text-sm ${modalCls.label} mb-2`}>
            Key Name <span className="text-red-500">*</span>
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Production, Zapier integration"
            className={modalCls.input}
          />
        </div>

        <div>
          <label className={`block text-sm ${modalCls.label} mb-3`}>
            Scopes <span className="text-red-500">*</span>
          </label>
          <div className="space-y-2">
            {ALL_SCOPES.map(({ value, label }) => (
              <label key={value} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={scopes.includes(value)}
                  onChange={() => toggle(value)}
                  className="h-4 w-4 rounded border-gray-300 text-[#1A6FFF] focus:ring-[#1A6FFF]"
                />
                <span className={`text-sm ${modalCls.title}`}>{label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className={`${modalCls.footer} flex justify-end gap-3`}>
        <button onClick={onClose} className={modalCls.backBtn}>Cancel</button>
        <button
          onClick={submit}
          disabled={isLoading}
          className="flex items-center gap-2 rounded-lg bg-[#1A6FFF] px-5 py-2 text-sm text-white hover:bg-[#1557CC] transition-colors disabled:opacity-50"
        >
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          Create Key
        </button>
      </div>
    </ModalShell>
  );
}

function RevealKeyModal({ plainKey, onClose }: { plainKey: string; onClose: () => void }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(plainKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <ModalShell isOpen onClose={onClose} className="max-w-md">
      <div className={modalCls.header}>
        <div className="flex items-center justify-between">
          <h2 className={`text-base font-semibold ${modalCls.title}`}>Your API Key</h2>
          <button onClick={onClose} className={modalCls.closeBtn}><X className="h-4 w-4" /></button>
        </div>
      </div>

      <div className={`${modalCls.body} space-y-4`}>
        <div className={`rounded-lg p-3 text-sm ${modalCls.infoBox}`}>
          Copy this key now — it will not be shown again.
        </div>
        <div className="flex items-center gap-2">
          <code className="flex-1 rounded-lg bg-gray-900 px-3 py-2.5 text-xs text-white font-mono break-all">
            {plainKey}
          </code>
          <button
            onClick={copy}
            className="flex-shrink-0 rounded-lg border border-gray-200 dark:border-gray-700 p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {copied ? <Check className="h-4 w-4 text-[#00D97E]" /> : <Copy className="h-4 w-4 text-gray-600 dark:text-gray-400" />}
          </button>
        </div>
      </div>

      <div className={`${modalCls.footer} flex justify-end`}>
        <button
          onClick={onClose}
          className="rounded-lg bg-[#1A6FFF] px-5 py-2 text-sm text-white hover:bg-[#1557CC] transition-colors"
        >
          Done
        </button>
      </div>
    </ModalShell>
  );
}
