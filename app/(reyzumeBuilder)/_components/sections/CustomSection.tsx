"use client";

import { useState } from "react";
import {
  Section,
  CustomContent,
  useReyzumeStore,
} from "@/hooks/useReyzumeStore";
import { EditableText } from "../shared/EditableText";
import { SectionHeader } from "../shared/SectionHeader";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { MonthYearPicker } from "../shared/MonthYearPicker";
import { DeleteButton } from "../shared/DeleteButton";
import { SortableItemList } from "../draggable/SortableItemList";
import { DraggableItem } from "../draggable/DraggableItem";

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

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState(content.title);

  const canDelete = content.items.length > 1;

  const handleTitleSave = () => {
    updateSection(section.id, { title });
    setIsEditingTitle(false);
  };

  return (
    <div>
      <SectionHeader onAdd={() => addSectionItem(section.id)}>
        <div className="flex items-center gap-2 group/title">
          {isEditingTitle ? (
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-lg font-semibold bg-transparent outline-none border-b border-primary"
              autoFocus
              onBlur={handleTitleSave}
              onKeyDown={(e) => e.key === "Enter" && handleTitleSave()}
            />
          ) : (
            <>
              <h2 className="text-lg font-semibold">{content.title}</h2>
              <Button
                variant="ghost"
                size="sm"
                className="h-5 w-5 p-0 opacity-0 group-hover/title:opacity-100 transition-opacity"
                onClick={() => setIsEditingTitle(true)}
              >
                <Pencil className="h-3 w-3" />
              </Button>
            </>
          )}
        </div>
      </SectionHeader>
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
            {/* Title and Dates */}
            <div className="flex justify-between items-baseline gap-4">
              <div className="flex gap-1">
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
                    className="opacity-0 group-hover/item:opacity-100 transition-opacity"
                  />
                )}
              </div>
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
            {/* Subtitle */}
            <EditableText
              value={item.subtitle || ""}
              onChange={(val) =>
                updateSectionItem(section.id, item.id, { subtitle: val })
              }
              className="text-sm font-medium text-muted-foreground"
              placeholder="Subtitle"
            />
            {/* Description */}
            <EditableText
              value={item.description || ""}
              onChange={(val) =>
                updateSectionItem(section.id, item.id, { description: val })
              }
              className="text-sm whitespace-pre-line mt-1"
              placeholder="Description..."
              multiline
            />
          </DraggableItem>
        ))}
      </SortableItemList>
    </div>
  );
}