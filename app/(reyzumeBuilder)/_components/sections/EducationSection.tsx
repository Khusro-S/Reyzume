"use client";

import {
  Section,
  EducationContent,
  useReyzumeStore,
} from "@/hooks/useReyzumeStore";
import { EditableText } from "../shared/EditableText";
import { SectionHeader } from "../shared/SectionHeader";
import { DeleteButton } from "../shared/DeleteButton";
import { SortableItemList } from "../draggable/SortableItemList";
import { DraggableItem } from "../draggable/DraggableItem";
import { DateRangePicker } from "../shared/DateRangePicker";

interface EducationSectionProps {
  section: Section;
}

export function EducationSection({ section }: EducationSectionProps) {
  const content = section.content as EducationContent;

  const addSectionItem = useReyzumeStore((state) => state.addSectionItem);
  const updateSectionItem = useReyzumeStore((state) => state.updateSectionItem);
  const removeSectionItem = useReyzumeStore((state) => state.removeSectionItem);
  const reorderSectionItems = useReyzumeStore(
    (state) => state.reorderSectionItems
  );

  const canDelete = content.items.length > 1;

  return (
    <div>
      <SectionHeader
        title="Education"
        onAdd={() => addSectionItem(section.id)}
      />
      <SortableItemList
        items={content.items}
        onReorder={(items) => reorderSectionItems(section.id, items)}
        className="space-y-4"
      >
        {content.items.map((item) => (
          <DraggableItem
            key={item.id}
            id={item.id}
            className="space-y-1 group/item"
          >
            {/* School and Location */}
            <div className="flex justify-between items-baseline gap-4">
              <div className="flex gap-1 min-w-0 flex-1">
                <EditableText
                  value={item.school}
                  onChange={(val) =>
                    updateSectionItem(section.id, item.id, { school: val })
                  }
                  className="font-semibold"
                  placeholder="School Name"
                />
                {canDelete && (
                  <DeleteButton
                    onDelete={() => removeSectionItem(section.id, item.id)}
                    itemName="section item"
                    className="md:opacity-0 md:group-hover/item:opacity-100 transition-opacity"
                  />
                )}
              </div>
              <div className="shrink-0">
                <EditableText
                  value={item.location}
                  onChange={(val) =>
                    updateSectionItem(section.id, item.id, { location: val })
                  }
                  className="text-muted-foreground text-right"
                  style={{ fontSize: "0.9em" }}
                  placeholder="City, Country"
                />
              </div>
            </div>
            {/* Degree and Dates */}
            <div className="flex justify-between items-baseline gap-4">
              <EditableText
                value={item.degree}
                onChange={(val) =>
                  updateSectionItem(section.id, item.id, { degree: val })
                }
                className="font-medium"
                style={{ fontSize: "0.9em" }}
                placeholder="Degree"
              />
              <DateRangePicker
                startDate={item.startDate}
                endDate={item.endDate}
                onStartDateChange={(val) =>
                  updateSectionItem(section.id, item.id, { startDate: val })
                }
                onEndDateChange={(val) =>
                  updateSectionItem(section.id, item.id, { endDate: val })
                }
                onDelete={() =>
                  updateSectionItem(section.id, item.id, {
                    startDate: undefined,
                    endDate: undefined,
                  })
                }
              />
            </div>
            {/* Description */}
            <EditableText
              value={item.description || ""}
              onChange={(val) =>
                updateSectionItem(section.id, item.id, { description: val })
              }
              className="whitespace-pre-line mt-1"
              placeholder="Relevant coursework: ..."
              multiline
            />
          </DraggableItem>
        ))}
      </SortableItemList>
    </div>
  );
}