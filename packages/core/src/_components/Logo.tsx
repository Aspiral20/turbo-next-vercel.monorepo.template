type Props = {
  size?: 'sm' | 'md';
};

export function Logo({ size = 'md' }: Props) {
  return (
    <div className="flex items-center gap-2">
      <img src="/logo.png" alt="SyncLead" className="h-8 w-8" />
      <span className={`${size === 'sm' ? 'text-lg' : 'text-xl'} text-[#1A6FFF]`}>SyncLead</span>
    </div>
  );
}
