"use client";

import {
  Section,
  SkillsContent,
  useReyzumeStore,
} from "@/hooks/useReyzumeStore";
import { EditableText } from "../shared/EditableText";
import { SectionHeader } from "../shared/SectionHeader";

interface SkillsSectionProps {
  section: Section;
}

export function SkillsSection({ section }: SkillsSectionProps) {
  const content = section.content as SkillsContent;

  const addSectionItem = useReyzumeStore((state) => state.addSectionItem);
  const updateSectionItem = useReyzumeStore((state) => state.updateSectionItem);

  return (
    <div>
      <SectionHeader
        title="Skills & Interests"
        onAdd={() => addSectionItem(section.id)}
      />
      <div className="space-y-2">
        {content.items?.map((category) => (
          <div
            key={category.id}
            className="flex items-center justify-center gap-2"
          >
            <div className="flex justify-center items-center max-w-[120px]">
              <EditableText
                value={category.label}
                onChange={(val) =>
                  updateSectionItem(section.id, category.id, { label: val })
                }
                className="font-semibold text-sm whitespace-pre-line mt-1 w-full"
                placeholder="Skills"
                multiline
              />
              <span className="font-semibold text-sm">:</span>
            </div>
            <EditableText
              value={category.skills || ""}
              onChange={(val) =>
                updateSectionItem(section.id, category.id, { skills: val })
              }
              className="text-sm whitespace-pre-line mt-1"
              placeholder="Microsoft Office (Excel, Word, PowerPoint), JavaScript, React"
              multiline
            />
          </div>
        ))}
      </div>
    </div>
  );
}
