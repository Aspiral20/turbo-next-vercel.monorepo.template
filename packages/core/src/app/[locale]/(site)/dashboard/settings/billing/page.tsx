'use client';
import { useState } from 'react';
import { BarChart2, CreditCard, Receipt } from 'lucide-react';
import { SettingsSectionSidebar, type SidebarItem } from '@/_components/settings/SettingsSectionSidebar';

const SIDEBAR_ITEMS: SidebarItem[] = [
  { id: 'plan', label: 'Current Plan', icon: BarChart2 },
  { id: 'payment', label: 'Payment Method', icon: CreditCard },
  { id: 'invoices', label: 'Invoices', icon: Receipt },
];

export default function BillingPage() {
  const [activeSection, setActiveSection] = useState<string | null>('plan');

  return (
    <div className="flex gap-6">
      <div className="flex-1 min-w-0 space-y-6">
        <div>
          <h3 className="text-lg text-gray-900 dark:text-white mb-1">Billing & Subscription</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Manage your plan and payment methods</p>
        </div>

        <div className="rounded-lg border-2 border-[#1A6FFF] bg-gradient-to-b from-[#1A6FFF]/5 to-transparent p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h4 className="text-lg text-gray-900 dark:text-white mb-1">Growth Plan</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">$299 per month</p>
            </div>
            <span className="rounded-full bg-[#00D97E]/10 px-3 py-1 text-xs text-[#00D97E]">Active</span>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Next billing date</span>
              <span className="text-gray-900 dark:text-white">June 5, 2026</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Leads this month</span>
              <span className="text-gray-900 dark:text-white">7,234 / 10,000</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Enrichments this month</span>
              <span className="text-gray-900 dark:text-white">3,456 / 5,000</span>
            </div>
          </div>

          <div className="flex gap-2">
            <button className="flex-1 rounded-lg border border-[#1A6FFF] bg-white dark:bg-[#161B22] px-4 py-2 text-sm text-[#1A6FFF] hover:bg-[#1A6FFF]/5 transition-colors">
              Upgrade Plan
            </button>
            <button className="flex-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#161B22] px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              Manage Billing
            </button>
          </div>
        </div>

        <div>
          <h4 className="text-sm text-gray-900 dark:text-white mb-3">Payment Method</h4>
          <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#161B22] p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded bg-gray-900 px-2 py-1 text-xs text-white">VISA</div>
                <div>
                  <div className="text-sm text-gray-900 dark:text-white">•••• •••• •••• 4242</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Expires 12/27</div>
                </div>
              </div>
              <button className="text-sm text-[#1A6FFF] hover:text-[#1557CC]">Update</button>
            </div>
          </div>
        </div>
      </div>

      <SettingsSectionSidebar items={SIDEBAR_ITEMS} activeId={activeSection} onChange={setActiveSection} />
    </div>
  );
}
