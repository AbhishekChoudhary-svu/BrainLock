"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { useState, useEffect, useContext } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Brain, CheckCircle, XCircle, ChevronRight, ChevronLeft, Award, AlertCircle } from "lucide-react"
import MyContext from "@/context/ThemeProvider"
import { toast } from "sonner"



export default function ChallengeDetailPage() {
  const context = useContext(MyContext)
  const params = useParams()
  const { courseid, challengeid } = params

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState({}) // { questionId: selectedOption }
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [incorrectCount, setIncorrectCount] = useState(0)

  useEffect(() => {
    context.fetchCourses();
    setCurrentQuestionIndex(0)
    setSelectedAnswers({})
    setShowResults(false)
    setScore(0)
    setCorrectCount(0)
    setIncorrectCount(0)
  }, [challengeid])

  const course = context?.courses.find(c => String(c._id) === String(courseid));
const challenge = course?.challenges.find(ch => String(ch._id) === String(challengeid));
const questions = challenge?.mcqs || [];


  if (!questions || questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
        <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Challenge Not Found</h2>
        <p className="text-gray-600 mb-6">
          The challenge "{challengeid}" for subject "{courseid}" could not be found or has no questions.
        </p>
        <Link href={`/Dashboard/StudentDashboard/Challenges/${courseid}`}>
          <Button>Back to Challenges</Button>
        </Link>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]
  const totalQuestions = questions.length

   const handleOptionSelect = (value) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestion._id]: value,
    }))
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1)
    }
  }

  const handleSubmitQuiz = async () => {
  let newScore = 0;
  let newCorrectCount = 0;
  let newIncorrectCount = 0;
  const pointsPerQuestion = 5; // Each question worth 5 points

  questions.forEach((q) => {
    const selected = selectedAnswers[q._id];
    const correctOption = q.options.find(opt => opt.isCorrect);

    if (selected === correctOption?.text) {
      newScore += pointsPerQuestion; // Add 5 points for correct answer
      newCorrectCount += 1;
    } else {
      newIncorrectCount += 1;
    }
  });

  setScore(newScore);
  setCorrectCount(newCorrectCount);
  setIncorrectCount(newIncorrectCount);
  setShowResults(true);

  // Call the API to update user score
  try {
    const res = await fetch(`/api/user/${context.user._id}/challenge/${challenge._id}/score`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ score: newScore }),
    });

    const data = await res.json();
    if (data.success) {
      toast.success(`Challenge completed! Score: ${newScore} points. Progress: ${data.progress.toFixed(1)}%`);
      context.fetchProfile();
    } else {
      toast.error(data.message || "Failed to update score");
    }
  } catch (err) {
    console.error(err);
    toast.error("Server error. Score not saved.");
  }
};




  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link
              href={`/Dashboard/StudentDashboard/Challenges/${courseid}`}
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
              {challenge?.title}
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
       <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <Card className="w-full max-w-8xl shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl font-bold text-gray-900">{challenge?.title}</CardTitle>
            <CardDescription className="text-gray-600">Subject: {course?.title}</CardDescription>
            {!showResults && (
              <div className="mt-4">
                <Progress value={((currentQuestionIndex + 1) / totalQuestions) * 100} className="h-2" />
                <p className="text-sm text-gray-600 mt-2">
                  Question {currentQuestionIndex + 1} of {totalQuestions}
                </p>
              </div>
            )}
          </CardHeader>
          <CardContent className="pt-4">
            {showResults ? (
              <div className="text-center space-y-6 py-8">
                <Award className="h-20 w-20 text-yellow-500 mx-auto" />
                <h3 className="text-3xl font-bold text-gray-900">Challenge Completed!</h3>
                <p className="text-xl text-gray-700">
                  You scored {score} out of {totalQuestions * 5}!
                </p>
                <div className="flex justify-center gap-8 text-lg font-semibold">
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-6 w-6" /> {correctCount} Correct
                  </div>
                  <div className="flex items-center gap-2 text-red-600">
                    <XCircle className="h-6 w-6" /> {incorrectCount} Incorrect
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                  <Link href={`/Dashboard/StudentDashboard/Challenges/${courseid}`}>
                    <Button size="lg">Back to Challenges</Button>
                  </Link>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => {
                      setCurrentQuestionIndex(0)
                      setSelectedAnswers({})
                      setShowResults(false)
                      setScore(0)
                      setCorrectCount(0)
                      setIncorrectCount(0)
                    }}
                  >
                    Retake Challenge
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-lg font-semibold text-gray-800">
                  {currentQuestionIndex + 1}. {currentQuestion.question}
                </div>
                <RadioGroup
                  value={selectedAnswers[currentQuestion._id] || ""}
                  onValueChange={handleOptionSelect}
                  className="space-y-3"
                >
                  {currentQuestion.options.map((option, index) => (
                    <div
                      key={option._id || index}
                      className="flex items-center space-x-3 p-3 border rounded-md bg-gray-50 hover:bg-gray-100 cursor-pointer"
                    >
                      <RadioGroupItem value={option.text} id={`option-${index}`} />
                      <Label htmlFor={`option-${index}`} className="text-base font-normal cursor-pointer">
                        {option.text}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
                <div className="flex justify-between mt-6">
                  <Button onClick={handlePreviousQuestion} disabled={currentQuestionIndex === 0} variant="outline">
                    <ChevronLeft className="mr-2 h-4 w-4" /> Previous
                  </Button>
                  {currentQuestionIndex === totalQuestions - 1 ? (
                    <Button onClick={handleSubmitQuiz} disabled={!selectedAnswers[currentQuestion._id]}>
                      Submit Challenge <CheckCircle className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button onClick={handleNextQuestion} disabled={!selectedAnswers[currentQuestion._id]}>
                      Next Question <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
