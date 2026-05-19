"use client";

import {
  Section,
  SummaryContent,
  useReyzumeStore,
} from "@/hooks/useReyzumeStore";
import { EditableText } from "../shared/EditableText";
import { SectionFlow } from "../shared/LayoutTiers";
import { SectionHeader } from "../shared/SectionHeader";

interface SummarySectionProps {
  section: Section;
}

export function SummarySection({ section }: SummarySectionProps) {
  const content = section.content as SummaryContent;
  const updateSection = useReyzumeStore((state) => state.updateSection);

  return (
    <SectionFlow>
      <SectionHeader title={content.title} />
      <EditableText
        value={content.text}
        onChange={(val) => updateSection(section.id, { text: val })}
        // className="text-sm"
        // style={{fontSize: }}
        placeholder="Add your professional summary..."
        multiline
      />
    </SectionFlow>
  );
}
