"use client";

import { UserButton } from "@clerk/nextjs";
import { Authenticated } from "convex/react";
import Link from "next/link";

export function Navbar() {
  return (
    <header className="">
      <nav className="mx-auto flex max-w-6xl items-center justify-between rounded-full border backdrop-blur-sm border-[#3B82F6]/10 bg-white/80 px-6 py-5 shadow-sm">
        <Link href="/" className="text-xl font-bold text-[#3B82F6]">
          Reyzume
        </Link>

        {/* <div className="hidden items-center gap-8 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-[#111827] transition hover:text-[#3B82F6]"
            >
              {link.label}
            </Link>
          ))}
          <Button asChild>
            <Link href="#cta">Create My Resume</Link>
          </Button>
        </div> */}

        {/* <button
          onClick={toggleMenu}
          className="text-[#111827] lg:hidden"
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button> */}

        <Authenticated>
          <UserButton
            appearance={{
              elements: {
                userButtonPopoverCard: "right-0",
                userButtonPopoverActionButton: "transition-all",
              },
            }}
          />
        </Authenticated>
        {/* <Button asChild className="bg-[#3B82F6] text-white rounded-full">
          <Link href="#cta">Create My Resume</Link>
        </Button> */}
      </nav>

      {/* {isOpen && (
        <div className="absolute left-0 right-0 top-full mx-auto mt-2 flex w-full max-w-6xl flex-col gap-2 rounded-3xl border border-[#3B82F6]/10 bg-white p-6 shadow-lg lg:hidden animate-in fade-in slide-in-from-top-2 duration-200">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={closeMenu}
              className="text-base font-medium text-[#111827] transition hover:text-[#3B82F6]"
            >
              {link.label}
            </Link>
          ))}
          <Button asChild className="mt-4 w-full">
            <Link href="#cta" onClick={closeMenu}>
              Create My Resume
            </Link>
          </Button>
        </div>
      )} */}
    </header>
  );
}
