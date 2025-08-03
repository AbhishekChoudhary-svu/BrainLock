"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Brain,
  BookOpen,
  Users,
  BarChart3,
  Plus,
  Edit,
  Trash2,
  Eye,
  MessageCircle,
  Bell,
  Settings,
  LogOut,
  ChevronRight,
  Award,
  TrendingUp,
  Clock,
  Target,
  Star,
  AlertCircle,
  CheckCircle,
  FileText,
  Download,
  Upload,
  Filter,
  Search,
  MoreHorizontal,
} from "lucide-react"

export default function TeacherDashboard() {
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [isCreateCourseOpen, setIsCreateCourseOpen] = useState(false)
  const [isCreateChallengeOpen, setIsCreateChallengeOpen] = useState(false)

  // Mock data for teacher
  const teacherData = {
    name: "Dr. Sarah Wilson",
    email: "sarah.wilson@school.edu",
    role: "teacher",
    department: "Mathematics",
    institution: "Lincoln High School",
    avatar: "/placeholder.svg?height=40&width=40",
    totalStudents: 156,
    activeCourses: 4,
    totalChallenges: 28,
    avgPerformance: 87,
  }

  const courses = [
    {
      id: 1,
      title: "Advanced Calculus",
      students: 32,
      challenges: 8,
      avgScore: 85,
      status: "active",
      lastUpdated: "2 days ago",
      completion: 78,
    },
    {
      id: 2,
      title: "Linear Algebra",
      students: 28,
      challenges: 6,
      avgScore: 92,
      status: "active",
      lastUpdated: "1 day ago",
      completion: 65,
    },
    {
      id: 3,
      title: "Statistics Fundamentals",
      students: 45,
      challenges: 10,
      avgScore: 79,
      status: "active",
      lastUpdated: "3 hours ago",
      completion: 45,
    },
    {
      id: 4,
      title: "Geometry Basics",
      students: 51,
      challenges: 4,
      avgScore: 88,
      status: "completed",
      lastUpdated: "1 week ago",
      completion: 100,
    },
  ]

  const students = [
    {
      id: 1,
      name: "Alex Johnson",
      email: "alex.j@student.edu",
      courses: 3,
      avgScore: 92,
      streak: 7,
      lastActive: "2 hours ago",
      status: "active",
    },
    {
      id: 2,
      name: "Emma Davis",
      email: "emma.d@student.edu",
      courses: 2,
      avgScore: 88,
      streak: 12,
      lastActive: "1 day ago",
      status: "active",
    },
    {
      id: 3,
      name: "Michael Chen",
      email: "michael.c@student.edu",
      courses: 4,
      avgScore: 95,
      streak: 15,
      lastActive: "30 min ago",
      status: "active",
    },
    {
      id: 4,
      name: "Sofia Rodriguez",
      email: "sofia.r@student.edu",
      courses: 2,
      avgScore: 76,
      streak: 3,
      lastActive: "3 days ago",
      status: "inactive",
    },
  ]

  const recentActivities = [
    {
      id: 1,
      type: "challenge_created",
      title: "Created new challenge: Derivatives Practice",
      course: "Advanced Calculus",
      time: "2 hours ago",
    },
    {
      id: 2,
      type: "student_completed",
      title: "Alex Johnson completed Linear Systems Quiz",
      course: "Linear Algebra",
      time: "4 hours ago",
    },
    {
      id: 3,
      type: "course_updated",
      title: "Updated course materials for Statistics",
      course: "Statistics Fundamentals",
      time: "1 day ago",
    },
  ]

  const pendingReviews = [
    {
      id: 1,
      student: "Emma Davis",
      challenge: "Calculus Integration",
      course: "Advanced Calculus",
      submittedAt: "2 hours ago",
      score: null,
    },
    {
      id: 2,
      student: "Michael Chen",
      challenge: "Matrix Operations",
      course: "Linear Algebra",
      submittedAt: "1 day ago",
      score: null,
    },
  ]

  const getActivityIcon = (type) => {
    switch (type) {
      case "challenge_created":
        return <Plus className="h-4 w-4 text-green-600" />
      case "student_completed":
        return <CheckCircle className="h-4 w-4 text-blue-600" />
      case "course_updated":
        return <Edit className="h-4 w-4 text-orange-600" />
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
              <Brain className="h-8 w-8 text-green-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Brain Lock</h1>
                <p className="text-xs text-gray-500">Teacher Dashboard</p>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center space-x-4">
              {/* Quick Actions */}
              <Button size="sm" onClick={() => setIsCreateCourseOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                New Course
              </Button>

              {/* Notifications */}
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  5
                </span>
              </Button>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={teacherData.avatar || "/placeholder.svg"} alt={teacherData.name} />
                      <AvatarFallback>SW</AvatarFallback>
                    </Avatar>
                    <div className="text-left hidden sm:block">
                      <p className="text-sm font-medium">{teacherData.name}</p>
                      <p className="text-xs text-gray-500">{teacherData.department}</p>
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back, {teacherData.name.split(" ")[1]}! 👋</h2>
          <p className="text-gray-600">Manage your courses and track student progress</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{teacherData.totalStudents}</div>
              <p className="text-xs text-gray-600">+12 this semester</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
              <BookOpen className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{teacherData.activeCourses}</div>
              <p className="text-xs text-gray-600">2 new this month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Challenges</CardTitle>
              <Target className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{teacherData.totalChallenges}</div>
              <p className="text-xs text-gray-600">5 pending review</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Performance</CardTitle>
              <TrendingUp className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{teacherData.avgPerformance}%</div>
              <p className="text-xs text-gray-600">↑ 3% from last month</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="courses">My Courses</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="challenges">Challenges</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column */}
              <div className="lg:col-span-2 space-y-6">
                {/* Course Performance */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <BarChart3 className="h-5 w-5 text-blue-600" />
                      <span>Course Performance</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {courses
                      .filter((course) => course.status === "active")
                      .map((course) => (
                        <div key={course.id} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <h4 className="font-medium">{course.title}</h4>
                            <div className="flex items-center space-x-2">
                              <Badge variant="secondary">{course.students} students</Badge>
                              <span className="text-sm text-gray-600">{course.avgScore}% avg</span>
                            </div>
                          </div>
                          <Progress value={course.completion} className="h-2" />
                          <div className="flex justify-between text-sm text-gray-600">
                            <span>{course.completion}% complete</span>
                            <span>Updated {course.lastUpdated}</span>
                          </div>
                        </div>
                      ))}
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Clock className="h-5 w-5 text-green-600" />
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
                            <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Pending Reviews */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <FileText className="h-5 w-5 text-orange-600" />
                      <span>Pending Reviews</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {pendingReviews.map((review) => (
                      <div key={review.id} className="border rounded-lg p-3 space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-sm">{review.student}</p>
                            <p className="text-xs text-gray-600">{review.challenge}</p>
                            <p className="text-xs text-gray-500">{review.course}</p>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {review.submittedAt}
                          </Badge>
                        </div>
                        <Button size="sm" className="w-full">
                          Review Submission
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button
                      className="w-full justify-start bg-transparent"
                      variant="outline"
                      onClick={() => setIsCreateChallengeOpen(true)}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Create Challenge
                    </Button>
                    <Button className="w-full justify-start bg-transparent" variant="outline">
                      <Upload className="mr-2 h-4 w-4" />
                      Import Students
                    </Button>
                    <Button className="w-full justify-start bg-transparent" variant="outline">
                      <Download className="mr-2 h-4 w-4" />
                      Export Grades
                    </Button>
                    <Button className="w-full justify-start bg-transparent" variant="outline">
                      <MessageCircle className="mr-2 h-4 w-4" />
                      AI Assistant
                    </Button>
                  </CardContent>
                </Card>

                {/* Top Performers */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Star className="h-5 w-5 text-yellow-600" />
                      <span>Top Performers</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {students
                      .sort((a, b) => b.avgScore - a.avgScore)
                      .slice(0, 3)
                      .map((student, index) => (
                        <div key={student.id} className="flex items-center space-x-3">
                          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-yellow-100 text-yellow-800 text-xs font-bold">
                            {index + 1}
                          </div>
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>
                              {student.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{student.name}</p>
                            <p className="text-xs text-gray-600">{student.avgScore}% avg</p>
                          </div>
                        </div>
                      ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Courses Tab */}
          <TabsContent value="courses" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">My Courses</h3>
              <Button onClick={() => setIsCreateCourseOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Course
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <Card key={course.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{course.title}</CardTitle>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Course
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="mr-2 h-4 w-4" />
                            Export Data
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Course
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Students</p>
                        <p className="font-semibold">{course.students}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Challenges</p>
                        <p className="font-semibold">{course.challenges}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Avg Score</p>
                        <p className="font-semibold">{course.avgScore}%</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Status</p>
                        <Badge variant={course.status === "active" ? "default" : "secondary"}>{course.status}</Badge>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{course.completion}%</span>
                      </div>
                      <Progress value={course.completion} className="h-2" />
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <span className="text-sm text-gray-600">Updated {course.lastUpdated}</span>
                      <Button size="sm">
                        Manage
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Students Tab */}
          <TabsContent value="students" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Student Management</h3>
              <div className="flex space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input placeholder="Search students..." className="pl-10 w-64" />
                </div>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button>
                  <Upload className="h-4 w-4 mr-2" />
                  Import
                </Button>
              </div>
            </div>

            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Courses</TableHead>
                    <TableHead>Avg Score</TableHead>
                    <TableHead>Streak</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>
                              {student.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{student.name}</p>
                            <p className="text-sm text-gray-600">{student.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{student.courses}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            student.avgScore >= 90 ? "default" : student.avgScore >= 80 ? "secondary" : "destructive"
                          }
                        >
                          {student.avgScore}%
                        </Badge>
                      </TableCell>
                      <TableCell>{student.streak} days</TableCell>
                      <TableCell>{student.lastActive}</TableCell>
                      <TableCell>
                        <Badge variant={student.status === "active" ? "default" : "secondary"}>{student.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <MessageCircle className="mr-2 h-4 w-4" />
                              Send Message
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <BarChart3 className="mr-2 h-4 w-4" />
                              View Progress
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          {/* Challenges Tab */}
          <TabsContent value="challenges" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Challenge Management</h3>
              <Button onClick={() => setIsCreateChallengeOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Challenge
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="border-dashed border-2 border-gray-300 hover:border-gray-400 transition-colors">
                <CardContent className="flex flex-col items-center justify-center h-48 text-center">
                  <Plus className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">Create New Challenge</h3>
                  <p className="text-sm text-gray-600 mb-4">Design engaging challenges for your students</p>
                  <Button onClick={() => setIsCreateChallengeOpen(true)}>Get Started</Button>
                </CardContent>
              </Card>

              {/* Sample challenges would be mapped here */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">Calculus Derivatives</CardTitle>
                    <Badge>Active</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Course</p>
                      <p className="font-semibold">Advanced Calculus</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Difficulty</p>
                      <Badge variant="destructive">Hard</Badge>
                    </div>
                    <div>
                      <p className="text-gray-600">Submissions</p>
                      <p className="font-semibold">24/32</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Avg Score</p>
                      <p className="font-semibold">87%</p>
                    </div>
                  </div>
                  <Button size="sm" className="w-full">
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Engagement</CardTitle>
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">94%</div>
                  <p className="text-xs text-gray-600">↑ 12% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">89%</div>
                  <p className="text-xs text-gray-600">↑ 5% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Study Time</CardTitle>
                  <Clock className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2.4h</div>
                  <p className="text-xs text-gray-600">per student/day</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                  <Award className="h-4 w-4 text-yellow-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">92%</div>
                  <p className="text-xs text-gray-600">challenges passed</p>
                </CardContent>
              </Card>
            </div>

            <Alert>
              <BarChart3 className="h-4 w-4" />
              <AlertDescription>
                Detailed analytics and reporting features are coming soon. Export current data using the buttons above.
              </AlertDescription>
            </Alert>
          </TabsContent>
        </Tabs>
      </main>

      {/* Create Course Dialog */}
      <Dialog open={isCreateCourseOpen} onOpenChange={setIsCreateCourseOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Course</DialogTitle>
            <DialogDescription>Add a new course to your teaching portfolio.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="course-title" className="text-right">
                Title
              </Label>
              <Input id="course-title" placeholder="Course title" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="course-description" className="text-right">
                Description
              </Label>
              <Textarea id="course-description" placeholder="Course description" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="course-difficulty" className="text-right">
                Difficulty
              </Label>
              <Select>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Create Course</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Challenge Dialog */}
      <Dialog open={isCreateChallengeOpen} onOpenChange={setIsCreateChallengeOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Challenge</DialogTitle>
            <DialogDescription>Design a new challenge for your students.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="challenge-title" className="text-right">
                Title
              </Label>
              <Input id="challenge-title" placeholder="Challenge title" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="challenge-course" className="text-right">
                Course
              </Label>
              <Select>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id.toString()}>
                      {course.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="challenge-type" className="text-right">
                Type
              </Label>
              <Select>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="quiz">Quiz</SelectItem>
                  <SelectItem value="assignment">Assignment</SelectItem>
                  <SelectItem value="project">Project</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Create Challenge</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
