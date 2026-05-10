'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { AuthCard } from '@/_components/auth/AuthCard';
import { Link } from '@/i18n/navigation';
import { routes } from '@/routes';
import { apiInterceptor, endpoints } from '@/lib/axios';

export default function VerifyEmailTokenPage() {
  const { token } = useParams<{ token: string }>();
  const { update } = useSession();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const verify = async () => {
      try {
        const api = apiInterceptor();
        await api.postApiData(endpoints.intern.axiosNextInstance.auth.verifyEmail, { token });
        // Update JWT so AuthGuard allows dashboard access
        await update({ emailVerified: true });
        setStatus('success');
        setTimeout(() => router.push(routes.i18n.dashboard.self), 1500);
      } catch (err: any) {
        setErrorMessage(err?.error ?? 'Verification link is invalid or has expired.');
        setStatus('error');
      }
    };
    verify();
  }, [token]);

  return (
    <AuthCard
      title={status === 'error' ? 'Verification failed' : 'Verifying your email'}
      subtitle={
        status === 'loading'
          ? 'Please wait while we verify your email address…'
          : status === 'success'
          ? 'Email verified! Redirecting you to the dashboard…'
          : errorMessage
      }
      footer={
        status === 'error' ? (
          <>
            Back to{' '}
            <Link href={routes.i18n.verifyEmail.self} className="text-[#1A6FFF] hover:text-[#1557CC] transition-colors">
              Verify Email
            </Link>
          </>
        ) : undefined
      }
    >
      <div className="flex justify-center py-4">
        {status === 'loading' && <Loader2 className="h-10 w-10 text-[#1A6FFF] animate-spin" />}
        {status === 'success' && <CheckCircle className="h-10 w-10 text-[#00D97E]" />}
        {status === 'error' && <XCircle className="h-10 w-10 text-red-500" />}
      </div>
    </AuthCard>
  );
}
