"use client";

import Link from "next/link";
import { Home, Search, ArrowLeft, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-16 bg-background text-foreground">
      <div className="w-full max-w-xl text-center">
        {/* Illustration */}
        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-56 h-56 sm:w-72 sm:h-72 rounded-full bg-accent/10 blur-3xl" />
          </div>

          <div className="relative">
            <div className="flex items-center justify-center gap-2 mb-3 text-accent">
              <Compass size={22} />
              <span className="text-sm font-semibold tracking-[0.25em] uppercase">
                Lost Your Way?
              </span>
            </div>

            <h1 className="text-[120px] sm:text-[160px] font-extrabold leading-none tracking-tighter bg-gradient-to-r from-[#542437] via-[#b76e79] to-[#d08a96] dark:from-[#d08a96] dark:via-[#b76e79] dark:to-[#f0b7c0] bg-clip-text text-transparent">
              404
            </h1>

            <div className="w-20 h-1 rounded-full mx-auto mt-5 bg-gradient-to-r from-[#542437] to-[#d08a96]" />
          </div>
        </div>

        {/* Message */}
        <div className="space-y-3 mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold">Page Not Found</h2>

          <p className="text-muted text-sm sm:text-base leading-relaxed max-w-md mx-auto">
            Sorry! We couldn&apos;t find the page you&apos;re looking for. It
            might have been moved, deleted, or the URL may be incorrect.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-all duration-200"
          >
            <Home size={18} />
            Back to Home
          </Link>

          <Link
            href="/studios"
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 rounded-xl border border-border bg-card text-card-foreground font-semibold hover:bg-secondary transition-all duration-200"
          >
            <Search size={18} />
            Explore Studios
          </Link>
        </div>

        {/* Go Back */}
        <button
          type="button"
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-2 mt-8 text-sm text-muted hover:text-accent transition-colors"
        >
          <ArrowLeft size={16} />
          Go Back
        </button>

        {/* Footer */}
        <p className="mt-12 text-xs text-muted">
          © 2026 StudioSpace. All rights reserved.
        </p>
      </div>
    </main>
  );
}
