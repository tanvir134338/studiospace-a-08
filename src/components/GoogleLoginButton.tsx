"use client";

import { authClient } from "@/lib/auth-client";

export default function GoogleLoginButton() {
  const handleGoogleLogin = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/",
    });
  };

  return <button onClick={handleGoogleLogin}>Continue with Google</button>;
}
