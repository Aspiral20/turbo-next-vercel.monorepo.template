'use client'
import {
  LayoutDashboard,
  Database,
  Users,
  Settings,
  Mail,
  Sparkles,
  ChevronLeft,
  Building2,
} from 'lucide-react';
import { usePathname, Link } from "@/i18n/navigation";
import { routes } from "@/routes";
import { Logo } from "@/_components/Logo";
import { v4 as uuid } from 'uuid';
import { useState } from 'react';
import { useSession } from 'next-auth/react';

enum SectionsEnum {
  home = 'home',
  leadExplorer = 'apps-data',
  sources = 'apps-traffic',
  campaigns = 'platform-users',
  enrichment = 'ask-ai',
  workspaces = 'workspaces',
  settings = 'crm',
}

export const initExpandedSections = [SectionsEnum.leadExplorer, SectionsEnum.campaigns]

const navItems = [
  { id: uuid(), name: SectionsEnum.home, icon: LayoutDashboard, label: 'Dashboard', path: routes.i18n.dashboard.self, matchPrefix: false, show: true },
  { id: uuid(), name: SectionsEnum.settings, icon: Settings, label: 'Settings', path: routes.i18n.dashboard.settings.self, matchPrefix: true, show: true },
];

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

function getInitials(name?: string | null): string {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? '?';
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function SidebarLayout({ isCollapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const [expandedSections, setExpandedSections] = useState<string[]>(initExpandedSections);
  const { data: session } = useSession();
  const initials = getInitials(session?.user?.name);
  const displayName = session?.user?.name ?? session?.user?.email ?? '';
  const displayEmail = session?.user?.email ?? '';

  const isActive = (path: string, matchPrefix: boolean) =>
    matchPrefix ? pathname.startsWith(path) : pathname === path;

  return (
    <aside
      className={`flex flex-col border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-[#161B22] transition-all ${isCollapsed ? 'w-16' : 'w-60'}`}
    >
      <div className="flex h-16 items-center justify-between border-b border-gray-200 dark:border-gray-800 px-4">
        {!isCollapsed && (
          <Logo size="sm" />
        )}
        <button
          onClick={onToggle}
          className="rounded-lg p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <ChevronLeft className={`h-5 w-5 text-gray-600 dark:text-gray-400 transition-transform ${isCollapsed ? 'rotate-180' : ''}`} />
        </button>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {navItems.filter((item) => item.show).map((item) => {
          const Icon = item.icon;
          const itemIsActive = item.path ? isActive(item.path, item.matchPrefix) : false;
          return (
            <Link
              key={item.id}
              href={item.path}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${itemIsActive
                ? 'bg-[#1A6FFF]/10 text-[#1A6FFF]'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && <span className="text-sm">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-gray-200 dark:border-gray-800 p-3">
        <div className={`flex items-center gap-3 rounded-lg px-3 py-2 ${isCollapsed ? 'justify-center' : ''}`}>
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#1A6FFF] to-[#00D97E] flex items-center justify-center text-sm text-white flex-shrink-0">
            {initials}
          </div>
          {!isCollapsed && (
            <div className="flex-1 overflow-hidden">
              <div className="text-sm text-gray-900 dark:text-white truncate">{displayName}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{displayEmail}</div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
