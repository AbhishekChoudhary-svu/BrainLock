"use client";

import { useContext, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  User,
  CircuitBoard,
  Send,
  Bot,
  Loader2,
} from "lucide-react";
import Link from "next/link"; // Import Link
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import MyContext from "@/context/ThemeProvider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";

export default function StudentDashboard() {
  const context = useContext(MyContext);
  const router = useRouter();
  const [currentStreak, setCurrentStreak] = useState(7);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    context.fetchCourses();
    context.fetchProfile();
  }, []);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "assistant", content: data.text },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          role: "assistant",
          content: "Sorry, I couldn't process that. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

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
  };


const continueCourse = async (course) => {
  try {
    const res = await fetch(`/api/user/${context.user?._id}/enroll/${course._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message);

    toast.success(`You enrolled in ${course.title}`);
    router.push(`/Dashboard/StudentDashboard/Courses/${course._id}`);

    return data;
  } catch (err) {
    console.error("❌ Continue course error:", err);
    toast.error(err.message || "Something went wrong");
  }
};







  // const courses = [
  //   {
  //     id: 1,
  //     title: "Advanced Mathematics",
  //     subjectId: "mathematics", // Added subjectId for routing
  //     progress: 78,
  //     nextChallenge: "Calculus Derivatives",
  //     dueDate: "Tomorrow",
  //     difficulty: "Hard",
  //     points: 150,
  //     status: "active",
  //   },
  //   {
  //     id: 2,
  //     title: "Physics Fundamentals",
  //     subjectId: "physics", // Added subjectId for routing
  //     progress: 45,
  //     nextChallenge: "Newton's Laws Quiz",
  //     dueDate: "In 3 days",
  //     difficulty: "Medium",
  //     points: 120,
  //     status: "active",
  //   },
  //   {
  //     id: 3,
  //     title: "Chemistry Basics",
  //     subjectId: "chemistry", // Added subjectId for routing
  //     progress: 100,
  //     nextChallenge: "Course Completed",
  //     dueDate: "Completed",
  //     difficulty: "Easy",
  //     points: 200,
  //     status: "completed",
  //   },
  // ];

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
  ];

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include", // send cookies
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        toast.error(data.error || "Failed to logout");
        return;
      }

      toast.success(data.message || "Logged out successfully");
      router.push("/LoginPage"); // redirect to login page after logout
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const leaderboard = [
    {
      rank: 1,
      name: "Sarah Chen",
      points: 3200,
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      rank: 2,
      name: "Mike Rodriguez",
      points: 2890,
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      rank: 3,
      name: "Emma Wilson",
      points: 2750,
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      rank: 12,
      name: "Alex Johnson",
      points: 2450,
      avatar: "/placeholder.svg?height=32&width=32",
      isCurrentUser: true,
    },
  ];


  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "hard":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case "challenge_completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "streak_milestone":
        return <Fire className="h-4 w-4 text-orange-600" />;
      case "quiz_completed":
        return <Award className="h-4 w-4 text-blue-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

   const [studyTimer, setStudyTimer] = useState({
    minutes: 25, // Default Pomodoro session
    seconds: 0,
    isRunning: false,
  });

  const intervalRef = useRef(null);

  // Start/Pause toggle
  const toggleTimer = () => {
    setStudyTimer((prev) => ({ ...prev, isRunning: !prev.isRunning }));
  };

  // Reset timer
  const resetTimer = () => {
    clearInterval(intervalRef.current);
    setStudyTimer({
      minutes: 25,
      seconds: 0,
      isRunning: false,
    });
  };

  useEffect(() => {
    if (studyTimer.isRunning) {
      intervalRef.current = setInterval(() => {
        setStudyTimer((prev) => {
          if (prev.seconds > 0) {
            return { ...prev, seconds: prev.seconds - 1 };
          } else if (prev.minutes > 0) {
            return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
          } else {
            clearInterval(intervalRef.current);
            return { ...prev, isRunning: false }; // Stop when finished
          }
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [studyTimer.isRunning]);

  

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
                  <Button
                    variant="ghost"
                    className="flex items-center space-x-2"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={studentData.avatar || "/placeholder.svg"}
                        alt={studentData.name}
                      />
                      <AvatarFallback>AJ</AvatarFallback>
                    </Avatar>
                    <div className="text-left hidden sm:block">
                      <p className="text-sm font-medium">
                        {context.user?.firstName} {context.user?.lastName}
                      </p>
                      <p className="text-xs text-gray-500">{context.user?.email}</p>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <Link href={"/Dashboard/AdminDashboard"}>
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      Admin Page
                    </DropdownMenuItem>
                  </Link>
                  <Link href={"/Dashboard/TeacherDashboard"}>
                    <DropdownMenuItem>
                      <CircuitBoard className="mr-2 h-4 w-4" />
                      Teacher Page
                    </DropdownMenuItem>
                  </Link>
                  <Link href={"/Dashboard/ProfilePage"}>
                    <DropdownMenuItem>
                      <CircuitBoard className="mr-2 h-4 w-4" />
                      My Profile
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Help & Support
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-600"
                  >
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome back, {context.user?.firstName}! 👋
          </h2>
          <p className="text-gray-600">
            Ready to continue your learning journey?
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Current Streak
              </CardTitle>
              <Fire className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {context?.user?.streaks} days
              </div>
              <p className="text-xs text-gray-600">Keep it up!</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Points
              </CardTitle>
              <Star className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {context?.user?.points.toLocaleString()}
              </div>
              <p className="text-xs text-gray-600">+150 this week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Class Rank</CardTitle>
              <Trophy className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                #{studentData.rank}
              </div>
              <p className="text-xs text-gray-600">↑ 3 positions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Courses
              </CardTitle>
              <BookOpen className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {studentData.activeCourses}
              </div>
              <p className="text-xs text-gray-600">
                {studentData.completedCourses} completed
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="courses">My Courses</TabsTrigger>
            <TabsTrigger value="challenges">Challenges</TabsTrigger>
            <TabsTrigger value="assistant">AI Assistant</TabsTrigger>
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
                    {context.courses
                      .filter((course) => course.status === "active")
                      .map((course) => (
                        <div key={course._id} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <h4 className="font-medium">{course.title}</h4>
                            {/* <Badge
                              className={getDifficultyColor(course.difficulty) || ""}
                            >
                              {course.difficulty || ""}
                            </Badge> */}
                          </div>
                          <Progress
                            value={course.progress || 50}
                            className="h-2"
                          />
                          <div className="flex justify-between text-sm text-gray-600">
                            <span>{course.progress || 50}% complete</span>
                            <span className="font-[500] text-black">
                              Next: {course.challenges?.[0].title}
                            </span>
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
                        <div
                          key={activity.id}
                          className="flex items-start space-x-3"
                        >
                          <div className="flex-shrink-0 mt-1">
                            {getActivityIcon(activity.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900">
                              {activity.title}
                            </p>
                            {activity.course && (
                              <p className="text-sm text-gray-600">
                                {activity.course}
                              </p>
                            )}
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="text-xs text-gray-500">
                                {activity.time}
                              </span>
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
                      {String(studyTimer.minutes).padStart(2, "0")}:
                      {String(studyTimer.seconds).padStart(2, "0")}
                    </div>
                    <div className="flex justify-center space-x-2">
                      <Button
                        size="sm"
                        variant={
                          studyTimer.isRunning ? "destructive" : "default"
                        }
                        onClick={toggleTimer}
                      >
                        {studyTimer.isRunning ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </Button>
                      <Button size="sm" variant="outline" onClick={resetTimer}>
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
                    
                    <Button
                      className="w-full justify-start bg-transparent"
                      variant="outline"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      View Schedule
                    </Button>
                    <Button
                      className="w-full justify-start bg-transparent"
                      variant="outline"
                    >
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
                        <p className="text-xs text-gray-600">
                          Completed 5 challenges
                        </p>
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
    {context.courses.map((course) => {
      // Check enrollment in user.courses
      const userCourse = context?.user?.courses?.find(
        (uc) => String(uc.courseId) === String(course._id)
      );

      const isEnrolled = !!userCourse;
      const status = userCourse?.status || "not-enrolled";
      const progress = userCourse?.progress || 0;

      return (
        <Card key={course._id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">{course.title}</CardTitle>
              <Badge
                variant={status === "completed" ? "default" : "secondary"}
                className={
                  status === "completed"
                    ? "bg-green-100 text-green-800"
                    : ""
                }
              >
                {status === "completed"
                  ? "Completed"
                  : isEnrolled
                  ? "Enrolled"
                  : "Not Enrolled"}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {/* Challenges Preview */}
            {course.challenges.length > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Next Challenge:</span>
                  {course.challenges.map((challenge) => (
                    <p
                      key={challenge._id}
                      className="text-sm font-medium"
                    >
                      {challenge?.title || "No subtopics available"}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {/* Footer Section */}
            <div className="flex justify-between items-center">
              <p className="text-xs font-bold pt-2 text-gray-800">
                Due: {userCourse?.enrolledAt?.split("T")[0] || "Not Yet"}
              </p>

              {/* Action Button */}
              {status === "completed" ? (
                <Link href={`/Dashboard/StudentDashboard/Courses/${course._id}`}>
                  <Button size="sm" >
                    View Course<ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
                // <Button size="sm" disabled>
                //   Completed
                // </Button>
              ) : isEnrolled ? (
                <Link href={`/Dashboard/StudentDashboard/Courses/${course._id}`}>
                  <Button size="sm" >
                    View Course<ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              ) : (
                <Button size="sm" onClick={() => continueCourse(course)}>
                  Enroll <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      );
    })}
  </div>
</TabsContent>



          {/* Challenges Tab */}
          <TabsContent value="challenges" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
              {/* Challenge Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5 text-green-600" />
                    <span>Challenge Statistics</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">24</div>
                      <div className="text-sm text-gray-600">Completed</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        92%
                      </div>
                      <div className="text-sm text-gray-600">Success Rate</div>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600">
                        18
                      </div>
                      <div className="text-sm text-gray-600">This Week</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        5
                      </div>
                      <div className="text-sm text-gray-600">
                        Perfect Scores
                      </div>
                    </div>
                  </div>

                  <Alert>
                    <Zap className="h-4 w-4" />
                    <AlertDescription>
                      You're on fire! Complete 2 more challenges to unlock the
                      "Challenge Master" badge.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
              {/* Upcoming Challenges */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="h-5 w-5 text-blue-600" />
                    <span>Upcoming Challenges</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    {context.courses.map((course) => (
                      <div
                        key={course._id}
                        className="border rounded-lg p-4 space-y-6"
                      >
                        <div className="flex justify-between items-start">
                          <h4 className="font-[500] text-xl">{course.title}</h4>
                          {/* <Badge
                          className={getDifficultyColor(challenge.difficulty)}
                        >
                          {challenge.difficulty}
                        </Badge> */}
                        </div>
                        <p className="text-sm font-[500] text-gray-600">
                          Next Challenge : {course.challenges?.[0].title}
                        </p>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-500">
                            ⏱️ {course.time || "50 min"}
                          </span>
                          <span className="text-gray-500">
                            📅 {course.createdAt.split("T")[0]}
                          </span>
                          <Badge variant="secondary">
                            +{course.points || 50} pts
                          </Badge>
                        </div>
                        <Link
                          href={`/Dashboard/StudentDashboard/Challenges/${course._id}`}
                        >
                          {" "}
                          {/* Link to new challenges page */}
                          <Button size="sm" className="w-full">
                            View All Challenges
                          </Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

           {/* Ai Assistant Tab */}
          <TabsContent value="assistant" className="space-y-6">
            
            
          <Card className="flex-1 flex flex-col h-[calc(100vh-450px)] lg:h-[50vh] bg-gray-50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageCircle className="h-5 w-5 text-purple-600" />
                <span>AI Assistant</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-4 pt-0 overflow-hidden">
              <ScrollArea className="flex-1 pr-4 overflow-x-hidden">
                <div className="space-y-4">
                  {messages.length === 0 && (
                    <div className="text-center text-gray-500 text-sm py-4">
                      Ask me anything about you Like!
                    </div>
                  )}
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex items-start gap-3 ${
                        msg.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      {msg.role === "assistant" && (
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            <Bot className="h-5 w-5" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={`max-w-[80%] p-3 rounded-lg overflow-hidden break-words ${
                          msg.role === "user"
                            ? "bg-blue-600 text-white rounded-br-none"
                            : "bg-gray-200 text-gray-900 rounded-bl-none"
                        }`}
                      >
                        <p className="text-sm break-words">{msg.content}</p>
                      </div>
                      {msg.role === "user" && (
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            <User className="h-5 w-5" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex items-start gap-3 justify-start">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          <Bot className="h-5 w-5" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="max-w-[80%] p-3 rounded-lg bg-gray-200 text-gray-900 rounded-bl-none">
                        <Loader2 className="h-4 w-4 animate-spin" />
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
              <form onSubmit={handleSendMessage} className="mt-4 flex gap-2">
                <Input
                  placeholder="Type your question..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button type="submit" size="icon" disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </form>
            </CardContent>
          </Card> 
          </TabsContent>

          {/* Leaderboard Tab */}
          <TabsContent value="leaderboard" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Trophy className="h-5 w-5 text-yellow-600" />
                  <span>Class Leaderboard</span>
                </CardTitle>
                <CardDescription>
                  See how you rank against your classmates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {leaderboard.map((student) => (
                    <div
                      key={student.rank}
                      className={`flex items-center space-x-4 p-3 rounded-lg ${
                        student.isCurrentUser
                          ? "bg-purple-50 border border-purple-200"
                          : "bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center justify-center w-8 h-8">
                        {student.rank === 1 && (
                          <Crown className="h-6 w-6 text-yellow-500" />
                        )}
                        {student.rank === 2 && (
                          <Medal className="h-6 w-6 text-gray-400" />
                        )}
                        {student.rank === 3 && (
                          <Medal className="h-6 w-6 text-amber-600" />
                        )}
                        {student.rank > 3 && (
                          <span className="text-lg font-bold text-gray-600">
                            #{student.rank}
                          </span>
                        )}
                      </div>
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={student.avatar || "/placeholder.svg"}
                          alt={student.name}
                        />
                        <AvatarFallback>
                          {student.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p
                          className={`font-medium ${
                            student.isCurrentUser
                              ? "text-purple-900"
                              : "text-gray-900"
                          }`}
                        >
                          {student.name} {student.isCurrentUser && "(You)"}
                        </p>
                        <p className="text-sm text-gray-600">
                          {student.points.toLocaleString()} points
                        </p>
                      </div>
                      {student.isCurrentUser && (
                        <Badge
                          variant="secondary"
                          className="bg-purple-100 text-purple-800"
                        >
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
  );
}
