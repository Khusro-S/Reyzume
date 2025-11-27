import { useMemo } from "react";
import { SectionType, useReyzumeStore } from "./useReyzumeStore";

export function useReyzumeSections() {
  const sections = useReyzumeStore((state) => state.sections);
  const addSection = useReyzumeStore((state) => state.addSection);
  const removeSection = useReyzumeStore((state) => state.removeSection);
  const updateSection = useReyzumeStore((state) => state.updateSection);
  const reorderSections = useReyzumeStore((state) => state.reorderSections);
  const toggleVisibility = useReyzumeStore(
    (state) => state.toggleSectionVisibility
  );

  // Get visible sections sorted by order
  const visibleSections = useMemo(
    () => sections.filter((s) => s.isVisible).sort((a, b) => a.order - b.order),
    [sections]
  );

  // Get section by id
  const getSectionById = (id: string) => sections.find((s) => s.id === id);

  // Check if section type already exists (for single-instance sections like header)
  const hasSectionType = (type: SectionType) =>
    sections.some((s) => s.type === type);

  return {
    sections,
    visibleSections,
    addSection,
    removeSection,
    updateSection,
    reorderSections,
    toggleVisibility,
    getSectionById,
    hasSectionType,
  };
}
