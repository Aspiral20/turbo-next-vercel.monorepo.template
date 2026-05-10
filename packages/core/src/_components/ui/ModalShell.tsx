'use client';

import { cn } from './utils';

interface ModalShellProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  children: React.ReactNode;
}

export function ModalShell({ isOpen, onClose, className, children }: ModalShellProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm" />
      <div
        className={cn(
          'relative w-full rounded-2xl flex flex-col max-h-[90vh] overflow-hidden',
          'bg-white dark:bg-[#161B22]',
          'border border-gray-200 dark:border-white/10',
          'shadow-[0_24px_64px_rgba(0,0,0,0.14)] dark:shadow-[0_24px_64px_rgba(0,0,0,0.5)]',
          className,
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

// Shared theme-aware class tokens for use inside any modal
export const modalCls = {
  header:      'border-b border-gray-200 dark:border-white/10 px-6 py-4',
  footer:      'border-t border-gray-200 dark:border-white/10 px-6 py-4',
  body:        'flex-1 overflow-y-auto p-6',
  title:       'text-gray-900 dark:text-white',
  label:       'text-gray-700 dark:text-gray-300',
  subtext:     'text-gray-500 dark:text-gray-400',
  closeBtn:    'rounded-lg p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-gray-600 dark:hover:text-gray-200 transition-colors',
  input:       'w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0D1117] text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 px-4 py-2.5 text-sm focus:border-[#1A6FFF] focus:outline-none focus:ring-2 focus:ring-[#1A6FFF]/20',
  select:      'w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0D1117] text-gray-900 dark:text-white px-4 py-2.5 text-sm focus:border-[#1A6FFF] focus:outline-none focus:ring-2 focus:ring-[#1A6FFF]/20',
  secondary:   'bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300',
  card:        'rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0D1117]',
  infoBox:     'rounded-xl bg-[#1A6FFF]/5 dark:bg-[#1A6FFF]/10 border border-[#1A6FFF]/20 p-4',
  templateBtn: 'rounded-md bg-gray-100 dark:bg-white/10 px-2 py-1 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/15',
  backBtn:     'flex items-center gap-2 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-[#161B22] px-6 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors',
  addBtn:      'flex items-center gap-2 rounded-lg border border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-white/5 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:border-[#1A6FFF] hover:bg-[#1A6FFF]/5 transition-all',
  timelineLine:'bg-gray-200 dark:bg-gray-700',
  stepInactive: 'border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-[#161B22] text-gray-400 dark:text-gray-500',
  stepConnector:'bg-gray-300 dark:bg-gray-700',
};
