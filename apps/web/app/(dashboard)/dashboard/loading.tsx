import { Spinner } from '@/components/ui/spinner'

export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>

      {/* Skeleton for tabs */}
      <div className="flex gap-4">
        <div className="h-10 w-24 bg-[#1e1e1e] rounded-lg animate-pulse" />
        <div className="h-10 w-24 bg-[#1e1e1e] rounded-lg animate-pulse" />
        <div className="h-10 w-24 bg-[#1e1e1e] rounded-lg animate-pulse" />
      </div>

      {/* Loading indicator */}
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-3 text-[#a1a1aa]">
          <Spinner size="md" />
          <span>Loading your gift lists...</span>
        </div>
      </div>

      {/* Skeleton for items table */}
      <div className="bg-[#141414] border border-[#2d2d2d] rounded-lg p-4 space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex gap-4 items-center">
            <div className="h-6 w-6 bg-[#1e1e1e] rounded animate-pulse" />
            <div className="h-6 flex-1 bg-[#1e1e1e] rounded animate-pulse" />
            <div className="h-6 w-20 bg-[#1e1e1e] rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  )
}
