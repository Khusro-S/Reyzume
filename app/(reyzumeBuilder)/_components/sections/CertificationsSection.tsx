"use client";

import {
  Section,
  CertificationsContent,
  useReyzumeStore,
} from "@/hooks/useReyzumeStore";
import { EditableText } from "../shared/EditableText";
import { SectionHeader } from "../shared/SectionHeader";
import { DeleteButton } from "../shared/DeleteButton";

interface CertificationsSectionProps {
  section: Section;
}

export function CertificationsSection({ section }: CertificationsSectionProps) {
  const content = section.content as CertificationsContent;

  const addSectionItem = useReyzumeStore((state) => state.addSectionItem);
  const updateSectionItem = useReyzumeStore((state) => state.updateSectionItem);
  const removeSectionItem = useReyzumeStore((state) => state.removeSectionItem);

  const canDelete = content.items.length > 1;

  return (
    <div>
      <SectionHeader
        title="Certifications"
        onAdd={() => addSectionItem(section.id)}
      />
      <div className="space-y-3">
        {content.items.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-baseline gap-4 group/item"
          >
            <div className="flex-1 space-y-0.5">
              <div className="flex gap-1">
                <EditableText
                  value={item.name}
                  onChange={(val) =>
                    updateSectionItem(section.id, item.id, { name: val })
                  }
                  className="font-semibold w-1/2"
                  placeholder="Certification Name"
                />
                {canDelete && (
                  <DeleteButton
                    onDelete={() => removeSectionItem(section.id, item.id)}
                    itemName="section item"
                    className="opacity-0 group-hover/item:opacity-100 transition-opacity"
                  />
                )}
              </div>
              <EditableText
                value={item.issuer}
                onChange={(val) =>
                  updateSectionItem(section.id, item.id, { issuer: val })
                }
                className="text-sm text-muted-foreground"
                placeholder="Issuer"
              />
            </div>
            <EditableText
              value={item.date}
              onChange={(val) =>
                updateSectionItem(section.id, item.id, { date: val })
              }
              className="text-sm text-muted-foreground w-20 text-right"
              placeholder="MM/YYYY"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
