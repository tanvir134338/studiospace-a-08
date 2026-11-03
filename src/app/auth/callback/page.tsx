"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function completeLogin() {
      try {
        const params = new URLSearchParams(window.location.search);
        const requestedPath = params.get("callbackURL") || "/";

        // Prevent external redirects
        let callbackURL = "/";

        try {
          const destination = new URL(requestedPath, window.location.origin);

          if (destination.origin === window.location.origin) {
            callbackURL = `${destination.pathname}${destination.search}${destination.hash}`;
          }
        } catch {
          callbackURL = "/";
        }

        const apiURL = process.env.NEXT_PUBLIC_API_URL;

        if (!apiURL) {
          throw new Error("API URL is not configured.");
        }

        const response = await fetch(`${apiURL}/api/session/jwt`, {
          method: "POST",
          credentials: "include",
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Failed to create authentication token.",
          );
        }

        if (isMounted) {
          router.replace(callbackURL);
          router.refresh();
        }
      } catch (error) {
        if (isMounted) {
          setError(
            error instanceof Error
              ? error.message
              : "Google login failed. Please try again.",
          );
        }
      }
    }

    completeLogin();

    return () => {
      isMounted = false;
    };
  }, [router]);

  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-background p-8 text-center shadow-lg">
        {error ? (
          <>
            <h1 className="text-xl font-bold text-red-500">
              Authentication Failed
            </h1>

            <p className="mt-3 text-sm text-muted">{error}</p>

            <button
              onClick={() => router.replace("/login")}
              className="mt-6 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
            >
              Back to Login
            </button>
          </>
        ) : (
          <>
            <Loader2 className="mx-auto h-10 w-10 animate-spin text-primary" />

            <h1 className="mt-5 text-xl font-bold">Completing your login...</h1>

            <p className="mt-2 text-sm text-muted">
              Please wait while we secure your session.
            </p>
          </>
        )}
      </div>
    </main>
  );
}
