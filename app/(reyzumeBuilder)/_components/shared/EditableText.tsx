"use client";

import { RichTextEditor } from "./RichTextEditor";

interface EditableTextProps {
  value: string;
  onChange: (val: string) => void;
  className?: string;
  placeholder?: string;
  multiline?: boolean;
  maxLength?: number;
}

export function EditableText({
  value,
  onChange,
  className,
  placeholder,
  multiline = false,
  maxLength,
}: EditableTextProps) {
  return (
    <RichTextEditor
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={className}
      singleLine={!multiline}
      maxLength={!multiline && !maxLength ? 100 : maxLength || undefined}
    />
  );
}
