import { generateId } from "./helpers";
import {
  CertificationItem,
  CertificationsContent,
  CustomContent,
  CustomItem,
  EducationContent,
  EducationItem,
  ExperienceContent,
  ExperienceItem,
  HeaderContent,
  ProjectItem,
  ProjectsContent,
  Section,
  SectionContent,
  SectionType,
  SkillItem,
  SkillsContent,
  SummaryContent,
} from "./types";

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

export function getSectionDefaultContent(type: SectionType): SectionContent {
  switch (type) {
    case "header":
      return {
        name: "",
        contactInfo: "",
        links: [],
      } as HeaderContent;
    case "summary":
      return {
        text: "",
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

export function getSectionDefaultItem(type: SectionType) {
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
