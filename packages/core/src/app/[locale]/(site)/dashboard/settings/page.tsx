import { redirect } from '@/i18n/navigation';
import { routes } from '@/routes';
import { getLocale } from 'next-intl/server';

export default async function SettingsPage() {
  const locale = await getLocale();
  redirect({ href: routes.i18n.dashboard.settings.profile.self, locale });
}
