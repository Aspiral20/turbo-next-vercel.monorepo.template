'use client';

import { Bell, Search, LogOut, User, ChevronDown, Building2, Check, Loader2, Plus } from 'lucide-react';
import { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from '@/i18n/navigation';
import { routes } from '@/routes';
import { signOut, useSession } from 'next-auth/react';
import { ThemeToggle } from '@/_components/ui/ThemeToggle';

function getInitials(name?: string | null): string {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? '?';
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const DashboardNavbar: React.FC = () => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();
  const displayName = session?.user?.name ?? session?.user?.email ?? '';
  const displayEmail = session?.user?.email ?? '';
  const initials = getInitials(session?.user?.name);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSignOut = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signOut({ callbackUrl: routes.i18n.login });
    } catch (err) {
      console.error(`Something went wrong!: ${err}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#161B22] px-6">
      <div className="flex flex-1 items-center gap-4">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Search leads, campaigns..."
            className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#0D1117] text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-600 py-2 pl-10 pr-4 text-sm focus:border-[#1A6FFF] focus:bg-white dark:focus:bg-[#161B22] focus:outline-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />

        <button className="relative rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-[#EF4444]" />
        </button>

        <div ref={ref} className="relative">
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-2 rounded-lg p-1 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#1A6FFF] to-[#00D97E] flex items-center justify-center text-sm text-white flex-shrink-0">
              {initials}
            </div>
            <ChevronDown className={`h-4 w-4 text-gray-500 dark:text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
          </button>

          {open && (
            <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#161B22] shadow-lg z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                <p className="text-sm text-gray-900 dark:text-white">{displayName}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{displayEmail}</p>
              </div>

              <div className="p-1">
                <Link
                  href={routes.i18n.dashboard.settings.profile.self}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors w-full"
                >
                  <User className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  Profile
                </Link>

                <button
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-[#EF4444] hover:bg-[#EF4444]/5 transition-colors w-full"
                  onClick={handleSignOut}
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default DashboardNavbar;
