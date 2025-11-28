"use client";

import {
  Section,
  SkillsContent,
  useReyzumeStore,
} from "@/hooks/useReyzumeStore";
import { EditableText } from "../shared/EditableText";
import { SectionHeader } from "../shared/SectionHeader";
import { DeleteButton } from "../shared/DeleteButton";

interface SkillsSectionProps {
  section: Section;
}

export function SkillsSection({ section }: SkillsSectionProps) {
  const content = section.content as SkillsContent;

  const addSectionItem = useReyzumeStore((state) => state.addSectionItem);
  const updateSectionItem = useReyzumeStore((state) => state.updateSectionItem);
  const removeSectionItem = useReyzumeStore((state) => state.removeSectionItem);

  const canDelete = content.items.length > 1;

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
            className="flex items-center justify-center gap-2 group/item"
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
            {canDelete && (
              <DeleteButton
                onDelete={() => removeSectionItem(section.id, category.id)}
                itemName="section item"
                className="opacity-0 group-hover/item:opacity-100 transition-opacity"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
