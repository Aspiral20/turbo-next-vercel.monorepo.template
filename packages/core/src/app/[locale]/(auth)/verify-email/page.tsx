'use client';
import { useState, useEffect, useRef } from 'react';
import { Mail, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { AuthCard } from '@/_components/auth/AuthCard';
import ButtonSync from '@/_components/ButtonSync';
import { Link } from '@/i18n/navigation';
import { routes } from '@/routes';
import { apiInterceptor, endpoints } from '@/lib/axios';
import { useSession } from 'next-auth/react';

const COOLDOWN_SECONDS = 60;

export default function VerifyEmailPage() {
  const { data: session } = useSession();
  const email = session?.user?.email;
  const [isResending, setIsResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startCooldown = () => {
    setCooldown(COOLDOWN_SECONDS);
    timerRef.current = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResend = async () => {
    if (cooldown > 0) return;
    setIsResending(true);
    try {
      const api = apiInterceptor();
      await api.postApiData(endpoints.intern.axiosNextInstance.auth.resendVerification, {});
      toast.success('Verification email sent! Check your inbox.');
      startCooldown();
    } catch (err: any) {
      toast.error(err?.error ?? 'Could not resend email. Try again.');
    } finally {
      setIsResending(false);
    }
  };

  const coloredLinkText = `text-[#1a98ff] hover:text-[#1A6FFF] transition-colors`;

  return (
    <AuthCard
      title="Check your email"
      subtitle="We sent a verification link to your inbox. Click it to activate your account."
      footer={
        <>
          Already verified?{' '}
          <Link href={routes.i18n.login} className={coloredLinkText}>
            Sign in
          </Link>
        </>
      }
    >
      <div className="space-y-6">
        <div className="space-y-3">
          <div className="flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#1A6FFF]/10">
              <Mail className={`h-8 w-8 text-[#1a98ff]`} />
            </div>
          </div>

          <p className={`text-center text-md text-[#1a98ff]`}>
            {email}
          </p>
        </div>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          Didn't receive it? Check your spam folder, or resend below.
        </p>

        <ButtonSync
          displayedIcon={<RefreshCw className="h-4 w-4" />}
          className="w-full justify-center py-3"
          type="button"
          isLoading={isResending}
          disabled={isResending || cooldown > 0}
          text={cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend Verification Email'}
          loadingText="Sending…"
          onClick={handleResend}
        />
      </div>
    </AuthCard>
  );
}
