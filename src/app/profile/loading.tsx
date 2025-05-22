import { Card } from "@/components/ui/card"

export default function ProfileLoading() {
  return (
    <div className="container max-w-6xl py-8 space-y-8">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Avatar & Info */}
        <Card className="p-6 flex-grow bg-blue-950/10 border-blue-900/50">
          <div className="flex gap-6 items-start">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-blue-950/50 animate-pulse" />
            </div>
            <div className="flex-grow space-y-4">
              <div className="flex items-center justify-between">
                <div className="h-8 w-48 bg-blue-950/50 rounded animate-pulse" />
                <div className="h-9 w-32 bg-blue-950/50 rounded animate-pulse" />
              </div>
              <div className="h-5 w-64 bg-blue-950/50 rounded animate-pulse" />
              <div className="h-5 w-48 bg-blue-950/50 rounded animate-pulse" />
            </div>
          </div>
        </Card>

        {/* Quick Stats */}
        <Card className="w-full md:w-auto p-6 bg-blue-950/10 border-blue-900/50">
          <div className="grid grid-cols-2 gap-6 md:gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-8 w-16 bg-blue-950/50 rounded animate-pulse" />
                <div className="h-5 w-24 bg-blue-950/50 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Activity Sections */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* My Requests */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-7 w-32 bg-blue-950/50 rounded animate-pulse" />
            <div className="h-9 w-24 bg-blue-950/50 rounded animate-pulse" />
          </div>
          <Card className="h-48 bg-blue-950/10 border-blue-900/50 animate-pulse" />
        </div>

        {/* My Offers */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-7 w-32 bg-blue-950/50 rounded animate-pulse" />
            <div className="h-9 w-24 bg-blue-950/50 rounded animate-pulse" />
          </div>
          <Card className="h-48 bg-blue-950/10 border-blue-900/50 animate-pulse" />
        </div>
      </div>
    </div>
  )
}
