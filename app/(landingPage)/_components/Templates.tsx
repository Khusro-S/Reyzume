"use client";

import { motion } from "motion/react";
import Image from "next/image";

const templates = [
  {
    name: "Aurora",
    src: "/templates/template-1.svg",
  },
  {
    name: "Nimbus",
    src: "/templates/template-2.svg",
  },
  {
    name: "Lumen",
    src: "/templates/template-3.svg",
  },
];

export function Templates() {
  return (
    <section id="templates" className="space-y-10">
      <div className="flex flex-col gap-4 text-center">
        <span className="text-sm font-semibold uppercase tracking-[0.2em] text-[#3B82F6]">
          Templates
        </span>
        <h2 className="text-3xl font-semibold text-[#111827] sm:text-4xl">
          Minimal layouts crafted for readability
        </h2>
        <p className="mx-auto max-w-2xl text-lg text-[#4B5563]">
          Choose from modern, ATS-friendly designs that highlight your strengths
          without clutter.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {templates.map((template, index) => (
          <motion.div
            key={template.name}
            className="group relative overflow-hidden rounded-3xl border border-[#3B82F6]/15 bg-white shadow-md"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.15 }}
            viewport={{ once: true, amount: 0.4 }}
          >
            <motion.div
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 120, damping: 15 }}
              className="relative h-[420px] w-full"
            >
              <Image
                src={template.src}
                alt={`${template.name} resume template preview`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
                priority={index === 0}
              />
            </motion.div>
            <div className="absolute inset-x-4 bottom-4 flex items-center justify-between rounded-full bg-white/90 px-5 py-3 text-sm font-semibold text-[#111827] shadow-lg">
              <span>{template.name} Template</span>
              <span className="text-[#3B82F6]">View</span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
