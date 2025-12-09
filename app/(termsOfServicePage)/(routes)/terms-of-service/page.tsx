"use client";

import { Footer } from "@/app/(landingPage)/_components/Footer";
import { Navbar } from "@/app/(landingPage)/_components/Navbar";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function TermsPage() {
  return (
    <div className="relative min-h-screen w-full px-3 sm:px-8 lg:px-12 py-5 flex flex-col justify-center items-center gap-y-10">
      <Navbar />
      <div className=" min-h-screen max-w-5xl">
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
                Terms of Service
              </h1>
              <p className="text-sm text-[#6B7280]">
                Last updated: December 7, 2025
              </p>
            </div>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-[#111827]">
                Acceptance of Terms
              </h2>
              <p className="text-[#4B5563] leading-relaxed">
                By accessing and using Reyzume (&quot;the Service&ldquo;), you
                accept and agree to be bound by these Terms of Service. If you
                do not agree to these terms, please do not use the Service.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-[#111827]">
                Description of Service
              </h2>
              <p className="text-[#4B5563] leading-relaxed">
                Reyzume is a web-based resume builder that allows users to
                create, edit, and export professional resumes. The Service is
                provided free of charge as an open-source project.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-[#111827]">
                User Accounts
              </h2>
              <p className="text-[#4B5563] leading-relaxed">
                To use certain features of the Service, you must create an
                account. You are responsible for:
              </p>
              <ul className="list-disc list-inside text-[#4B5563] space-y-2 pl-4">
                <li>
                  Maintaining the confidentiality of your account credentials
                </li>
                <li>All activities that occur under your account</li>
                <li>Notifying us immediately of any unauthorized use</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-[#111827]">
                User Content
              </h2>
              <div className="space-y-3">
                <h3 className="text-xl font-medium text-[#111827]">
                  Ownership
                </h3>
                <p className="text-[#4B5563] leading-relaxed">
                  You retain all rights to the content you create using Reyzume,
                  including your resume text, formatting choices, and exported
                  PDFs. We do not claim ownership of your content.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-xl font-medium text-[#111827]">
                  Responsibility
                </h3>
                <p className="text-[#4B5563] leading-relaxed">
                  You are solely responsible for the accuracy and legality of
                  the content you create. You agree not to:
                </p>
                <ul className="list-disc list-inside text-[#4B5563] space-y-2 pl-4">
                  <li>Include false or misleading information</li>
                  <li>Violate any third-party rights</li>
                  <li>Upload malicious code or content</li>
                  <li>Use the Service for illegal purposes</li>
                </ul>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-[#111827]">
                Service Availability
              </h2>
              <p className="text-[#4B5563] leading-relaxed">
                We strive to provide reliable service, but we do not guarantee:
              </p>
              <ul className="list-disc list-inside text-[#4B5563] space-y-2 pl-4">
                <li>Uninterrupted or error-free operation</li>
                <li>That the Service will meet your specific requirements</li>
                <li>
                  The accuracy or reliability of any information obtained
                  through the Service
                </li>
              </ul>
              <p className="text-[#4B5563] leading-relaxed mt-2">
                We reserve the right to modify, suspend, or discontinue the
                Service at any time without notice.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-[#111827]">
                Limitation of Liability
              </h2>
              <p className="text-[#4B5563] leading-relaxed">
                The Service is provided &quot;as is&ldquo; without warranties of
                any kind. To the maximum extent permitted by law, we shall not
                be liable for:
              </p>
              <ul className="list-disc list-inside text-[#4B5563] space-y-2 pl-4">
                <li>Any indirect, incidental, or consequential damages</li>
                <li>Loss of data or profits</li>
                <li>
                  Damages resulting from your use or inability to use the
                  Service
                </li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-[#111827]">
                Intellectual Property
              </h2>
              <p className="text-[#4B5563] leading-relaxed">
                Reyzume is open-source software licensed under the MIT License.
                The source code is available on{" "}
                <a
                  href="https://github.com/Khusro-S/Reyzume"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#3B82F6] hover:underline"
                >
                  GitHub
                </a>
                . The Service&apos;s design, logos, and branding remain the
                property of the project creator.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-[#111827]">Privacy</h2>
              <p className="text-[#4B5563] leading-relaxed">
                Your use of the Service is also governed by our{" "}
                <a href="/privacy" className="text-[#3B82F6] hover:underline">
                  Privacy Policy
                </a>
                . Please review it to understand our data practices.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-[#111827]">
                Termination
              </h2>
              <p className="text-[#4B5563] leading-relaxed">
                We reserve the right to terminate or suspend your account at our
                discretion, without notice, for conduct that we believe:
              </p>
              <ul className="list-disc list-inside text-[#4B5563] space-y-2 pl-4">
                <li>Violates these Terms of Service</li>
                <li>Is harmful to other users or the Service</li>
                <li>Violates applicable laws or regulations</li>
              </ul>
              <p className="text-[#4B5563] leading-relaxed mt-2">
                You may delete your account at any time through your account
                settings.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-[#111827]">
                Changes to Terms
              </h2>
              <p className="text-[#4B5563] leading-relaxed">
                We may update these Terms of Service from time to time.
                Continued use of the Service after changes constitutes
                acceptance of the new terms. We will update the &quot;Last
                updated&ldquo; date at the top of this page.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-[#111827]">
                Governing Law
              </h2>
              <p className="text-[#4B5563] leading-relaxed">
                These Terms shall be governed by and construed in accordance
                with applicable international laws, without regard to conflict
                of law principles.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-[#111827]">Contact</h2>
              <p className="text-[#4B5563] leading-relaxed">
                For questions about these Terms, please contact:{" "}
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
