"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash2, Edit, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { QuestionLoading } from "@/components/Loader/loading";

export default function ManageChallengePage() {
  const { challengeid } = useParams();

  const [loading, setLoading] = useState(true);
  const [challenge, setChallenge] = useState({});
  const [questions, setQuestions] = useState([]);
  const [editQuestionId, setEditQuestionId] = useState(null);

  // Fetch challenge by ID
  const fetchChallenge = async () => {
    try {
      
      const res = await fetch(`/api/teacher/challenges/${challengeid}`);
      const data = await res.json();
      if (res.ok) {
        setChallenge(data.data);
      } else {
        toast.error(data.error || "Failed to fetch challenge");
      }
    } catch (err) {
      toast.error("Error fetching challenge");
    } finally {
      setLoading(false);
    }
  };

  const fetchChallengeMcqs = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/teacher/mcqs?challengeId=${challengeid}`);
      const data = await res.json();

      if (res.ok) {
        setQuestions(data.data);
      } else {
        toast.error(data.error || "Failed to fetch challenge MCQs");
      }
    } catch (err) {
      toast.error("Error fetching challenge MCQs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChallenge();
    fetchChallengeMcqs();
  }, [challengeid]);

  const [newMcqQuestion, setNewMcqQuestion] = useState("");
  const [newMcqOptions, setNewMcqOptions] = useState(["", "", "", ""]);
  const [newMcqCorrectAnswer, setNewMcqCorrectAnswer] = useState("");

  // Option management
  const handleAddMcqOption = () => {
    setNewMcqOptions([...newMcqOptions, ""]);
  };

  const handleMcqOptionChange = (index, value) => {
    const updatedOptions = [...newMcqOptions];
    updatedOptions[index] = value;
    setNewMcqOptions(updatedOptions);
  };

  const handleRemoveMcqOption = (index) => {
    const updatedOptions = newMcqOptions.filter((_, i) => i !== index);
    setNewMcqOptions(updatedOptions);
  };

  const handleEditQuestion = (question) => {
    setEditQuestionId(question._id);
    setNewMcqQuestion(question.question);
    setNewMcqOptions(question.options.map((opt) => opt.text));
    const correctOpt = question.options.find((opt) => opt.isCorrect);
    setNewMcqCorrectAnswer(correctOpt?.text || "");
  };

  // Add new question
  const handleSaveQuestion = async () => {
    if (
      !newMcqQuestion ||
      newMcqOptions.some((opt) => !opt) ||
      !newMcqCorrectAnswer
    ) {
      toast.error("Please fill all MCQ fields.");
      return;
    }

    if (!newMcqOptions.includes(newMcqCorrectAnswer)) {
      toast.error("Correct answer must be one of the options.");
      return;
    }

    const formattedOptions = newMcqOptions.map((opt) => ({
      text: opt,
      isCorrect: opt === newMcqCorrectAnswer,
    }));

    const questionPayload = {
      type: "mcq",
      question: newMcqQuestion,
      options: formattedOptions,
      subjectChallenge: challengeid,
    };

    try {
      const url = editQuestionId
        ? `/api/teacher/mcqs/${editQuestionId}`
        : `/api/teacher/mcqs`;

      const res = await fetch(url, {
        method: editQuestionId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(questionPayload),
      });

      const data = await res.json();

      if (res.ok) {
        if (editQuestionId) {
          setQuestions(
            questions.map((q) => (q._id === editQuestionId ? data.data : q))
          );
          toast.success("Question updated successfully!");
        } else {
          setQuestions([...questions, data.data]);
          toast.success("Question added successfully!");
        }

        // Reset form
        setEditQuestionId(null);
        setNewMcqQuestion("");
        setNewMcqOptions(["", "", "", ""]);
        setNewMcqCorrectAnswer("");
      } else {
        toast.error(data.error || "Failed to save question");
      }
    } catch (err) {
      toast.error("Error saving question");
    }
  };

  // Delete question
  const handleDeleteQuestion = async (id) => {
    try {
      const res = await fetch(`/api/teacher/mcqs/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        setQuestions(questions.filter((q) => q._id !== id));
        toast.info("The question has been removed.");
      } else {
        toast.error(data.error || "Failed to delete question");
      }
    } catch (err) {
      toast.error("Error deleting question");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 p-8">
      <div className="max-w-8xl mx-auto bg-white dark:bg-slate-900 p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-6">
          <Link href="/Dashboard/TeacherDashboard">
            <Button variant="ghost">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-2xl font-bold dark:text-gray-100 text-gray-900">
            Manage Challenge: {challenge.title}
          </h1>
          <div></div> {/* Placeholder */}
        </div>

        {/* Add / Edit Question Form */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>
              {editQuestionId ? "Edit Question" : "Add New Question"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="mcq-question" className="mb-2">
                  Question
                </Label>
                <Input
                  id="mcq-question"
                  placeholder="Enter MCQ question"
                  value={newMcqQuestion}
                  onChange={(e) => setNewMcqQuestion(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Options</Label>
                {newMcqOptions.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      placeholder={`Option ${index + 1}`}
                      value={option}
                      onChange={(e) =>
                        handleMcqOptionChange(index, e.target.value)
                      }
                    />
                    {newMcqOptions.length > 2 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveMcqOption(index)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddMcqOption}
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Option
                </Button>
              </div>
              <div>
                <Label htmlFor="mcq-correct-answer" className="mb-2">
                  Correct Answer
                </Label>
                <Input
                  id="mcq-correct-answer"
                  placeholder="Enter correct answer (must match an option)"
                  value={newMcqCorrectAnswer}
                  onChange={(e) => setNewMcqCorrectAnswer(e.target.value)}
                />
              </div>
            </div>

            <Button onClick={handleSaveQuestion} className="w-full">
              {editQuestionId ? "Update Question" : "Add Question"}
            </Button>
          </CardContent>
        </Card>

        {/* Existing Questions */}
        
        {loading  ? <QuestionLoading/> : <>
        <h2 className="text-xl font-bold dark:text-gray-100 text-gray-900 mb-4">
          Existing Questions ({questions.length})
        </h2>
        <div className="space-y-4">
          {questions.length === 0 ? (
            <p className="text-gray-600">
              No questions added yet. Start by adding one above!
            </p>
          ) : (
            questions.map((q, index) => (
              <Card key={q._id || index}>
                <CardContent className="p-4 flex justify-between items-start">
                  <div className="flex-1 pr-4">
                    <p className="text-sm font-medium dark:text-gray-300 text-gray-700 mb-1">
                      Question {index + 1}
                    </p>
                    <p className="text-lg font-semibold mb-2">{q.question}</p>

                    {Array.isArray(q.options) && q.options.length > 0 && (
                      <div className="space-y-1 text-sm">
                        {q.options.map((option, optIndex) => (
                          <p
                            key={option._id || optIndex}
                            className={
                              option.isCorrect
                                ? "font-medium text-green-600"
                                : "text-gray-600 dark:text-gray-200"
                            }
                          >
                            {String.fromCharCode(65 + optIndex)}. {option.text}
                            {option.isCorrect && " (Correct)"}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEditQuestion(q)}
                    >
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit Question</span>
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDeleteQuestion(q._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete Question</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
        </>}
        
      </div>
    </div>
  );
}
