"use client";

import {
  Section,
  ProjectsContent,
  useReyzumeStore,
} from "@/hooks/useReyzumeStore";
import { EditableText } from "../shared/EditableText";
import { SectionHeader } from "../shared/SectionHeader";
import { DeleteButton } from "../shared/DeleteButton";
import { SortableItemList } from "../draggable/SortableItemList";
import { DraggableItem } from "../draggable/DraggableItem";
import { DateRangePicker } from "../shared/DateRangePicker";

interface ProjectsSectionProps {
  section: Section;
}

export function ProjectsSection({ section }: ProjectsSectionProps) {
  const content = section.content as ProjectsContent;

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
        title={content.title}
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
            {/* Project Name and Dates */}
            <div className="flex justify-between items-baseline gap-4">
              <div className="flex gap-1 min-w-0 flex-1">
                <EditableText
                  value={item.name}
                  onChange={(val) =>
                    updateSectionItem(section.id, item.id, { name: val })
                  }
                  className="font-semibold"
                  placeholder="Project Name"
                />
                {canDelete && (
                  <DeleteButton
                    onDelete={() => removeSectionItem(section.id, item.id)}
                    itemName="section item"
                    className="md:opacity-0 md:group-hover/item:opacity-100 transition-opacity"
                  />
                )}
              </div>
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
            {/* URL */}
            <EditableText
              value={item.url || ""}
              onChange={(val) =>
                updateSectionItem(section.id, item.id, { url: val })
              }
              // className="text-blue-600 hover:underline"
              // style={{}}
              // placeholder="https://project-url.com"
              placeholder="Subtitle/Link"
            />
            {/* Description */}
            <EditableText
              value={item.description}
              onChange={(val) =>
                updateSectionItem(section.id, item.id, { description: val })
              }
              className="whitespace-pre-line mt-1"
              placeholder="Project description..."
              multiline
            />
          </DraggableItem>
        ))}
      </SortableItemList>
    </div>
  );
}