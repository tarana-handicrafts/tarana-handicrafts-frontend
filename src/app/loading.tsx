export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        {/* Animated spinner */}
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[var(--color-primary)] border-t-transparent" />
        <p className="text-[var(--color-muted)] animate-pulse">
          Loading...
        </p>
      </div>
    </div>
  );
}
