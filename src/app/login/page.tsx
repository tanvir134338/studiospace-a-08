"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  Aperture,
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  Loader2,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Email Login
  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setIsLoading(true);

    try {
      const result = await authClient.signIn.email({
        email,
        password,
        callbackURL: `${window.location.origin}/`,
      });

      if (result.error) {
        setError(result.error.message || "Invalid email or password.");
        setIsLoading(false);
        return;
      }

      // Generate JWT after successful login
      const apiURL = process.env.NEXT_PUBLIC_API_URL;

      if (!apiURL) {
        throw new Error("API URL is not configured.");
      }

      const jwtResponse = await fetch(`${apiURL}/api/session/jwt`, {
        method: "POST",
        credentials: "include",
      });

      const jwtData = await jwtResponse.json();

      if (!jwtResponse.ok || !jwtData.success) {
        throw new Error(jwtData.message || "Failed to generate JWT.");
      }

      // Redirect after successful JWT generation
      router.replace("/");
      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Google Login
  const handleGoogleLogin = async () => {
    setError("");
    setIsLoading(true);

    try {
      const result = await authClient.signIn.social({
        provider: "google",
        callbackURL: `${window.location.origin}/`,
        errorCallbackURL: `${window.location.origin}/register?reason=google-signup-required`,
      });

      if (result.error) {
        setError(result.error.message || "Google login failed.");
        setIsLoading(false);
      }
    } catch {
      setError("Google login failed. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-[calc(100vh-100px)] items-center justify-center px-4 py-12 sm:px-6">
      <div className="grid w-full max-w-6xl overflow-hidden rounded-3xl border border-border bg-background shadow-2xl lg:grid-cols-2">
        {/* Left Side */}
        <div className="relative hidden min-h-[650px] flex-col justify-between overflow-hidden bg-primary p-10 text-primary-foreground lg:flex xl:p-14">
          <div className="absolute inset-0 bg-gradient-to-br from-black/10 via-transparent to-black/50" />

          <div className="relative z-10 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15">
              <Aperture size={29} />
            </div>

            <span className="text-2xl font-extrabold tracking-tight">
              StudioSpace
            </span>
          </div>

          <div className="relative z-10 max-w-md">
            <span className="mb-5 inline-block rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em]">
              Welcome Back
            </span>

            <h1 className="text-5xl font-extrabold leading-tight xl:text-6xl">
              Your Next
              <br />
              Creative
              <br />
              Journey
              <br />
              Starts Here.
            </h1>

            <p className="mt-6 max-w-sm text-base leading-8 text-white/75">
              Sign in to discover inspiring studios, manage your bookings, and
              bring your creative ideas to life.
            </p>
          </div>

          <div className="relative z-10 flex items-center justify-between text-sm text-white/70">
            <span>© 2026 StudioSpace</span>
            <span>Spaces for every vision.</span>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center justify-center p-6 sm:p-10 lg:p-12 xl:p-16">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="mb-10 flex items-center gap-2 lg:hidden">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Aperture size={25} />
              </div>

              <span className="text-xl font-extrabold">StudioSpace</span>
            </div>

            {/* Heading */}
            <div className="mb-8">
              <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-accent">
                Welcome Back
              </p>

              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                Sign in to your account
              </h2>

              <p className="mt-3 text-sm leading-6 text-muted">
                Enter your credentials to access your StudioSpace account.
              </p>
            </div>

            {/* Google Login */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-border px-5 py-3.5 text-sm font-semibold transition-all hover:border-accent hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-60"
            >
              <svg viewBox="0 0 48 48" className="h-5 w-5" aria-hidden="true">
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z"
                />
                <path
                  fill="#4285F4"
                  d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.72 7.18l7.62 5.91c4.45-4.1 7.14-10.13 7.14-17.56Z"
                />
                <path
                  fill="#FBBC05"
                  d="M10.53 28.59a14.5 14.5 0 0 1 0-9.18l-7.98-6.19a24 24 0 0 0 0 21.56l7.98-6.19Z"
                />
                <path
                  fill="#34A853"
                  d="M24 48c6.48 0 11.93-2.13 15.9-5.89l-7.62-5.91c-2.12 1.42-4.84 2.26-8.28 2.26-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48Z"
                />
              </svg>

              {isLoading ? "Please wait..." : "Continue with Google"}
            </button>

            {/* Divider */}
            <div className="my-7 flex items-center gap-4">
              <div className="h-px flex-1 bg-border" />

              <span className="text-xs font-medium uppercase tracking-wider text-muted">
                Or continue with email
              </span>

              <div className="h-px flex-1 bg-border" />
            </div>

            {/* Email Login Form */}
            <form onSubmit={handleLogin} className="space-y-5">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold"
                >
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
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    disabled={isLoading}
                    className="w-full rounded-xl border border-border bg-secondary/40 py-3.5 pl-12 pr-4 text-sm outline-none transition-all placeholder:text-muted focus:border-accent focus:ring-2 focus:ring-accent/15"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-semibold">
                    Password
                  </label>

                  <Link
                    href="/forgot-password"
                    className="text-xs font-semibold text-accent transition-colors hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>

                <div className="relative">
                  <Lock
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
                  />

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    disabled={isLoading}
                    className="w-full rounded-xl border border-border bg-secondary/40 py-3.5 pl-12 pr-12 text-sm outline-none transition-all placeholder:text-muted focus:border-accent focus:ring-2 focus:ring-accent/15"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted transition-colors hover:text-foreground"
                  >
                    {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                  </button>
                </div>
              </div>

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
                disabled={isLoading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/15 transition-all duration-300 hover:bg-accent hover:shadow-accent/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={19} className="animate-spin" />
                    Please wait...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight size={19} />
                  </>
                )}
              </button>
            </form>

            {/* Register Link */}
            <p className="mt-8 text-center text-sm text-muted">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-bold text-accent transition-colors hover:underline"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
