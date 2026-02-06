"use client";

import { AuthBackground } from "@/components/auth/AuthBackground";
import { SignIn, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SignInPage() {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.replace("/reyzumes");
      // the `/signin` gets replaced with `/rezyumes` in the browser's history
    }
  }, [isLoaded, isSignedIn, router]);

  // Don't render the SignIn component if already signed in
  if (!isLoaded) {
    return (
      <AuthBackground>
        <div className="h-100 w-100 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
      </AuthBackground>
    );
  }

  if (isSignedIn) {
    // Return nothing while the redirect happens
    return null;
  }
  return (
    <AuthBackground>
      <SignIn fallbackRedirectUrl="/reyzumes" />
    </AuthBackground>
  );
}
