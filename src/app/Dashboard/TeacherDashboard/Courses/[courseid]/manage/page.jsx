"use client"

import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ArrowLeft, Brain, Plus, Edit, Trash2, ChevronRight, MoreHorizontal } from 'lucide-react'

// Mock data for courses with nested subtopics
const mockCoursesWithSubtopics = {
  "1": {
    id: 1,
    title: "Advanced Calculus",
    subtopics: [
      {
        id: "1-1",
        title: "Introduction to Multivariable Calculus",
        content: `This section introduces the fundamental concepts of multivariable calculus, including functions of several variables, limits, and continuity.`,
        imageUrl: "/placeholder.svg?height=300&width=500",
      },
      {
        id: "1-2",
        title: "Partial Derivatives and Gradients",
        content: `Explore the concept of partial derivatives and how to compute them. Understand the geometric interpretation of the gradient vector.`,
        imageUrl: "/placeholder.svg?height=300&width=500",
      },
      {
        id: "1-3",
        title: "Multiple Integrals",
        content: `Learn about double and triple integrals, their properties, and applications in calculating areas, volumes, and mass.`,
        imageUrl: "/placeholder.svg?height=300&width=500",
      },
    ],
  },
  "2": {
    id: 2,
    title: "Linear Algebra",
    subtopics: [
      {
        id: "2-1",
        title: "Vectors and Vector Spaces",
        content: `An introduction to vectors, vector operations, and the definition of vector spaces and subspaces.`,
        imageUrl: "/placeholder.svg?height=300&width=500",
      },
      {
        id: "2-2",
        title: "Matrices and Linear Transformations",
        content: `Understand matrices, matrix operations, and how matrices represent linear transformations.`,
        imageUrl: "/placeholder.svg?height=300&width=500",
      },
    ],
  },
  "3": {
    id: 3,
    title: "Statistics Fundamentals",
    subtopics: [
      {
        id: "3-1",
        title: "Descriptive Statistics",
        content: `Learn to summarize and describe data using measures of central tendency (mean, median, mode) and dispersion (variance, standard deviation).`,
        imageUrl: "/placeholder.svg?height=300&width=500",
      },
      {
        id: "3-2",
        title: "Probability Basics",
        content: `Introduction to probability theory, including events, sample spaces, and basic probability rules.`,
        imageUrl: "/placeholder.svg?height=300&width=500",
      },
    ],
  },
  "4": {
    id: 4,
    title: "Geometry Basics",
    subtopics: [
      {
        id: "4-1",
        title: "Euclidean Geometry",
        content: `Fundamental concepts of Euclidean geometry, including points, lines, planes, and basic postulates.`,
        imageUrl: "/placeholder.svg?height=300&width=500",
      },
    ],
  },
}

export default function CourseSubtopicManagePage() {
  const params = useParams()
  const router = useRouter()
  const { courseid } = params

  const course = mockCoursesWithSubtopics[courseid] || {
    id: courseid,
    title: "Unknown Course",
    subtopics: [],
  }
  useEffect(()=>{
     console.log(courseid)
  },[courseid])

  const [isCreateSubtopicOpen, setIsCreateSubtopicOpen] = useState(false)
  const [newSubtopicTitle, setNewSubtopicTitle] = useState("")

  const handleCreateSubtopic = () => {
    if (newSubtopicTitle.trim()) {
      const newId = `${courseid}-${course.subtopics.length + 1}` // Simple ID generation
      const newSubtopic = {
        id: newId,
        title: newSubtopicTitle.trim(),
        content: "New subtopic content goes here.",
        imageUrl: "/placeholder.svg?height=300&width=500",
      }
      // In a real app, you'd update a backend here
      course.subtopics.push(newSubtopic) // Directly modifying mock data for demonstration
      setNewSubtopicTitle("")
      setIsCreateSubtopicOpen(false)
      // Force re-render to show new subtopic (optional, but good for mock data)
      router.refresh()
    }
  }

  const handleDeleteSubtopic = (subtopicToDeleteId) => {
    // In a real app, you'd call an API to delete
    const updatedSubtopics = course.subtopics.filter(
      (subtopic) => subtopic.id !== subtopicToDeleteId
    )
    course.subtopics = updatedSubtopics // Directly modifying mock data
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link
              href="/Dashboard/TeacherDashboard"
              className="flex items-center space-x-3 text-gray-900 hover:text-green-600 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <Brain className="h-8 w-8 text-green-600" />
              <div>
                <h1 className="text-xl font-bold">Brain Lock</h1>
                <p className="text-xs text-gray-500">Teacher Dashboard</p>
              </div>
            </Link>
            <Badge variant="secondary" className="text-sm">
              Manage Subtopics
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Manage Subtopics for {course.title}</h2>
          <p className="text-lg text-gray-600">Add, edit, or remove subtopics and their content.</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Plus className="h-5 w-5 text-green-600" />
              <span>Subtopics</span>
            </CardTitle>
            <Dialog open={isCreateSubtopicOpen} onOpenChange={setIsCreateSubtopicOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Subtopic
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Create New Subtopic</DialogTitle>
                  <DialogDescription>Enter the title for your new subtopic.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="subtopic-title" className="text-right">
                      Title
                    </Label>
                    <Input
                      id="subtopic-title"
                      value={newSubtopicTitle}
                      onChange={(e) => setNewSubtopicTitle(e.target.value)}
                      placeholder="e.g., Introduction to Derivatives"
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleCreateSubtopic}>Create Subtopic</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent className="space-y-4">
            {course.subtopics.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                No subtopics added yet. Click "Create New Subtopic" to get started!
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {course.subtopics.map((subtopic) => (
                  <Card key={subtopic.id} className="lg:flex-row flex items-center justify-between p-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{subtopic.title}</h3>
                      <p className="text-sm text-gray-600">ID: {subtopic.id}</p>
                    </div>
                    <div className="flex items-center  space-x-2">
                      <Link href={`/Dashboard/TeacherDashboard/Courses/${courseid}/manage/${subtopic.id}`}>
                        <Button variant="outline" size="sm">
                          Manage Content
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                      </Link>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Rename Subtopic
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDeleteSubtopic(subtopic.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Subtopic
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
