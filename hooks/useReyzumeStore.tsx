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
  links?: { label: string; url: string }[];
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
  sections: Section[];

  // Actions
  addSection: (type: SectionType) => void;
  removeSection: (id: string) => void;
  addSectionItem: (sectionId: string) => void;
  removeSectionItem: (sectionId: string, itemId: string) => void;
  updateSection: (id: string, content: Partial<Section["content"]>) => void;
  updateSectionItem: (
    sectionId: string,
    itemId: string,
    content: Record<string, unknown>
  ) => void;
  reorderSections: (sections: Section[]) => void;
  toggleSectionVisibility: (id: string) => void;
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
    (set) => ({
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
                startDate: "MM/YYYY",
                endDate: "MM/YYYY",
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
                startDate: "MM/YYYY",
                endDate: "MM/YYYY",
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
                startDate: "MM/YYYY",
                endDate: "MM/YYYY",
                description: "",
              },
            ],
          } as CustomContent,
        },
      ],

      addSection: (type) =>
        set((state) => {
          const maxOrder = Math.max(...state.sections.map((s) => s.order), -1);
          const newSection: Section = {
            // id: crypto.randomUUID(),
            id: generateId(),
            type,
            order: maxOrder + 1,
            isVisible: true,
            content: getSectionDefaultContent(type),
          };
          return { sections: [...state.sections, newSection] };
        }),

      removeSection: (id) =>
        set((state) => ({
          sections: state.sections.filter((s) => s.id !== id),
        })),

      addSectionItem: (sectionId) =>
        set((state) => ({
          sections: state.sections.map((section) => {
            if (section.id !== sectionId) return section;

            const newItem = getSectionDefaultItem(section.type);
            if (!newItem) return section;

            if ("items" in section.content) {
              return {
                ...section,
                content: {
                  ...section.content,
                  items: [...section.content.items, newItem],
                } as SectionContent,
              };
            }
            return section;
          }),
        })),

      removeSectionItem: (sectionId, itemId) =>
        set((state) => ({
          sections: state.sections.map((section) => {
            if (section.id !== sectionId) return section;

            if ("items" in section.content) {
              return {
                ...section,
                content: {
                  ...section.content,
                  items: section.content.items.filter(
                    (
                      item:
                        | ExperienceItem
                        | EducationItem
                        | SkillItem
                        | ProjectItem
                        | CertificationItem
                        | CustomItem
                    ) => item.id !== itemId
                  ),
                } as SectionContent,
              };
            }
            return section;
          }),
        })),

      updateSection: (id, content) =>
        set((state) => ({
          sections: state.sections.map((s) =>
            s.id === id
              ? {
                  ...s,
                  content: { ...s.content, ...content } as SectionContent,
                }
              : s
          ),
        })),

      updateSectionItem: (sectionId, itemId, content) =>
        set((state) => ({
          sections: state.sections.map((s) => {
            if (s.id !== sectionId) return s;
            // Check if content has items array
            if ("items" in s.content && Array.isArray(s.content.items)) {
              return {
                ...s,
                content: {
                  ...s.content,
                  items: s.content.items.map(
                    (
                      item:
                        | ExperienceItem
                        | EducationItem
                        | SkillItem
                        | ProjectItem
                        | CertificationItem
                        | CustomItem
                    ) => (item.id === itemId ? { ...item, ...content } : item)
                  ),
                } as SectionContent,
              };
            }
            return s;
          }),
        })),

      reorderSections: (sections) => set({ sections }),

      toggleSectionVisibility: (id) =>
        set((state) => ({
          sections: state.sections.map((s) =>
            s.id === id ? { ...s, isVisible: !s.isVisible } : s
          ),
        })),
    }),
    { name: "ReyzumeStore" }
  )
);

// Helper function for default content
function getSectionDefaultContent(type: SectionType): SectionContent {
  switch (type) {
    case "header":
      return {
        name: "Your Name",
        // title: "Your Title",
        // email: "email@example.com",
        // phone: "(555) 123-4567",
        // location: "City",
        contactInfo: "email@example.com | (555) 123-4567 | City, Country",
        links: [],
      };
    case "summary":
      return {
        text: "Experienced professional with a strong background in...",
      };
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
      return { text: "" } as SummaryContent;
  }
}

function getSectionDefaultItem(type: SectionType) {
  switch (type) {
    case "experience":
      return {
        id: generateId(),
        title: "Job Title",
        company: "Company Name",
        location: "City, Country",
        startDate: "MM/YYYY",
        endDate: "MM/YYYY",
        current: false,
        description: "• Achieved X by doing Y\n• Led a team of Z people",
      };
    case "education":
      return {
        id: generateId(),
        degree: "",
        school: "",
        location: "",
        startDate: "MM/YYYY",
        graduationDate: "MM/YYYY",
        current: false,
        description: "",
      };
    case "skills":
      return {
        id: generateId(),
        label: "Category",
        skills: "Skill 1, Skill 2, Skill 3",
      };
    case "projects":
      return {
        id: generateId(),
        name: "Project Name",
        description: "Project description...",
        url: "https://project-url.com",
        startDate: "MM/YYYY",
        endDate: "MM/YYYY",
      };
    case "certifications":
      return {
        id: generateId(),
        name: "",
        issuer: "",
        date: "MM/YYYY",
      };
    case "custom":
      return {
        id: generateId(),
        title: "Item Title",
        subtitle: "Subtitle",
        startDate: "MM/YYYY",
        endDate: "MM/YYYY",
        description: "Description...",
      };
    default:
      return null;
  }
}
