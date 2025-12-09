"use client";

import {
  Section,
  HeaderContent,
  useReyzumeStore,
} from "@/hooks/useReyzumeStore";
import { EditableText } from "../shared/EditableText";

interface HeaderSectionProps {
  section: Section;
}

export function HeaderSection({ section }: HeaderSectionProps) {
  const content = section.content as HeaderContent;
  const updateSection = useReyzumeStore((state) => state.updateSection);

  const handleChange = (field: keyof HeaderContent, value: string) => {
    updateSection(section.id, { [field]: value });
  };

  return (
    <div className="text-center space-y-1">
      <div className="flex justify-center">
        <EditableText
          value={content.name}
          onChange={(val) => handleChange("name", val)}
          // className="text-2xl md:text-3xl font-bold text-center"
          className="font-bold text-center"
          style={{ fontSize: "1.5em" }}
          placeholder="Your Name"
        />
      </div>
      <div className="flex justify-center">
        <EditableText
          value={content.contactInfo}
          onChange={(val) =>
            handleChange("contactInfo" as keyof HeaderContent, val)
          }
          // className="text-sm text-muted-foreground text-center"
          className="text-muted-foreground text-center"
          style={{ fontSize: "0.85em" }}
          placeholder="email@example.com | (555) 123-4567 | City, Country"
        />
      </div>
    </div>
  );
}
