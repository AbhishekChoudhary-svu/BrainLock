"use client"

import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Brain, Search, Filter, ChevronRight, AlertCircle } from "lucide-react"
import { useContext, useEffect, useState } from "react"
import MyContext from "@/context/ThemeProvider"
import { toast } from "sonner"

// Mock data for challenges
const mockChallenges = [
  {
    id: 1,
    title: "Calculus Derivatives",
    challengeId: "calculus-derivatives", // Added challengeId for routing
    courseId: 1,
    subjectId: "mathematics",
    difficulty: "Hard",
    estimatedTime: "45 min",
    dueDate: "Tomorrow",
    points: 50,
    description: "Master the concepts of differentiation and its applications in real-world problems.",
    status: "pending",
  },
  {
    id: 2,
    title: "Newton's Laws Quiz",
    challengeId: "newtons-laws-quiz", // Added challengeId for routing
    courseId: 2,
    subjectId: "physics",
    difficulty: "Medium",
    estimatedTime: "30 min",
    dueDate: "In 3 days",
    points: 40,
    description: "Test your understanding of Newton's three laws of motion through a series of challenging questions.",
    status: "pending",
  },
  {
    id: 3,
    title: "Periodic Table Quiz",
    challengeId: "periodic-table-quiz", // Added challengeId for routing
    courseId: 3,
    subjectId: "chemistry",
    difficulty: "Easy",
    estimatedTime: "20 min",
    dueDate: "Next week",
    points: 30,
    description: "Identify elements and understand their properties on the periodic table with this interactive quiz.",
    status: "completed",
  },
  {
    id: 4,
    title: "Linear Equations Challenge",
    challengeId: "linear-equations-challenge", // Added challengeId for routing
    courseId: 1,
    subjectId: "mathematics",
    difficulty: "Medium",
    estimatedTime: "30 min",
    dueDate: "In 5 days",
    points: 45,
    description: "Solve systems of linear equations using various methods, including substitution and elimination.",
    status: "pending",
  },
  {
    id: 5,
    title: "Thermodynamics Principles",
    challengeId: "thermodynamics-principles", // Added challengeId for routing
    courseId: 2,
    subjectId: "physics",
    difficulty: "Hard",
    estimatedTime: "60 min",
    dueDate: "In 7 days",
    points: 60,
    description: "Explore the laws of thermodynamics and their applications in energy transfer.",
    status: "pending",
  },
  {
    id: 6,
    title: "Organic Chemistry Basics",
    challengeId: "organic-chemistry-basics", // Added challengeId for routing
    courseId: 3,
    subjectId: "chemistry",
    difficulty: "Medium",
    estimatedTime: "40 min",
    dueDate: "In 10 days",
    points: 45,
    description:
      "An introduction to the fundamental concepts of organic chemistry, including functional groups and nomenclature.",
    status: "pending",
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

export default function SubjectChallengesPage() {
  const router = useRouter()
  const context = useContext(MyContext)
  const params = useParams()
  const { courseid } = params

  useEffect(()=>{
    context.fetchCourses();
    context.fetchProfile()
  },[])


  const [searchTerm, setSearchTerm] = useState("")
  const [filterDifficulty, setFilterDifficulty] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")

  // Flatten courses in case nested
const allCourses = context?.courses?.flat() || [];

// Find the course by ID
const course = allCourses.find((c) => String(c._id) === String(courseid));

// Get challenges safely
const challengesForSubject = course?.challenges || [];

  const filteredChallenges = challengesForSubject.filter((challenge) => {
    const matchesSearch =
      challenge.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      challenge.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDifficulty = filterDifficulty === "all" || challenge.difficulty.toLowerCase() === filterDifficulty
    const matchesStatus = filterStatus === "all" || challenge.status.toLowerCase() === filterStatus
    return matchesSearch && matchesDifficulty && matchesStatus
  })

const handleStartChallenge = async (challenge) => {
  try {
    const res = await fetch(
      `/api/user/${context?.user?._id}/challenge/${challenge._id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      }
    );

    const data = await res.json();

    if (data.success) {
      // Update local challenge status
      challenge.status = "active";
      toast.success("Challenge started successfully!");
      // Optionally refetch profile or challenges
      context.fetchProfile();
      router.push(`/Dashboard/StudentDashboard/Challenges/${courseid}/${challenge._id}`);

    } else {
      toast.error(data.message || "Failed to start challenge");
    }
  } catch (err) {
    console.error(err);
    toast.error("Failed to start challenge");
  }
};



  if (challengesForSubject.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
        <AlertCircle className="h-16 w-16 text-gray-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">No Challenges Found</h2>
        <p className="text-gray-600 mb-6">There are no challenges available for {courseid} yet.</p>
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
              href={`/Dashboard/StudentDashboard/Courses/${courseid}`}
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
              Challenges
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Challenges for {course?.title}</h2>
          <p className="text-lg text-gray-600">Explore and conquer challenges in your chosen subject.</p>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search challenges..."
              className="pl-10 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={filterDifficulty} onValueChange={setFilterDifficulty}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Difficulties</SelectItem>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Challenges List */}
        <section>
          {filteredChallenges.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredChallenges.map((challenge) => (
                <Card key={challenge._id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{challenge.title}</CardTitle>
                      <Badge className={getDifficultyColor(challenge.difficulty)}>{challenge.difficulty}</Badge>
                    </div>
                    <CardDescription>{challenge.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">⏱️ {challenge.estimatedTime || "50 mins"}</span>
                      <span className="text-gray-500">📅 Due: {challenge.createdAt.split("T")[0]}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <Badge variant="secondary">+{challenge.points || 50} pts</Badge>
                      <Link href="" onClick={()=>handleStartChallenge(challenge)}>
                        <Button size="sm" disabled={challenge.status === "completed"}>
                          {challenge.status === "completed" ? "Completed" : "Start Challenge"}
                          {challenge.status !== "completed" && <ChevronRight className="ml-1 h-4 w-4" />}
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center p-8 bg-white rounded-lg shadow">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg text-gray-600">No challenges match your criteria.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
