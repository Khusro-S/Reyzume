"use client";

import {
  Section,
  ProjectsContent,
  useReyzumeStore,
} from "@/hooks/useReyzumeStore";
import { EditableText } from "../shared/EditableText";
import { SectionHeader } from "../shared/SectionHeader";

interface ProjectsSectionProps {
  section: Section;
}

export function ProjectsSection({ section }: ProjectsSectionProps) {
  const content = section.content as ProjectsContent;

  const addSectionItem = useReyzumeStore((state) => state.addSectionItem);
  const updateSectionItem = useReyzumeStore((state) => state.updateSectionItem);

  return (
    <div>
      <SectionHeader
        title="Projects"
        onAdd={() => addSectionItem(section.id)}
      />
      <div className="space-y-4">
        {content.items.map((item) => (
          <div key={item.id} className="space-y-1">
            {/* Project Name and Dates */}
            <div className="flex justify-between items-baseline gap-4">
              <EditableText
                value={item.name}
                onChange={(val) =>
                  updateSectionItem(section.id, item.id, { name: val })
                }
                className="font-semibold"
                placeholder="Project Name"
              />
              <div className="flex gap-1 shrink-0 text-sm text-muted-foreground whitespace-nowrap">
                <EditableText
                  value={item.startDate || ""}
                  onChange={(val) =>
                    updateSectionItem(section.id, item.id, { startDate: val })
                  }
                  className="w-auto max-w-[70px] text-right text-sm"
                  placeholder="Start Date"
                />
                <span>-</span>
                <EditableText
                  value={item.endDate || ""}
                  onChange={(val) =>
                    updateSectionItem(section.id, item.id, { endDate: val })
                  }
                  className=" w-auto max-w-[70px] text-sm"
                  placeholder="End Date"
                />
              </div>
            </div>
            {/* URL */}
            <EditableText
              value={item.url || ""}
              onChange={(val) =>
                updateSectionItem(section.id, item.id, { url: val })
              }
              className="text-sm text-blue-600 hover:underline"
              placeholder="https://project-url.com"
            />
            {/* Description */}
            <EditableText
              value={item.description}
              onChange={(val) =>
                updateSectionItem(section.id, item.id, { description: val })
              }
              className="text-sm whitespace-pre-line mt-1"
              placeholder="Project description..."
              multiline
            />
          </div>
        ))}
      </div>
    </div>
  );
}
