import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function LoadingCard() {
  return (
    <Card className="w-[300px] sm:w-[350px] h-[220px] bg-blue-950/10 border-blue-900/50">
      <div className="h-full p-6 flex flex-col gap-4">
        <Skeleton className="h-6 w-2/3" />
        <div className="space-y-3 flex-grow">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
    </Card>
  )
}

export function LoadingCardGrid() {
  return (
    <div className="grid grid-rows-2 grid-flow-col gap-6 px-4">
      {[...Array(4)].map((_, i) => (
        <LoadingCard key={i} />
      ))}
    </div>
  )
} 