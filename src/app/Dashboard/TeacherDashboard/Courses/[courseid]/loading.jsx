// /Dashboard/TeacherDashboard/Courses/[courseid]/loading.js

export default function Loading() {
  return (
    <div className="p-6 animate-pulse">
      {/* Page Title */}
      <div className="h-8 w-2/3 bg-gray-200 rounded mb-4"></div>
      <div className="h-4 w-1/2 bg-gray-200 rounded mb-8"></div>

      {/* Create Button */}
      <div className="flex justify-end mb-6">
        <div className="h-10 w-40 bg-gray-200 rounded"></div>
      </div>

      {/* Subtopic List Skeleton */}
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="flex justify-between items-center p-4 border rounded-lg"
          >
            <div>
              <div className="h-5 w-48 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 w-72 bg-gray-200 rounded"></div>
            </div>
            <div className="h-8 w-32 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
