'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Lock, Pencil } from 'lucide-react';
import { toast } from 'sonner';
import { SettingsSectionSidebar, type SidebarItem } from '@/_components/settings/SettingsSectionSidebar';
import { Link } from '@/i18n/navigation';
import { routes } from '@/routes';
import { apiInterceptor, endpoints } from '@/lib/axios';
import ButtonSync from '@/_components/ButtonSync';
import { PasswordInput } from '@/_components/ui/PasswordInput';
import { PROFILE_SIDEBAR_ITEMS } from '../_data/sidebar';
import { useAppDispatch } from '@/store/hooks';

type FormValues = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const errorCls = 'mt-1 text-xs text-red-500';

export default function ChangePasswordPage() {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, reset, getValues, formState: { isDirty, errors } } = useForm<FormValues>({
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  });
  const sidebarItems = PROFILE_SIDEBAR_ITEMS(dispatch);


  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    try {
      const api = apiInterceptor();
      await api.postApiData(endpoints.intern.axiosNextInstance.users.changePassword, {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      toast.success('Password updated.');
      reset();
    } catch (err: any) {
      toast.error(err?.error ?? 'Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex gap-6">
      <div className="flex-1 min-w-0 space-y-6">
        <h3 className="text-lg text-gray-900 dark:text-white">Change Password</h3>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
              Current Password <span className="text-red-500">*</span>
            </label>
            <PasswordInput
              {...register('currentPassword', { required: 'Current password is required.' })}
              placeholder="Enter current password"
            />
            {errors.currentPassword && (
              <p className={errorCls}>{errors.currentPassword.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
              New Password <span className="text-red-500">*</span>
            </label>
            <PasswordInput
              {...register('newPassword', {
                required: 'New password is required.',
                minLength: { value: 8, message: 'Password must be at least 8 characters.' },
              })}
              placeholder="Enter new password"
            />
            {errors.newPassword && (
              <p className={errorCls}>{errors.newPassword.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
              Confirm New Password <span className="text-red-500">*</span>
            </label>
            <PasswordInput
              {...register('confirmPassword', {
                required: 'Please confirm your new password.',
                validate: (v) => v === getValues('newPassword') || 'Passwords do not match.',
              })}
              placeholder="Confirm new password"
            />
            {errors.confirmPassword && (
              <p className={errorCls}>{errors.confirmPassword.message}</p>
            )}
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
            <ButtonSync
              type="submit"
              isLoading={isLoading}
              disabled={isLoading || !isDirty}
              text="Update Password"
              loadingText="Updating…"
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
