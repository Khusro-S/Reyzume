"use client";

import {
  Section,
  SummaryContent,
  useReyzumeStore,
} from "@/hooks/useReyzumeStore";
import { EditableText } from "../shared/EditableText";
import { SectionHeader } from "../shared/SectionHeader";

interface SummarySectionProps {
  section: Section;
}

export function SummarySection({ section }: SummarySectionProps) {
  const content = section.content as SummaryContent;
  const updateSection = useReyzumeStore((state) => state.updateSection);

  return (
    <div>
      <SectionHeader title="Summary" />
      <EditableText
        value={content.text}
        onChange={(val) => updateSection(section.id, { text: val })}
        className="text-sm"
        placeholder="Add your professional summary..."
        multiline
      />
    </div>
  );
}
