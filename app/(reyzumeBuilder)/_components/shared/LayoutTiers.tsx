import { forwardRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface LayoutFlowProps {
  children: ReactNode;
  className?: string;
}

export const ResumeFlow = forwardRef<HTMLDivElement, LayoutFlowProps>(
  ({ children, className }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex flex-col", className)}
        style={{ gap: "var(--resume-section-gap, 0.6em)" }}
      >
        {children}
      </div>
    );
  },
);
ResumeFlow.displayName = "ResumeFlow";

export const SectionFlow = forwardRef<HTMLDivElement, LayoutFlowProps>(
  ({ children, className }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex flex-col", className)}
        style={{ gap: "var(--resume-item-gap, 0.4em)" }}
      >
        {children}
      </div>
    );
  },
);
SectionFlow.displayName = "SectionFlow";

export const ItemFlow = forwardRef<HTMLDivElement, LayoutFlowProps>(
  ({ children, className }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex flex-col", className)}
        style={{ gap: "var(--resume-block-gap, 0.1em)" }}
      >
        {children}
      </div>
    );
  },
);
ItemFlow.displayName = "ItemFlow";
