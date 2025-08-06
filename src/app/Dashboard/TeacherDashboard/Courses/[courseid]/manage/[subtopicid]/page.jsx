"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Brain, Upload, Save, ImageIcon, AlertCircle, CheckCircle } from 'lucide-react'

// Mock data for courses with nested subtopics (must be consistent with parent page)
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

export default function SubtopicContentManagePage() {
  const params = useParams()
  const { courseid, subtopicId } = params

  const course = mockCoursesWithSubtopics[courseid]
  const initialSubtopicData = course?.subtopics.find((st) => st.id === subtopicId) || {
    title: "Unknown Subtopic",
    content: "No content available for this subtopic yet. Start adding some!",
    imageUrl: "/placeholder.svg?height=300&width=500",
  }

  const [subtopicTitle, setSubtopicTitle] = useState(initialSubtopicData.title)
  const [subtopicContent, setSubtopicContent] = useState(initialSubtopicData.content)
  const [subtopicImage, setSubtopicImage] = useState(initialSubtopicData.imageUrl)
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState(null) // null, 'success', 'error'

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setSubtopicImage(reader.result) // This will be a data URL for local preview
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSaveContent = async () => {
    setIsSaving(true)
    setSaveStatus(null)
    try {
      // Simulate API call to save content
      await new Promise((resolve) => setTimeout(resolve, 1500))
      console.log("Saving subtopic content:", { subtopicTitle, subtopicContent, subtopicImage })
      setSaveStatus("success")
      // In a real app, you'd update the actual data source here
      // const subtopicIndex = course.subtopics.findIndex(st => st.id === subtopicId);
      // if (subtopicIndex !== -1) {
      //   course.subtopics[subtopicIndex] = { ...course.subtopics[subtopicIndex], title: subtopicTitle, content: subtopicContent, imageUrl: subtopicImage };
      // }
    } catch (error) {
      console.error("Failed to save content:", error)
      setSaveStatus("error")
    } finally {
      setIsSaving(false)
      setTimeout(() => setSaveStatus(null), 3000) // Clear status message after 3 seconds
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link
              href={`/Dashboard/TeacherDashboard/Courses/${courseid}/manage`}
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
              Edit Subtopic Content
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Edit Content for "{subtopicTitle}"</h2>
          <p className="text-lg text-gray-600">Course: {course?.title || "Loading..."}</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ImageIcon className="h-5 w-5 text-blue-600" />
              <span>Subtopic Details & Content</span>
            </CardTitle>
            <CardDescription>Update the title, theory, and associated image for this subtopic.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Subtopic Title */}
            <div className="space-y-2">
              <Label htmlFor="subtopic-title">Subtopic Title</Label>
              <Input
                id="subtopic-title"
                value={subtopicTitle}
                onChange={(e) => setSubtopicTitle(e.target.value)}
                placeholder="Enter subtopic title"
              />
            </div>

            {/* Subtopic Content (Text) */}
            <div className="space-y-2">
              <Label htmlFor="subtopic-content">Subtopic Theory / Content</Label>
              <Textarea
                id="subtopic-content"
                value={subtopicContent}
                onChange={(e) => setSubtopicContent(e.target.value)}
                placeholder="Write your subtopic theory here..."
                rows={15}
                className="min-h-[200px]"
              />
              <p className="text-sm text-gray-500">
                For advanced styling (bold, italics, lists), consider integrating a rich text editor like TinyMCE or Quill.
              </p>
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <Label htmlFor="subtopic-image">Subtopic Image</Label>
              <div className="flex items-center space-x-4">
                <Input
                  id="subtopic-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="flex-1"
                />
                <Button variant="outline" className="shrink-0">
                  <Upload className="mr-2 h-4 w-4" /> Upload
                </Button>
              </div>
              {subtopicImage && (
                <div className="mt-4 border rounded-md overflow-hidden">
                  <img
                    src={subtopicImage || "/placeholder.svg"}
                    alt="Subtopic Preview"
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/placeholder.svg?height=300&width=500";
                    }}
                  />
                </div>
              )}
              <p className="text-xs text-gray-500">Upload a new image or paste an image URL directly into the input above.</p>
            </div>

            {/* Save Button and Status */}
            <div className="flex items-center justify-end gap-4">
              {saveStatus === "success" && (
                <div className="flex items-center text-green-600 text-sm">
                  <CheckCircle className="h-4 w-4 mr-2" /> Content saved successfully!
                </div>
              )}
              {saveStatus === "error" && (
                <div className="flex items-center text-red-600 text-sm">
                  <AlertCircle className="h-4 w-4 mr-2" /> Failed to save content.
                </div>
              )}
              <Button onClick={handleSaveContent} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Save className="mr-2 h-4 w-4 animate-pulse" /> Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" /> Save Changes
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
