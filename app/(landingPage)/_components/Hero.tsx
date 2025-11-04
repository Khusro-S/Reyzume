"use client";

import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import Link from "next/link";
import ResumeBuilderHero from "./ResumeBuilderHero";
// import { SignInButton } from "@clerk/nextjs";
// import FinderWindow from "./FinderWindow";

export function Hero() {
  return (
    <section
      id="home"
      className="relative overflow-hidden rounded-3xl border border-[#3B82F6]/10 bg-white/90 backdrop-blur-md px-6 py-10 shadow-lg sm:px-8 lg:px-16"
    >
      <div
        className="absolute -left-24 -top-24 h-64 w-64 rounded-full bg-[#3B82F6]/10 blur-3xl"
        aria-hidden
      />
      <div
        className="absolute -bottom-32 -right-24 h-72 w-72 rounded-full bg-[#FACC15]/20 blur-3xl"
        aria-hidden
      />
      <div className="relative grid items-center gap-12 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="space-y-8"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-[#3B82F6]/10 px-4 py-1 text-sm font-medium text-[#2563eb]">
            Trusted AI resume builder
          </span>
          <h1 className="text-4xl font-semibold tracking-tight text-[#111827] sm:text-5xl lg:text-6xl">
            Build ATS-Ready Resumes in Minutes.
          </h1>
          <p className="max-w-lg text-lg leading-relaxed text-[#4B5563]">
            Fast. Clean. AI-Smart. Reyzume guides you from blank page to
            polished resume with intelligent prompts, stunning templates, and
            export-ready formats.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Button size="lg">
              <Link href="/signin">Start Building</Link>
            </Button>
            {/* <SignInButton mode="modal" fallbackRedirectUrl="/reyzumes">
              <Button>Start Building</Button>
            </SignInButton> */}
            {/* <Button size="lg" variant="secondary">
              <Link href="#templates">See Templates</Link>
            </Button> */}
          </div>
        </motion.div>
        {/* <FinderWindow /> */}
        <ResumeBuilderHero />
        {/* Animated background orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-2xl -z-10"
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
          className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-2xl -z-10"
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
          className="absolute top-1/2 right-1/3 w-64 h-64 bg-pink-500/20 rounded-full blur-2xl -z-10"
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
        {/* <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ delay: 0.2, duration: 0.7, ease: "easeOut" }}
          className="relative flex justify-center"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="relative h-[360px] w-[260px] overflow-hidden rounded-3xl border border-[#3B82F6]/20 bg-[#F9FAFB] shadow-xl"
          >
            <Image
              src="/templates/template-hero.svg"
              alt="Preview of a Reyzume resume template"
              fill
              priority
              sizes="(max-width: 768px) 60vw, 260px"
              className="object-cover"
            />
          </motion.div> */}
        {/* <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="absolute -bottom-10 right-10 hidden rounded-2xl border border-[#FACC15]/40 bg-white/95 px-4 py-3 shadow-lg lg:flex"
          >
            <div>
              <p className="text-sm font-medium text-[#2563eb]">
                AI Suggestions
              </p>
              <p className="text-xs text-[#4B5563]">
                Tailored bullet points to highlight your impact.
              </p>
            </div>
          </motion.div> */}
        {/* </motion.div> */}
      </div>
    </section>
  );
}
