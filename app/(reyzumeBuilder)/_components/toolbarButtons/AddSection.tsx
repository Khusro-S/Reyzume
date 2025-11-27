"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useReyzumeSections } from "@/hooks/useReyzumeSections";
import { SectionType } from "@/hooks/useReyzumeStore";
import { Plus } from "lucide-react";

const SECTION_TYPES: { label: string; value: SectionType; single?: boolean }[] =
  [
    { label: "Header", value: "header", single: true },
    { label: "Summary", value: "summary", single: true },
    { label: "Experience", value: "experience", single: true },
    { label: "Projects", value: "projects", single: true },
    { label: "Education", value: "education", single: true },
    { label: "Certifications", value: "certifications", single: true },
    { label: "Skills", value: "skills", single: true },
    { label: "Custom Section", value: "custom", single: false },
  ];

export default function AddSection() {
  const { addSection, hasSectionType } = useReyzumeSections();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="h-full">
        <Button
          variant="outline"
          size="sm"
          className="h-9 gap-1 px-2 hover:bg-accent"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline text-sm">Add Section</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {SECTION_TYPES.map((type) => {
          const isDisabled = type.single && hasSectionType(type.value);
          return (
            <DropdownMenuItem
              key={type.value}
              onClick={() => addSection(type.value)}
              disabled={isDisabled}
              className="cursor-pointer"
            >
              {type.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
