"use client";

import {
  Section,
  CertificationsContent,
  useReyzumeStore,
} from "@/hooks/useReyzumeStore";
import { EditableText } from "../shared/EditableText";
import { SectionHeader } from "../shared/SectionHeader";

interface CertificationsSectionProps {
  section: Section;
}

export function CertificationsSection({ section }: CertificationsSectionProps) {
  const content = section.content as CertificationsContent;

  const addSectionItem = useReyzumeStore((state) => state.addSectionItem);
  const updateSectionItem = useReyzumeStore((state) => state.updateSectionItem);

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
            className="flex justify-between items-baseline gap-4"
          >
            <div className="flex-1 space-y-0.5">
              <EditableText
                value={item.name}
                onChange={(val) =>
                  updateSectionItem(section.id, item.id, { name: val })
                }
                className="font-semibold text-sm"
                placeholder="Certification Name"
              />
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
