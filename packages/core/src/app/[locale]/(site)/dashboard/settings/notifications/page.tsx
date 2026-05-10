'use client';
import { useState } from 'react';
import { Save, Mail, Monitor, Megaphone } from 'lucide-react';
import { SettingsSectionSidebar, type SidebarItem } from '@/_components/settings/SettingsSectionSidebar';

const SIDEBAR_ITEMS: SidebarItem[] = [
  { id: 'email', label: 'Email', icon: Mail },
  { id: 'system', label: 'System', icon: Monitor },
  { id: 'marketing', label: 'Marketing', icon: Megaphone },
];

const notificationSettings = [
  {
    id: 'email',
    category: 'Email Notifications',
    settings: [
      { label: 'New leads found', enabled: true },
      { label: 'Campaign performance updates', enabled: true },
      { label: 'Weekly summary reports', enabled: false },
    ],
  },
  {
    id: 'system',
    category: 'System Notifications',
    settings: [
      { label: 'Source sync completed', enabled: true },
      { label: 'Enrichment completed', enabled: true },
      { label: 'API rate limit warnings', enabled: true },
    ],
  },
  {
    id: 'marketing',
    category: 'Marketing',
    settings: [
      { label: 'Product updates', enabled: false },
      { label: 'Tips and best practices', enabled: false },
    ],
  },
];

export default function NotificationsPage() {
  const [activeSection, setActiveSection] = useState<string | null>('email');

  const visibleSections = activeSection
    ? notificationSettings.filter((s) => s.id === activeSection)
    : notificationSettings;

  return (
    <div className="flex gap-6">
      <div className="flex-1 min-w-0 space-y-6">
        <div>
          <h3 className="text-lg text-gray-900 dark:text-white mb-1">Notification Preferences</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Choose what updates you want to receive</p>
        </div>

        {visibleSections.map((section) => (
          <div key={section.category} className="space-y-3">
            <h4 className="text-sm text-gray-900 dark:text-white">{section.category}</h4>
            <div className="space-y-2">
              {section.settings.map((setting) => (
                <div key={setting.label} className="flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-[#0D1117]/50 p-3">
                  <span className="text-sm text-gray-700 dark:text-gray-300">{setting.label}</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked={setting.enabled} />
                    <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1A6FFF]"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
          <button className="flex items-center gap-2 rounded-lg bg-[#1A6FFF] px-6 py-2 text-sm text-white hover:bg-[#1557CC] transition-colors">
            <Save className="h-4 w-4" />
            Save Preferences
          </button>
        </div>
      </div>

      <SettingsSectionSidebar items={SIDEBAR_ITEMS} activeId={activeSection} onChange={setActiveSection} />
    </div>
  );
}
