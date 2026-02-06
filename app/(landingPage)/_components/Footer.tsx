"use client";

import Image from "next/image";

import { Mail } from "lucide-react";
import { toast } from "sonner";
import ReyzumeLogo from "@/components/ReyzumeLogo";

export function Footer() {
  return (
    <footer className="w-full rounded-3xl border border-primary/10 bg-background px-4 py-8 text-sm text-[#4B5563] sm:px-12 mx-auto max-w-6xl">
      <div className="flex flex-col gap-6">
        {/* Top Section: Brand + Social Links */}
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="text-center md:text-left">
            <ReyzumeLogo variant="footer" />

            <p className="text-xs text-[#6B7280] mt-1">
              Built with ❤️ by{" "}
              <a
                href="https://www.linkedin.com/in/khusro-sakhi"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Khusro Sakhi
              </a>
            </p>
          </div>

          {/* Social Links */}
          <div className="flex gap-4 justify-center md:justify-end">
            <a
              href="https://github.com/Khusro-S/Reyzume"
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-primary hover:scale-110 active:scale-100"
              aria-label="GitHub"
            >
              <Image
                src="/github.svg"
                alt="GitHub"
                width={20}
                height={20}
                className="h-5 w-5"
              />
            </a>
            <a
              href="https://www.linkedin.com/in/khusro-sakhi"
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-primary hover:scale-110 active:scale-100"
              aria-label="LinkedIn"
            >
              <Image
                src="/linkedin.svg"
                alt="GitHub"
                width={20}
                height={20}
                className="h-5 w-5"
              />
            </a>
            <button
              onClick={async () => {
                const email = "khusro.sakhi20@gmail.com";
                try {
                  await navigator.clipboard.writeText(email);
                  toast.success("Email copied to clipboard");
                } catch {
                  toast.error(
                    "Couldn't copy email — please copy manually: " + email,
                  );
                }
              }}
              className="transition hover:text-primary cursor-pointer hover:scale-110 active:scale-100"
              aria-label="Copy email to clipboard"
              title="Copy email"
            >
              <Mail className="h-5 w-5" />
              <span className="sr-only">Copy email</span>
            </button>
          </div>
        </div>

        {/* Bottom Section: Legal Links */}
        <div className="flex flex-wrap gap-4 justify-center items-center border-t border-primary/10 pt-6">
          <a className="transition hover:text-primary" href="/privacy-policy">
            Privacy Policy
          </a>
          <span className="text-[#D1D5DB]">•</span>
          <a className="transition hover:text-primary" href="/terms-of-service">
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
}
