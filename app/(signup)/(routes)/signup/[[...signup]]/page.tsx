"use client";

import { AuthBackground } from "@/components/auth/AuthBackground";
import { SignUp, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SignupPage() {
    const { isLoaded, isSignedIn } = useUser();
    const router = useRouter();

    useEffect(() => {
      if (isLoaded && isSignedIn) {
        router.replace("/reyzumes");
        // the `/signin` gets replaced with `/rezyumes` in the browser's history
      }
    }, [isLoaded, isSignedIn, router]);

    // Don't render the SignUp component if already signed in
    if (!isLoaded) {
      return (
        <AuthBackground>
          <div className="h-100 w-100 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
        </AuthBackground>
      );
    }

    if (isSignedIn) {
      return null;
    }
  return (
    <AuthBackground>
      <SignUp fallbackRedirectUrl="/reyzumes" />
    </AuthBackground>
  );
}
