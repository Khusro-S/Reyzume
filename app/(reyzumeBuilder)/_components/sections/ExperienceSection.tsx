"use client";

import {
  Section,
  ExperienceContent,
  useReyzumeStore,
} from "@/hooks/useReyzumeStore";
import { EditableText } from "../shared/EditableText";
import { SectionHeader } from "../shared/SectionHeader";
import { MonthYearPicker } from "../shared/MonthYearPicker";

interface ExperienceSectionProps {
  section: Section;
}

export function ExperienceSection({ section }: ExperienceSectionProps) {
  const content = section.content as ExperienceContent;

  const addSectionItem = useReyzumeStore((state) => state.addSectionItem);
  const updateSectionItem = useReyzumeStore((state) => state.updateSectionItem);

  return (
    <div>
      <SectionHeader onAdd={() => addSectionItem(section.id)}>
        <div className="flex items-center gap-2 group/title">
          <h2 className="text-xl font-semibold">Experience</h2>
        </div>
      </SectionHeader>
      <div className="space-y-4">
        {content.items.map((item) => (
          <div key={item.id} className="space-y-1">
            {/* Title and Location */}
            <div className="flex justify-between items-baseline gap-4">
              <EditableText
                value={item.title}
                onChange={(val) =>
                  updateSectionItem(section.id, item.id, { title: val })
                }
                className="font-semibold"
                placeholder="Job Title"
              />
              <EditableText
                value={item.location}
                onChange={(val) =>
                  updateSectionItem(section.id, item.id, { location: val })
                }
                className="text-right"
                placeholder="City, Country"
              />
            </div>
            {/* Company and Dates */}
            <div className="flex justify-between items-baseline gap-4">
              <EditableText
                value={item.company}
                onChange={(val) =>
                  updateSectionItem(section.id, item.id, { company: val })
                }
                className="text-sm font-medium text-muted-foreground"
                placeholder="Company Name"
              />
              <div className="flex gap-1 shrink-0 text-sm text-muted-foreground whitespace-nowrap">
                <MonthYearPicker
                  value={item.startDate || ""}
                  onChange={(val) =>
                    updateSectionItem(section.id, item.id, { startDate: val })
                  }
                  placeholder="Start"
                  className="text-sm"
                />
                {/* <EditableText
                  value={item.startDate || ""}
                  onChange={(val) =>
                    updateSectionItem(section.id, item.id, { startDate: val })
                  }
                  className="w-auto max-w-[70px] text-right text-sm"
                  placeholder="Start Date"
                /> */}
                <span>-</span>
                <MonthYearPicker
                  value={item.endDate || ""}
                  onChange={(val) =>
                    updateSectionItem(section.id, item.id, { endDate: val })
                  }
                  placeholder="End"
                  className="text-sm"
                  allowPresent
                />
                {/* <EditableText
                  value={item.endDate || ""}
                  onChange={(val) =>
                    updateSectionItem(section.id, item.id, { endDate: val })
                  }
                  className="w-auto max-w-[70px] text-sm"
                  placeholder="End Date"
                /> */}
              </div>
            </div>
            {/* Description */}
            <EditableText
              value={item.description || ""}
              onChange={(val) =>
                updateSectionItem(section.id, item.id, { description: val })
              }
              className="text-sm whitespace-pre-line mt-1"
              placeholder="• Achieved X by doing Y\n• Led a team of Z people"
              multiline
            />
          </div>
        ))}
      </div>
    </div>
  );
}
