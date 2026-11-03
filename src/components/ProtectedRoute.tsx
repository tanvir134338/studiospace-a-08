"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { authClient } from "@/lib/auth-client";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  const [jwtReady, setJwtReady] = useState(false);
  const [jwtError, setJwtError] = useState("");

  useEffect(() => {
    if (isPending) return;

    if (!session) {
      router.replace("/login");
      return;
    }

    let active = true;

    const generateJWT = async () => {
      try {
        const response = await fetch(
          `${API_URL.replace(/\/+$/, "")}/api/session/jwt`,
          {
            method: "POST",
            credentials: "include",
          },
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message || "Failed to generate authentication token.",
          );
        }

        if (active) {
          setJwtReady(true);
          setJwtError("");
        }
      } catch (error) {
        if (active) {
          setJwtError(
            error instanceof Error
              ? error.message
              : "Authentication failed. Please login again.",
          );
        }
      }
    };

    generateJWT();

    return () => {
      active = false;
    };
  }, [session, isPending, router]);

  if (isPending || (session && !jwtReady && !jwtError)) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={40} className="animate-spin text-primary" />

          <p className="text-sm font-medium text-muted">
            Verifying your session...
          </p>
        </div>
      </div>
    );
  }

  if (jwtError) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4">
        <div className="max-w-md text-center">
          <p className="text-sm text-red-500">{jwtError}</p>

          <button
            onClick={() => router.replace("/login")}
            className="mt-4 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  if (!session) return null;

  return <>{children}</>;
}
