"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Plus, Trash2, Edit, ChevronLeft } from 'lucide-react'
import Link from "next/link"
import { toast } from "sonner"

export default function ManageChallengePage() {
  const { challengeId } = useParams()
  

  // Mock data for challenges and questions
  const mockChallenges = {
    "1": {
      id: 1,
      title: "Calculus Derivatives",
      course: "Advanced Calculus",
      difficulty: "Hard",
      questions: [
        {
          id: "q1",
          type: "mcq",
          question: "What is the derivative of f(x) = x^2?",
          options: ["2x", "x", "x^3/3", "2"],
          correctAnswer: "2x",
        },
        {
          id: "q2",
          type: "assignment",
          question: "Explain the concept of limits in calculus.",
          description: "Provide a detailed explanation with examples.",
        },
      ],
    },
    "2": {
      id: 2,
      title: "Linear Systems",
      course: "Linear Algebra",
      difficulty: "Medium",
      questions: [
        {
          id: "q3",
          type: "mcq",
          question: "Which of the following is a linear equation?",
          options: ["y = x^2 + 1", "y = 2x + 3", "y = sin(x)", "y = 1/x"],
          correctAnswer: "y = 2x + 3",
        },
      ],
    },
  }

  const challenge = mockChallenges[challengeId] || {
    id: challengeId,
    title: "New Challenge",
    course: "Unknown Course",
    difficulty: "Medium",
    questions: [],
  }

  const [questions, setQuestions] = useState(challenge.questions)
  const [newQuestionType, setNewQuestionType] = useState("mcq")
  const [newMcqQuestion, setNewMcqQuestion] = useState("")
  const [newMcqOptions, setNewMcqOptions] = useState(["", "", "", ""])
  const [newMcqCorrectAnswer, setNewMcqCorrectAnswer] = useState("")
  const [newAssignmentQuestion, setNewAssignmentQuestion] = useState("")
  const [newAssignmentDescription, setNewAssignmentDescription] = useState("")

  const handleAddMcqOption = () => {
    setNewMcqOptions([...newMcqOptions, ""])
  }

  const handleMcqOptionChange = (index, value) => {
    const updatedOptions = [...newMcqOptions]
    updatedOptions[index] = value
    setNewMcqOptions(updatedOptions)
  }

  const handleRemoveMcqOption = (index) => {
    const updatedOptions = newMcqOptions.filter((_, i) => i !== index)
    setNewMcqOptions(updatedOptions)
  }

  const handleAddQuestion = () => {
    if (newQuestionType === "mcq") {
      if (!newMcqQuestion || newMcqOptions.some(opt => !opt) || !newMcqCorrectAnswer) {
        toast.error("Please fill all MCQ fields.")
        return
      }
      if (!newMcqOptions.includes(newMcqCorrectAnswer)) {
         toast.error("Correct answer must be one of the options.")
       
        return
      }
      setQuestions([
        ...questions,
        {
          id: `q${questions.length + 1}`,
          type: "mcq",
          question: newMcqQuestion,
          options: newMcqOptions,
          correctAnswer: newMcqCorrectAnswer,
        },
      ])
      setNewMcqQuestion("")
      setNewMcqOptions(["", "", "", ""])
      setNewMcqCorrectAnswer("")
      toast.success("MCQ added successfully!")
    } else if (newQuestionType === "assignment") {
      if (!newAssignmentQuestion) {
         toast.error("Please fill the assignment question field.")
        return
      }
      setQuestions([
        ...questions,
        {
          id: `q${questions.length + 1}`,
          type: "assignment",
          question: newAssignmentQuestion,
          description: newAssignmentDescription,
        },
      ])
      setNewAssignmentQuestion("")
      setNewAssignmentDescription("")
      toast.success("Assignment question added successfully!")
    }
  }

  const handleDeleteQuestion = (id) => {
    setQuestions(questions.filter((q) => q.id !== id))
    toast.info("The question has been removed.")
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-6">
          <Link href="/Dashboard/TeacherDashboard">
            <Button variant="ghost">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Manage Challenge: {challenge.title}</h1>
          <div></div> {/* Placeholder for alignment */}
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Add New Question</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <RadioGroup
              defaultValue="mcq"
              onValueChange={setNewQuestionType}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="mcq" id="mcq-type" />
                <Label htmlFor="mcq-type">Multiple Choice Question</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="assignment" id="assignment-type" />
                <Label htmlFor="assignment-type">Assignment Question</Label>
              </div>
            </RadioGroup>

            <Separator />

            {newQuestionType === "mcq" ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="mcq-question">Question</Label>
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
                        onChange={(e) => handleMcqOptionChange(index, e.target.value)}
                      />
                      {newMcqOptions.length > 2 && (
                        <Button variant="ghost" size="icon" onClick={() => handleRemoveMcqOption(index)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={handleAddMcqOption}>
                    <Plus className="h-4 w-4 mr-2" /> Add Option
                  </Button>
                </div>
                <div>
                  <Label htmlFor="mcq-correct-answer">Correct Answer</Label>
                  <Input
                    id="mcq-correct-answer"
                    placeholder="Enter correct answer (must match an option)"
                    value={newMcqCorrectAnswer}
                    onChange={(e) => setNewMcqCorrectAnswer(e.target.value)}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="assignment-question">Question</Label>
                  <Input
                    id="assignment-question"
                    placeholder="Enter assignment question"
                    value={newAssignmentQuestion}
                    onChange={(e) => setNewAssignmentQuestion(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="assignment-description">Description (Optional)</Label>
                  <Textarea
                    id="assignment-description"
                    placeholder="Provide additional details or instructions"
                    value={newAssignmentDescription}
                    onChange={(e) => setNewAssignmentDescription(e.target.value)}
                  />
                </div>
              </div>
            )}
            <Button onClick={handleAddQuestion} className="w-full">
              Add Question
            </Button>
          </CardContent>
        </Card>

        <h2 className="text-xl font-bold text-gray-900 mb-4">Existing Questions ({questions.length})</h2>
        <div className="space-y-4">
          {questions.length === 0 ? (
            <p className="text-gray-600">No questions added yet. Start by adding one above!</p>
          ) : (
            questions.map((q, index) => (
              <Card key={q.id}>
                <CardContent className="p-4 flex justify-between items-start">
                  <div className="flex-1 pr-4">
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      Question {index + 1} ({q.type.toUpperCase()})
                    </p>
                    <p className="text-lg font-semibold mb-2">{q.question}</p>
                    {q.type === "mcq" && (
                      <div className="space-y-1 text-sm">
                        {q.options.map((option, optIndex) => (
                          <p
                            key={optIndex}
                            className={
                              option === q.correctAnswer
                                ? "font-medium text-green-600"
                                : "text-gray-600"
                            }
                          >
                            {String.fromCharCode(65 + optIndex)}. {option}
                            {option === q.correctAnswer && " (Correct)"}
                          </p>
                        ))}
                      </div>
                    )}
                    {q.type === "assignment" && q.description && (
                      <p className="text-sm text-gray-600 mt-2">{q.description}</p>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="icon">
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit Question</span>
                    </Button>
                    <Button variant="destructive" size="icon" onClick={() => handleDeleteQuestion(q.id)}>
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete Question</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
