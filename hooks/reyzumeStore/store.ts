import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { temporal, TemporalState } from "zundo";
import { shallow } from "zustand/shallow";
import { useStore } from "zustand";

import { generateId, sanitizeSectionContent } from "./helpers";
import {
  getDefaultSections,
  getSectionDefaultContent,
  getSectionDefaultItem,
} from "./defaults";
import { ReyzumeState, ReyzumeStore, Section, SectionContent } from "./types";

export const useReyzumeStore = create<ReyzumeStore>()(
  devtools(
    temporal(
      (set, get) => ({
        // Initial state
        currentReyzumeId: null,
        sections: getDefaultSections(),
        isLoading: true,
        isDirty: false,
        isSaving: false,

        // Actions
        setCurrentReyzumeId: (id) => set({ currentReyzumeId: id }),
        setIsLoading: (loading) => set({ isLoading: loading }),
        setIsSaving: (saving) => set({ isSaving: saving }),
        markClean: () => set({ isDirty: false }),

        loadSections: (content) => {
          // Pause tracking during load
          useReyzumeStore.temporal.getState().pause();
          if (content) {
            try {
              const parsed = JSON.parse(content) as Section[];
              set({ sections: parsed, isLoading: false, isDirty: false });
            } catch (e) {
              console.error("Failed to parse resume content:", e);
              set({
                sections: getDefaultSections(),
                isLoading: false,
                isDirty: false,
              });
            }
          } else {
            set({
              sections: getDefaultSections(),
              isLoading: false,
              isDirty: false,
            });
          }
          // Clear history and resume
          useReyzumeStore.temporal.getState().clear();
          useReyzumeStore.temporal.getState().resume();
        },

        getSectionsAsJson: () => {
          // return JSON.stringify(get().sections);
          const sections = get().sections;
          // Sanitize HTML content (strip trailing empty paragraphs from lists)
          const sanitizedSections = sections.map((section) => ({
            ...section,
            content: sanitizeSectionContent(section.content),
          }));
          return JSON.stringify(sanitizedSections);
        },

        // ✅ TRACKED: Add section
        addSection: (type) =>
          set((state) => ({
            sections: [
              ...state.sections,
              {
                id: generateId(),
                type,
                order: state.sections.length,
                isVisible: true,
                content: getSectionDefaultContent(type),
              },
            ],
            isDirty: true,
          })),

        // ✅ TRACKED: Remove section
        removeSection: (sectionId) =>
          set((state) => ({
            sections: state.sections.filter((s) => s.id !== sectionId),
            isDirty: true,
          })),

        // ❌ NOT TRACKED: Update section content (text editing)
        updateSection: (sectionId, content) => {
          useReyzumeStore.temporal.getState().pause();
          set((state) => ({
            sections: state.sections.map((s) =>
              s.id === sectionId
                ? {
                    ...s,
                    content: { ...s.content, ...content } as SectionContent,
                  }
                : s
            ),
            isDirty: true,
          }));
          useReyzumeStore.temporal.getState().resume();
        },

        // ✅ TRACKED: Reorder sections
        reorderSections: (newSections: Section[]) =>
          set((state) => {
            const hiddenSections = state.sections.filter((s) => !s.isVisible);
            const allSections = [...newSections, ...hiddenSections];
            return {
              sections: allSections,
              isDirty: true,
            };
          }),

        // ✅ TRACKED: Toggle visibility
        toggleSectionVisibility: (sectionId) =>
          set((state) => ({
            sections: state.sections.map((s) =>
              s.id === sectionId ? { ...s, isVisible: !s.isVisible } : s
            ),
            isDirty: true,
          })),

        // ✅ TRACKED: Add item
        addSectionItem: (sectionId) =>
          set((state) => ({
            sections: state.sections.map((section) => {
              if (section.id !== sectionId) return section;

              const newItem = getSectionDefaultItem(section.type);
              const sectionContent = section.content as { items: unknown[] };
              return {
                ...section,
                content: {
                  ...sectionContent,
                  items: [...(sectionContent.items || []), newItem],
                } as SectionContent,
              };
            }),
            isDirty: true,
          })),

        // ❌ NOT TRACKED: Update item content (text editing)
        updateSectionItem: (sectionId, itemId, content) => {
          useReyzumeStore.temporal.getState().pause();
          set((state) => ({
            sections: state.sections.map((s) => {
              if (s.id !== sectionId) return s;

              const sectionContent = s.content as { items: { id: string }[] };
              if (!sectionContent.items) return s;

              return {
                ...s,
                content: {
                  ...sectionContent,
                  items: sectionContent.items.map((item) =>
                    item.id === itemId ? { ...item, ...content } : item
                  ),
                } as SectionContent,
              };
            }),
            isDirty: true,
          }));
          useReyzumeStore.temporal.getState().resume();
        },

        // ✅ TRACKED: Remove item
        removeSectionItem: (sectionId, itemId) =>
          set((state) => ({
            sections: state.sections.map((s) => {
              if (s.id !== sectionId) return s;

              const sectionContent = s.content as { items: { id: string }[] };
              if (!sectionContent.items) return s;

              return {
                ...s,
                content: {
                  ...sectionContent,
                  items: sectionContent.items.filter(
                    (item) => item.id !== itemId
                  ),
                } as SectionContent,
              };
            }),
            isDirty: true,
          })),

        // ✅ TRACKED: Reorder items
        reorderSectionItems: (sectionId, newItems) =>
          set((state) => ({
            sections: state.sections.map((s) => {
              if (s.id !== sectionId) return s;

              const sectionContent = s.content as { items: { id: string }[] };
              if (!sectionContent.items) return s;

              return {
                ...s,
                content: {
                  ...sectionContent,
                  items: newItems,
                } as SectionContent,
              };
            }),
            isDirty: true,
          })),
      }),
      {
        partialize: (state) => ({
          sections: state.sections,
        }),
        equality: (
          pastState: Pick<ReyzumeState, "sections">,
          currentState: Pick<ReyzumeState, "sections">
        ) => shallow(pastState, currentState),
        limit: 100,
      }
    ),
    { name: "ReyzumeStore" }
  )
);

// Hook to access undo/redo temporal store
export const useTemporalStore = <T>(
  selector: (state: TemporalState<Pick<ReyzumeState, "sections">>) => T
  // equality?: (a: T, b: T) => boolean
) => useStore(useReyzumeStore.temporal, selector);
