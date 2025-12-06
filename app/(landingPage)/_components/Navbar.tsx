"use client";

import { UserButton } from "@clerk/nextjs";
import { Authenticated } from "convex/react";
import Link from "next/link";

export function Navbar() {
  return (
    <header className="w-full">
      <nav className="mx-auto flex max-w-6xl items-center justify-between rounded-full border backdrop-blur-sm border-[#3B82F6]/10 bg-white/80 px-6 py-5 shadow-sm">
        <Link href="/" className="text-xl font-bold text-[#3B82F6]">
          Reyzume
        </Link>

        <Authenticated>
          <UserButton
            appearance={{
              elements: {
                userButtonPopoverCard: "right-0 !fixed",
                userButtonPopoverActionButton: "transition-all",
                rootBox: "relative",
              },
            }}
          />
        </Authenticated>
      </nav>
    </header>
  );
}
