export default function Loading() {
  return (
  <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
  {/* Header Skeleton */}
  <div className="bg-white dark:bg-slate-900 shadow-sm border-b dark:border-slate-800">
    <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-16">
        <div className="h-6 w-32 bg-gray-200 dark:bg-slate-700 rounded animate-pulse"></div>
        <div className="h-10 w-28 bg-gray-200 dark:bg-slate-700 rounded animate-pulse"></div>
      </div>
    </div>
  </div>

  {/* Profile Content Skeleton */}
  <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm overflow-hidden">
      {/* Profile Header Skeleton */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8">
        <div className="flex items-center space-x-6">
          <div className="h-24 w-24 bg-white/20 dark:bg-slate-700/40 rounded-full animate-pulse"></div>
          <div className="space-y-2">
            <div className="h-8 w-48 bg-white/20 dark:bg-slate-700/40 rounded animate-pulse"></div>
            <div className="h-5 w-36 bg-white/20 dark:bg-slate-700/40 rounded animate-pulse"></div>
            <div className="h-4 w-32 bg-white/20 dark:bg-slate-700/40 rounded animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Profile Details Skeleton */}
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="h-6 w-40 bg-gray-200 dark:bg-slate-700 rounded animate-pulse"></div>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 w-20 bg-gray-200 dark:bg-slate-700 rounded animate-pulse"></div>
                  <div className="h-10 w-full bg-gray-200 dark:bg-slate-700 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <div className="h-6 w-48 bg-gray-200 dark:bg-slate-700 rounded animate-pulse"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 w-24 bg-gray-200 dark:bg-slate-700 rounded animate-pulse"></div>
                  <div className="h-10 w-full bg-gray-200 dark:bg-slate-700 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-8 space-y-4">
          <div className="h-6 w-24 bg-gray-200 dark:bg-slate-700 rounded animate-pulse"></div>
          <div className="h-24 w-full bg-gray-200 dark:bg-slate-700 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  </div>
</div>

  )
}
