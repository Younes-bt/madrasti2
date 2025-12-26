export function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-neutral-50 animate-pulse">
      {/* Hero Skeleton */}
      <div className="bg-gradient-to-br from-neutral-300 to-neutral-400 h-96 rounded-b-2xl" />

      {/* Filters Skeleton */}
      <div className="container mx-auto max-w-6xl px-4 py-6">
        <div className="h-12 bg-neutral-200 rounded-lg mb-4" />
        <div className="h-12 bg-neutral-200 rounded-lg" />
      </div>

      {/* Cards Skeleton */}
      <div className="container mx-auto max-w-6xl px-4 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-64 bg-neutral-200 rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}
