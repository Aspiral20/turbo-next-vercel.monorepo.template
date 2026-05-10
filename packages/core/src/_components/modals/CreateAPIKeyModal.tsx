'use client'

import { X, Eye, EyeOff, Copy, AlertTriangle, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { ModalShell, modalCls } from '@/_components/ui/ModalShell';
import { genRandomKey } from '@/utils/helpers/generators';

interface CreateAPIKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateAPIKeyModal({ isOpen, onClose }: CreateAPIKeyModalProps) {
  const [keyName, setKeyName] = useState('');
  const [permissions, setPermissions] = useState({
    readLeads: true,
    writeLeads: false,
    manageCampaigns: false,
    exportData: false,
    admin: false,
  });
  const [expiry, setExpiry] = useState('Never');
  const [ipWhitelist, setIpWhitelist] = useState('');
  const [created, setCreated] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const [generatedKey] = useState(genRandomKey());

  const handleCreate = () => setCreated(true);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const togglePermission = (key: keyof typeof permissions) => {
    setPermissions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <ModalShell isOpen={isOpen} onClose={onClose} className="max-w-lg">
      {!created ? (
        <>
          <div className={modalCls.header}>
            <div className="flex items-center justify-between">
              <h2 className={`text-xl ${modalCls.title}`}>Create API Key</h2>
              <button onClick={onClose} className={modalCls.closeBtn}>
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className={`${modalCls.body} space-y-6`}>
            <div>
              <label className={`block text-sm ${modalCls.label} mb-2`}>Key Name</label>
              <input
                type="text"
                value={keyName}
                onChange={(e) => setKeyName(e.target.value)}
                placeholder="e.g. My CRM Integration"
                className={modalCls.input}
              />
            </div>

            <div>
              <label className={`block text-sm ${modalCls.label} mb-3`}>Permission Scopes</label>
              <div className="space-y-2">
                <PermissionCheckbox label="Read Leads" description="View lead data and export reports" checked={permissions.readLeads} onChange={() => togglePermission('readLeads')} />
                <PermissionCheckbox label="Write Leads" description="Create and update lead records" checked={permissions.writeLeads} onChange={() => togglePermission('writeLeads')} />
                <PermissionCheckbox label="Manage Campaigns" description="Create, modify, and delete campaigns" checked={permissions.manageCampaigns} onChange={() => togglePermission('manageCampaigns')} />
                <PermissionCheckbox label="Export Data" description="Bulk export all data from your account" checked={permissions.exportData} onChange={() => togglePermission('exportData')} />
                <PermissionCheckbox label="Admin" description="Full access to all resources and settings" checked={permissions.admin} onChange={() => togglePermission('admin')} warning />
              </div>
            </div>

            <div>
              <label className={`block text-sm ${modalCls.label} mb-2`}>Expiry</label>
              <select value={expiry} onChange={(e) => setExpiry(e.target.value)} className={modalCls.select}>
                <option>Never</option>
                <option>30 days</option>
                <option>90 days</option>
                <option>1 year</option>
              </select>
            </div>

            <div>
              <label className={`block text-sm ${modalCls.label} mb-2`}>
                IP Whitelist <span className="text-gray-400 dark:text-gray-500">(Optional)</span>
              </label>
              <input
                type="text"
                value={ipWhitelist}
                onChange={(e) => setIpWhitelist(e.target.value)}
                placeholder="e.g. 192.168.1.1, 10.0.0.1"
                className={modalCls.input}
              />
              <p className={`mt-1 text-xs ${modalCls.subtext}`}>Comma-separated IP addresses. Leave empty for no restrictions.</p>
            </div>
          </div>

          <div className={`${modalCls.footer} flex items-center justify-between`}>
            <button onClick={onClose} className={modalCls.backBtn}>Cancel</button>
            <button onClick={handleCreate} className="rounded-lg bg-[#1A6FFF] px-6 py-2.5 text-sm text-white hover:bg-[#1557CC] transition-colors">
              Create Key
            </button>
          </div>
        </>
      ) : (
        <>
          <div className={modalCls.header}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-[#00D97E]" />
                <h2 className={`text-xl ${modalCls.title}`}>API Key Created</h2>
              </div>
              <button onClick={onClose} className={modalCls.closeBtn}>
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className={`${modalCls.body} space-y-6`}>
            <div className="rounded-xl bg-[#F59E0B]/10 border border-[#F59E0B]/30 p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-[#F59E0B] flex-shrink-0 mt-0.5" />
                <div>
                  <div className={`text-sm ${modalCls.title} mb-1`}>This key will only be shown once</div>
                  <div className={`text-xs ${modalCls.subtext}`}>Make sure to copy and store it securely. You won't be able to see it again.</div>
                </div>
              </div>
            </div>

            <div>
              <label className={`block text-sm ${modalCls.label} mb-2`}>Your API Key</label>
              <div className="relative">
                <code className="block w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-900 dark:bg-black px-4 py-3 text-sm text-white font-mono overflow-x-auto pr-20">
                  {showKey ? generatedKey : '•'.repeat(generatedKey.length)}
                </code>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <button onClick={() => setShowKey(!showKey)} className="rounded p-1.5 text-gray-400 hover:bg-gray-800 hover:text-gray-200 transition-colors">
                    {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                  <button onClick={handleCopy} className="rounded p-1.5 text-gray-400 hover:bg-gray-800 hover:text-gray-200 transition-colors">
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </div>
              {copied && (
                <div className="mt-2 flex items-center gap-1 text-xs text-[#00D97E]">
                  <CheckCircle className="h-3 w-3" />
                  Copied to clipboard
                </div>
              )}
            </div>

            <div className={`rounded-lg p-4 space-y-2 ${modalCls.secondary}`}>
              {[
                { label: 'Name', value: keyName },
                { label: 'Permissions', value: `${Object.values(permissions).filter(Boolean).length} scopes` },
                { label: 'Expires', value: expiry },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between text-sm">
                  <span className={modalCls.subtext}>{label}</span>
                  <span className={modalCls.title}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={modalCls.footer}>
            <button onClick={onClose} className="w-full rounded-lg bg-[#1A6FFF] px-6 py-2.5 text-sm text-white hover:bg-[#1557CC] transition-colors">
              Done
            </button>
          </div>
        </>
      )}
    </ModalShell>
  );
}

function PermissionCheckbox({ label, description, checked, onChange, warning }: {
  label: string;
  description: string;
  checked: boolean;
  onChange: () => void;
  warning?: boolean;
}) {
  return (
    <label className={`flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition-colors ${
      checked
        ? warning
          ? 'border-[#F59E0B] bg-[#F59E0B]/5 dark:bg-[#F59E0B]/10'
          : 'border-[#1A6FFF] bg-[#1A6FFF]/5 dark:bg-[#1A6FFF]/10'
        : 'border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10'
    }`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#1A6FFF] focus:ring-[#1A6FFF]"
      />
      <div className="flex-1">
        <div className="text-sm text-gray-900 dark:text-white mb-0.5">{label}</div>
        <div className="text-xs text-gray-500 dark:text-gray-400">{description}</div>
      </div>
    </label>
  );
}
