import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function StatisticsLoading() {
  return (
    <div className="container py-24 space-y-12">
      {/* Heading */}
      <div className="space-y-3 text-center">
        <Skeleton className="h-10 w-72 mx-auto" />
        <Skeleton className="h-5 w-96 mx-auto opacity-60" />
      </div>

      {/* Stat cards row */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className="border-border/50 bg-card/30">
            <CardContent className="flex flex-col items-center gap-2 p-4">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-4 w-24 opacity-60" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chart area */}
      <Card className="border-border/50 bg-card/30">
        <CardContent className="p-6 space-y-4">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-48 w-full opacity-40" />
        </CardContent>
      </Card>

      {/* Heatmap area */}
      <Card className="border-border/50 bg-card/30">
        <CardContent className="p-6 space-y-4">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-32 w-full opacity-40" />
        </CardContent>
      </Card>
    </div>
  );
}
