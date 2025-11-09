"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react";

const ROLES = [
  "Software Engineer",
  "Frontend Developer",
  "Graphic Designer",
  "Product Manager",
  "UX Designer",
  "Data Scientist",
];

const TypingAnimation = () => {
  const [currentRole, setCurrentRole] = useState("");
  const [roleIndex, setRoleIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(150);
  const [showCursor, setShowCursor] = useState(true);

  // typing effect
  useEffect(() => {
    const role = ROLES[roleIndex];

    const timer = setTimeout(() => {
      // typing mode
      if (!isDeleting) {
        if (currentRole.length < role.length) {
          setCurrentRole(role.substring(0, currentRole.length + 1));
          setTypingSpeed(100);
          setShowCursor(true);
        } else {
          setTimeout(() => setIsDeleting(true), 2000); // stop for few seconds after finishing typing
        }
        // deleting mode
      } else {
        if (currentRole.length > 0) {
          setCurrentRole(currentRole.substring(0, currentRole.length - 1));
          setTypingSpeed(50);
          setShowCursor(true);
        } else {
          setIsDeleting(false);
          setRoleIndex((roleIndex + 1) % ROLES.length);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [currentRole, isDeleting, roleIndex, typingSpeed]);

  // Blinking effect
  useEffect(() => {
    const role = ROLES[roleIndex];
    const isFinishedTyping = currentRole.length === role.length && !isDeleting;

    if (isFinishedTyping) {
      const blinkInterval = setInterval(() => {
        setShowCursor((prev) => !prev);
      }, 530);

      return () => clearInterval(blinkInterval);
    }
  }, [currentRole, isDeleting, roleIndex]);

  return (
    <span className="inline-flex items-center text-sm">
      {currentRole}
      <span
        className={`ml-0.5 w-0.5 h-4 bg-primary transition-opacity duration-100 ${
          showCursor ? "opacity-100" : "opacity-0"
        }`}
      />
    </span>
  );
};

export default function ResumeBuilderHero() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="relative w-full mx-auto max-w-sm max-lg:hidden"
    >
      {/* Glow effect behind builder */}
      <div className="absolute inset-0 bg-linear-to-br from-white to-primary/30 rounded-lg blur-xl scale-105" />

      {/* Builder Window */}
      <div className="relative bg-white/10 backdrop-blur-xl border border-white/10 rounded-lg shadow-xl overflow-hidden">
        {/* Toolbar - Made smaller */}
        <div className="bg-white/50 backdrop-blur-sm px-3 py-2 border-b border-black/10">
          <div className="flex items-center gap-3">
            <div className="flex gap-0.5">
              <button className="p-1 hover:bg-white/10 rounded transition">
                <Bold className="w-3 h-3 text-gray-300" />
              </button>
              <button className="p-1 hover:bg-white/10 rounded transition">
                <Italic className="w-3 h-3 text-gray-300" />
              </button>
              <button className="p-1 hover:bg-white/10 rounded transition">
                <Underline className="w-3 h-3 text-gray-300" />
              </button>
            </div>
            <div className="w-px h-4 bg-white/20" />
            <div className="flex gap-0.5">
              <button className="p-1 hover:bg-white/10 rounded transition">
                <AlignLeft className="w-3 h-3 text-gray-300" />
              </button>
              <button className="p-1 hover:bg-white/10 rounded transition">
                <AlignCenter className="w-3 h-3 text-gray-300" />
              </button>
              <button className="p-1 hover:bg-white/10 rounded transition">
                <AlignRight className="w-3 h-3 text-gray-300" />
              </button>
            </div>
          </div>
        </div>

        {/* A4 Page Preview - Reduced padding and min-height */}
        <div className="p-8 bg-linear-to-br from-white/50 to-gray-200/50 flex items-center justify-center min-h-[200px]">
          <div className="w-full aspect-[1/1.414] bg-white rounded-md shadow-lg p-4 relative overflow-hidden">
            {/* Resume Content - Smaller spacing */}
            <div className="relative space-y-3">
              {/* Name section */}
              <div className="space-y-1">
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 font-medium">
                  <TypingAnimation />
                </div>
              </div>

              {/* Contact info */}
              <div className="space-y-1">
                <div className="h-2 w-full bg-gray-100 rounded" />
                <div className="h-2 w-4/5 bg-gray-100 rounded" />
              </div>

              {/* Section divider */}
              <div className="h-px bg-gray-300" />

              {/* Experience section */}
              <div className="space-y-1.5">
                <div className="h-2.5 w-24 bg-gray-300 rounded" />
                <div className="space-y-1">
                  <div className="h-2 w-full bg-gray-100 rounded" />
                  <div className="h-2 w-full bg-gray-100 rounded" />
                  <div className="h-2 w-3/4 bg-gray-100 rounded" />
                </div>
              </div>

              {/* Another section */}
              <div className="space-y-1.5">
                <div className="h-2.5 w-24 bg-gray-300 rounded" />
                <div className="space-y-1">
                  <div className="h-2 w-full bg-gray-100 rounded" />
                  <div className="h-2 w-5/6 bg-gray-100 rounded" />
                </div>
              </div>
              {/* Another section */}
              <div className="space-y-1.5">
                <div className="h-2.5 w-24 bg-gray-300 rounded" />
                <div className="space-y-1">
                  <div className="h-2 w-full bg-gray-100 rounded" />
                  <div className="h-2 w-5/6 bg-gray-100 rounded" />
                </div>
              </div>
              {/* Another section */}
              <div className="space-y-1.5">
                <div className="h-2.5 w-24 bg-gray-300 rounded" />
                <div className="space-y-1">
                  <div className="h-2 w-full bg-gray-100 rounded" />
                  <div className="h-2 w-5/6 bg-gray-100 rounded" />
                </div>
              </div>
              {/* Another section */}
              <div className="space-y-1.5">
                <div className="h-2.5 w-24 bg-gray-300 rounded" />
                <div className="space-y-1">
                  <div className="h-2 w-full bg-gray-100 rounded" />
                  <div className="h-2 w-5/6 bg-gray-100 rounded" />
                </div>
              </div>
              {/* Another section */}
              <div className="space-y-1.5">
                <div className="h-2.5 w-24 bg-gray-300 rounded" />
                <div className="space-y-1">
                  <div className="h-2 w-full bg-gray-100 rounded" />
                  <div className="h-2 w-5/6 bg-gray-100 rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// export default function FinderWindow() {
//   return (
//     <>
//       <ResumeBuilder />
//     </>
//   );
// }
