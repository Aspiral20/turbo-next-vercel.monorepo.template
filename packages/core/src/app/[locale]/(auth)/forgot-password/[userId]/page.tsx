'use client';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/_components/ui/button';
import { Input } from '@/_components/ui/input';
import { Label } from '@/_components/ui/label';
import { Link, useRouter } from '@/i18n/navigation';
import { routes } from '@/routes';
import { AuthCard } from '@/_components/auth/AuthCard';
import { apiInterceptor, endpoints } from '@/lib/axios';

const inputCls = 'text-gray-900 dark:text-white bg-white dark:bg-transparent border-gray-300 dark:border-white/55 h-11';

export default function ResetPasswordPage() {
  const { userId: token } = useParams<{ userId: string }>();
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      const api = apiInterceptor();
      await api.postApiData(endpoints.intern.axiosNextInstance.auth.resetPassword, { token, password });
      router.push(routes.i18n.login);
    } catch (err: any) {
      setError(err?.error ?? 'Reset link is invalid or has expired.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard
      title="New Password"
      subtitle="Choose a strong password for your account."
      footer={
        <>
          Back to{' '}
          <Link href={routes.i18n.login} className="text-[#1A6FFF] hover:text-[#1557CC] transition-colors">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col space-y-6">
          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-700 dark:text-white">New Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={inputCls}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm" className="text-gray-700 dark:text-white">Confirm Password</Label>
            <Input
              id="confirm"
              type="password"
              placeholder="••••••••"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              className={inputCls}
            />
          </div>
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-11 bg-[#1A6FFF] hover:bg-[#1557CC] transition-colors duration-200"
        >
          {isLoading ? 'Updating…' : 'Update Password'}
        </Button>
      </form>
    </AuthCard>
  );
}
