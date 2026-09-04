import { Card, Skeleton } from "@heroui/react";

export default function SkeletonContent() {
  return (
    <div className="w-full flex-1 space-y-6">
      {Array.from({ length: 2 }).map((_, index) => (
        <div key={index} className="space-y-4">
          <Skeleton className="h-5 w-30 rounded-lg" />
          <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(20rem,1fr))]">
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i}>
                <div className="flex items-center justify-between gap-2">
                  <Skeleton className="h-4 w-36 rounded-lg" />
                  <Skeleton key={i} className="h-5 w-10 rounded-lg" />
                </div>
                <div className="w-full max-w-md space-y-2">
                  <Skeleton className="h-4 w-full rounded" />
                  <Skeleton className="h-4 w-5/6 rounded" />
                </div>
                <div className="flex justify-end">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 2 }).map((_, i) => (
                      <Skeleton key={i} className="h-5 w-12 rounded-lg" />
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
