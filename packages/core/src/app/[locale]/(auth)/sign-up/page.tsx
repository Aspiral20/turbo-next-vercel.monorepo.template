'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Label } from '@/_components/ui/label';
import { Input } from '@/_components/ui/input';
import { PasswordInput } from '@/_components/ui/PasswordInput';
import { AuthCard } from '@/_components/auth/AuthCard';
import ButtonSync from '@/_components/ButtonSync';
import { Link } from '@/i18n/navigation';
import { routes } from '@/routes';
import { apiInterceptor, endpoints } from '@/lib/axios';

const labelCls = 'text-gray-700 dark:text-white';
const inputCls = 'text-gray-900 dark:text-white bg-white dark:bg-transparent border-gray-300 dark:border-white/55 h-11';
const errorCls = 'mt-1 text-xs text-red-500';

type FormValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function SignUpPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    try {
      const api = apiInterceptor();
      await api.postApiData(endpoints.intern.axiosNextInstance.auth.signUp, {
        name: values.name,
        email: values.email,
        password: values.password,
      });

      await signIn('credentials', { email: values.email, password: values.password, redirect: false });
      toast.success('Account created! Check your inbox to verify your email.');
      router.push(routes.i18n.verifyEmail.self);
    } catch (err: any) {
      toast.error(err?.error ?? 'Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard
      title="Create your account"
      subtitle="Start generating leads and automating your outreach."
      footer={
        <>
          Already have an account?{' '}
          <Link href={routes.i18n.login} className="text-[#1A6FFF] hover:text-[#1557CC] transition-colors">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="name" className={labelCls}>
            Full Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            type="text"
            placeholder="John Doe"
            className={inputCls}
            {...register('name', { required: 'Full name is required.' })}
          />
          {errors.name && <p className={errorCls}>{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className={labelCls}>
            Email <span className="text-red-500">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            className={inputCls}
            {...register('email', { required: 'Email is required.' })}
          />
          {errors.email && <p className={errorCls}>{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className={labelCls}>
            Password <span className="text-red-500">*</span>
          </Label>
          <PasswordInput
            id="password"
            placeholder="Min. 8 characters"
            {...register('password', {
              required: 'Password is required.',
              minLength: { value: 8, message: 'Password must be at least 8 characters.' },
            })}
          />
          {errors.password && <p className={errorCls}>{errors.password.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className={labelCls}>
            Confirm Password <span className="text-red-500">*</span>
          </Label>
          <PasswordInput
            id="confirmPassword"
            placeholder="Repeat your password"
            {...register('confirmPassword', {
              required: 'Please confirm your password.',
              validate: (v) => v === getValues('password') || 'Passwords do not match.',
            })}
          />
          {errors.confirmPassword && <p className={errorCls}>{errors.confirmPassword.message}</p>}
        </div>

        <div className="pt-1">
          <ButtonSync
            displayedIcon={null}
            className="w-full justify-center py-3"
            type="submit"
            isLoading={isLoading}
            text="Create Account"
            loadingText="Creating account…"
          />
        </div>
      </form>
    </AuthCard>
  );
}
