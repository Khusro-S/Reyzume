import { Id } from "@/convex/_generated/dataModel";

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
  contactInfo: string;
}

export interface SummaryContent {
  text: string;
}

export interface ExperienceItem {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate?: string;
  endDate?: string;
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
  startDate?: string;
  endDate?: string;
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
  date?: string;
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

export interface ReyzumeState {
  currentReyzumeId: Id<"reyzumes"> | null;
  sections: Section[];
  isLoading: boolean;
  isDirty: boolean;
  isSaving: boolean;
}

export interface ReyzumeActions {
  // Actions
  setCurrentReyzumeId: (id: Id<"reyzumes"> | null) => void;
  loadSections: (content: string | undefined) => void;
  getSectionsAsJson: () => string;
  setIsLoading: (loading: boolean) => void;
  markClean: () => void;
  setIsSaving: (saving: boolean) => void;

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

export type ReyzumeStore = ReyzumeState & ReyzumeActions;
