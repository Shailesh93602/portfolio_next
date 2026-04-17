import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function BlogsLoading() {
  return (
    <div className="container py-24 space-y-10">
      {/* Heading */}
      <div className="space-y-3 text-center">
        <Skeleton className="h-10 w-48 mx-auto" />
        <Skeleton className="h-5 w-80 mx-auto opacity-60" />
      </div>

      {/* Search + filter row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <Skeleton className="h-10 w-full sm:w-72" />
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-20 rounded-full opacity-50" />
          ))}
        </div>
      </div>

      {/* Blog card grid */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="border-border/50 bg-card/30 overflow-hidden">
            <Skeleton className="h-48 w-full opacity-30" />
            <CardContent className="space-y-3 p-5">
              <div className="flex gap-2">
                <Skeleton className="h-5 w-16 rounded-full opacity-50" />
                <Skeleton className="h-5 w-20 rounded-full opacity-50" />
              </div>
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-4 w-[90%] opacity-60" />
              <Skeleton className="h-4 w-[75%] opacity-60" />
              <div className="flex items-center justify-between pt-2">
                <Skeleton className="h-4 w-24 opacity-50" />
                <Skeleton className="h-4 w-16 opacity-50" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
