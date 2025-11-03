"use client";

import { motion } from "motion/react";

const testimonials = [
  {
    name: "Maya Chen",
    role: "Product Designer",
    quote:
      "Reyzume shaved hours off my application process. The AI suggestions sounded exactly like me—just more polished.",
  },
  {
    name: "Jordan Alvarez",
    role: "Software Engineer",
    quote:
      "Loved how easy it was to tailor my resume for different roles. Recruiters actually commented on how clean it looked.",
  },
  {
    name: "Priya Singh",
    role: "Marketing Strategist",
    quote:
      "Finally a builder that understands modern resumes. Exporting an ATS-ready PDF took seconds.",
  },
];

export function Testimonials() {
  return (
    <section className="space-y-10">
      <div className="flex flex-col gap-4 text-center">
        <span className="text-sm font-semibold uppercase tracking-[0.2em] text-[#3B82F6]">
          Voices from users
        </span>
        <h2 className="text-3xl font-semibold text-[#111827] sm:text-4xl">
          Professionals trust Reyzume to make an impact
        </h2>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={testimonial.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true, amount: 0.3 }}
            className="rounded-3xl border border-[#3B82F6]/10 bg-white p-8 text-left shadow-md"
          >
            <p className="text-base leading-relaxed text-[#111827]">
              &ldquo;{testimonial.quote}&rdquo;
            </p>
            <div className="mt-6">
              <p className="text-sm font-semibold text-[#111827]">
                {testimonial.name}
              </p>
              <p className="text-sm text-[#4B5563]">{testimonial.role}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
