"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, BookOpen, ChevronRight, Brain, BarChart3, CheckCircle, AlertCircle } from "lucide-react"

// Mock data for courses and challenges
const mockCourses = [
  {
    id: 1,
    title: "Advanced Mathematics",
    subjectId: "mathematics",
    progress: 78,
    nextChallenge: "Calculus Derivatives",
    dueDate: "Tomorrow",
    difficulty: "Hard",
    points: 150,
    status: "active",
    description:
      "Dive deep into advanced mathematical concepts including calculus, differential equations, and linear algebra. This course is designed to challenge your analytical skills and prepare you for higher-level studies.",
  },
  {
    id: 2,
    title: "Physics Fundamentals",
    subjectId: "physics",
    progress: 45,
    nextChallenge: "Newton's Laws Quiz",
    dueDate: "In 3 days",
    difficulty: "Medium",
    points: 120,
    status: "active",
    description:
      "Explore the fundamental principles of physics, from classical mechanics to electromagnetism. Understand the laws governing the universe through interactive lessons and practical examples.",
  },
  {
    id: 3,
    title: "Chemistry Basics",
    subjectId: "chemistry",
    progress: 100,
    nextChallenge: "Course Completed",
    dueDate: "Completed",
    difficulty: "Easy",
    points: 200,
    status: "completed",
    description:
      "An introductory course covering the basics of chemical reactions, atomic structure, and periodic trends. Build a strong foundation in chemistry for future scientific endeavors.",
  },
]

const mockChallenges = [
  {
    id: 1,
    title: "Calculus Derivatives",
    courseId: 1,
    subjectId: "mathematics",
    difficulty: "Hard",
    estimatedTime: "45 min",
    dueDate: "Tomorrow",
    points: 50,
    description: "Master the concepts of differentiation and its applications in real-world problems.",
  },
  {
    id: 2,
    title: "Newton's Laws Quiz",
    courseId: 2,
    subjectId: "physics",
    difficulty: "Medium",
    estimatedTime: "30 min",
    dueDate: "In 3 days",
    points: 40,
    description: "Test your understanding of Newton's three laws of motion through a series of challenging questions.",
  },
  {
    id: 3,
    title: "Periodic Table Quiz",
    courseId: 3,
    subjectId: "chemistry",
    difficulty: "Easy",
    estimatedTime: "20 min",
    dueDate: "Next week",
    points: 30,
    description: "Identify elements and understand their properties on the periodic table with this interactive quiz.",
  },
  {
    id: 4,
    title: "Linear Equations Challenge",
    courseId: 1,
    subjectId: "mathematics",
    difficulty: "Medium",
    estimatedTime: "30 min",
    dueDate: "In 5 days",
    points: 45,
    description: "Solve systems of linear equations using various methods, including substitution and elimination.",
  },
  {
    id: 5,
    title: "Thermodynamics Principles",
    courseId: 2,
    subjectId: "physics",
    difficulty: "Hard",
    estimatedTime: "60 min",
    dueDate: "In 7 days",
    points: 60,
    description: "Explore the laws of thermodynamics and their applications in energy transfer.",
  },
]

const getDifficultyColor = (difficulty) => {
  switch (difficulty.toLowerCase()) {
    case "easy":
      return "bg-green-100 text-green-800"
    case "medium":
      return "bg-yellow-100 text-yellow-800"
    case "hard":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export default function SubjectCoursePage() {
  const params = useParams()
  const { subjectid } = params

  const course = mockCourses.find((c) => c.subjectId === subjectid)
  const challengesForSubject = mockChallenges.filter((c) => c.subjectId === subjectid)

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
        <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Course Not Found</h2>
        <p className="text-gray-600 mb-6">The course for subject "{subjectid}" could not be found.</p>
        <Link href="/Dashboard/StudentDashboard">
          <Button>Back to Dashboard</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{course.title}</h2>
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
                  <span>{course.progress}%</span>
                </div>
                <Progress value={course.progress} className="h-2" />
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Status</p>
                  <Badge
                    variant={course.status === "completed" ? "default" : "secondary"}
                    className={course.status === "completed" ? "bg-green-100 text-green-800" : ""}
                  >
                    {course.status === "completed" ? "Completed" : "Active"}
                  </Badge>
                </div>
                <div>
                  <p className="text-gray-600">Difficulty</p>
                  <Badge className={getDifficultyColor(course.difficulty)}>{course.difficulty}</Badge>
                </div>
                <div>
                  <p className="text-gray-600">Points Earned</p>
                  <p className="font-semibold">{course.points}</p>
                </div>
                <div>
                  <p className="text-gray-600">Next Challenge</p>
                  <p className="font-semibold">{course.nextChallenge}</p>
                </div>
              </div>
              <div className="flex justify-end">
                <Link href={`/Dashboard/StudentDashboard/Challenges/${course.subjectId}`}>
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
                <CardTitle className="text-sm font-medium">Challenges Completed</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {challengesForSubject.filter((c) => c.status === "completed").length} / {challengesForSubject.length}
                </div>
                <p className="text-xs text-gray-600">for this course</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Challenge Score</CardTitle>
                <BarChart3 className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">85%</div> {/* Mock average score */}
                <p className="text-xs text-gray-600">across all challenges</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Challenges for this Course */}
        <section className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Challenges in {course.title}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {challengesForSubject.length > 0 ? (
              challengesForSubject.map((challenge) => (
                <Card key={challenge.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{challenge.title}</CardTitle>
                      <Badge className={getDifficultyColor(challenge.difficulty)}>{challenge.difficulty}</Badge>
                    </div>
                    <CardDescription>{challenge.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">⏱️ {challenge.estimatedTime}</span>
                      <span className="text-gray-500">📅 Due: {challenge.dueDate}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <Badge variant="secondary">+{challenge.points} pts</Badge>
                      <Button size="sm">
                        Start Challenge
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center p-8 bg-white rounded-lg shadow">
                <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg text-gray-600">No challenges found for this course yet.</p>
              </div>
            )}
          </div>
        </section>

        {/* Link to Theory Page */}
        <section className="text-center mt-8">
          <Link href={`/Dashboard/StudentDashboard/Courses/${course.subjectId}/Theory`}>
            <Button size="lg" className="text-lg px-8 py-3">
              Explore {course.title} Theory
              <BookOpen className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </section>
      </main>
    </div>
  )
}
