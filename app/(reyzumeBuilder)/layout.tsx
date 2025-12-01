import { EditorProvider } from "@/components/providers/EditorContext";
import { LinkBubble } from "./_components/shared/LinkBubble";

export default function LayoutReyzumes({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <EditorProvider>
      <div className="relative min-h-screen w-full px-3 sm:px-8 lg:px-12 py-5 flex flex-col">
        {/* <div className="relative min-h-screen w-full px-3 sm:px-8 flex flex-col"> */}
        <main className=" h-full">{children}</main>
        <LinkBubble />
      </div>
    </EditorProvider>
  );
}
