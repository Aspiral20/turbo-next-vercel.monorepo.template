import { BrandBackgroundLayers } from '@/_components/ui/BrandBackgroundLayers';

type Props = {
  title: string;
  subtitle: string | React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

export function AuthCard({ title, subtitle, children, footer }: Props) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0D1117] relative overflow-hidden">
      <BrandBackgroundLayers />

      <div className="w-full max-w-md px-6 relative z-10">
        <div className="bg-white border border-gray-200 shadow-xl dark:bg-white/5 dark:backdrop-blur-sm dark:shadow-2xl dark:border-white/10 rounded-2xl p-8">
          <div className="flex justify-center my-4">
            <img src="/logo.svg" alt="logo" className="h-10" />
          </div>

          <h1 className="text-center font-bold text-[20px] mb-2 text-gray-900 dark:text-white/85">{title}</h1>
          <p className="text-center text-gray-600 dark:text-white/60 mb-8">{subtitle}</p>

          {children}

          {footer && <p className="text-center mt-6 text-gray-500 dark:text-white/50">{footer}</p>}
        </div>
      </div>
    </div>
  );
}
