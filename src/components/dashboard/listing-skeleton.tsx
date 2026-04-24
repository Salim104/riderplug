import { Skeleton } from "@/components/ui/skeleton"

export function ListingSkeleton() {
  return (
    <div className="flex items-center gap-3 sm:gap-4 py-3 px-4 border-b">
      <Skeleton className="size-14 rounded-md shrink-0" />
      <div className="flex-1 space-y-2 min-w-0">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-3.5 w-24" />
        <Skeleton className="h-3 w-28" />
      </div>
      <Skeleton className="hidden sm:block h-5 w-14 rounded-full" />
      <div className="flex gap-1.5 shrink-0">
        <Skeleton className="h-8 w-16 rounded-md" />
        <Skeleton className="h-8 w-16 rounded-md" />
      </div>
    </div>
  )
}

export function ListingsSkeletonList({ count = 5 }: { count?: number }) {
  return (
    <div>
      {Array.from({ length: count }).map((_, i) => (
        <ListingSkeleton key={i} />
      ))}
    </div>
  )
}
