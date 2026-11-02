"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import {
  Aperture,
  LockKeyhole,
  Eye,
  EyeOff,
  CheckCircle2,
  ArrowLeft,
  XCircle,
} from "lucide-react";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Password requirements
  const hasMinLength = password.length >= 6;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);

  // Confirm password validation
  const passwordsMatch =
    confirmPassword.length > 0 && password === confirmPassword;

  // Check all requirements
  const isPasswordValid = hasMinLength && hasUppercase && hasLowercase;

  const isFormValid = isPasswordValid && passwordsMatch;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!isPasswordValid) {
      setError("Please fulfill all password requirements.");
      return;
    }

    if (!passwordsMatch) {
      setError("Passwords do not match.");
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
            Reset Password
          </h1>

          <p className="mt-3 text-sm leading-6 text-muted">
            Create a new password for your StudioSpace account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* New Password */}
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-semibold"
            >
              New Password
            </label>

            <div className="relative">
              <LockKeyhole
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
              />

              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                  setMessage("");
                }}
                required
                minLength={6}
                autoComplete="new-password"
                className="w-full rounded-xl border border-border bg-secondary/40 py-3.5 pl-12 pr-12 text-sm outline-none transition-all placeholder:text-muted focus:border-accent focus:ring-2 focus:ring-accent/15"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted transition-colors hover:text-foreground"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>

            {/* Password Requirements */}
            <div className="mt-3 space-y-2">
              <p className="text-xs font-semibold text-muted">
                Password Requirements
              </p>

              <div className="space-y-2 text-xs">
                <div
                  className={`flex items-center gap-2 ${
                    hasMinLength ? "text-green-600" : "text-muted"
                  }`}
                >
                  {hasMinLength ? (
                    <CheckCircle2 size={15} />
                  ) : (
                    <XCircle size={15} />
                  )}
                  At least 6 characters
                </div>

                <div
                  className={`flex items-center gap-2 ${
                    hasUppercase ? "text-green-600" : "text-muted"
                  }`}
                >
                  {hasUppercase ? (
                    <CheckCircle2 size={15} />
                  ) : (
                    <XCircle size={15} />
                  )}
                  One uppercase letter (A-Z)
                </div>

                <div
                  className={`flex items-center gap-2 ${
                    hasLowercase ? "text-green-600" : "text-muted"
                  }`}
                >
                  {hasLowercase ? (
                    <CheckCircle2 size={15} />
                  ) : (
                    <XCircle size={15} />
                  )}
                  One lowercase letter (a-z)
                </div>
              </div>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-2 block text-sm font-semibold"
            >
              Confirm New Password
            </label>

            <div className="relative">
              <LockKeyhole
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
              />

              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setError("");
                  setMessage("");
                }}
                required
                minLength={6}
                autoComplete="new-password"
                className="w-full rounded-xl border border-border bg-secondary/40 py-3.5 pl-12 pr-12 text-sm outline-none transition-all placeholder:text-muted focus:border-accent focus:ring-2 focus:ring-accent/15"
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted transition-colors hover:text-foreground"
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
              >
                {showConfirmPassword ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>

            {/* Password Match Indicator */}
            {confirmPassword.length > 0 && (
              <p
                className={`mt-2 flex items-center gap-2 text-xs ${
                  passwordsMatch ? "text-green-600" : "text-red-500"
                }`}
              >
                {passwordsMatch ? (
                  <CheckCircle2 size={15} />
                ) : (
                  <XCircle size={15} />
                )}

                {passwordsMatch ? "Passwords match" : "Passwords do not match"}
              </p>
            )}
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
            disabled={!isFormValid}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-sm font-bold text-primary-foreground shadow-lg transition-all hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
          >
            Reset Password
            <LockKeyhole size={19} />
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
