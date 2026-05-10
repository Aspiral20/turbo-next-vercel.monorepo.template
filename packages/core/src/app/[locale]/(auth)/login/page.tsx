'use client';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/_components/ui/button';
import { Input } from '@/_components/ui/input';
import { Label } from '@/_components/ui/label';
import { getSession, signIn } from 'next-auth/react';
import { routes } from '@/routes';
import { LoaderEnum, LoadingLayout } from '@/_layouts';
import { useRouter } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import { LoadingLayoutWrapper } from '@/_layouts/LoadingLayout';
import { AuthCard } from '@/_components/auth/AuthCard';
import ButtonSync from '@/_components/ButtonSync';

const inputCls = 'text-gray-900 dark:text-white bg-white dark:bg-transparent border-gray-300 dark:border-white/55 h-11';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (!email || !password) {
        toast.error('Email or password are required!');
        return;
      }
      await signIn('credentials', { email, password, redirect: false });
      const resSession = await getSession();
      if (!resSession?.authenticated) {
        toast.error('Invalid email or password. Please try again!');
        return;
      }
      toast.success('You are now logged in!');
      router.refresh();
    } catch (err) {
      console.error(`Something went wrong!: ${err}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard
      title="Login"
      subtitle="Good to see you again! Ready when you are just sign-in."
      footer={
        <>
          <span className='block'>
            Forgot Password?{' '}
            <Link href={routes.i18n.forgotPassword.self} className="text-[#1A6FFF] hover:text-[#1557CC] transition-colors">
              Reset Password
            </Link>
          </span>
          {/* <span className="mx-2 text-gray-300 dark:text-white/20">·</span> */}
          <span className='block'>
            No account?{' '}
            <Link href={routes.i18n.signUp} className="text-[#1A6FFF] hover:text-[#1557CC] transition-colors">
              Sign up
            </Link>
          </span>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700 dark:text-white">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder=""
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={inputCls}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-700 dark:text-white">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder=""
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={inputCls}
            />
          </div>
        </div>

        <ButtonSync
          displayedIcon={null}
          className={"w-full justify-center py-3"}
          type="submit"
          isLoading={isLoading}
          text={"Log In"}
          loadingText="Loading..."
        />
        {/* <Button
          type="submit"
          className="w-full h-11 bg-[#1A6FFF] hover:bg-[#1557CC] transition-colors duration-200"
        >
          Log In
        </Button> */}
      </form>
    </AuthCard>
  );
}
