"use client";

import {
  Section,
  EducationContent,
  useReyzumeStore,
} from "@/hooks/useReyzumeStore";
import { EditableText } from "../shared/EditableText";
import { SectionHeader } from "../shared/SectionHeader";

interface EducationSectionProps {
  section: Section;
}

export function EducationSection({ section }: EducationSectionProps) {
  const content = section.content as EducationContent;

  const addSectionItem = useReyzumeStore((state) => state.addSectionItem);
  const updateSectionItem = useReyzumeStore((state) => state.updateSectionItem);

  return (
    <div>
      <SectionHeader
        title="Education"
        onAdd={() => addSectionItem(section.id)}
      />
      <div className="space-y-4">
        {content.items.map((item) => (
          <div key={item.id} className="space-y-1">
            {/* School and Location */}
            <div className="flex justify-between items-baseline gap-4">
              <EditableText
                value={item.school}
                onChange={(val) =>
                  updateSectionItem(section.id, item.id, { school: val })
                }
                className="font-semibold"
                placeholder="School Name"
              />
              <EditableText
                value={item.location}
                onChange={(val) =>
                  updateSectionItem(section.id, item.id, { location: val })
                }
                className="text-sm text-muted-foreground text-right"
                placeholder="City, Country"
              />
            </div>
            {/* Degree and Dates */}
            <div className="flex justify-between items-baseline gap-4">
              <EditableText
                value={item.degree}
                onChange={(val) =>
                  updateSectionItem(section.id, item.id, { degree: val })
                }
                className="text-sm font-medium"
                placeholder="Degree"
              />
              <div className="flex gap-1 shrink-0 text-sm text-muted-foreground whitespace-nowrap">
                <EditableText
                  value={item.startDate}
                  onChange={(val) =>
                    updateSectionItem(section.id, item.id, { startDate: val })
                  }
                  className="w-auto max-w-[70px] text-right text-sm"
                  placeholder="Start Date"
                />
                <span>-</span>
                <EditableText
                  value={item.graduationDate}
                  onChange={(val) =>
                    updateSectionItem(section.id, item.id, {
                      graduationDate: val,
                    })
                  }
                  className="mw-auto max-w-[70px] text-sm"
                  placeholder="End Date"
                />
              </div>
            </div>
            {/* Description */}
            <EditableText
              value={item.description || ""}
              onChange={(val) =>
                updateSectionItem(section.id, item.id, { description: val })
              }
              className="text-sm whitespace-pre-line mt-1"
              placeholder="Relevant coursework: ..."
              multiline
            />
          </div>
        ))}
      </div>
    </div>
  );
}
