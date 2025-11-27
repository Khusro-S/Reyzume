"use client";

import { cn } from "@/lib/utils";

interface EditableTextProps {
  value: string;
  onChange: (val: string) => void;
  className?: string;
  placeholder?: string;
  multiline?: boolean;
}

export function EditableText({
  value,
  onChange,
  className,
  placeholder,
  multiline = false,
}: EditableTextProps) {
  if (multiline) {
    return (
      <textarea
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "w-full bg-transparent outline-none resize-none overflow-hidden min-h-[1.5em] placeholder:text-muted-foreground/50 border-none shadow-none focus-visible:ring-transparent text-base",
          className
        )}
        rows={1}
        onInput={(e) => {
          e.currentTarget.style.height = "auto";
          e.currentTarget.style.height = e.currentTarget.scrollHeight + "px";
        }}
      />
    );
  }
  return (
    <input
      type="text"
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={cn(
        "w-full bg-transparent outline-none shadow-none focus-visible:ring-transparent placeholder:text-muted-foreground/50 text-base",
        className
      )}
    />
  );
}
