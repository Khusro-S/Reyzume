"use client";

import {
  Section,
  EducationContent,
  useReyzumeStore,
} from "@/hooks/useReyzumeStore";
import { EditableText } from "../shared/EditableText";
import { SectionHeader } from "../shared/SectionHeader";
import { MonthYearPicker } from "../shared/MonthYearPicker";
import { DeleteButton } from "../shared/DeleteButton";

interface EducationSectionProps {
  section: Section;
}

export function EducationSection({ section }: EducationSectionProps) {
  const content = section.content as EducationContent;

  const addSectionItem = useReyzumeStore((state) => state.addSectionItem);
  const updateSectionItem = useReyzumeStore((state) => state.updateSectionItem);
  const removeSectionItem = useReyzumeStore((state) => state.removeSectionItem);

  const canDelete = content.items.length > 1;

  return (
    <div>
      <SectionHeader
        title="Education"
        onAdd={() => addSectionItem(section.id)}
      />
      <div className="space-y-4">
        {content.items.map((item) => (
          <div key={item.id} className="space-y-1 group/item">
            {/* School and Location */}
            <div className="flex justify-between items-baseline gap-4">
              <div className=" flex gap-1 ">
                <EditableText
                  value={item.school}
                  onChange={(val) =>
                    updateSectionItem(section.id, item.id, { school: val })
                  }
                  className="font-semibold"
                  placeholder="School Name"
                />
                {/* Delete item button */}
                {canDelete && (
                  <DeleteButton
                    onDelete={() => removeSectionItem(section.id, item.id)}
                    itemName="section item"
                    className="opacity-0 group-hover/item:opacity-100 transition-opacity"
                  />
                )}
              </div>
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
                <MonthYearPicker
                  value={item.startDate || ""}
                  onChange={(val) =>
                    updateSectionItem(section.id, item.id, { startDate: val })
                  }
                  placeholder="Start"
                  className="text-sm"
                />
                {/* <EditableText
                  value={item.startDate}
                  onChange={(val) =>
                    updateSectionItem(section.id, item.id, { startDate: val })
                  }
                  className="w-auto max-w-[70px] text-right text-sm"
                  placeholder="Start Date"
                /> */}
                <span>-</span>
                <MonthYearPicker
                  value={item.graduationDate || ""}
                  onChange={(val) =>
                    updateSectionItem(section.id, item.id, {
                      graduationDate: val,
                    })
                  }
                  placeholder="End"
                  className="text-sm"
                  allowPresent
                />
                {/* <EditableText
                  value={item.graduationDate}
                  onChange={(val) =>
                    updateSectionItem(section.id, item.id, {
                      graduationDate: val,
                    })
                  }
                  className="mw-auto max-w-[70px] text-sm"
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
              placeholder="Relevant coursework: ..."
              multiline
            />
          </div>
        ))}
      </div>
    </div>
  );
}
