"use client";

import {
  Section,
  SkillsContent,
  useReyzumeStore,
} from "@/hooks/useReyzumeStore";
import { EditableText } from "../shared/EditableText";
import { SectionHeader } from "../shared/SectionHeader";
import { DeleteButton } from "../shared/DeleteButton";
import { SortableItemList } from "../draggable/SortableItemList";
import { DraggableItem } from "../draggable/DraggableItem";

interface SkillsSectionProps {
  section: Section;
}

export function SkillsSection({ section }: SkillsSectionProps) {
  const content = section.content as SkillsContent;

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
        title="Skills & Interests"
        onAdd={() => addSectionItem(section.id)}
      />
      <SortableItemList
        items={content.items}
        onReorder={(items) => reorderSectionItems(section.id, items)}
        className="space-y-2"
      >
        {content.items?.map((category) => (
          <DraggableItem
            key={category.id}
            id={category.id}
            className="flex gap-2"
          >
            <div className="flex justify-center items-baseline w-1/4 flex-1">
              <EditableText
                value={category.label}
                onChange={(val) =>
                  updateSectionItem(section.id, category.id, { label: val })
                }
                className="font-semibold whitespace-pre-line w-full"
                placeholder="Skills"
                maxLength={50}
              />
              <span className="font-semibold ml-1">:</span>
            </div>
            <EditableText
              value={category.skills || ""}
              onChange={(val) =>
                updateSectionItem(section.id, category.id, { skills: val })
              }
              className="whitespace-pre-line"
              placeholder="Microsoft Office (Excel, Word, PowerPoint), JavaScript, React"
              multiline
            />
            {canDelete && (
              <DeleteButton
                onDelete={() => removeSectionItem(section.id, category.id)}
                itemName="entry"
                className="md:opacity-0 md:group-hover/item:opacity-100 transition-opacity"
              />
            )}
          </DraggableItem>
        ))}
      </SortableItemList>
    </div>
  );
}