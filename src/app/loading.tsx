import { LoaderCircle } from "lucide-react";

export default function Loading() {
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground px-4"
      role="status"
      aria-label="Loading"
    >
      {/* Animated Loader */}
      <div className="relative flex items-center justify-center">
        <div className="w-16 h-16 rounded-full border-4 border-secondary border-t-accent animate-spin" />

        <div className="absolute w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
          <LoaderCircle size={20} className="text-accent animate-pulse" />
        </div>
      </div>

      {/* Brand */}
      <h2 className="mt-6 text-2xl font-bold tracking-tight">
        Studio<span className="text-accent">Space</span>
      </h2>

      <p className="mt-2 text-sm text-muted">
        Preparing your creative space...
      </p>

      {/* Loading Dots */}
      <div className="flex items-center gap-1.5 mt-5">
        <span className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:0ms]" />
        <span className="w-2 h-2 rounded-full bg-accent animate-bounce [animation-delay:150ms]" />
        <span className="w-2 h-2 rounded-full bg-[#d08a96] animate-bounce [animation-delay:300ms]" />
      </div>
    </main>
  );
}
