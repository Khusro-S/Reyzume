import { Navbar } from "@/app/(landingPage)/_components/Navbar";
import { Skeleton } from "@/components/ui/skeleton";

// Skeleton component for resume cards
function ReyzumeCardSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg px-4 py-5 flex flex-col justify-center items-center gap-3">
      <Skeleton className="h-12 w-12 rounded-lg" />
      <Skeleton className="h-5 w-24" />
      <Skeleton className="h-3 w-20" />
    </div>
  );
}

// Loading skeleton for the entire page
export default function ReyzumesPageSkeleton() {
  return (
    <div className="flex flex-col gap-5 justify-center items-center">
      <Navbar />
      <div className="min-h-screen max-w-6xl px-2 md:px-4 w-full">
        <div className="flex flex-1 flex-col gap-10 bg-background rounded-3xl shadow-lg px-6 py-10 sm:px-8 lg:px-16">
          {/* Header skeleton */}
          <div className="w-full flex justify-between items-center">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>

          {/* Cards grid skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <ReyzumeCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
