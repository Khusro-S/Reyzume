"use client";

import { motion } from "motion/react";
import { BrainCircuit, FileText, Zap } from "lucide-react";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const features = [
  {
    title: "Fast Resume Builder",
    description:
      "Use guided prompts and smart defaults to move from idea to polished resume without the friction.",
    icon: Zap,
  },
  {
    title: "AI Resume Enhancer",
    description:
      "Let Reyzume analyze your experience and suggest impactful bullet points tailored to your role.",
    icon: BrainCircuit,
  },
  {
    title: "ATS-Proof Export",
    description:
      "Export clean, standards-friendly PDFs optimized to pass applicant tracking systems every time.",
    icon: FileText,
  },
];

export function Features() {
  return (
    <section id="about" className="space-y-14">
      <div className="flex flex-col gap-4 text-center">
        <span className="text-lg font-semibold uppercase tracking-[0.2em] text-[#3B82F6]">
          Why Reyzume
        </span>
        <h2 className="text-3xl font-semibold text-[#111827] sm:text-4xl">
          Designed to get you hired faster
        </h2>
        <p className="mx-auto max-w-2xl text-lg text-[#4B5563]">
          Every feature keeps recruiters in mind. Delightful to create, powerful
          when submitted.
        </p>
      </div>
      <div className="grid gap-12 md:gap-10 lg:gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true, amount: 0.4 }}
            >
              <Card className="h-full">
                <CardHeader className="relative gap-4 text-center flex flex-col items-center justify-center">
                  <div className="absolute -top-13 left-1/2 -translate-x-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white">
                    <Icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl font-semibold text-[#111827]">
                    {feature.title}
                  </CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
