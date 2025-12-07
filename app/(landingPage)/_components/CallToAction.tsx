"use client";

import { motion } from "motion/react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export function CallToAction() {
  return (
    <section
      id="cta"
      className="scroll-mt-32 overflow-hidden rounded-3xl border border-[#3B82F6]/20 bg-linear-to-br from-[#3B82F6] via-[#3B82F6]/90 to-[#1d4ed8] px-6 py-14 text-white shadow-xl sm:px-12"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, amount: 0.4 }}
        className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center"
      >
        <h2 className="text-3xl font-semibold sm:text-4xl">
          Ready to land your next interview?
        </h2>
        <p className="text-lg text-white/90">
          Your next career move starts here. Create your resume for free in
          minutes.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Button
            size="lg"
            asChild
            className="bg-white text-[#1d4ed8] hover:bg-transparent hover:text-white hover:border hover:border-white"
          >
            <Link href="/signup">Create My Resume</Link>
          </Button>
        </div>
      </motion.div>
    </section>
  );
}
