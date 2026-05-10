'use client'
import {
  X, MapPin,
  // Linkedin,
  Target,
  // Instagram,
  Database, ExternalLink, Info
} from 'lucide-react';
import { useState } from 'react';

interface ConnectSourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  sourceName?: string;
}

export function ConnectSourceModal({ isOpen, onClose, sourceName = 'Google Maps' }: ConnectSourceModalProps) {
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const [radius, setRadius] = useState('10km');
  const [maxLeads, setMaxLeads] = useState('500');
  const [autoSync, setAutoSync] = useState(true);
  const [frequency, setFrequency] = useState('Daily');
  const [deduplication, setDeduplication] = useState(true);

  if (!isOpen) return null;

  const sources = {
    'Google Maps': {
      icon: MapPin,
      category: 'Maps',
      description: 'Pull local business leads with ratings, reviews, and contact info from Google Maps.',
      authType: 'apiKey',
      color: '#1A6FFF',
      example: { name: 'Acme Coffee Roasters', category: 'Coffee Shop', location: 'San Francisco, CA', email: 'contact@acmecoffee.com', rating: 4.8, signals: 'High rating, 200+ reviews' }
    },
    'LinkedIn': {
      icon: MapPin,
      category: 'Social',
      description: 'Extract company and professional data from LinkedIn profiles and company pages.',
      authType: 'oauth',
      color: '#0A66C2',
      example: { name: 'TechFlow Solutions', category: 'Software Development', location: 'Austin, TX', email: 'careers@techflow.io', rating: null, signals: '50-200 employees, Series B' }
    },
    'Apollo': {
      icon: Database,
      category: 'B2B',
      description: 'Access verified B2B contacts and company intelligence from Apollo\'s database.',
      authType: 'apiKeySecret',
      color: '#6B46C1',
      example: { name: 'CloudScale Inc', category: 'SaaS', location: 'Remote', email: 'hello@cloudscale.com', rating: null, signals: 'Tech stack: AWS, React, Node' }
    }
  };

  const source = sources[sourceName as keyof typeof sources] || sources['Google Maps'];
  const Icon = source?.icon;

  const handleConnect = () => {
    console.log('Connecting source:', { sourceName, apiKey, radius, maxLeads, autoSync, frequency });
    onClose();
  };

  const inputCls = 'w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0D1117] text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 px-4 py-2.5 text-sm focus:border-[#1A6FFF] focus:outline-none focus:ring-2 focus:ring-[#1A6FFF]/20';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      <div
        className="relative w-full max-w-2xl rounded-2xl bg-white dark:bg-[#161B22] border border-transparent dark:border-gray-800 shadow-[0_24px_64px_rgba(0,0,0,0.14)] max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-gradient-to-br from-[#1A6FFF] to-[#00D97E] p-3">
                {Icon && <Icon className="h-6 w-6 text-white" />}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-xl text-gray-900 dark:text-white">{sourceName}</h2>
                  <span className="rounded-full bg-gray-100 dark:bg-gray-800 px-2 py-0.5 text-xs text-gray-600 dark:text-gray-400">
                    {source.category}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{source.description}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-sm text-gray-900 dark:text-white mb-3">Authentication</h3>

              {source.authType === 'apiKey' && (
                <div>
                  <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">API Key</label>
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter your API key"
                    className={inputCls}
                  />
                  <a href="#" className="mt-2 inline-flex items-center gap-1 text-xs text-[#1A6FFF] hover:text-[#1557CC]">
                    Get API Key
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}

              {source.authType === 'oauth' && (
                <button
                  style={{ backgroundColor: source.color }}
                  className="w-full rounded-lg px-4 py-3 text-white hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                  {Icon && <Icon className="h-5 w-5" />}
                  Connect with {sourceName}
                </button>
              )}

              {source.authType === 'apiKeySecret' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">API Key</label>
                    <input type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="Enter your API key" className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">API Secret</label>
                    <input type="password" value={apiSecret} onChange={(e) => setApiSecret(e.target.value)} placeholder="Enter your API secret" className={inputCls} />
                  </div>
                </div>
              )}
            </div>

            <div>
              <h3 className="text-sm text-gray-900 dark:text-white mb-3">Configuration</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">Search Radius</label>
                  <select value={radius} onChange={(e) => setRadius(e.target.value)} className={inputCls}>
                    <option>1km</option>
                    <option>5km</option>
                    <option>10km</option>
                    <option>25km</option>
                    <option>50km</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">Max Leads per Sync</label>
                  <input type="number" value={maxLeads} onChange={(e) => setMaxLeads(e.target.value)} className={inputCls} />
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#0D1117] px-4 py-3">
                  <div>
                    <div className="text-sm text-gray-900 dark:text-white">Auto-sync</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Automatically pull new leads</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={autoSync} onChange={(e) => setAutoSync(e.target.checked)} />
                    <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00D97E]"></div>
                  </label>
                </div>

                {autoSync && (
                  <div>
                    <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">Sync Frequency</label>
                    <select value={frequency} onChange={(e) => setFrequency(e.target.value)} className={inputCls}>
                      <option>Daily</option>
                      <option>Weekly</option>
                      <option>Manual</option>
                    </select>
                  </div>
                )}

                <div className="flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#0D1117] px-4 py-3">
                  <div>
                    <div className="text-sm text-gray-900 dark:text-white">Lead Deduplication</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Skip duplicate contacts</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={deduplication} onChange={(e) => setDeduplication(e.target.checked)} />
                    <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00D97E]"></div>
                  </label>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm text-gray-900 dark:text-white mb-3">Data Preview</h3>
              <div className="rounded-xl bg-gray-50 dark:bg-[#0D1117] p-4 space-y-2">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-3">Example lead from {sourceName}:</div>
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#1A6FFF] to-[#00D97E] flex items-center justify-center text-sm text-white flex-shrink-0">
                    {source.example.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-gray-900 dark:text-white">{source.example.name}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">{source.example.category} • {source.example.location}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">{source.example.email}</div>
                    {source.example.rating && (
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-xs text-gray-600 dark:text-gray-400">★</span>
                        <span className="text-xs text-gray-600 dark:text-gray-400">{source.example.rating}</span>
                      </div>
                    )}
                    <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-[#1A6FFF]/10 px-2 py-0.5 text-xs text-[#1A6FFF]">
                      <Info className="h-3 w-3" />
                      {source.example.signals}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-gray-200 dark:border-gray-800 pt-6">
            <button
              onClick={onClose}
              className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#161B22] px-6 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConnect}
              className="rounded-lg bg-[#1A6FFF] px-6 py-2.5 text-sm text-white hover:bg-[#1557CC] transition-colors"
            >
              Connect Source
            </button>
          </div>

          <div className="mt-3 flex items-center justify-center gap-1 text-xs text-gray-500 dark:text-gray-500">
            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            Your credentials are encrypted and never shared.
          </div>
        </div>
      </div>
    </div>
  );
}
