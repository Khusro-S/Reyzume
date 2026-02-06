import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

interface EmptyStateProps {
  onCreate: () => void;
  isCreating: boolean;
}

export default function EmptyState({ onCreate, isCreating }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="bg-primary/10 p-4 rounded-full mb-4">
        <FileText className="h-8 w-8 text-primary" />
      </div>
      <h3 className="text-xl font-semibold mb-2">No resumes yet</h3>
      <p className="text-muted-foreground mb-6 max-w-sm">
        Create your first resume to get started building your professional
        profile.
      </p>
      <Button onClick={onCreate} disabled={isCreating}>
        {isCreating ? "Creating..." : "Create New Resume"}
      </Button>
    </div>
  );
}
