"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  BookOpen,
  ChevronRight,
  Brain,
  BarChart3,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useContext, useEffect } from "react";
import MyContext from "@/context/ThemeProvider";

const getDifficultyColor = (difficulty) => {
  switch (difficulty?.toLowerCase()) {
    case "easy":
      return "bg-green-100 text-green-800";
    case "medium":
      return "bg-yellow-100 text-yellow-800";
    case "hard":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default function SubjectCoursePage() {
  const context = useContext(MyContext);
  const params = useParams();
  const { courseid } = params;

  useEffect(() => {
    context.fetchCourses();
    context.fetchProfile();
  }, []);

  const userCourse = context?.user?.courses?.find(
    (c) => String(c.courseId) === String(courseid)
  );

  const course = context?.courses?.find(
    (c) => String(c._id) === String(courseid)
  );

  // Subtopics for this course
  const challengesForSubject = course?.subtopics || [];

  // Get user’s challenges for this course
  const userChallengesForCourse =
    context?.user?.challenges?.filter((uc) =>
      course?.challenges?.some(
        (sub) => String(sub._id) === String(uc.challengeId)
      )
    ) || [];

  // Total challenges in this course
  const totalChallenges = course?.challenges?.length || 0;

  // Completed challenges count
  const completedChallenges = userChallengesForCourse.filter(
    (c) => c.status === "completed"
  ).length;

  // Average challenge progress (0 if none)
  const avgChallengeProgress =
    userChallengesForCourse.length > 0
      ? Math.round(
          userChallengesForCourse.reduce(
            (sum, c) => sum + (c.progress || 0),
            0
          ) / userChallengesForCourse.length
        )
      : 0;

  const totalPoints = userChallengesForCourse.reduce(
    (sum, c) => sum + (c.score || 0),
    0
  );

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
        <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Course Not Found
        </h2>
        <p className="text-gray-600 mb-6">
          The course for the given subtopic could not be found.
        </p>
        <Link href="/Dashboard/StudentDashboard">
          <Button>Back to Dashboard</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link
              href="/Dashboard/StudentDashboard"
              className="flex items-center space-x-3 text-gray-900 hover:text-purple-600 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <Brain className="h-8 w-8 text-purple-600" />
              <div>
                <h1 className="text-xl font-bold">Brain Lock</h1>
                <p className="text-xs text-gray-500">Student Dashboard</p>
              </div>
            </Link>
            <Badge variant="secondary" className="text-sm">
              Course Details
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {course.title}
          </h2>
          <p className="text-lg text-gray-600">{course.description}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Course Overview Card */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-blue-600" />
                <span>Course Overview</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{userCourse?.progress.toFixed(2)}%</span>
                </div>
                <Progress value={userCourse?.progress} className="h-2" />
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Status</p>
                  <Badge
                    variant={
                      course.status === "completed" ? "default" : "secondary"
                    }
                    className={
                      course.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : ""
                    }
                  >
                    {course.status === "completed" ? "Completed" : "Active"}
                  </Badge>
                </div>
                <div>
                  <p className="text-gray-600">Difficulty</p>
                  <Badge
                    className={getDifficultyColor(course.difficulty || "Hard")}
                  >
                    {course.difficulty || "Hard"}
                  </Badge>
                </div>
                <div>
                  <p className="text-gray-600">Points Earned</p>
                  <p className="font-semibold">{totalPoints || 0}</p>
                </div>
                <div>
                  <p className="text-gray-600">Next Challenge</p>
                  <p className="font-semibold">
                    {course.subtopics?.[0]?.title || "No challenges yet"}
                  </p>
                </div>
              </div>
              <div className="flex justify-end">
                <Link
                  href={`/Dashboard/StudentDashboard/Challenges/${course._id}`}
                >
                  <Button>
                    View All Challenges
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Challenges Completed
                </CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {completedChallenges} / {totalChallenges}
                </div>
                <p className="text-xs text-gray-600">for this course</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Avg Challenge Score
                </CardTitle>
                <BarChart3 className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {avgChallengeProgress.toFixed(2)}%
                </div>{" "}
                {/* Mock average score */}
                <p className="text-xs text-gray-600">across all challenges</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Challenges for this Course */}
        <section className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Theory in {course.title}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {course.subtopics && course.subtopics.length > 0 ? (
              course.subtopics.map((subtopic, index) => (
                <Card
                  key={index}
                  className="hover:shadow-lg transition-shadow flex flex-col"
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">
                        {subtopic.title}
                      </CardTitle>
                      <Badge
                        className={
                          getDifficultyColor(subtopic.difficulty) || "Hard"
                        }
                      >
                        {subtopic.difficulty || "Hard"}
                      </Badge>
                    </div>

                    <CardDescription>{subtopic.description}</CardDescription>
                  </CardHeader>

                  {/* Everything below description stays fixed at bottom */}
                  <CardContent className="space-y-3 flex flex-col flex-1">
                    <div className="mt-auto space-y-3">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500">
                          ⏱️ {subtopic.estimatedTime || "4 Days"}
                        </span>
                        <span className="text-gray-500">
                          📅 Due:{" "}
                          {subtopic.dueDate || subtopic.updatedAt.split("T")[0]}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <Badge variant="secondary">
                          +{(50 / course.subtopics.length).toFixed(2)} progress
                        </Badge>
                        <Link
                          href={`/Dashboard/StudentDashboard/Courses/${course._id}/Subtopics/${subtopic._id}`}
                        >
                          <Button
                            onClick={async () => {
                              await fetch(
                                `/api/user/${context?.user?._id}/progress/${course?._id}`,
                                {
                                  method: "PUT",
                                  headers: {
                                    "Content-Type": "application/json",
                                  },
                                  body: JSON.stringify({
                                    subtopicId: subtopic._id,
                                  }),
                                }
                              );
                              context.fetchProfile();
                            }}
                            size="sm"
                          >
                            Open Theory
                            <ChevronRight className="ml-1 h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center p-8 bg-white rounded-lg shadow">
                <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg text-gray-600">
                  No subtopics found for this course yet.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
