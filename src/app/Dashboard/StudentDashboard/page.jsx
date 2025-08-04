"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Brain,
  BookOpen,
  Trophy,
  Target,
  Clock,
  TrendingUp,
  Star,
  Play,
  Pause,
  RotateCcw,
  MessageCircle,
  Bell,
  Settings,
  LogOut,
  ChevronRight,
  Calendar,
  Award,
  Zap,
  BarChart3,
  CheckCircle,
  AlertCircle,
  FlameIcon as Fire,
  Crown,
  Medal,
} from "lucide-react"
import Link from "next/link" // Import Link

export default function StudentDashboard() {
  const [currentStreak, setCurrentStreak] = useState(7)
  const [studyTimer, setStudyTimer] = useState({ minutes: 25, seconds: 0, isRunning: false })

  // Mock data
  const studentData = {
    name: "Alex Johnson",
    email: "alex.johnson@student.edu",
    grade: "Grade 11",
    institution: "Lincoln High School",
    avatar: "/placeholder.svg?height=40&width=40",
    totalPoints: 2450,
    rank: 12,
    streak: currentStreak,
    completedCourses: 3,
    activeCourses: 2,
  }

  const courses = [
    {
      id: 1,
      title: "Advanced Mathematics",
      subjectId: "mathematics", // Added subjectId for routing
      progress: 78,
      nextChallenge: "Calculus Derivatives",
      dueDate: "Tomorrow",
      difficulty: "Hard",
      points: 150,
      status: "active",
    },
    {
      id: 2,
      title: "Physics Fundamentals",
      subjectId: "physics", // Added subjectId for routing
      progress: 45,
      nextChallenge: "Newton's Laws Quiz",
      dueDate: "In 3 days",
      difficulty: "Medium",
      points: 120,
      status: "active",
    },
    {
      id: 3,
      title: "Chemistry Basics",
      subjectId: "chemistry", // Added subjectId for routing
      progress: 100,
      nextChallenge: "Course Completed",
      dueDate: "Completed",
      difficulty: "Easy",
      points: 200,
      status: "completed",
    },
  ]

  const recentActivities = [
    {
      id: 1,
      type: "challenge_completed",
      title: "Completed Quadratic Equations Challenge",
      course: "Advanced Mathematics",
      points: 25,
      time: "2 hours ago",
    },
    {
      id: 2,
      type: "streak_milestone",
      title: "7-day study streak achieved!",
      course: null,
      points: 50,
      time: "Today",
    },
    {
      id: 3,
      type: "quiz_completed",
      title: "Aced Periodic Table Quiz",
      course: "Chemistry Basics",
      points: 30,
      time: "Yesterday",
    },
  ]

  const leaderboard = [
    { rank: 1, name: "Sarah Chen", points: 3200, avatar: "/placeholder.svg?height=32&width=32" },
    { rank: 2, name: "Mike Rodriguez", points: 2890, avatar: "/placeholder.svg?height=32&width=32" },
    { rank: 3, name: "Emma Wilson", points: 2750, avatar: "/placeholder.svg?height=32&width=32" },
    {
      rank: 12,
      name: "Alex Johnson",
      points: 2450,
      avatar: "/placeholder.svg?height=32&width=32",
      isCurrentUser: true,
    },
  ]

  const upcomingChallenges = [
    {
      id: 1,
      title: "Calculus Derivatives",
      course: "Advanced Mathematics",
      subjectId: "mathematics", // Added subjectId for routing
      difficulty: "Hard",
      estimatedTime: "45 min",
      dueDate: "Tomorrow",
      points: 50,
    },
    {
      id: 2,
      title: "Newton's Laws Quiz",
      course: "Physics Fundamentals",
      subjectId: "physics", // Added subjectId for routing
      difficulty: "Medium",
      estimatedTime: "30 min",
      dueDate: "In 3 days",
      points: 40,
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

  const getActivityIcon = (type) => {
    switch (type) {
      case "challenge_completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "streak_milestone":
        return <Fire className="h-4 w-4 text-orange-600" />
      case "quiz_completed":
        return <Award className="h-4 w-4 text-blue-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <Brain className="h-8 w-8 text-purple-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Brain Lock</h1>
                <p className="text-xs text-gray-500">Student Dashboard</p>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  3
                </span>
              </Button>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={studentData.avatar || "/placeholder.svg"} alt={studentData.name} />
                      <AvatarFallback>AJ</AvatarFallback>
                    </Avatar>
                    <div className="text-left hidden sm:block">
                      <p className="text-sm font-medium">{studentData.name}</p>
                      <p className="text-xs text-gray-500">{studentData.grade}</p>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Help & Support
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back, {studentData.name.split(" ")[0]}! 👋</h2>
          <p className="text-gray-600">Ready to continue your learning journey?</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
              <Fire className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{studentData.streak} days</div>
              <p className="text-xs text-gray-600">Keep it up!</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Points</CardTitle>
              <Star className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{studentData.totalPoints.toLocaleString()}</div>
              <p className="text-xs text-gray-600">+150 this week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Class Rank</CardTitle>
              <Trophy className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">#{studentData.rank}</div>
              <p className="text-xs text-gray-600">↑ 3 positions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
              <BookOpen className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{studentData.activeCourses}</div>
              <p className="text-xs text-gray-600">{studentData.completedCourses} completed</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="courses">My Courses</TabsTrigger>
            <TabsTrigger value="challenges">Challenges</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column */}
              <div className="lg:col-span-2 space-y-6">
                {/* Current Progress */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                      <span>Current Progress</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {courses
                      .filter((course) => course.status === "active")
                      .map((course) => (
                        <div key={course.id} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <h4 className="font-medium">{course.title}</h4>
                            <Badge className={getDifficultyColor(course.difficulty)}>{course.difficulty}</Badge>
                          </div>
                          <Progress value={course.progress} className="h-2" />
                          <div className="flex justify-between text-sm text-gray-600">
                            <span>{course.progress}% complete</span>
                            <span>Next: {course.nextChallenge}</span>
                          </div>
                        </div>
                      ))}
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Clock className="h-5 w-5 text-blue-600" />
                      <span>Recent Activity</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivities.map((activity) => (
                        <div key={activity.id} className="flex items-start space-x-3">
                          <div className="flex-shrink-0 mt-1">{getActivityIcon(activity.type)}</div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                            {activity.course && <p className="text-sm text-gray-600">{activity.course}</p>}
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="text-xs text-gray-500">{activity.time}</span>
                              <Badge variant="secondary" className="text-xs">
                                +{activity.points} pts
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Study Timer */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Target className="h-5 w-5 text-red-600" />
                      <span>Focus Timer</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center space-y-4">
                    <div className="text-4xl font-mono font-bold text-gray-900">
                      {String(studyTimer.minutes).padStart(2, "0")}:{String(studyTimer.seconds).padStart(2, "0")}
                    </div>
                    <div className="flex justify-center space-x-2">
                      <Button size="sm" variant={studyTimer.isRunning ? "destructive" : "default"}>
                        {studyTimer.isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                      <Button size="sm" variant="outline">
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-gray-600">Pomodoro Session</p>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full justify-start bg-transparent" variant="outline">
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Ask AI Assistant
                    </Button>
                    <Button className="w-full justify-start bg-transparent" variant="outline">
                      <Calendar className="mr-2 h-4 w-4" />
                      View Schedule
                    </Button>
                    <Button className="w-full justify-start bg-transparent" variant="outline">
                      <BarChart3 className="mr-2 h-4 w-4" />
                      Progress Report
                    </Button>
                  </CardContent>
                </Card>

                {/* Achievements */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Award className="h-5 w-5 text-yellow-600" />
                      <span>Recent Achievements</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="bg-orange-100 p-2 rounded-full">
                        <Fire className="h-4 w-4 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Week Warrior</p>
                        <p className="text-xs text-gray-600">7-day streak</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <Brain className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Quick Learner</p>
                        <p className="text-xs text-gray-600">Completed 5 challenges</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Courses Tab */}
          <TabsContent value="courses" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <Card key={course.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{course.title}</CardTitle>
                      <Badge
                        variant={course.status === "completed" ? "default" : "secondary"}
                        className={course.status === "completed" ? "bg-green-100 text-green-800" : ""}
                      >
                        {course.status === "completed" ? "Completed" : "Active"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} className="h-2" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Next Challenge:</span>
                        <Badge className={getDifficultyColor(course.difficulty)}>{course.difficulty}</Badge>
                      </div>
                      <p className="text-sm font-medium">{course.nextChallenge}</p>
                      <p className="text-xs text-gray-500">Due: {course.dueDate}</p>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <span className="text-sm text-gray-600">Points: {course.points}</span>
                      <Link href={`/Dashboard/StudentDashboard/Courses/${course.subjectId}`}>
                        {" "}
                        {/* Link to new course page */}
                        <Button size="sm" disabled={course.status === "completed"}>
                          {course.status === "completed" ? "Completed" : "Continue"}
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Challenges Tab */}
          <TabsContent value="challenges" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Upcoming Challenges */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="h-5 w-5 text-blue-600" />
                    <span>Upcoming Challenges</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {upcomingChallenges.map((challenge) => (
                    <div key={challenge.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium">{challenge.title}</h4>
                        <Badge className={getDifficultyColor(challenge.difficulty)}>{challenge.difficulty}</Badge>
                      </div>
                      <p className="text-sm text-gray-600">{challenge.course}</p>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500">⏱️ {challenge.estimatedTime}</span>
                        <span className="text-gray-500">📅 {challenge.dueDate}</span>
                        <Badge variant="secondary">+{challenge.points} pts</Badge>
                      </div>
                      <Link href={`/Dashboard/StudentDashboard/Challenges/${challenge.subjectId}`}>
                        {" "}
                        {/* Link to new challenges page */}
                        <Button size="sm" className="w-full">
                          Start Challenge
                        </Button>
                      </Link>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Challenge Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5 text-green-600" />
                    <span>Challenge Statistics</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">24</div>
                      <div className="text-sm text-gray-600">Completed</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">92%</div>
                      <div className="text-sm text-gray-600">Success Rate</div>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600">18</div>
                      <div className="text-sm text-gray-600">This Week</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">5</div>
                      <div className="text-sm text-gray-600">Perfect Scores</div>
                    </div>
                  </div>

                  <Alert>
                    <Zap className="h-4 w-4" />
                    <AlertDescription>
                      You're on fire! Complete 2 more challenges to unlock the "Challenge Master" badge.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Leaderboard Tab */}
          <TabsContent value="leaderboard" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Trophy className="h-5 w-5 text-yellow-600" />
                  <span>Class Leaderboard</span>
                </CardTitle>
                <CardDescription>See how you rank against your classmates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {leaderboard.map((student) => (
                    <div
                      key={student.rank}
                      className={`flex items-center space-x-4 p-3 rounded-lg ${
                        student.isCurrentUser ? "bg-purple-50 border border-purple-200" : "bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center justify-center w-8 h-8">
                        {student.rank === 1 && <Crown className="h-6 w-6 text-yellow-500" />}
                        {student.rank === 2 && <Medal className="h-6 w-6 text-gray-400" />}
                        {student.rank === 3 && <Medal className="h-6 w-6 text-amber-600" />}
                        {student.rank > 3 && <span className="text-lg font-bold text-gray-600">#{student.rank}</span>}
                      </div>
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={student.avatar || "/placeholder.svg"} alt={student.name} />
                        <AvatarFallback>
                          {student.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className={`font-medium ${student.isCurrentUser ? "text-purple-900" : "text-gray-900"}`}>
                          {student.name} {student.isCurrentUser && "(You)"}
                        </p>
                        <p className="text-sm text-gray-600">{student.points.toLocaleString()} points</p>
                      </div>
                      {student.isCurrentUser && (
                        <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                          Your Rank
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
