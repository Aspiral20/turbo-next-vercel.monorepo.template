'use client';
import { useState } from 'react';
import { Button } from '@/_components/ui/button';
import { Input } from '@/_components/ui/input';
import { Label } from '@/_components/ui/label';
import { Link } from '@/i18n/navigation';
import { routes } from '@/routes';
import { AuthCard } from '@/_components/auth/AuthCard';
import { apiInterceptor, endpoints } from '@/lib/axios';
import ButtonSync from '@/_components/ButtonSync';

const inputCls = 'text-gray-900 dark:text-white bg-white dark:bg-transparent border-gray-300 dark:border-white/55 h-11';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const api = apiInterceptor();
      await api.postApiData(endpoints.intern.axiosNextInstance.auth.forgotPassword, { email });
      setSent(true);
    } catch (err) {
      console.error(`Something went wrong!: ${err}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard
      title="Reset Password"
      subtitle={
        sent
          ? "Check your inbox — we've sent you a reset link."
          : "Enter your email and we'll send you a link to reset your password."
      }
      footer={
        <>
          Remembered it?{' '}
          <Link href={routes.i18n.login} className="text-[#1A6FFF] hover:text-[#1557CC] transition-colors">
            Back to Sign in
          </Link>
        </>
      }
    >
      {!sent ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700 dark:text-white">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={inputCls}
            />
          </div>

          <ButtonSync
            displayedIcon={null}
            className={"w-full justify-center py-3"}
            type="submit"
            isLoading={isLoading}
            text={"Send Reset Link"}
            loadingText="Loading..."
          />
        </form>
      ) : (
        <div className="rounded-xl border border-gray-200 dark:border-white/15 bg-gray-50 dark:bg-white/5 px-4 py-6 text-center text-sm text-gray-600 dark:text-white/70">
          A reset link was sent to <span className="text-gray-900 dark:text-white">{email}</span>
        </div>
      )}
    </AuthCard>
  );
}
