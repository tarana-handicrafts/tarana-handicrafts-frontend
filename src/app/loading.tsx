export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F9F8F6]">
      <div className="flex flex-col items-center gap-4">
        {/* Animated spinner */}
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#C5A059] border-t-transparent" />
        <p className="animate-pulse font-serif text-stone-500">
          Loading...
        </p>
      </div>
    </div>
  );
}
