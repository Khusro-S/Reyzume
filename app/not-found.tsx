"use client";

import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import Link from "next/link";
import { FileX, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16 bg-linear-to-b from-white to-gray-50">
      {/* Background orbs - matching Hero.tsx style */}
      <motion.div
        className="fixed top-1/4 left-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl -z-10"
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
        className="fixed bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl -z-10"
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
        className="fixed top-1/2 right-1/3 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl -z-10"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.4, 0.6, 0.4],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center text-center max-w-lg"
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2, type: "spring" }}
          className="mb-6 p-4 rounded-full bg-primary/10"
        >
          <FileX className="h-12 w-12 sm:h-16 sm:w-16 text-primary" />
        </motion.div>

        {/* 404 Number */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-7xl sm:text-9xl font-bold text-primary mb-2"
        >
          404
        </motion.h1>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-2xl sm:text-3xl font-semibold text-[#111827] mb-4"
        >
          Page Not Found
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-[#4B5563] text-base sm:text-lg mb-8 px-4"
        >
          Oops! The page you&apos;re looking for doesn&apos;t exist or has been
          moved. Let&apos;s get you back on track.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto px-4 sm:px-0"
        >
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/">
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="w-full sm:w-auto border-primary/20 hover:bg-primary/5"
            onClick={() => window.history.back()}
          >
            <Link
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.history.back();
              }}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Link>
          </Button>
        </motion.div>

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-12"
        >
          <Link
            href="/"
            className="text-xl font-bold text-primary hover:opacity-80 transition-opacity"
          >
            Reyzume
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
