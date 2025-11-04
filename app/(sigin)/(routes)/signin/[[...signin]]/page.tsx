"use client";

import { SignIn } from "@clerk/nextjs";
import { motion } from "motion/react";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12">
      <div className="relative w-full max-w-md flex items-center justify-center">
        {/* Header */}
        {/* <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Sign in to continue building your resume
          </p>
        </div> */}

        {/* Clerk Sign In Component */}
        {/* <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700"> */}
        {/* Animated background orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl z-0"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, 30, 0],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl z-0"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
            x: [0, -30, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
        <motion.div
          className="absolute top-1/2 right-1/3 w-72 h-72 bg-pink-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.4, 0.6, 0.4],
            x: [0, 20, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
        <div className="z-10">
          <SignIn />
        </div>
        {/* <SignIn
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "bg-transparent shadow-none",
              headerTitle: "hidden",
              headerSubtitle: "hidden",
              socialButtonsBlockButton:
                "bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium transition-all duration-200",
              socialButtonsBlockButtonText: "font-medium",
              formButtonPrimary:
                "bg-primary hover:bg-blue-600 text-white font-medium py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg",
              formFieldInput:
                "rounded-lg border-2 border-gray-300 dark:border-gray-600 focus:border-primary dark:focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100",
              formFieldLabel: "text-gray-700 dark:text-gray-300 font-medium",
              footerActionLink: "text-primary hover:text-blue-600 font-medium",
              identityPreviewText: "text-gray-700 dark:text-gray-300",
              formFieldInputShowPasswordButton:
                "text-gray-500 dark:text-gray-400",
              otpCodeFieldInput:
                "border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-primary dark:focus:border-primary",
              dividerLine: "bg-gray-300 dark:bg-gray-600",
              dividerText: "text-gray-500 dark:text-gray-400",
              footerActionText: "text-gray-600 dark:text-gray-400",
            },
          }}
        />
      </div> */}

        {/* Footer */}
        {/* <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
          Don&apos;t have an account?{" "}
          <a
            href="/sign-up"
            className="text-primary hover:text-blue-600 font-medium transition-colors"
          >
            Sign up for free
          </a>
        </p> */}
      </div>
    </div>
  );
}
