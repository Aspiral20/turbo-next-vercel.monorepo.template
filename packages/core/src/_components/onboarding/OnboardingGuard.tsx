'use client';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { OnboardingModal } from './OnboardingModal';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { openOnboardingModal, closeOnboardingModal } from '@/store/slices/uiSlice';

export function OnboardingGuard() {
  const { data: session } = useSession();
  const dispatch = useAppDispatch();
  const show = useAppSelector((s) => s.ui.showOnboardingModal);

  useEffect(() => {
    if (session?.user?.emailVerified && !session?.user?.onboardingCompleted) {
      dispatch(openOnboardingModal());
    }
  }, [session?.user?.emailVerified, session?.user?.onboardingCompleted, dispatch]);

  if (!show) return null;

  const closeable = session?.user?.onboardingCompleted ?? false;

  return (
    <OnboardingModal
      onClose={closeable ? () => dispatch(closeOnboardingModal()) : undefined}
    />
  );
}
