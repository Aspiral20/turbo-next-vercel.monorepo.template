import { SettingsTabNav } from '@/_components/settings/SettingsTabNav';

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl text-gray-900 dark:text-white mb-1">Settings</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">Manage your account and preferences</p>
      </div>

      <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#161B22] overflow-hidden">
        <SettingsTabNav />
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
