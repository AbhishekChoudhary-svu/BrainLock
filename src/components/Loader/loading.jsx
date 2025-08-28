// /Dashboard/TeacherDashboard/Courses/[courseid]/loading.js

import { Loader2 } from "lucide-react";

export function SubtopicLoading() {
  return (
    <div className="animate-pulse">
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

export function ContentLoading() {
  return (
    <div className="animate-pulse space-y-6 p-6 border rounded-lg shadow-md">
      {/* Title */}
      <div>
        <div className="h-5 w-60 bg-gray-200 rounded mb-2"></div>
        <div className="h-10 w-full bg-gray-200 rounded"></div>
      </div>

      {/* Theory / Article */}
      <div>
        <div className="h-5 w-44 bg-gray-200 rounded mb-2"></div>
        <div className="h-10 w-full bg-gray-200 rounded"></div>
        <div className="h-10 w-full bg-gray-200 rounded"></div>
      </div>

      {/* Video URL */}
      <div>
        <div className="h-5 w-48 bg-gray-200 rounded mb-2"></div>
        <div className="h-10 w-full bg-gray-200 rounded"></div>
      </div>

      {/* File Upload */}
      <div>
        <div className="h-5 w-40 bg-gray-200 rounded mb-2"></div>
        <div className="h-10 w-full bg-gray-200 rounded"></div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <div className="h-10 w-32 bg-gray-300 rounded"></div>
      </div>
    </div>
  );
}

export function QuestionLoading() {
  return (
    <div className="animate-pulse space-y-6">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="p-4 border rounded-lg shadow-sm space-y-3">
          {/* Action Buttons (Edit/Delete) */}
          <div className="flex gap-2 justify-end">
            <div className="h-8 w-8 bg-gray-300 rounded"></div>
            <div className="h-8 w-8 bg-gray-300 rounded"></div>
          </div>

          {/* Question Title */}
          <div className="h-5 w-1/3 bg-gray-200 rounded"></div>

          {/* Question Text */}
          <div className="h-4 w-2/3 bg-gray-200 rounded"></div>

          {/* Options */}
          <div className="space-y-2">
            <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
            <div className="h-4 w-1/3 bg-gray-200 rounded"></div>
            <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
            <div className="h-4 w-1/4 bg-gray-200 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function TheoryCardLoading() {
  return (
    <div className="animate-pulse grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="p-5 border rounded-2xl shadow-sm bg-gray-900 space-y-4"
        >
          {/* Title */}
          <div className="h-6 w-full bg-gray-700 rounded"></div>

          {/* Description */}
          <div className="space-y-2">
            <div className="h-4 w-full bg-gray-700 rounded"></div>
            <div className="h-4 w-5/6 bg-gray-700 rounded"></div>
          </div>

          {/* Tags (Days + Due Date) */}
          <div className="flex items-center gap-4">
            <div className="h-4 w-16 bg-gray-700 rounded"></div>
            <div className="h-4 w-24 bg-gray-700 rounded"></div>
          </div>

          {/* Progress + Button */}
          <div className="flex items-center justify-between">
            <div className="h-6 w-20 bg-gray-600 rounded"></div>
            <div className="h-8 w-28 bg-gray-500 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function TheoryPageLoading() {
  return (
    <div className="animate-pulse w-full flex  flex-col gap-2 p-2">
      {[...Array(2)].map((_, i) => (
        <div
          key={i}
          className="p-5 border rounded-2xl shadow-sm bg-gray-900 space-y-2"
        >
          {/* Title */}
          <div className="h-6 w-full bg-gray-700 rounded"></div>

          {/* Description */}
          <div className="space-y-2">
            <div className="h-4 w-full bg-gray-700 rounded"></div>
            <div className="h-4 w-5/6 bg-gray-700 rounded"></div>
          </div>
          {/* Description */}
          <div className="space-y-2">
            <div className="h-4 w-full bg-gray-700 rounded"></div>
            <div className="h-4 w-5/6 bg-gray-700 rounded"></div>
          </div>
          {/* Description */}
          <div className="space-y-2">
            <div className="h-4 w-full bg-gray-700 rounded"></div>
            <div className="h-4 w-5/6 bg-gray-700 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function QuizSkeleton() {
  return (
    <div className="">
      <div className="max-w-8xl mx-auto bg-gray-900 dark:bg-gray-900 px-6 rounded-2xl shadow-lg">
        {/* Quiz Title */}
        <div className="h-6 w-48 bg-gray-700 rounded mb-2 animate-pulse"></div>
        <div className="h-4 w-32 bg-gray-700 rounded mb-4 animate-pulse"></div>

        {/* Progress Bar */}
        <div className="h-2 w-full bg-gray-700 rounded mb-6 animate-pulse"></div>

        {/* Question */}
        <div className="h-5 w-64 bg-gray-700 rounded mb-6 animate-pulse"></div>

        {/* Options */}
        <div className="space-y-4">
          <div className="h-9 w-full bg-gray-700 rounded-xl animate-pulse"></div>
          <div className="h-9 w-full bg-gray-700 rounded-xl animate-pulse"></div>
          <div className="h-9 w-full bg-gray-700 rounded-xl animate-pulse"></div>
          <div className="h-9 w-full bg-gray-700 rounded-xl animate-pulse"></div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <div className="h-10 w-24 bg-gray-700 rounded-lg animate-pulse"></div>
          <div className="h-10 w-32 bg-gray-700 rounded-lg animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      <p className="ml-2 text-gray-600"></p>
    </div>
  );
}
