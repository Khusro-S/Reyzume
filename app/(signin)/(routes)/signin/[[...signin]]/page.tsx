"use client";

import { AuthBackground } from "@/components/auth/AuthBackground";
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <AuthBackground>
      <SignIn fallbackRedirectUrl="/reyzumes" />
    </AuthBackground>
  );
}
