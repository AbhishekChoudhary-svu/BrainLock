// /Dashboard/TeacherDashboard/Courses/[courseid]/loading.js

import { Loader2 } from "lucide-react";

export default function Loading() {
  return (<>
       <div className="h-8 w-full  bg-gray-200 rounded mb-8"></div>
    <div className="p-2 animate-pulse">
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
    </div></>
  );
}
export  function Loading1() {
  return (
  <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      <p className="ml-2 text-gray-600"></p>
    </div>

  );
}


