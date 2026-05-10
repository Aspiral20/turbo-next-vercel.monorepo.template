'use client';
import { useEffect, useState } from 'react';
import { SettingsSectionSidebar } from '@/_components/settings/SettingsSectionSidebar';
import { useSession } from 'next-auth/react';
import { PROFILE_SIDEBAR_ITEMS } from './_data/sidebar';
import { useAppDispatch } from '@/store/hooks';
import { apiInterceptor, endpoints } from '@/lib/axios';
import { ShieldCheck, ShieldAlert } from 'lucide-react';
import countries from 'i18n-iso-countries';
import enLocale from 'i18n-iso-countries/langs/en.json';

countries.registerLocale(enLocale);

export default function ProfilePage() {
  const { data: session } = useSession();
  const dispatch = useAppDispatch();
  const [emailVerified, setEmailVerified] = useState<boolean | null>(null);
  const [emailVerifiedAt, setEmailVerifiedAt] = useState<string | null>(null);

  useEffect(() => {
    if (!session?.user?.id) return;
    const api = apiInterceptor();
    api.getApiData(endpoints.intern.axiosNextInstance.users.profile)
      .then((data: any) => {
        setEmailVerified(data.emailVerified ?? false);
        setEmailVerifiedAt(data.emailVerifiedAt ?? null);
      })
      .catch(() => {});
  }, [session?.user?.id]);

  const name = session?.user?.name ?? '';
  const email = session?.user?.email ?? '';
  const role = session?.user?.role ?? '';
  const countryCode = session?.user?.country ?? '';
  const initials = name.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2);
  const [firstName = '', ...rest] = name.split(' ');
  const lastName = rest.join(' ');

  const countryName = countryCode ? (countries.getName(countryCode, 'en') ?? countryCode) : '';
  const sidebarItems = PROFILE_SIDEBAR_ITEMS(dispatch);

  const verifiedDate = emailVerifiedAt
    ? new Date(emailVerifiedAt).toLocaleDateString('en', { day: 'numeric', month: 'short', year: 'numeric' })
    : null;

  return (
    <div className="flex gap-6">
      <div className="flex-1 min-w-0 space-y-6">
        <div className="flex items-center gap-5">
          <div className="h-20 w-20 rounded-full bg-gradient-to-br from-[#1A6FFF] to-[#00D97E] flex items-center justify-center text-2xl text-white flex-shrink-0">
            {initials}
          </div>
          <div className="flex-1">
            <h3 className="text-xl text-gray-900 dark:text-white">{name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{role}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-8 gap-y-5">
          <ProfileField label="First Name" value={firstName} />
          <ProfileField label="Last Name" value={lastName} />
          <div>
            <dt className="text-xs text-gray-400 dark:text-gray-500 mb-1">Email</dt>
            <dd className="text-sm text-gray-900 dark:text-white mb-1.5">{email || '—'}</dd>
            {emailVerified !== null && (
              emailVerified ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#00D97E]/10 px-2 py-0.5 text-xs text-[#00D97E]">
                  <ShieldCheck className="h-3 w-3" />
                  Verified{verifiedDate ? ` · ${verifiedDate}` : ''}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 dark:bg-amber-900/20 px-2 py-0.5 text-xs text-amber-600 dark:text-amber-400">
                  <ShieldAlert className="h-3 w-3" />
                  Not verified
                </span>
              )
            )}
          </div>
          <ProfileField label="Country" value={countryName} />
        </div>
      </div>

      <SettingsSectionSidebar items={sidebarItems} />
    </div>
  );
}

function ProfileField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-gray-400 dark:text-gray-500 mb-1">{label}</dt>
      <dd className="text-sm text-gray-900 dark:text-white">{value || '—'}</dd>
    </div>
  );
}
