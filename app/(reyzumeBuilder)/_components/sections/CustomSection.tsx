"use client";

import {
  Section,
  CustomContent,
  useReyzumeStore,
} from "@/hooks/useReyzumeStore";
import { EditableText } from "../shared/EditableText";
import { SectionHeader } from "../shared/SectionHeader";
import { DeleteButton } from "../shared/DeleteButton";
import { SortableItemList } from "../draggable/SortableItemList";
import { DraggableItem } from "../draggable/DraggableItem";
import { ItemFlow, SectionFlow } from "../shared/LayoutTiers";
import { DateRangePicker } from "../shared/DateRangePicker";

interface CustomSectionProps {
  section: Section;
}

export function CustomSection({ section }: CustomSectionProps) {
  const content = section.content as CustomContent;
  const addSectionItem = useReyzumeStore((state) => state.addSectionItem);
  const updateSection = useReyzumeStore((state) => state.updateSection);
  const updateSectionItem = useReyzumeStore((state) => state.updateSectionItem);
  const removeSectionItem = useReyzumeStore((state) => state.removeSectionItem);
  const reorderSectionItems = useReyzumeStore(
    (state) => state.reorderSectionItems
  );

  const canDelete = content.items.length > 1;

  return (
    <SectionFlow>
      <SectionHeader
        title={content.title}
        onAdd={() => addSectionItem(section.id)}
      >
        {/* <div className="flex items-center gap-2 group/title"> */}
        <div className="shrink-0">
          <EditableText
            value={content.title}
            onChange={(val) => updateSection(section.id, { title: val })}
            className="font-bold"
            selectAllOnFocus
            placeholder="Custom Title"
            maxLength={40}
          />
        </div>
      </SectionHeader>
      <SortableItemList
        items={content.items}
        onReorder={(items) => reorderSectionItems(section.id, items)}
      >
        {content.items.map((item) => (
          <DraggableItem key={item.id} id={item.id} className="group/item">
            <ItemFlow>
              {/* Title and Dates */}
              <div className="flex justify-between items-center gap-4">
                <div className="flex gap-1 min-w-0 flex-1">
                  <EditableText
                    value={item.title}
                    onChange={(val) =>
                      updateSectionItem(section.id, item.id, { title: val })
                    }
                    className="font-semibold"
                    placeholder="Title"
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
              {/* Subtitle */}
              <EditableText
                value={item.subtitle || ""}
                onChange={(val) =>
                  updateSectionItem(section.id, item.id, { subtitle: val })
                }
                className="font-medium text-muted-foreground"
                placeholder="Subtitle"
              />
              {/* Description */}
              <EditableText
                value={item.description || ""}
                onChange={(val) =>
                  updateSectionItem(section.id, item.id, { description: val })
                }
                className="whitespace-pre-line"
                placeholder="Description..."
                multiline
              />
            </ItemFlow>
          </DraggableItem>
        ))}
      </SortableItemList>
    </SectionFlow>
  );
}