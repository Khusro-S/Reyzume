import { Id } from "@/convex/_generated/dataModel";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

export type SectionType =
  | "header"
  | "summary"
  | "experience"
  | "education"
  | "skills"
  | "projects"
  | "custom"
  | "certifications";

export interface HeaderContent {
  name: string;
  // title?: string;
  // email?: string;
  // phone?: string;
  // location?: string;
  contactInfo: string;
  // links?: { label: string; url: string }[];
}

export interface SummaryContent {
  text: string;
}

export interface ExperienceItem {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface ExperienceContent {
  items: ExperienceItem[];
}

export interface EducationItem {
  id: string;
  degree: string;
  school: string;
  location: string;
  startDate: string;
  graduationDate: string;
  current: boolean;
  description?: string;
}

export interface EducationContent {
  items: EducationItem[];
}

export interface SkillItem {
  id: string;
  label: string;
  skills: string;
}

export interface SkillsContent {
  items: SkillItem[];
}

export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  url?: string;
  startDate?: string;
  endDate?: string;
}

export interface ProjectsContent {
  items: ProjectItem[];
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  date: string;
  url?: string;
}

export interface CertificationsContent {
  items: CertificationItem[];
}

export interface CustomItem {
  id: string;
  title: string;
  subtitle?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
}

export interface CustomContent {
  title: string;
  items: CustomItem[];
}

export type SectionContent =
  | HeaderContent
  | SummaryContent
  | ExperienceContent
  | EducationContent
  | SkillsContent
  | ProjectsContent
  | CertificationsContent
  | CustomContent;

export interface Section {
  id: string;
  type: SectionType;
  order: number;
  isVisible: boolean;
  content: SectionContent;
}

interface ReyzumeStore {
  currentReyzumeId: Id<"reyzumes"> | null;

  sections: Section[];

  isLoading: boolean;

  // Dirty state (unsaved changes)
  isDirty: boolean;

  // Actions
  setCurrentReyzumeId: (id: Id<"reyzumes"> | null) => void;
  loadSections: (content: string | undefined) => void;
  getSectionsAsJson: () => string;
  setIsLoading: (loading: boolean) => void;
  markClean: () => void; // for updating isDirty (indicating there are no unsaved changes)

  // Section CRUD
  addSection: (type: SectionType) => void;
  removeSection: (id: string) => void;
  updateSection: (id: string, content: Partial<Section["content"]>) => void;
  toggleSectionVisibility: (id: string) => void;
  reorderSections: (sections: Section[]) => void;

  // Item CRUD within sections
  addSectionItem: (sectionId: string) => void;
  removeSectionItem: (sectionId: string, itemId: string) => void;
  updateSectionItem: (
    sectionId: string,
    itemId: string,
    content: Record<string, unknown>
  ) => void;
  reorderSectionItems: (sectionId: string, items: { id: string }[]) => void;
}
// Helper to generate IDs that works in non-secure contexts (like mobile dev)
function generateId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for dev environments without HTTPS
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}
export const useReyzumeStore = create<ReyzumeStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      currentReyzumeId: null,
      isLoading: true,
      isDirty: false,

      // Actions
      setCurrentReyzumeId: (id) => set({ currentReyzumeId: id }),

      setIsLoading: (loading) => set({ isLoading: loading }),

      markClean: () => set({ isDirty: false }),

      loadSections: (content) => {
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
            isDirty: true,
          });
        }
      },

      getSectionsAsJson: () => {
        return JSON.stringify(get().sections);
      },

      sections: [
        {
          id: "header-1",
          type: "header",
          order: 0,
          isVisible: true,
          content: {
            name: "",
            // title: "Your Title",
            // email: "email@example.com",
            // phone: "(555) 123-4567",
            // location: "City, Country",
            contactInfo: "",
            // contactInfo: "email@example.com | (555) 123-4567 | City, Country",
            links: [],
          } as HeaderContent,
        },
        {
          id: "summary-1",
          type: "summary",
          order: 1,
          isVisible: true,
          content: {
            text: "",
            // text: "Experienced professional with a strong background in...",
          } as SummaryContent,
        },
        {
          id: "experience-1",
          type: "experience",
          order: 2,
          isVisible: true,
          content: {
            items: [
              {
                id: generateId(),
                title: "",
                company: "",
                location: "",
                startDate: "",
                endDate: "",
                current: false,
                description: "",
                // "• Achieved X by doing Y\n• Led a team of Z people",
              },
            ],
          } as ExperienceContent,
        },
        {
          id: "projects-1",
          type: "projects",
          order: 3,
          isVisible: true,
          content: {
            items: [
              {
                id: generateId(),
                name: "",
                description: "",
                url: "",
                startDate: "",
                endDate: "",
              },
            ],
          } as ProjectsContent,
        },
        {
          id: "skills-1",
          type: "skills",
          order: 4,
          isVisible: true,
          content: {
            items: [
              {
                id: generateId(),
                label: "",
                skills: "",
              },
              {
                id: generateId(),
                label: "",
                skills: "",
              },
            ],
          } as SkillsContent,
        },
        {
          id: "custom-1",
          type: "custom",
          order: 5,
          isVisible: true,
          content: {
            title: "Custom section",
            items: [
              {
                id: generateId(),
                title: "",
                subtitle: "",
                startDate: "",
                endDate: "",
                description: "",
              },
            ],
          } as CustomContent,
        },
      ],

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

      removeSection: (sectionId) =>
        set((state) => ({
          sections: state.sections.filter((s) => s.id !== sectionId),
          isDirty: true,
        })),

      updateSection: (sectionId, content) =>
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
        })),

      reorderSections: (newSections: Section[]) =>
        set((state) => {
          // Merge reordered visible sections with hidden sections
          const hiddenSections = state.sections.filter((s) => !s.isVisible);
          const allSections = [...newSections, ...hiddenSections];

          return {
            sections: allSections,
            isDirty: true,
          };
        }),

      toggleSectionVisibility: (sectionId) =>
        set((state) => ({
          sections: state.sections.map((s) =>
            s.id === sectionId ? { ...s, isVisible: !s.isVisible } : s
          ),
          isDirty: true,
        })),

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

      updateSectionItem: (sectionId, itemId, content) =>
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
        })),

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

    { name: "ReyzumeStore" }
  )
);
// Default sections for a new resume
export function getDefaultSections(): Section[] {
  return [
    {
      id: "header-1",
      type: "header",
      order: 0,
      isVisible: true,
      content: getSectionDefaultContent("header"),
    },
    {
      id: "summary-1",
      type: "summary",
      order: 1,
      isVisible: true,
      content: getSectionDefaultContent("summary"),
    },
    {
      id: "experience-1",
      type: "experience",
      order: 2,
      isVisible: true,
      content: getSectionDefaultContent("experience"),
    },
    {
      id: "projects-1",
      type: "projects",
      order: 3,
      isVisible: true,
      content: getSectionDefaultContent("projects"),
    },
    {
      id: "education-1",
      type: "education",
      order: 4,
      isVisible: true,
      content: getSectionDefaultContent("education"),
    },
    {
      id: "skills-1",
      type: "skills",
      order: 5,
      isVisible: true,
      content: getSectionDefaultContent("skills"),
    },
  ];
}
// Helper function for default content
function getSectionDefaultContent(type: SectionType): SectionContent {
  switch (type) {
    case "header":
      return {
        name: "",
        // title: "Your Title",
        // email: "email@example.com",
        // phone: "(555) 123-4567",
        // location: "City",
        contactInfo: "",
        links: [],
      } as HeaderContent;
    case "summary":
      return {
        text: "Experienced professional with a strong background in...",
      } as SummaryContent;
    case "experience":
      return {
        items: [getSectionDefaultItem("experience") as ExperienceItem],
      } as ExperienceContent;
    case "education":
      return {
        items: [getSectionDefaultItem("education") as EducationItem],
      } as EducationContent;
    case "skills":
      return {
        items: [getSectionDefaultItem("skills") as SkillItem],
      } as SkillsContent;
    case "projects":
      return {
        items: [getSectionDefaultItem("projects") as ProjectItem],
      } as ProjectsContent;
    case "certifications":
      return {
        items: [getSectionDefaultItem("certifications") as CertificationItem],
      } as CertificationsContent;
    case "custom":
      return {
        title: "Custom Section",
        items: [getSectionDefaultItem("custom") as CustomItem],
      } as CustomContent;
    default:
      return {} as SectionContent;
  }
}

function getSectionDefaultItem(type: SectionType) {
  switch (type) {
    case "experience":
      return {
        id: generateId(),
        title: "",
        company: "",
        location: "",
        startDate: "",
        endDate: "",
        current: false,
        description: "",
      };
    case "education":
      return {
        id: generateId(),
        degree: "",
        school: "",
        location: "",
        startDate: "",
        graduationDate: "",
        current: false,
        description: "",
      };
    case "skills":
      return {
        id: generateId(),
        label: "Skills",
        skills: "",
      };
    case "projects":
      return {
        id: generateId(),
        name: "",
        description: "",
        url: "",
        startDate: "",
        endDate: "",
      };
    case "certifications":
      return {
        id: generateId(),
        name: "",
        issuer: "",
        date: "",
      };
    case "custom":
      return {
        id: generateId(),
        title: "",
        subtitle: "",
        startDate: "",
        endDate: "",
        description: "",
      };
    default:
      return { id: generateId() };
  }
}
