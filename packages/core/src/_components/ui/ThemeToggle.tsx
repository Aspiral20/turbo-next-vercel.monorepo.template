'use client';
import { useTheme } from 'next-themes';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

type ThemeOption = 'light' | 'dark' | 'system';

const OPTIONS: { value: ThemeOption; label: string }[] = [
  { value: 'dark', label: 'Dark' },
  { value: 'light', label: 'Light' },
  { value: 'system', label: 'System' },
];

function MiniPreview({ mode }: { mode: ThemeOption }) {
  if (mode === 'dark') {
    return (
      <div className="w-full h-10 rounded-md border border-gray-300 dark:border-gray-600 overflow-hidden flex">
        <div className="w-1/3 bg-[#161B22] flex flex-col gap-0.5 p-1">
          <div className="h-1.5 w-full rounded-sm bg-[#1A6FFF]" />
          <div className="h-1 w-full rounded-sm bg-gray-700" />
          <div className="h-1 w-3/4 rounded-sm bg-gray-700" />
          <div className="h-1 w-full rounded-sm bg-gray-700" />
        </div>
        <div className="flex-1 bg-[#0D1117]" />
      </div>
    );
  }
  if (mode === 'light') {
    return (
      <div className="w-full h-10 rounded-md border border-gray-300 dark:border-gray-600 overflow-hidden flex">
        <div className="w-1/3 bg-gray-100 flex flex-col gap-0.5 p-1">
          <div className="h-1.5 w-full rounded-sm bg-[#1A6FFF]" />
          <div className="h-1 w-full rounded-sm bg-gray-300" />
          <div className="h-1 w-3/4 rounded-sm bg-gray-300" />
          <div className="h-1 w-full rounded-sm bg-gray-300" />
        </div>
        <div className="flex-1 bg-white" />
      </div>
    );
  }
  return (
    <div className="w-full h-10 rounded-md border border-gray-300 dark:border-gray-600 overflow-hidden flex">
      <div className="w-1/2 bg-[#161B22] flex flex-col gap-0.5 p-1">
        <div className="h-1.5 w-full rounded-sm bg-[#1A6FFF]" />
        <div className="h-1 w-full rounded-sm bg-gray-700" />
        <div className="h-1 w-3/4 rounded-sm bg-gray-700" />
      </div>
      <div className="w-1/2 bg-gray-100 flex flex-col gap-0.5 p-1">
        <div className="h-1.5 w-full rounded-sm bg-[#1A6FFF]" />
        <div className="h-1 w-full rounded-sm bg-gray-300" />
        <div className="h-1 w-3/4 rounded-sm bg-gray-300" />
      </div>
    </div>
  );
}

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  if (!mounted) return <div className="w-9 h-9" />;

  const CurrentIcon = theme === 'dark' ? Moon : theme === 'light' ? Sun : Monitor;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        title="Change theme"
      >
        <CurrentIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-52 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#161B22] shadow-xl z-50 p-3">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-3">Appearance</p>
          <div className="grid grid-cols-3 gap-2">
            {OPTIONS.map(({ value, label }) => {
              const active = theme === value;
              return (
                <button
                  key={value}
                  onClick={() => { setTheme(value); setOpen(false); }}
                  className={`flex flex-col items-center gap-1.5 rounded-lg p-1.5 transition-all ${
                    active
                      ? 'ring-2 ring-[#1A6FFF] bg-[#1A6FFF]/5'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <MiniPreview mode={value} />
                  <span className={`text-xs font-medium ${active ? 'text-[#1A6FFF]' : 'text-gray-600 dark:text-gray-400'}`}>
                    {label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
