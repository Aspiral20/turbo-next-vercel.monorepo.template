'use client';
import { type LucideIcon } from 'lucide-react';
import { Link, usePathname } from '@/i18n/navigation';

export type SidebarItem = {
  id: string;
  label: string;
  icon?: LucideIcon;
  href?: string;
  onClick?: () => void;
};

type Props = {
  items: SidebarItem[];
  activeId?: string | null;
  onChange?: (id: string) => void;
};

export function SettingsSectionSidebar({ items, activeId, onChange }: Props) {
  const pathname = usePathname();

  return (
    <div className="w-52 flex-shrink-0">
      <nav className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#161B22] overflow-hidden">
        {items.map((item, index) => {
          const Icon = item.icon;
          const isActive = item.href
            ? pathname === item.href || pathname.startsWith(item.href + '/')
            : activeId === item.id;

          const cls = `cursor-pointer w-full flex items-center gap-3 px-4 py-3 text-sm text-left transition-colors ${
            index !== 0 ? 'border-t border-gray-100 dark:border-gray-800' : ''
          } ${isActive ? 'bg-[#1A6FFF]/10 text-[#1A6FFF]' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'}`;

          if (item.href) {
            return (
              <Link key={item.id} href={item.href} className={cls}>
                {Icon && <Icon className="h-4 w-4 flex-shrink-0" />}
                {item.label}
              </Link>
            );
          }

          return (
            <button key={item.id} onClick={() => { item.onClick?.(); onChange?.(item.id); }} className={cls}>
              {Icon && <Icon className="h-4 w-4 flex-shrink-0" />}
              {item.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
