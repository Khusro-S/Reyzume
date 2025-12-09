"use client";

import { Footer } from "@/app/(landingPage)/_components/Footer";
import { Navbar } from "@/app/(landingPage)/_components/Navbar";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function PrivacyPage() {
  return (
    <div className="relative min-h-screen w-full px-3 sm:px-8 lg:px-12 py-5 flex flex-col justify-center items-center gap-y-10">
      <Navbar />
      <div className="min-h-screen max-w-5xl">
        <div className="rounded-3xl border border-[#3B82F6]/10 bg-white/90 backdrop-blur-md p-8 sm:p-12 shadow-lg">
          {/* Back to Home Button */}
          <div className="mb-8">
            <Button variant="ghost" asChild>
              <Link href="/" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </div>
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold text-[#111827] mb-4">
                Privacy Policy
              </h1>
              <p className="text-sm text-[#6B7280]">
                Last updated: December 7, 2025
              </p>
            </div>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-[#111827]">
                Introduction
              </h2>
              <p className="text-[#4B5563] leading-relaxed">
                Reyzume (&quot;we,&ldquo; &quot;our,&ldquo; or &quot;us&ldquo;)
                is committed to protecting your privacy. This Privacy Policy
                explains how we collect, use, and safeguard your information
                when you use our resume builder service.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-[#111827]">
                Information We Collect
              </h2>
              <div className="space-y-3">
                <h3 className="text-xl font-medium text-[#111827]">
                  Account Information
                </h3>
                <p className="text-[#4B5563] leading-relaxed">
                  When you create an account via Clerk authentication, we
                  collect:
                </p>
                <ul className="list-disc list-inside text-[#4B5563] space-y-2 pl-4">
                  <li>Email address</li>
                  <li>Name (if provided)</li>
                  <li>Authentication provider data (Google, GitHub, etc.)</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="text-xl font-medium text-[#111827]">
                  Resume Content
                </h3>
                <p className="text-[#4B5563] leading-relaxed">
                  We store the resume data you create, including:
                </p>
                <ul className="list-disc list-inside text-[#4B5563] space-y-2 pl-4">
                  <li>
                    Text content (work experience, education, skills, etc.)
                  </li>
                  <li>Formatting preferences (fonts, spacing, layout)</li>
                  <li>Resume metadata (title, creation date, last modified)</li>
                </ul>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-[#111827]">
                How We Use Your Information
              </h2>
              <ul className="list-disc list-inside text-[#4B5563] space-y-2 pl-4">
                <li>To provide and maintain our resume builder service</li>
                <li>To authenticate and secure your account</li>
                <li>To save and sync your resume data across devices</li>
                <li>To improve our service and user experience</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-[#111827]">
                Data Storage and Security
              </h2>
              <p className="text-[#4B5563] leading-relaxed">
                Your data is stored securely using:
              </p>
              <ul className="list-disc list-inside text-[#4B5563] space-y-2 pl-4">
                <li>
                  <strong>Convex</strong>: Our backend database provider with
                  enterprise-grade security
                </li>
                <li>
                  <strong>Clerk</strong>: Authentication service with
                  industry-standard encryption
                </li>
                <li>
                  Row-level security ensuring you can only access your own
                  resumes
                </li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-[#111827]">
                Your Rights
              </h2>
              <p className="text-[#4B5563] leading-relaxed">
                You have the right to:
              </p>
              <ul className="list-disc list-inside text-[#4B5563] space-y-2 pl-4">
                <li>Access your personal data</li>
                <li>Edit or delete your resumes at any time</li>
                <li>Delete your account and all associated data</li>
                <li>Export your resume data</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-[#111827]">
                Third-Party Services
              </h2>
              <p className="text-[#4B5563] leading-relaxed">
                We use the following third-party services:
              </p>
              <ul className="list-disc list-inside text-[#4B5563] space-y-2 pl-4">
                <li>
                  <strong>Clerk</strong>: Authentication and user management
                </li>
                <li>
                  <strong>Convex</strong>: Database and real-time sync
                </li>
                <li>
                  <strong>Netlify</strong>: Hosting and deployment
                </li>
              </ul>
              <p className="text-[#4B5563] leading-relaxed mt-2">
                These services have their own privacy policies governing the use
                of your information.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-[#111827]">
                Cookies and Tracking
              </h2>
              <p className="text-[#4B5563] leading-relaxed">
                We use essential cookies to:
              </p>
              <ul className="list-disc list-inside text-[#4B5563] space-y-2 pl-4">
                <li>Maintain your login session</li>
                <li>Remember your preferences</li>
                <li>Ensure service functionality</li>
              </ul>
              <p className="text-[#4B5563] leading-relaxed mt-2">
                We do not use tracking cookies or sell your data to third
                parties.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-[#111827]">
                Children&apos;s Privacy
              </h2>
              <p className="text-[#4B5563] leading-relaxed">
                Our service is not intended for users under the age of 13. We do
                not knowingly collect information from children under 13.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-[#111827]">
                Changes to This Policy
              </h2>
              <p className="text-[#4B5563] leading-relaxed">
                We may update this Privacy Policy from time to time. We will
                notify you of any changes by updating the &quot;Last
                updated&ldquo; date at the top of this policy.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-[#111827]">
                Contact Us
              </h2>
              <p className="text-[#4B5563] leading-relaxed">
                If you have questions about this Privacy Policy, please contact
                us at:{" "}
                <button
                  onClick={async () => {
                    const email = "hello@reyzume.com";
                    try {
                      await navigator.clipboard.writeText(email);
                      toast.success("Email copied to clipboard");
                    } catch {
                      toast.error(
                        "Couldn't copy email — please copy manually: " + email
                      );
                    }
                  }}
                  className="transition text-primary hover:underline cursor-pointer active:scale-90"
                  aria-label="Copy email to clipboard"
                  title="Copy email"
                >
                  <span>hello@reyzume.com</span>
                </button>
              </p>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
