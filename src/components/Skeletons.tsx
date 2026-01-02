export function TableSkeleton({ rows = 5, columns = 6 }) {
  return (
    <div className="animate-pulse">
      {/* Header */}
      <div className="grid gap-4 mb-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }).map((_, i) => (
          <div key={i} className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="grid gap-4 mb-3" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div key={colIndex} className="h-8 bg-gray-100 dark:bg-gray-800 rounded"></div>
          ))}
        </div>
      ))}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
        <div className="w-16 h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
      <div className="w-24 h-8 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
      <div className="w-32 h-4 bg-gray-100 dark:bg-gray-800 rounded"></div>
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm animate-pulse">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="w-48 h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
          <div className="w-64 h-4 bg-gray-100 dark:bg-gray-800 rounded"></div>
        </div>
        <div className="w-24 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
      </div>
      <div className="h-80 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-end justify-around p-4 gap-2">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="bg-gray-200 dark:bg-gray-700 rounded-t w-full"
            style={{ height: `${Math.random() * 60 + 20}%` }}
          ></div>
        ))}
      </div>
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-2xl p-6 animate-pulse">
      <div className="flex items-center justify-between mb-3">
        <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
        <div className="w-12 h-5 bg-gray-300 dark:bg-gray-600 rounded"></div>
      </div>
      <div className="w-20 h-9 bg-gray-300 dark:bg-gray-600 rounded mb-1"></div>
      <div className="w-32 h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
    </div>
  );
}
