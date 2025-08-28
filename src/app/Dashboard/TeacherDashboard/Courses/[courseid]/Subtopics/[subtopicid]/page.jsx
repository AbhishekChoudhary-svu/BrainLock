"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  Brain,
  Upload,
  Save,
  ImageIcon,
  AlertCircle,
  CheckCircle,
  FileText,
  Pencil,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import TextEditor from "@/components/TextEditor/page";
import { Loading1 } from "@/components/Loader/loading";

export default function SubtopicContentManagePage() {
  const params = useParams();
  const { courseid, subtopicid } = params;

  const [subtopic, setSubtopic] = useState({});
  const [subtopicDescription, setSubtopicDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [subtopicImage, setSubtopicImage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  const [contents, setContents] = useState([]);
  const [editingContentId, setEditingContentId] = useState(null);

  // Fetch subtopic
  async function fetchSubtopics() {
    try {
      setLoading(true);
      const res = await fetch(`/api/teacher/subTopics/${subtopicid}`);
      if (!res.ok) throw new Error("Failed to fetch subtopic");
      const data = await res.json();
      setSubtopic(data.data);
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function fetchContents() {
    try {
      setLoading(true);
      const res = await fetch(`/api/teacher/theory?subtopic=${subtopicid}`);
      if (!res.ok) throw new Error("Failed to fetch contents");
      const data = await res.json();
      setContents(data.data);
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (subtopicid) {
      fetchSubtopics();
      fetchContents();
    }
  }, [subtopicid]);

  // File upload (PDF/DOC)
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file); // local preview
      setFileUrl(url);
    }
  };

  // Save content
  const handleSaveContent = async () => {
    setIsSaving(true);
    setSaveStatus(null);
    try {
      const payload = {
        title: subtopic.title,
        description: subtopicDescription,
        videoUrl,
        fileUrl,
        subtopic: subtopicid,
      };

      const method = editingContentId ? "PUT" : "POST";
      const url = editingContentId
        ? `/api/teacher/theory/${editingContentId}`
        : `/api/teacher/theory`;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save");
      {
        editingContentId
          ? toast.success("Content Updated Successfully")
          : toast.success("Content Created Successfully");
      }

      setSaveStatus("success");
      setEditingContentId(null); // reset edit mode
      setSubtopicDescription("");
      setVideoUrl("");
      setFileUrl("");
      fetchContents(); // refresh contents
    } catch (error) {
      toast.error("Failed to create or update");
      setSaveStatus("error");
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  const handleEdit = (content) => {
    setEditingContentId(content._id);
    setSubtopicDescription(content.description || "");
    setVideoUrl(content.videoUrl || "");
    setFileUrl(content.fileUrl || "");
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/teacher/theory/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) toast.error("Failed to delete");

      toast.success("Content Deleted Successfully");
      fetchContents();
    } catch (err) {
      console.error(err.message);
    }
  };
   if (loading)
      return (
        <div className="p-6">
          <Loading1/>
        </div>
      );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-slate-950 border-b dark:border-gray-900 border-gray-200 sticky top-0 z-40">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link
              href={`/Dashboard/TeacherDashboard/Courses/${courseid}/`}
              className="flex items-center space-x-3 dark:text-gray-100 text-gray-900 hover:text-green-600 transition-colors"
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

      {/* Main */}
      <main className="flex-1 max-w-8xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Form */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ImageIcon className="h-5 w-5 text-blue-600" />
              <span>Subtopic Details & Content</span>
            </CardTitle>
            <CardDescription>
              Manage subtopic title, theory content, videos, PDFs, and images.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="subtopic-title">Subtopic Title</Label>
              <Input
                id="subtopic-title"
                value={subtopic?.title}
                disabled
                placeholder="Enter subtopic title"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="subtopic-description">Theory / Article</Label>
              <TextEditor
                value={subtopicDescription}
                onChange={setSubtopicDescription}
              />
              {/* <Textarea
                id="subtopic-description"
                value={subtopicDescription}
                onChange={(e) => setSubtopicDescription(e.target.value)}
                placeholder="Write theory or article content here..."
                rows={8}
              /> */}
            </div>

            {/* Video URL */}
            <div className="space-y-2">
              <Label htmlFor="video-url">Video (YouTube / Embed URL)</Label>
              <Input
                id="video-url"
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://www.youtube.com/embed/..."
              />
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <Label htmlFor="file-upload">Attach PDF / File</Label>
              <Input
                id="file-upload"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileUpload}
              />
            </div>

            {/* Image Upload
            <div className="space-y-2">
              <Label htmlFor="subtopic-image">Subtopic Image</Label>
              <Input
                id="subtopic-image"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </div> */}

            {/* Save Button */}
            <div className="flex items-center justify-end gap-4">
              {saveStatus === "success" && (
                <div className="flex items-center text-green-600 text-sm">
                  <CheckCircle className="h-4 w-4 mr-2" /> Subtopic saved
                  successfully!
                </div>
              )}
              {saveStatus === "error" && (
                <div className="flex items-center text-red-600 text-sm">
                  <AlertCircle className="h-4 w-4 mr-2" /> Failed to save
                  subtopic.
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

        {/* --- FETCHED CONTENT LIST --- */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-blue-700">Saved Contents</CardTitle>
            <CardDescription>All contents for this subtopic</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {contents.length === 0 ? (
              <p className="text-gray-500">No contents added yet.</p>
            ) : (
              contents.map((c) => (
                <div
                  key={c._id}
                  className="border rounded-md p-4 flex justify-between items-start"
                >
                  <div>
                    <h3 className="font-bold pb-4">{c.title}</h3>
                    <div
                      className="ql-snow ql-editor border mr-4 rounded-lg "
                      dangerouslySetInnerHTML={{ __html: c.description }}
                    />

                    {c.videoUrl && (
                      <iframe
                        src={c.videoUrl}
                        className="w-full h-[70vh] rounded-md mt-10"
                        allowFullScreen
                      />
                    )}
                    {c.fileUrl && (
                      <a
                        href={c.fileUrl}
                        target="_blank"
                        className="text-blue-600 underline flex items-center mt-5"
                      >
                        <FileText className="h-4 w-4 mr-2 mt-1" /> {c.title}
                      </a>
                    )}
                  </div>
                  <div className="flex flex-col gap-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(c)}
                    >
                      <Pencil className="h-4 w-4 mr-1" /> Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(c._id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" /> Delete
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
