"use client";

import {
  Section,
  ExperienceContent,
  useReyzumeStore,
} from "@/hooks/useReyzumeStore";
import { EditableText } from "../shared/EditableText";
import { SectionHeader } from "../shared/SectionHeader";
import { MonthYearPicker } from "../shared/MonthYearPicker";
import { DeleteButton } from "../shared/DeleteButton";
import { SortableItemList } from "../draggable/SortableItemList";
import { DraggableItem } from "../draggable/DraggableItem";

interface ExperienceSectionProps {
  section: Section;
}

export function ExperienceSection({ section }: ExperienceSectionProps) {
  const content = section.content as ExperienceContent;

  const addSectionItem = useReyzumeStore((state) => state.addSectionItem);
  const updateSectionItem = useReyzumeStore((state) => state.updateSectionItem);
  const removeSectionItem = useReyzumeStore((state) => state.removeSectionItem);
  const reorderSectionItems = useReyzumeStore(
    (state) => state.reorderSectionItems
  );

  const canDelete = content.items.length > 1;

  return (
    <div>
      <SectionHeader onAdd={() => addSectionItem(section.id)}>
        <div className="flex items-center gap-2 group/title">
          <h2 className="text-xl font-semibold">Experience</h2>
        </div>
      </SectionHeader>
      <SortableItemList
        items={content.items}
        onReorder={(items) => reorderSectionItems(section.id, items)}
        className="space-y-4"
      >
        {content.items.map((item) => (
          <DraggableItem key={item.id} id={item.id} className="space-y-1">
            {/* Title and Location */}
            <div className="flex justify-between items-baseline gap-4">
              <div className="flex gap-1">
                <EditableText
                  value={item.title}
                  onChange={(val) =>
                    updateSectionItem(section.id, item.id, { title: val })
                  }
                  className="font-semibold"
                  placeholder="Job Title"
                />
                {canDelete && (
                  <DeleteButton
                    onDelete={() => removeSectionItem(section.id, item.id)}
                    itemName="entry"
                    className="opacity-0 group-hover/item:opacity-100 transition-opacity"
                  />
                )}
              </div>
              <EditableText
                value={item.location}
                onChange={(val) =>
                  updateSectionItem(section.id, item.id, { location: val })
                }
                className="text-right text-sm"
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
          </DraggableItem>
        ))}
      </SortableItemList>
    </div>
  );
}