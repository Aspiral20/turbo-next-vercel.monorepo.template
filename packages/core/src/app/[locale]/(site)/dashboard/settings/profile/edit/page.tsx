'use client';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Save } from 'lucide-react';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { SettingsSectionSidebar } from '@/_components/settings/SettingsSectionSidebar';
import { Link } from '@/i18n/navigation';
import { routes } from '@/routes';
import { apiInterceptor, endpoints } from '@/lib/axios';
import ButtonSync from '@/_components/ButtonSync';
import { PROFILE_SIDEBAR_ITEMS } from '../_data/sidebar';
import { useAppDispatch } from '@/store/hooks';
import countries from 'i18n-iso-countries';
import enLocale from 'i18n-iso-countries/langs/en.json';

countries.registerLocale(enLocale);

const COUNTRIES = Object.entries(countries.getNames('en', { select: 'official' }))
  .map(([code, name]) => ({ code, name }))
  .sort((a, b) => a.name.localeCompare(b.name));

type FormValues = {
  firstName: string;
  lastName: string;
  country: string;
};

export default function EditProfilePage() {
  const dispatch = useAppDispatch();
  const { data: session, update } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const { register, handleSubmit, reset, watch, formState: { isDirty } } = useForm<FormValues>({
    defaultValues: { firstName: '', lastName: '', country: '' },
  });

  useEffect(() => {
    if (!session?.user?.id || initialized) return;
    const api = apiInterceptor();
    api.getApiData(endpoints.intern.axiosNextInstance.users.profile)
      .then((data) => {
        const [first = '', ...rest] = (data.name || '').split(' ');
        reset({ firstName: first, lastName: rest.join(' '), country: data.country ?? '' });
      })
      .catch(() => {
        const [first = '', ...rest] = (session.user?.name || '').split(' ');
        reset({ firstName: first, lastName: rest.join(' '), country: '' });
      })
      .finally(() => setInitialized(true));
  }, [session?.user?.id, initialized, reset]);

  const sidebarItems = PROFILE_SIDEBAR_ITEMS(dispatch);

  const firstName = watch('firstName');
  const lastName = watch('lastName');
  const initials = `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`.toUpperCase();

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    const fullName = [values.firstName.trim(), values.lastName.trim()].filter(Boolean).join(' ');
    if (!fullName) {
      toast.error('First name is required.');
      setIsLoading(false);
      return;
    }
    try {
      const api = apiInterceptor();
      const res = await api.putApiData(endpoints.intern.axiosNextInstance.users.profile, {
        name: fullName,
        country: values.country || undefined,
      });
      const saved = res?.user;
      await update({ name: saved?.name ?? fullName, country: saved?.country ?? values.country ?? null });
      const [first = '', ...rest] = (saved?.name ?? fullName).split(' ');
      reset({ firstName: first, lastName: rest.join(' '), country: saved?.country ?? values.country });
      toast.success('Profile updated.');
    } catch (err: any) {
      toast.error(err?.error ?? 'Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  }

  const inputCls = 'w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0D1117] text-gray-900 dark:text-white px-4 py-2 text-sm focus:border-[#1A6FFF] focus:outline-none';

  return (
    <div className="flex gap-6">
      <div className="flex-1 min-w-0 space-y-6">
        <h3 className="text-lg text-gray-900 dark:text-white">Edit Profile</h3>

        <div className="flex items-center gap-4">
          <div className="h-20 w-20 rounded-full bg-gradient-to-br from-[#1A6FFF] to-[#00D97E] flex items-center justify-center text-2xl text-white flex-shrink-0">
            {initials}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">First Name</label>
              <input {...register('firstName')} type="text" className={inputCls} />
            </div>
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">Last Name</label>
              <input {...register('lastName')} type="text" className={inputCls} />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">Email</label>
            <input
              type="email"
              value={session?.user?.email ?? ''}
              disabled
              className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#0D1117] text-gray-400 dark:text-gray-500 px-4 py-2 text-sm cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Your Country</label>
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-2">
              Where you&apos;re personally based — used for timezone display and locale formatting.
            </p>
            <select {...register('country')} className={inputCls}>
              <option value="">Select a country…</option>
              {COUNTRIES.map(({ code, name }) => (
                <option key={code} value={code}>{name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
            <ButtonSync
              type="submit"
              isLoading={isLoading}
              disabled={isLoading || !isDirty}
              displayedIcon={<Save className="h-4 w-4" />}
            />
            <Link
              href={routes.i18n.dashboard.settings.profile.self}
              className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#161B22] px-6 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>

      <SettingsSectionSidebar items={sidebarItems} />
    </div>
  );
}
