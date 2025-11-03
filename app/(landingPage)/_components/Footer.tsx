"use client";

export function Footer() {
  return (
    <footer className="w-full rounded-3xl border border-[#3B82F6]/10 bg-white/90 px-6 py-10 text-sm text-[#4B5563] sm:px-12 mx-auto max-w-6xl">
      <div className="flex flex-col-reverse gap-6 md:flex-row md:items-center md:justify-between">
        <p className="text-base md:text-lg text-center md:text-left font-semibold text-[#111827]">
          Reyzume{" "}
          <span className="text-xs text-[#6B7280]">
            © {new Date().getFullYear()}
          </span>
        </p>

        <div className="flex flex-wrap gap-4 justify-center md:justify-end">
          <a className="transition hover:text-[#3B82F6]" href="#privacy">
            Privacy
          </a>
          <a className="transition hover:text-[#3B82F6]" href="#terms">
            Terms
          </a>
          <a
            className="transition hover:text-[#3B82F6]"
            // href="mailto:hello@reyzume.com"
          >
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
