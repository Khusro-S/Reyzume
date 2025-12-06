"use client";

import {
  Section,
  ExperienceContent,
  useReyzumeStore,
} from "@/hooks/useReyzumeStore";
import { EditableText } from "../shared/EditableText";
import { SectionHeader } from "../shared/SectionHeader";
import { DeleteButton } from "../shared/DeleteButton";
import { SortableItemList } from "../draggable/SortableItemList";
import { DraggableItem } from "../draggable/DraggableItem";
import { DateRangePicker } from "../shared/DateRangePicker";

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
      <SectionHeader
        title="Experience"
        onAdd={() => addSectionItem(section.id)}
      >
        {/* <div className="flex items-center gap-2 group/title"> */}
        {/* <h2 className="font-semibold">Experience</h2> */}
        {/* </div> */}
      </SectionHeader>

      <SortableItemList
        items={content.items}
        onReorder={(items) => reorderSectionItems(section.id, items)}
        className="space-y-4"
      >
        {content.items.map((item) => (
          <DraggableItem key={item.id} id={item.id}>
            {/* company name and Location */}
            <div className="flex justify-between items-center gap-4 m-0">
              <div className="flex gap-1 min-w-0 flex-1">
                <EditableText
                  value={item.title}
                  onChange={(val) =>
                    updateSectionItem(section.id, item.id, { title: val })
                  }
                  className="font-semibold"
                  placeholder="Company Name"
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
                  className="text-right"
                  style={{ fontSize: "0.9em" }}
                  placeholder="City, Country"
                />
              </div>
            </div>
            {/* job title and Dates */}
            <div className="flex justify-between items-center gap-4">
              <div className="min-w-0 flex-1">
                <EditableText
                  value={item.company}
                  onChange={(val) =>
                    updateSectionItem(section.id, item.id, { company: val })
                  }
                  className="font-medium text-muted-foreground"
                  style={{ fontSize: "0.9em" }}
                  placeholder="Job Title"
                  maxLength={79}
                />
              </div>
              <div className="shrink-0">
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
            </div>
            {/* Description */}
            <EditableText
              value={item.description || ""}
              onChange={(val) =>
                updateSectionItem(section.id, item.id, { description: val })
              }
              className="whitespace-pre-line"
              placeholder={`• Achieved X by doing Y\n• Led a team of Z people`}
              multiline
            />
          </DraggableItem>
        ))}
      </SortableItemList>
    </div>
  );
}