'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Briefcase, Users, TrendingUp, Lightbulb, HelpCircle, ChevronLeft, X, Loader2 } from 'lucide-react';
import { ModalShell, modalCls } from '@/_components/ui/ModalShell';
import ButtonSync from '@/_components/ButtonSync';
import { apiInterceptor, endpoints } from '@/lib/axios';
import countries from 'i18n-iso-countries';
import enLocale from 'i18n-iso-countries/langs/en.json';

countries.registerLocale(enLocale);

const COUNTRIES = Object.entries(countries.getNames('en', { select: 'official' }))
  .map(([code, name]) => ({ code, name }))
  .sort((a, b) => a.name.localeCompare(b.name));

const USER_TYPES = [
  { value: 'freelancer',  label: 'Freelancer',       icon: Briefcase,  desc: 'Working independently on client projects' },
  { value: 'agency',      label: 'Marketing Agency', icon: Users,       desc: 'Running campaigns for multiple clients' },
  { value: 'sales_team',  label: 'Sales Team',        icon: TrendingUp, desc: 'Inside or field sales organization' },
  { value: 'founder',     label: 'Startup Founder',  icon: Lightbulb,  desc: 'Building a product or early-stage company' },
  { value: 'other',       label: 'Other',             icon: HelpCircle, desc: 'Something else entirely' },
] as const;

const HEARD_FROM_OPTIONS = [
  'Google Search', 'Twitter / X', 'LinkedIn', 'YouTube', 'Reddit',
  'Friend or colleague', 'Product Hunt', 'Newsletter', 'Other',
];

type FormValues = {
  workspaceName: string;
  country: string;
  heardFrom: string;
};

interface OnboardingModalProps {
  onClose?: () => void;
}

export function OnboardingModal({ onClose }: OnboardingModalProps = {}) {
  const { data: session, update } = useSession();
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState('');
  const [personalCountry, setPersonalCountry] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const defaultName = session?.user?.name?.split(' ')[0] ?? 'My';
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    defaultValues: { workspaceName: `${defaultName}'s Workspace`, country: '', heardFrom: '' },
  });

  useEffect(() => {
    const load = async () => {
      try {
        const api = apiInterceptor();
        const data = await api.getApiData(endpoints.intern.axiosNextInstance.onboarding);
        if (data.userType) {
          setUserType(data.userType);
          setStep(2);
        }
        if (data.userCountry) setPersonalCountry(data.userCountry);
        reset({
          workspaceName: data.workspaceName || `${defaultName}'s Workspace`,
          country: data.country || '',
          heardFrom: data.heardFrom || '',
        });
      } catch {
        // keep defaults if fetch fails
      } finally {
        setIsFetching(false);
      }
    };
    load();
  }, []);

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    try {
      const api = apiInterceptor();
      const res = await api.postApiData(endpoints.intern.axiosNextInstance.onboarding, {
        userType,
        userCountry: personalCountry || undefined,
        workspaceName: values.workspaceName,
        country: values.country,
        heardFrom: values.heardFrom || undefined,
      });
      await update({
        onboardingCompleted: true,
        country: (res as any).userCountry ?? personalCountry ?? undefined,
        workspaceId: (res as any).workspaceId ?? undefined,
      });
      toast.success('Saved!');
      onClose?.();
    } catch (err: any) {
      toast.error(err?.error ?? 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ModalShell isOpen onClose={() => {}} className="max-w-xl">
      {/* Header */}
      <div className={modalCls.header}>
        <div className="flex items-center justify-between mb-3">
          <h2 className={`text-lg font-semibold ${modalCls.title}`}>
            {step === 1 ? 'Tell us about yourself' : 'Set up your workspace'}
          </h2>
          <div className="flex items-center gap-3">
            <span className={`text-xs ${modalCls.subtext}`}>Step {step} of 2</span>
            {onClose && (
              <button type="button" onClick={onClose} className={modalCls.closeBtn}>
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
        <div className="flex gap-1.5">
          {[1, 2].map((s) => (
            <div key={s} className={`h-1 flex-1 rounded-full transition-colors ${s <= step ? 'bg-[#1A6FFF]' : 'bg-gray-200 dark:bg-white/10'}`} />
          ))}
        </div>
      </div>

      {isFetching ? (
        <div className={`${modalCls.body} flex items-center justify-center py-16`}>
          <Loader2 className="h-6 w-6 animate-spin text-[#1A6FFF]" />
        </div>
      ) : (
        <>
          {/* Step 1 — Role + Personal Country */}
          {step === 1 && (
            <div className={`${modalCls.body} space-y-3`}>
              <p className={`text-sm ${modalCls.subtext} mb-4`}>
                What best describes you? This helps us personalise your experience.
              </p>
              {USER_TYPES.map(({ value, label, icon: Icon, desc }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setUserType(value)}
                  className={`w-full flex items-center gap-4 rounded-xl border p-4 text-left transition-colors ${
                    userType === value
                      ? 'border-[#1A6FFF] bg-[#1A6FFF]/5 dark:bg-[#1A6FFF]/10'
                      : 'border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10'
                  }`}
                >
                  <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${
                    userType === value ? 'bg-[#1A6FFF]/15' : 'bg-gray-100 dark:bg-white/10'
                  }`}>
                    <Icon className={`h-5 w-5 ${userType === value ? 'text-[#1A6FFF]' : 'text-gray-500 dark:text-gray-400'}`} />
                  </div>
                  <div>
                    <div className={`text-sm font-medium ${modalCls.title}`}>{label}</div>
                    <div className={`text-xs ${modalCls.subtext}`}>{desc}</div>
                  </div>
                </button>
              ))}

              {/* <div className="pt-2">
                <label className={`block text-sm ${modalCls.label} mb-1`}>
                  Your Country <span className={`text-xs font-normal ${modalCls.subtext}`}>(Optional)</span>
                </label>
                <p className={`text-xs ${modalCls.subtext} mb-2`}>
                  Where you&apos;re personally based — used for timezone display and locale formatting.
                </p>
                <select
                  value={personalCountry}
                  onChange={(e) => setPersonalCountry(e.target.value)}
                  className={modalCls.select}
                >
                  <option value="">Select a country…</option>
                  {COUNTRIES.map(({ code, name }) => (
                    <option key={code} value={code}>{name}</option>
                  ))}
                </select>
              </div> */}
            </div>
          )}

          {/* Step 2 — Workspace */}
          {step === 2 && (
            <form id="onboarding-form" onSubmit={handleSubmit(onSubmit)}>
              <div className={`${modalCls.body} space-y-5`}>
                <div>
                  <label className={`block text-sm ${modalCls.label} mb-2`}>
                    Workspace / Business Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className={modalCls.input}
                    {...register('workspaceName', { required: 'Workspace name is required.' })}
                  />
                  {errors.workspaceName && <p className="mt-1 text-xs text-red-500">{errors.workspaceName.message}</p>}
                </div>

                <div>
                  <label className={`block text-sm ${modalCls.label} mb-1`}>
                    Workspace / Business Country <span className="text-red-500">*</span>
                  </label>
                  <p className={`text-xs ${modalCls.subtext} mb-2`}>
                    Where your business operates — used as the default location when searching for leads.
                  </p>
                  <select className={modalCls.select} {...register('country', { required: 'Please select your business country.' })}>
                    <option value="">Select a country…</option>
                    {COUNTRIES.map(({ code, name }) => (
                      <option key={code} value={code}>{name}</option>
                    ))}
                  </select>
                  {errors.country && <p className="mt-1 text-xs text-red-500">{errors.country.message}</p>}
                </div>

                <div>
                  <label className={`block text-sm ${modalCls.label} mb-2`}>
                    How did you hear about us? <span className={`${modalCls.subtext} text-xs`}>(Optional)</span>
                  </label>
                  <select className={modalCls.select} {...register('heardFrom')}>
                    <option value="">Select…</option>
                    {HEARD_FROM_OPTIONS.map((o) => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                </div>
              </div>
            </form>
          )}
        </>
      )}

      {/* Footer */}
      <div className={`${modalCls.footer} flex items-center justify-between`}>
        {step === 2 ? (
          <button type="button" onClick={() => setStep(1)} className={`${modalCls.backBtn} flex items-center gap-2`}>
            <ChevronLeft className="h-4 w-4" />
            Back
          </button>
        ) : (
          <div />
        )}

        {step === 1 ? (
          <button
            type="button"
            disabled={!userType || isFetching}
            onClick={() => setStep(2)}
            className="rounded-lg bg-[#1A6FFF] px-6 py-2.5 text-sm text-white hover:bg-[#1557CC] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Continue
          </button>
        ) : (
          <ButtonSync
            form="onboarding-form"
            type="submit"
            isLoading={isLoading}
            displayedIcon={null}
            text="Save"
            loadingText="Saving…"
          />
        )}
      </div>
    </ModalShell>
  );
}
