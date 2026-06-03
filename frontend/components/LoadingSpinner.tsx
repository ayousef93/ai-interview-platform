export function LoadingSpinner({ label = "Loading" }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20">
      <div className="relative h-10 w-10">
        <div className="absolute inset-0 rounded-full border-4 border-white/[0.08]" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-violet-500 animate-spin" />
      </div>
      <p className="text-sm font-semibold text-zinc-600">{label}</p>
    </div>
  );
}
