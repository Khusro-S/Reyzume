"use client";

import {
  Section,
  HeaderContent,
  useReyzumeStore,
} from "@/hooks/useReyzumeStore";
import { EditableText } from "../shared/EditableText";
import { useUser } from "@clerk/nextjs";

interface HeaderSectionProps {
  section: Section;
}

// Simple timezone to location mapping
function getLocationFromTimezone(): string {
  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    // timezone format is usually "Continent/City" e.g., "America/New_York"
    const parts = timezone.split("/");
    if (parts.length >= 2) {
      // Convert "New_York" to "New York"
      const city = parts[parts.length - 1].replace(/_/g, " ");
      return city;
    }
  } catch {
    return "";
  }
  return "";
}

export function HeaderSection({ section }: HeaderSectionProps) {
  const { user } = useUser();

  const content = section.content as HeaderContent;
  const updateSection = useReyzumeStore((state) => state.updateSection);

  const handleChange = (field: keyof HeaderContent, value: string) => {
    updateSection(section.id, { [field]: value });
  };

  const locationFromTimezone = getLocationFromTimezone();

  const displayName = content.name || user?.fullName || "";
  // const displayContactInfo =
  //   content.contactInfo ||
  //   [user?.primaryEmailAddress?.emailAddress, locationFromTimezone]
  //     .filter(Boolean)
  //     .join(" | ") ||
  //   "";

  const displayContactInfo =
    content.contactInfo ||
    [
      user?.primaryEmailAddress?.emailAddress,
      user?.primaryPhoneNumber?.phoneNumber,
      locationFromTimezone,
    ]
      .filter(Boolean)
      .join(" | ") ||
    "";

  return (
    <div className="text-center space-y-1">
      <div className="flex justify-center">
        <EditableText
          value={displayName}
          onChange={(val) => handleChange("name", val)}
          // className="text-2xl md:text-3xl font-bold text-center"
          className="font-bold text-center"
          style={{ fontSize: "1.5em" }}
          placeholder="Your Name"
        />
      </div>
      <div className="flex justify-center">
        <EditableText
          value={displayContactInfo}
          onChange={(val) =>
            handleChange("contactInfo" as keyof HeaderContent, val)
          }
          // className="text-sm text-muted-foreground text-center"
          className="text-muted-foreground text-center"
          style={{ fontSize: "0.85em" }}
          placeholder="email@example.com | (555) 123-4567 | City, Country"
        />
      </div>
    </div>
  );
}
