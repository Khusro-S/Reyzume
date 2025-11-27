"use client";

import { Section } from "@/hooks/useReyzumeStore";
import { HeaderSection } from "../sections/HeaderSection";
import { SummarySection } from "../sections/SummarySection";
import { ExperienceSection } from "../sections/ExperienceSection";
import { EducationSection } from "../sections/EducationSection";
import { SkillsSection } from "../sections/SkillsSection";
import { ProjectsSection } from "../sections/ProjectsSection";
import { CertificationsSection } from "../sections/CertificationsSection";
import { CustomSection } from "../sections/CustomSection";

interface SectionContentProps {
  section: Section;
}

export function SectionContent({ section }: SectionContentProps) {
  return (
    <>
      {section.type === "header" && <HeaderSection section={section} />}
      {section.type === "summary" && <SummarySection section={section} />}
      {section.type === "experience" && <ExperienceSection section={section} />}
      {section.type === "education" && <EducationSection section={section} />}
      {section.type === "skills" && <SkillsSection section={section} />}
      {section.type === "projects" && <ProjectsSection section={section} />}
      {section.type === "certifications" && (
        <CertificationsSection section={section} />
      )}
      {section.type === "custom" && <CustomSection section={section} />}
    </>
  );
}
