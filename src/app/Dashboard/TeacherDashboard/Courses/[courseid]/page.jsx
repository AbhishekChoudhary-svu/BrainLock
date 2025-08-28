"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArrowLeft,
  Brain,
  Plus,
  Edit,
  Trash2,
  ChevronRight,
  MoreHorizontal,
  Loader2,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {SubtopicLoading} from "@/components/Loader/loading";

export default function CourseSubtopicManagePage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseid; // Make sure your folder is named [id]

  const [course, setCourse] = useState([]);
  const [subtopic, setSubtopic] = useState([]);
  const [newSubtopicDescription, setNewSubtopicDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isCreateSubtopicOpen, setIsCreateSubtopicOpen] = useState(false);
  const [newSubtopicTitle, setNewSubtopicTitle] = useState("");
  const [editingSubtopicId, setEditingSubtopicId] = useState(null);

  async function fetchCourse() {
    try {
      setLoading(true);
      const res = await fetch(`/api/teacher/courses/${courseId}`);
      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error || "Failed to fetch course");
      }
      const data = await res.json();
      setCourse(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }
  async function fetchCourseSubTopics() {
    try {
      setLoading(true);
      const res = await fetch(`/api/teacher/subTopics?courseId=${courseId}`);
      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error || "Failed to fetch subtopics");
      }
      const data = await res.json();
      setSubtopic(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (courseId) {
      fetchCourse();
      fetchCourseSubTopics();
    }
  }, [courseId]);

  const handleEditSubtopic = (sub) => {
    setNewSubtopicTitle(sub.title);
    setNewSubtopicDescription(sub.description);
    setEditingSubtopicId(sub._id);
    setIsCreateSubtopicOpen(true);
  };

  const handleSaveSubtopic = async () => {
    try {
      const payload = {
        title: newSubtopicTitle,
        description: newSubtopicDescription,
        course: courseId,
        contents: [],
      };

      let res;
      if (editingSubtopicId) {
        // UPDATE
        res = await fetch(`/api/teacher/subTopics/${editingSubtopicId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        // CREATE
        res = await fetch("/api/teacher/subTopics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();

      if (data.success) {
        toast.success(
          editingSubtopicId
            ? "Subtopic updated successfully!"
            : "Subtopic created successfully!"
        );

        fetchCourseSubTopics(); // refresh list

        // reset form
        setNewSubtopicTitle("");
        setNewSubtopicDescription("");
        setEditingSubtopicId(null);
        setIsCreateSubtopicOpen(false);
      } else {
        toast.error(data.error || "Failed to save subtopic");
      }
    } catch (error) {
      toast.error("Error saving subtopic:", error.message);
    }
  };

  const handleDeleteSubtopic = async (subtopicId) => {
    try {
      const res = await fetch(`/api/teacher/subTopics/${subtopicId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Remove from local state
        toast.success(data.message || "SubTopics Deleted Successfully");
        setSubtopic((prev) => prev.filter((s) => s._id !== subtopicId));
      } else {
        toast.error(data.message || "Failed to delete subtopic");
      }
    } catch (err) {
      console.error("Error deleting subtopic:", err);
      toast.error("Something went wrong while deleting subtopic");
    }
  };

  if (error) return <p className="p-6 text-red-500">{error}</p>;
  if (!course) return <p className="p-6">Course not found.</p>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-slate-950 border-b border-gray-200 dark:border-gray-900 sticky top-0 z-40">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link
              href="/Dashboard/TeacherDashboard"
              className="flex items-center space-x-3 dark:text-gray-100 text-gray-900 hover:text-green-600 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <Brain className="h-8 w-8 text-green-600" />
              <div>
                <h1 className="text-xl font-bold dark:text-gray-100">
                  Brain Lock
                </h1>
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
      <main className="flex-1 max-w-8xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold dark:text-gray-100 text-gray-900 mb-2">
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
            <Dialog
              open={isCreateSubtopicOpen}
              onOpenChange={setIsCreateSubtopicOpen}
            >
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Subtopic
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingSubtopicId
                      ? "Edit Subtopic"
                      : "Create New Subtopic"}
                  </DialogTitle>
                  <DialogDescription>
                    Fill in details to create a new subtopic.
                  </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                  {/* Title */}
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

                  {/* Description */}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label
                      htmlFor="subtopic-description"
                      className="text-right"
                    >
                      Description
                    </Label>
                    <Textarea
                      id="subtopic-description"
                      value={newSubtopicDescription}
                      onChange={(e) =>
                        setNewSubtopicDescription(e.target.value)
                      }
                      placeholder="Brief description of subtopic"
                      className="col-span-3"
                    />
                  </div>

                  {/* Course Selection */}
                  <div className="flex items-center gap-18">
                    <Label htmlFor="subtopic-course" className="text-right">
                      Course
                    </Label>
                    <Input
                      id="subtopic-course"
                      value={course?.title || ""}
                      disabled
                      className="col-span-3 text-black dark:text-gray-100 bg-gray-100"
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button onClick={handleSaveSubtopic}>
                    {editingSubtopicId ? "Update Subtopic" : "Create Subtopic"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent className="space-y-4">
           { loading ? <SubtopicLoading/> :  !subtopic || subtopic.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                No subtopics added yet. Click "Create New Subtopic" to get
                started!
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {subtopic.map((subtopic) => (
                  <Card
                    key={subtopic._id}
                    className="lg:flex-row flex items-center justify-between p-4"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">
                        {subtopic.title}
                      </h3>
                      <p className="text-sm dark:text-gray-400 text-gray-600">
                        Description : {subtopic.description}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Link
                        href={`/Dashboard/TeacherDashboard/Courses/${courseId}/Subtopics/${subtopic._id}`}
                      >
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
                          <DropdownMenuItem
                            onClick={() => handleEditSubtopic(subtopic)}
                          >
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
  );
}
