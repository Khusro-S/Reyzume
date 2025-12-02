"use client";

import { RichTextEditor } from "./RichTextEditor";

interface EditableTextProps {
  value: string;
  onChange: (val: string) => void;
  className?: string;
  style?: React.CSSProperties;
  placeholder?: string;
  multiline?: boolean;
  maxLength?: number;
  selectAllOnFocus?: boolean;
}

export function EditableText({
  value,
  onChange,
  className,
  style,
  placeholder,
  multiline = false,
  maxLength,
  selectAllOnFocus = false,
}: EditableTextProps) {
  return (
    <RichTextEditor
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={className}
      style={style}
      singleLine={!multiline}
      selectAllOnFocus={selectAllOnFocus}
      maxLength={!multiline && !maxLength ? 100 : maxLength || undefined}
    />
  );
}
