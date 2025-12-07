"use client";

import { motion } from "motion/react";
import { Clock, Sparkles, RefreshCw } from "lucide-react";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const benefits = [
  {
    title: "Save Time",
    description:
      "Build a professional resume in minutes, not hours. Focus on content, not formatting.",
    icon: Clock,
  },
  {
    title: "Stand Out",
    description:
      "Clean, modern layouts that recruiters notice. Pass ATS filters and impress hiring managers.",
    icon: Sparkles,
  },
  {
    title: "Stay Flexible",
    description:
      "Create multiple versions for different roles. Update anytime, export instantly.",
    icon: RefreshCw,
  },
];

export default function WhatYouGet() {
  return (
    <section className="space-y-14">
      <div className="flex flex-col gap-4 text-center">
        <span className="text-lg font-semibold uppercase tracking-[0.2em] text-[#3B82F6]">
          What You Get
        </span>
        <h2 className="text-3xl font-semibold text-[#111827] sm:text-4xl">
          Everything you need to land your next role
        </h2>
        <p className="mx-auto max-w-2xl text-lg text-[#4B5563]">
          Built for job seekers who value speed, quality, and results.
        </p>
      </div>
      <div className="grid gap-12 md:gap-10 lg:gap-6 md:grid-cols-2 lg:grid-cols-3">
        {benefits.map((benefit, index) => {
          const Icon = benefit.icon;
          return (
            <motion.div
              key={benefit.title}
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
                    {benefit.title}
                  </CardTitle>
                  <CardDescription>{benefit.description}</CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
