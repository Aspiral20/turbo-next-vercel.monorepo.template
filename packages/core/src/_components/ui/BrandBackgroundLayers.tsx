export function BrandBackgroundLayers() {
  return (
    <>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:64px_64px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(26,111,255,0.08),transparent_50%)] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(26,111,255,0.15),transparent_50%)]" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#00D97E]/5 dark:bg-[#00D97E]/8 rounded-full blur-3xl" />
    </>
  );
}
