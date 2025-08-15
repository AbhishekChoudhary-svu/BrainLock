"use client"

import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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

export default function CourseSubtopicManagePage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params.courseid // Make sure your folder is named [id]

  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isCreateSubtopicOpen, setIsCreateSubtopicOpen] = useState(false)
  const [newSubtopicTitle, setNewSubtopicTitle] = useState("")

  useEffect(() => {
    async function fetchCourse() {
      try {
        setLoading(true)
        const res = await fetch(`/api/teacher/courses/${courseId}`)
        if (!res.ok) {
          const { error } = await res.json()
          throw new Error(error || "Failed to fetch course")
        }
        const data = await res.json()
        setCourse(data.data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    if (courseId) fetchCourse()
  }, [courseId])

  const handleCreateSubtopic = async () => {
    if (!newSubtopicTitle.trim()) return
    try {
      // Call backend API to create subtopic here
      // await fetch(`/api/course/${courseId}/subtopics`, { method: "POST", body: JSON.stringify({...}) })

      // Temp local update for UI without refetch
      setCourse(prev => ({
        ...prev,
        subtopics: [
          ...(prev.subtopics || []),
          {
            _id: `temp-${Date.now()}`,
            title: newSubtopicTitle.trim(),
            content: "New subtopic content",
          },
        ],
      }))
      setNewSubtopicTitle("")
      setIsCreateSubtopicOpen(false)
    } catch (err) {
      console.error(err)
    }
  }

  const handleDeleteSubtopic = async (subtopicId) => {
    try {
      // await fetch(`/api/subtopic/${subtopicId}`, { method: "DELETE" })
      setCourse(prev => ({
        ...prev,
        subtopics: prev.subtopics.filter(s => s._id !== subtopicId),
      }))
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) return <p className="p-6">Loading...</p>
  if (error) return <p className="p-6 text-red-500">{error}</p>
  if (!course) return <p className="p-6">Course not found.</p>

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
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Manage Subtopics for {course.title}
          </h2>
          <p className="text-lg text-gray-600">
            Add, edit, or remove subtopics and their content.
          </p>
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
              <DialogContent>
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
            {(!course.subtopics || course.subtopics.length === 0) ? (
              <div className="text-center text-gray-500 py-8">
                No subtopics added yet. Click "Create New Subtopic" to get started!
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {course.subtopics.map((subtopic) => (
                  <Card key={subtopic._id} className="lg:flex-row flex items-center justify-between p-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{subtopic.title}</h3>
                      <p className="text-sm text-gray-600">ID: {subtopic._id}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Link href={`/Dashboard/TeacherDashboard/Courses/${courseId}/manage/${subtopic._id}`}>
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
                            onClick={() => handleDeleteSubtopic(subtopic._id)}
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
