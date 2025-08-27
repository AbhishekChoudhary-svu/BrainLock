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
  Flame,
} from "lucide-react";
import Link from "next/link"; // Import Link
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import MyContext from "@/context/ThemeProvider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function StudentDashboard() {
  const context = useContext(MyContext);
  const router = useRouter();
  const [tabValue, setTabValue] = useState("overview");
  const [openProgressCard, setOpenProgressCard] = useState(false);

  useEffect(() => {
    context.fetchCourses();
    context.fetchProfile();
    context.fetchLeaderboard();
    context.fetchUserActivities();
  }, []);
  const [messages, setMessages] = useState([]);
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

  const continueCourse = async (course) => {
    try {
      const res = await fetch(
        `/api/user/${context.user?._id}/enroll/${course._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
        }
      );

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

  const getRoleColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800";
      case "teacher":
        return "bg-green-100 text-green-800";
      case "student":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  function getActivityIcon(type) {
    switch (type) {
      case "CREATE_COURSE":
        return <Clock className="h-5 w-5 text-green-600" />;
      case "ENROLL_COURSE":
        return <Clock className="h-5 w-5 text-blue-600" />;
      case "COMPLETE_CHALLENGE":
        return <Clock className="h-5 w-5 text-purple-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  }

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

  const enrolledCourses =
    context?.user?.courses
      ?.filter((c) => c.status === "active")
      ?.map((c) => {
        const courseDetails = context?.courses?.find(
          (course) => String(course._id) === String(c.courseId) // force both to string
        );
        return {
          ...c,
          course: courseDetails || null, // attach full course details
        };
      }) || [];

  useEffect(() => {
    console.log(successRateChallenges);
  }, [context.courses]);

  const completedChallenges =
    context.user?.challenges?.filter((c) => c.status === "completed").length ||
    0;

  const activeChallenges =
    context.user?.challenges?.filter((c) => c.status === "active").length || 0;

  const successRateChallenges =
    context.user?.challenges?.filter(
      (c) => c.status === "active" || c.status === "completed"
    ) || [];

  const averageProgress =
    successRateChallenges.length > 0
      ? successRateChallenges.reduce((sum, c) => sum + c.progress, 0) /
        successRateChallenges.length
      : 0;

  const perfectScore =
    successRateChallenges.length > 0
      ? Math.max(...successRateChallenges.map((c) => c.score))
      : 0;

  return (
    <div className="min-h-screen dark:bg-slate-950 bg-gray-50">
      {/* Header */}
      <header className="bg-white dark:bg-slate-950 border-b dark:border-gray-900 border-gray-200 sticky top-0 z-40">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <Brain className="h-8 w-8 text-purple-600" />
              <div>
                <h1 className="text-xl font-bold dark:text-gray-100 text-gray-900">
                  Brain Lock
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Student Dashboard
                </p>
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
                      <AvatarImage src={""} alt={""} />
                      <AvatarFallback>
                        {(
                          context.user?.firstName +
                          " " +
                          context.user?.lastName
                        )
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-left hidden sm:block">
                      <p className="text-sm font-medium">
                        {context.user?.firstName} {context.user?.lastName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {context.user?.email}
                      </p>
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
      <main className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold dark:text-gray-100 text-gray-900 mb-2">
            Welcome back, {context.user?.firstName}! 👋
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
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
              <p className="text-xs dark:text-gray-400 text-gray-600">
                Keep it up!
              </p>
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
                {context?.user?.points?.toLocaleString()}
              </div>
              <p className="text-xs dark:text-gray-400 text-gray-600">
                +{context?.user?.points?.toLocaleString()} this week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Class Rank</CardTitle>
              <Trophy className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                #{context?.user?.classRank?.toLocaleString()}
              </div>
              <p className="text-xs dark:text-gray-400 text-gray-600">
                ↑ {context?.user?.classRank?.toLocaleString()} positions
              </p>
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
                {context.user?.courses?.length}
              </div>
              <p className="text-xs dark:text-gray-400 text-gray-600">
                {context?.user?.courses?.filter((c) => c.status === "completed")
                  .length || 0}{" "}
                completed
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs
          value={tabValue}
          onValueChange={setTabValue}
          className="space-y-6"
        >
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
                <Card className="bg-white dark:bg-gray-900 border dark:border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                      <span className="text-gray-900 dark:text-gray-100">
                        Current Progress
                      </span>
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {enrolledCourses.length > 0 ? (
                      enrolledCourses.map((enrolled) => (
                        <div key={enrolled._id} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <h4 className="font-medium text-gray-900 dark:text-gray-100">
                              {enrolled.course?.title}
                            </h4>
                          </div>

                          <Progress
                            value={enrolled.progress || 0}
                            className="h-2"
                          />

                          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                            <span>
                              {enrolled.progress.toFixed(2) || 0}% complete
                            </span>
                            <span className="font-[500] text-black dark:text-gray-200">
                              Next:{" "}
                              {enrolled.course?.challenges?.[0]?.title ||
                                "No challenges"}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400 text-sm italic">
                        No enrolled courses yet
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card className="bg-white dark:bg-gray-900 border dark:border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      <span className="text-gray-900 dark:text-gray-100">
                        Recent Activity
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {context.userActivities.length > 0 ? (
                        context.userActivities.map((activity) => (
                          <div
                            key={activity._id}
                            className="flex items-start space-x-3"
                          >
                            <div className="flex-shrink-0 mt-1">
                              {getActivityIcon(activity.action)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {activity.action}
                                {activity.courseId
                                  ? `: ${activity.courseId.title}`
                                  : ""}
                                {activity.challengeId
                                  ? ` → ${activity.challengeId.title}`
                                  : ""}{" "}
                                <Badge className={getRoleColor(activity.role)}>
                                  {activity.role}
                                </Badge>{" "}
                                <span className="font-semibold">
                                  {activity.userId?.firstName}{" "}
                                  {activity.userId?.lastName}
                                </span>
                              </p>
                              {activity.details && (
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                  {activity.details.score !== undefined
                                    ? `Score: ${activity.details.score}, Progress: ${activity.details.progress}%`
                                    : typeof activity.details === "string"
                                    ? activity.details
                                    : JSON.stringify(activity.details)}
                                </p>
                              )}
                              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                {new Date(activity.createdAt).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-400 dark:text-gray-500">
                          No recent activities
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Study Timer */}
                <Card className="bg-white dark:bg-gray-900 border dark:border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Target className="h-5 w-5 text-red-600 dark:text-red-400" />
                      <span className="text-gray-900 dark:text-gray-100">
                        Focus Timer
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center space-y-4">
                    <div className="text-4xl font-mono font-bold text-gray-900 dark:text-gray-100">
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
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Pomodoro Session
                    </p>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="bg-white dark:bg-gray-900 border dark:border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-gray-900 dark:text-gray-100">
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button
                      className="w-full justify-start bg-transparent dark:text-gray-200"
                      variant="outline"
                      onClick={() => setTabValue("assistant")}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      AI Assistant
                    </Button>
                    <Button
                      className="w-full justify-start bg-transparent dark:text-gray-200"
                      variant="outline"
                      onClick={() => setOpenProgressCard(true)}
                    >
                      <BarChart3 className="mr-2 h-4 w-4" />
                      Progress Report
                    </Button>
                  </CardContent>
                </Card>

                {/* Achievements */}
                <Card className="bg-white dark:bg-gray-900 border dark:border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Award className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                      <span className="text-gray-900 dark:text-gray-100">
                        Recent Achievements
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="bg-orange-100 dark:bg-orange-900/40 p-2 rounded-full">
                        <Fire className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          Week Warrior
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          7-day streak
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-100 dark:bg-blue-900/40 p-2 rounded-full">
                        <Brain className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          Quick Learner
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
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
                  <Card
                    key={course._id}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">
                          {course.title}
                        </CardTitle>
                        <Badge
                          variant={
                            status === "completed" ? "default" : "secondary"
                          }
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
                          <span>{progress.toFixed(2)}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>

                      {/* Challenges Preview */}
                      {course.challenges.length > 0 && (
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm dark:text-gray-400 text-gray-600">
                              Next Challenge:
                            </span>
                            <p className="text-sm font-medium">
                              {course.challenges[0]?.title ||
                                "No challenges available"}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Footer Section */}
                      <div className="flex justify-between items-center">
                        <p className="text-xs font-bold pt-2 dark:text-gray-400 text-gray-800">
                          Due:{" "}
                          {userCourse?.enrolledAt?.split("T")[0] || "Not Yet"}
                        </p>

                        {/* Action Button */}
                        {status === "completed" ? (
                          <Link
                            href={`/Dashboard/StudentDashboard/Courses/${course._id}`}
                          >
                            <Button size="sm">
                              View Course
                              <ChevronRight className="ml-1 h-4 w-4" />
                            </Button>
                          </Link>
                        ) : // <Button size="sm" disabled>
                        //   Completed
                        // </Button>
                        isEnrolled ? (
                          <Link
                            href={`/Dashboard/StudentDashboard/Courses/${course._id}`}
                          >
                            <Button size="sm">
                              View Course
                              <ChevronRight className="ml-1 h-4 w-4" />
                            </Button>
                          </Link>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => continueCourse(course)}
                          >
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
              <Card className="bg-white dark:bg-gray-900 border dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-gray-100">
                    <BarChart3 className="h-5 w-5 text-green-600" />
                    <span>Challenge Statistics</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/40 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {completedChallenges}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        Completed
                      </div>
                    </div>
                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/40 rounded-lg">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {averageProgress}%
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        Success Rate
                      </div>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/40 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                        {activeChallenges}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        Active Challenges
                      </div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/40 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {perfectScore}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        Perfect Scores
                      </div>
                    </div>
                  </div>

                  <Alert className="bg-gray-50 dark:bg-gray-800 border dark:border-gray-700">
                    <Zap className="h-4 w-4 text-yellow-500" />
                    <AlertDescription className="text-gray-700 flex dark:text-gray-300">
                      You're on fire! Complete 2 more challenges to unlock the{" "}
                      <span className="font-semibold text-yellow-600 dark:text-yellow-400">
                        Challenge Master
                      </span>
                      badge.
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
                          Next Challenge : {course.challenges?.[0]?.title}
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
            <Card className="flex-1 flex flex-col h-[calc(100vh-450px)] lg:h-[50vh] bg-gray-50 dark:bg-gray-900">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-gray-100">
                  <MessageCircle className="h-5 w-5 text-purple-600" />
                  <span>AI Assistant</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col p-4 pt-0 overflow-hidden">
                <ScrollArea className="flex-1 pr-4 overflow-x-hidden">
                  <div className="space-y-4">
                    {messages.length === 0 && (
                      <div className="text-center text-gray-500 dark:text-gray-400 text-sm py-4">
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
                              : "bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-none"
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
                        <div className="max-w-[80%] p-3 rounded-lg bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-none">
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
                    className="flex-1 dark:bg-gray-800 dark:text-gray-100"
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
                  <Trophy className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                  <span className="text-gray-900 dark:text-gray-100">
                    Class Leaderboard
                  </span>
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  See how you rank against your classmates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {context.leaderboard.map((student) => (
                    <div
                      key={student.rank}
                      className={`flex items-center space-x-4 p-3 rounded-lg transition ${
                        student.isCurrentUser
                          ? "bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-700"
                          : "bg-gray-50 dark:bg-gray-800"
                      }`}
                    >
                      {/* Rank */}
                      <div className="flex items-center justify-center w-8 h-8">
                        {student.rank === 1 && (
                          <Crown className="h-6 w-6 text-yellow-500 dark:text-yellow-400" />
                        )}
                        {student.rank === 2 && (
                          <Medal className="h-6 w-6 text-gray-400 dark:text-gray-300" />
                        )}
                        {student.rank === 3 && (
                          <Medal className="h-6 w-6 text-amber-600 dark:text-amber-500" />
                        )}
                        {student.rank > 3 && (
                          <span className="text-lg font-bold text-gray-600 dark:text-gray-300">
                            #{student.rank}
                          </span>
                        )}
                      </div>

                      {/* Avatar */}
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={student.avatar || "/placeholder.svg"}
                          alt={student.firstName}
                        />
                        <AvatarFallback>
                          {(student.firstName + " " + student.lastName)
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>

                      {/* Name + Points */}
                      <div className="flex-1">
                        <p
                          className={`font-medium ${
                            student.isCurrentUser
                              ? "text-purple-900 dark:text-purple-200"
                              : "text-gray-900 dark:text-gray-100"
                          }`}
                        >
                          {student.firstName + " " + student.lastName}{" "}
                          {student.isCurrentUser && "(You)"}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {student.points.toLocaleString()} points
                        </p>
                      </div>

                      {/* Badge for Current User */}
                      {student.isCurrentUser && (
                        <Badge
                          variant="secondary"
                          className="bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100"
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

      {/* // Detailed Progress Report Dialog */}
      <Dialog open={openProgressCard} onOpenChange={setOpenProgressCard}>
        <DialogContent className="sm:max-w-[1000px] rounded-2xl shadow-lg h-[90vh] bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold flex items-center gap-2">
              <User className="h-5 w-5 text-blue-600" />
              Student Progress Report
            </DialogTitle>
          </DialogHeader>

          <Card className="rounded-2xl border shadow-md bg-white dark:bg-gray-800">
            <CardContent className="p-6 pt-0 space-y-6">
              {/* Student Info */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    {context.user?.firstName || "John"}{" "}
                    {context.user?.lastName || "Doe"}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {context.user?.email || "student@email.com"}
                  </p>
                </div>
                <Badge variant="outline" className="capitalize">
                  {context.user?.status || "active"}
                </Badge>
              </div>

              {/* Overall Stats */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-4 rounded-xl bg-yellow-50 dark:bg-yellow-900/40">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Streaks
                  </p>
                  <p className="text-xl font-bold text-red-700 dark:text-red-400">
                    {context.user?.streaks || 0}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/40">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Average Score
                  </p>
                  <p className="text-xl font-bold text-blue-700 dark:text-blue-400">
                    {context.user?.avgScore?.toFixed(2) || 0}%
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-yellow-50 dark:bg-yellow-900/40">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Total Points
                  </p>
                  <p className="text-xl font-bold text-yellow-700 dark:text-yellow-400">
                    {context.user?.points || 0}
                  </p>
                </div>
              </div>

              {/* Courses Section */}
              <div>
                <h3 className="text-md font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-indigo-600" />
                  Courses Progress
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  {context.user?.courses?.length > 0 ? (
                    context.user.courses.map((c, idx) => {
                      const matchedCourse = context.courses?.find(
                        (course) => course._id === c.courseId
                      );
                      return (
                        <div
                          key={idx}
                          className="p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 flex flex-col justify-center h-[70px]"
                        >
                          <span className="font-medium text-gray-700 dark:text-gray-200 text-sm truncate">
                            {matchedCourse
                              ? matchedCourse.title
                              : "Unknown Course"}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Progress: {c.progress.toFixed(0) || 0}%
                          </span>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      No courses enrolled yet
                    </p>
                  )}
                </div>
              </div>

              {/* Challenge Section */}
              <div>
                <h3 className="text-md font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-green-600" />
                  Challenges Progress
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {context.user?.challenges?.length > 0 ? (
                    context.user.challenges.map((ch, idx) => (
                      <div
                        key={idx}
                        className="p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 flex flex-col justify-center h-[70px]"
                      >
                        <span className="font-medium text-gray-700 dark:text-gray-200 text-sm truncate">
                          {ch.title}
                        </span>
                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                          <span>Score: {ch.score || 0}</span>
                          <span>Progress: {ch.progress.toFixed(0) || 0}%</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      No challenges yet
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>
    </div>
  );
}
