'use client';
import { User, Key, Zap, CreditCard, Bell } from 'lucide-react';
import { Link, usePathname } from '@/i18n/navigation';
import { routes } from '@/routes';

const TABS = [
  { label: 'Profile', icon: User, href: routes.i18n.dashboard.settings.profile.self },
  { label: 'API Keys', icon: Key, href: routes.i18n.dashboard.settings.apiKeys },
  { label: 'Billing', icon: CreditCard, href: routes.i18n.dashboard.settings.billing },
  { label: 'Notifications', icon: Bell, href: routes.i18n.dashboard.settings.notifications },
];

export function SettingsTabNav() {
  const pathname = usePathname();

  return (
    <div className="flex gap-1 p-2 border-b border-gray-200 dark:border-gray-800">
      {TABS.map(({ label, icon: Icon, href }) => {
        const isActive = pathname === href || pathname.startsWith(href + '/');
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm transition-colors ${
              isActive ? 'bg-[#1A6FFF]/10 text-[#1A6FFF]' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        );
      })}
    </div>
  );
}
