"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Aperture, Mail, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    setMessage("Password reset is currently unavailable.");
  };

  return (
    <main className="flex min-h-[calc(100vh-100px)] items-center justify-center px-4 py-12 sm:px-6">
      <div className="w-full max-w-md rounded-3xl border border-border bg-background p-6 shadow-2xl sm:p-10">
        {/* Brand */}
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Aperture size={27} />
          </div>

          <span className="text-2xl font-extrabold">StudioSpace</span>
        </div>

        {/* Heading */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight">
            Forgot Password?
          </h1>

          <p className="mt-3 text-sm leading-6 text-muted">
            No worries! Enter your registered email address to continue.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-semibold">
              Email Address
            </label>

            <div className="relative">
              <Mail
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
              />

              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setMessage("");
                  setError("");
                }}
                required
                autoComplete="email"
                className="w-full rounded-xl border border-border bg-secondary/40 py-3.5 pl-12 pr-4 text-sm outline-none transition-all placeholder:text-muted focus:border-accent focus:ring-2 focus:ring-accent/15"
              />
            </div>
          </div>

          {/* Success Message */}
          {message && (
            <div
              role="status"
              className="flex items-center gap-2 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-600"
            >
              <CheckCircle2 size={18} className="shrink-0" />
              {message}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div
              role="alert"
              className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600"
            >
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-sm font-bold text-primary-foreground shadow-lg transition-all hover:bg-accent"
          >
            Send Reset Link
            <Mail size={19} />
          </button>
        </form>

        {/* Back to Login */}
        <Link
          href="/login"
          className="mt-8 flex items-center justify-center gap-2 text-sm font-semibold text-accent transition-colors hover:underline"
        >
          <ArrowLeft size={17} />
          Back to Login
        </Link>
      </div>
    </main>
  );
}
