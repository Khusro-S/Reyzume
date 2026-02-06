"use client";

import {
  Section,
  CertificationsContent,
  useReyzumeStore,
} from "@/hooks/useReyzumeStore";
import { EditableText } from "../shared/EditableText";
import { SectionHeader } from "../shared/SectionHeader";
import { DeleteButton } from "../shared/DeleteButton";
import { SortableItemList } from "../draggable/SortableItemList";
import { DraggableItem } from "../draggable/DraggableItem";
import { SingleDatePicker } from "../shared/SingleDatePicker";

interface CertificationsSectionProps {
  section: Section;
}

export function CertificationsSection({ section }: CertificationsSectionProps) {
  const content = section.content as CertificationsContent;

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
        className="space-y-3"
      >
        {content.items.map((item) => (
          <DraggableItem
            key={item.id}
            id={item.id}
            className="flex justify-between items-baseline gap-4 group/item"
          >
            <div className="flex-1 space-y-0.5">
              <div className="flex gap-1 flex-1 min-w-0">
                <EditableText
                  value={item.name}
                  onChange={(val) =>
                    updateSectionItem(section.id, item.id, { name: val })
                  }
                  className="font-semibold"
                  placeholder="Certification Name"
                />
                {canDelete && (
                  <DeleteButton
                    onDelete={() => removeSectionItem(section.id, item.id)}
                    itemName="section item"
                    className="md:opacity-0 md:group-hover/item:opacity-100 transition-opacity"
                  />
                )}
              </div>
              <EditableText
                value={item.issuer}
                onChange={(val) =>
                  updateSectionItem(section.id, item.id, { issuer: val })
                }
                className="text-muted-foreground"
                placeholder="Issuer"
              />
            </div>
            {/* <EditableText
              value={item.date}
              onChange={(val) =>
                updateSectionItem(section.id, item.id, { date: val })
              }
              className="text-sm text-muted-foreground w-20 text-right"
              placeholder="MM/YYYY"
            /> */}
            <SingleDatePicker
              date={item.date}
              onChange={(val) =>
                updateSectionItem(section.id, item.id, { date: val })
              }
              onDelete={() =>
                updateSectionItem(section.id, item.id, { date: undefined })
              }
              placeholder="Issued Date"
            />
          </DraggableItem>
        ))}
      </SortableItemList>
    </div>
  );
}