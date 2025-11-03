"use client";

import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

const steps = [
  {
    title: "Create",
    description:
      "Kick things off with tailored prompts and AI-generated outlines.",
  },
  {
    title: "Customize",
    description:
      "Adjust sections, tweak styles, and fine-tune wording in real time.",
  },
  {
    title: "Download",
    description: "Export polished, recruiter-ready PDFs and share instantly.",
  },
];

export function HowItWorks() {
  return (
    <section className="space-y-10">
      <div className="flex flex-col gap-4 text-center">
        <span className="text-sm font-semibold uppercase tracking-[0.2em] text-[#3B82F6]">
          How it works
        </span>
        <h2 className="text-3xl font-semibold text-[#111827] sm:text-4xl">
          Build a standout resume in three intuitive steps
        </h2>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {steps.map((step, index) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.15 }}
            viewport={{ once: true, amount: 0.5 }}
            className="relative rounded-3xl border border-[#3B82F6]/15 bg-white p-8 text-left shadow-sm flex items-center justify-center flex-col "
          >
            <div className="flex items-center gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#3B82F6]/10 text-lg font-semibold text-[#2563eb]">
                0{index + 1}
              </span>
              <h3 className="text-xl font-semibold text-[#111827]">
                {step.title}
              </h3>
            </div>
            <p className="mt-4 text-base text-[#4B5563]">{step.description}</p>
            {index < steps.length - 1 && (
              // <ArrowRight className="absolute -right-6 top-1/2 hidden h-10 w-10 -translate-y-1/2 text-[#FACC15]/80 md:block" />
              <ArrowRight className="absolute -bottom-10 -translate-x-1/2 md:-right-6 md:top-1/2 h-10 w-10 md:translate-x-0 md:-translate-y-1/2 text-[#FACC15]/80 rotate-90 md:rotate-0 z-1" />
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
