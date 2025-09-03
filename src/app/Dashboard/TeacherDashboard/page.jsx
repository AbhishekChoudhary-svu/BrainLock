"use client";

import { useContext, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Brain,
  BookOpen,
  Users,
  BarChart3,
  Plus,
  Edit,
  Trash2,
  Eye,
  MessageCircle,
  Bell,
  Settings,
  LogOut,
  ChevronRight,
  Award,
  TrendingUp,
  Clock,
  Target,
  Star,
  AlertCircle,
  CheckCircle,
  FileText,
  Download,
  Upload,
  Filter,
  Search,
  MoreHorizontal,
  User,
  CircuitBoard,
  Crown,
  Medal,
  Sun,
  Send,
  Loader2,
  Flame,
  Trophy,
  Mail,
  Phone,
  Building2,
  MapPin,
  Info,
  Calendar,
  GraduationCap,
  Bot,
  ChartBar,
  Home,
  BookAlert,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import MyContext from "@/context/ThemeProvider";
import { ScrollArea } from "@/components/ui/scroll-area";
import ThemeToggleButton from "@/components/ui/theme-toggle-button";
import ReactMarkdown from "react-markdown";

export default function TeacherDashboard() {
  const context = useContext(MyContext);
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [courseData, setCourseData] = useState([]);
  const [challengeData, setChallengeData] = useState([]);
  const [isCreateChallengeOpen, setIsCreateChallengeOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);
  const [tabValue, setTabValue] = useState("overview");
  const [selectedUser, setSelectedUser] = useState(null);

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
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      if (!response.ok || !response.body) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      // add empty assistant msg first
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });

        // append chunk to last assistant message
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            ...updated[updated.length - 1],
            content: updated[updated.length - 1].content + chunk,
          };
          return updated;
        });
      }
    } catch (error) {
      console.error("Streaming error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "⚠️ Sorry, something went wrong while streaming.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const isEditMode = Boolean(courseData?._id);
  const isEditModeChallenge = Boolean(challengeData?._id);
  const [loading, setLoading] = useState(true);

  // edit and create for both
  const handleSaveCourse = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/teacher/courses/${isEditMode ? courseData._id : ""}`,
        {
          method: isEditMode ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(courseData),
        }
      );
      const data = await res.json();

      if (res.ok) {
        toast.success(
          isEditMode
            ? "Course updated successfully!"
            : "Course created successfully!"
        );
        setIsDialogOpen(false);
        context.fetchCourses();
      } else {
        toast.success(data.error || "Failed to save course");
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handleSaveChallenge = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/teacher/challenges/${
          isEditModeChallenge ? challengeData?._id : ""
        }`,
        {
          method: isEditModeChallenge ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(challengeData),
        }
      );
      const data = await res.json();

      if (res.ok) {
        toast.success(
          isEditModeChallenge
            ? "Challenge updated successfully!"
            : "Challenge created successfully!"
        );
        setIsCreateChallengeOpen(false);
        context.fetchChallenges();
      } else {
        toast.success(data.error || "Failed to save Challenge");
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    context.fetchCourses();
    context.fetchChallenges();
    context.fetchAllUsers();
    context.fetchProfile();
    context.fetchLeaderboard();
    context.fetchActivities();
  }, []);

  const openCreateDialog = () => {
    setCourseData({});
    setIsDialogOpen(true);
  };
  const openCreateChallengeDialog = () => {
    setChallengeData({});
    setIsCreateChallengeOpen(true);
  };

  const openEditDialog = (course) => {
    setCourseData(course);
    setIsDialogOpen(true);
  };

  const openEditChallengesDialog = (challenge) => {
    setChallengeData(challenge);
    setIsCreateChallengeOpen(true);
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

  const handleDeleteCourse = async (id) => {
    try {
      const res = await fetch(`/api/teacher/courses/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Course deleted successfully!");
        context.fetchCourses();
      } else {
        toast.error(data.error || "Failed to delete course");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteChallenge = async (id) => {
    try {
      const res = await fetch(`/api/teacher/challenges/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Challenges deleted successfully!");
        context.fetchChallenges();
      } else {
        toast.error(data.error || "Failed to delete course");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-red-800 text-red-100";
      case "teacher":
        return "bg-green-800 text-green-100";
      case "student":
        return "bg-blue-800 text-blue-100";
      default:
        return "bg-gray-800 text-gray-100";
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
  const openProgressDialog = (student) => {
    setSelectedUser(student);
    setOpen(true);
  };
  const openProfileDialog = (student) => {
    setSelectedUser(student);
    setOpen1(true);
  };

  const allUserAvgScore =
    context.allUsers.length > 0
      ? context.allUsers.reduce((sum, e) => sum + e.avgScore, 0) /
        context.allUsers.length
      : 0;

  return (
    <div className="min-h-screen dark:bg-slate-950 bg-gray-50">
      {/* Header */}
      <header className="dark:bg-slate-950 bg-white dark:border-slate-800 border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <Brain className="h-8 w-8 text-green-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Brain Lock
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Teacher Dashboard
                </p>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5 dark:text-gray-300 text-gray-700" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  5
                </span>
              </Button>
              <ThemeToggleButton
                variant="gif"
                url="https://media.giphy.com/media/5PncuvcXbBuIZcSiQo/giphy.gif?cid=ecf05e47j7vdjtytp3fu84rslaivdun4zvfhej6wlvl6qqsz&ep=v1_stickers_search&rid=giphy.gif&ct=s"
              />

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center space-x-2 dark:text-gray-200 text-gray-700"
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
                      <p className="text-sm font-medium dark:text-gray-100 text-gray-900">
                        {context.user?.firstName} {context.user?.lastName}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {context.user?.department}
                      </p>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 dark:bg-slate-900 dark:text-gray-200"
                >
                  <DropdownMenuLabel className="dark:text-gray-300">
                    My Account
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="dark:bg-slate-700" />
                  {context?.user?.role === "admin" && (
                    <>
                      <Link href={"/Dashboard/AdminDashboard"}>
                        <DropdownMenuItem>
                          <User className="mr-2 h-4 w-4" />
                          Admin Dashboard
                        </DropdownMenuItem>
                      </Link>
                      <Link href={"/Dashboard/StudentDashboard"}>
                        <DropdownMenuItem>
                          <CircuitBoard className="mr-2 h-4 w-4" />
                          Student Dashboard
                        </DropdownMenuItem>
                      </Link>
                    </>
                  )}

                  {context?.user?.role === "teacher" && (
                    <Link href={"/Dashboard/StudentDashboard"}>
                      <DropdownMenuItem>
                        <CircuitBoard className="mr-2 h-4 w-4" />
                        Student Dashboard
                      </DropdownMenuItem>
                    </Link>
                  )}

                  <Link href={"/Dashboard/ProfilePage"}>
                    <DropdownMenuItem>
                      <CircuitBoard className="mr-2 h-4 w-4" />
                      My Profile
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem>
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Help & Support
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="dark:bg-slate-700" />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-600 dark:text-red-400"
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
      <main className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-15 lg:pb-0">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold dark:text-gray-100 text-gray-900 mb-2">
            Welcome back, {context.user?.firstName}! 👋
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your courses and track student progress
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Students
              </CardTitle>
              <Users className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {context?.allUsers?.length}
              </div>
              <p className="text-xs dark:text-gray-400 text-gray-600">
                +2 this month
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
                {context.courses.length}
              </div>
              <p className="text-xs dark:text-gray-400 text-gray-600">
                2 new this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Challenges
              </CardTitle>
              <Target className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {context.challenges.length}
              </div>
              <p className="text-xs dark:text-gray-400 text-gray-600">
                5 pending review
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Avg Performance
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {allUserAvgScore.toFixed(2)}%
              </div>
              <p className="text-xs dark:text-gray-400 text-gray-600">
                ↑ 3% from last month
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
          {/* Desktop Tabs (shown on md and up) */}
          <TabsList className="hidden lg:grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="courses">My Courses</TabsTrigger>
            <TabsTrigger value="challenges">Challenges</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="assistant">AI Assistant</TabsTrigger>
          </TabsList>

          {/* Mobile Bottom Nav (shown on small screens) */}
          <TabsList
            className="lg:hidden fixed -bottom-6 inset-x-0 z-50 flex justify-around
                       border-t border-border bg-white dark:bg-slate-950 w-full py-8"
          >
            <TabsTrigger
              value="overview"
              className="flex flex-col items-center text-xs py-7"
            >
              <Home className="h-5 w-5" />
              Home
            </TabsTrigger>
            <TabsTrigger
              value="courses"
              className="flex flex-col items-center text-xs py-7"
            >
              <BookOpen className="h-5 w-5" />
              Courses
            </TabsTrigger>
            <TabsTrigger
              value="challenges"
              className="flex flex-col items-center text-xs py-7"
            >
              <BookAlert className="h-5 w-5" />
              Challenges
            </TabsTrigger>
            <TabsTrigger
              value="students"
              className="flex flex-col items-center text-xs py-7"
            >
              <User className="h-5 w-5" />
              Students
            </TabsTrigger>
            <TabsTrigger
              value="assistant"
              className="flex flex-col items-center text-xs py-7"
            >
              <MessageCircle className="h-5 w-5" />
              AI Assistant
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column */}
              <div className="lg:col-span-2 space-y-6">
                {/* Course Performance */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <BarChart3 className="h-5 w-5 text-blue-600" />
                      <span>Course Performance</span>
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {context.courses
                      .filter((course) => course.status === "active")
                      .map((course) => {
                        // Find users enrolled in this course
                        const enrolledUsers = context?.allUsers?.filter(
                          (user) =>
                            user.courses.some(
                              (uc) => uc.courseId === course._id
                            )
                        );

                        // Count students
                        const studentsCount = enrolledUsers.length || 0;

                        // Average progress of enrolled users
                        const avgProgress =
                          studentsCount > 0
                            ? (
                                enrolledUsers.reduce((sum, user) => {
                                  const uCourse = user.courses.find(
                                    (uc) => uc.courseId === course._id
                                  );
                                  return sum + (uCourse?.progress || 0);
                                }, 0) / studentsCount
                              ).toFixed(1)
                            : 0;

                        return (
                          <div key={course._id} className="space-y-2">
                            <div className="sm:flex-row sm:flex flex-col space-y-2 justify-between items-center">
                              <h4 className="font-medium">{course.title}</h4>
                              <div className="flex items-center space-x-2">
                                <Badge variant="secondary">
                                  {studentsCount} students
                                </Badge>
                                <span className="text-sm dark:text-gray-400 text-gray-600">
                                  {avgProgress}% avg
                                </span>
                              </div>
                            </div>

                            <Progress
                              value={avgProgress}
                              className="h-2 [&>div]:transition-colors
                              dark:[&>div]:bg-yellow-700"
                            />

                            <div className="flex justify-between text-sm dark:text-gray-400 text-gray-600">
                              <span>{avgProgress}% complete</span>
                              <span>
                                Updated{" "}
                                {formatDistanceToNow(
                                  new Date(course.updatedAt),
                                  {
                                    addSuffix: true,
                                  }
                                )}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Clock className="h-5 w-5 text-green-600" />
                      <span>Recent Activity</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {context.activities.length > 0 ? (
                        context.activities
                          .filter(
                            (c) => c.role === "teacher" || c.role === "student"
                          )
                          .map((activity) => (
                            <div
                              key={activity._id}
                              className="flex items-start space-x-3"
                            >
                              <div className="flex-shrink-0 mt-1">
                                {getActivityIcon(activity.action)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium dark:text-gray-100 text-gray-900">
                                  {activity.action}
                                  {activity.courseId
                                    ? `: ${activity.courseId.title}`
                                    : ""}
                                  {activity.challengeId
                                    ? ` → ${activity.challengeId.title}`
                                    : ""}{" "}
                                  <Badge
                                    className={getRoleColor(activity.role)}
                                  >
                                    {activity.role}
                                  </Badge>{" "}
                                  <span className="font-semibold">
                                    {activity.userId?.firstName}{" "}
                                    {activity.userId?.lastName}
                                  </span>
                                </p>
                                {activity.details && (
                                  <p className="text-xs dark:text-gray-400 text-gray-500 mt-1">
                                    {activity.details.score !== undefined
                                      ? `Score: ${activity.details.score}, Progress: ${activity.details.progress}%`
                                      : typeof activity.details === "string"
                                      ? activity.details
                                      : JSON.stringify(activity.details)}
                                  </p>
                                )}
                                <p className="text-xs dark:text-gray-500 text-gray-400 mt-1">
                                  {new Date(
                                    activity.createdAt
                                  ).toLocaleString()}
                                </p>
                              </div>
                            </div>
                          ))
                      ) : (
                        <p className="text-gray-400 ">
                          No recent admin activities
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button
                      className="w-full justify-start bg-transparent dark:bg-purple-800"
                      variant="outline"
                      onClick={() => openCreateDialog(true)}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Create Course
                    </Button>
                    <Button
                      className="w-full justify-start bg-transparent dark:bg-blue-800"
                      variant="outline"
                      onClick={() => setIsCreateChallengeOpen(true)}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Create Challenge
                    </Button>
                    <Button
                      className="w-full justify-start bg-transparent dark:bg-green-800"
                      variant="outline"
                      onClick={() => setTabValue("assistant")}
                    >
                      <MessageCircle className="mr-2 h-4 w-4" />
                      AI Assistant
                    </Button>
                  </CardContent>
                </Card>

                {/* Top Performers */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Star className="h-5 w-5 text-yellow-600" />
                      <span>Top Performers</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {context.leaderboard.map((student) => (
                        <div
                          key={student.rank}
                          className={`flex items-center space-x-4 p-3 rounded-lg ${
                            student.isCurrentUser
                              ? "bg-purple-50 border border-purple-200 dark:bg-purple-900/20 dark:border-purple-700/40"
                              : "bg-gray-50 dark:bg-slate-800"
                          }`}
                        >
                          {/* Rank */}
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

                          {/* Name & Points */}
                          <div className="flex-1">
                            <p
                              className={`font-medium ${
                                student.isCurrentUser
                                  ? "text-purple-900 dark:text-purple-300"
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

                          {/* Current User Badge */}
                          {student.isCurrentUser && (
                            <Badge
                              variant="secondary"
                              className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200"
                            >
                              Your Rank
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Courses Tab */}
          <TabsContent value="courses" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">My Courses</h3>
              <Button onClick={() => openCreateDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Course
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {context.courses.map((course) => {
                // Find enrolled users dynamically
                const enrolledUsers = context?.allUsers?.filter((user) =>
                  user.courses.some((uc) => uc.courseId === course._id)
                );

                const studentsCount = enrolledUsers.length || 0;

                // Calculate average progress
                const avgProgress =
                  studentsCount > 0
                    ? (
                        enrolledUsers.reduce((sum, user) => {
                          const uCourse = user.courses.find(
                            (uc) => uc.courseId === course._id
                          );
                          return sum + (uCourse?.progress || 0);
                        }, 0) / studentsCount
                      ).toFixed(1)
                    : 0;

                // First challenge
                const firstChallenge =
                  course.challenges[0]?.title || "No challenges";

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
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => openEditDialog(course)}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Course
                            </DropdownMenuItem>

                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>

                            <DropdownMenuItem>
                              <Download className="mr-2 h-4 w-4" />
                              Export Data
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDeleteCourse(course._id)}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Course
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600 dark:text-gray-400">
                            Students
                          </p>
                          <p className="font-semibold">{studentsCount}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 dark:text-gray-400">
                            Challenges
                          </p>
                          <p className="font-semibold">
                            {course.challenges.length}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600 dark:text-gray-400">
                            Avg Score
                          </p>
                          <p className="font-semibold">{course.avgScore}%</p>
                        </div>
                        <div>
                          <p className="text-gray-600 dark:text-gray-400">
                            Status
                          </p>
                          <Badge
                            variant={
                              course.status === "active"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {course.status}
                          </Badge>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{avgProgress}%</span>
                        </div>
                        <Progress
                          value={avgProgress}
                          className="h-2 [&>div]:transition-colors
                              dark:[&>div]:bg-yellow-700"
                        />
                      </div>

                      {course.challenges.length > 0 && (
                        <div className="text-sm dark:text-gray-300 text-gray-700">
                          <span className="font-medium">Next Challenge: </span>
                          {firstChallenge}
                        </div>
                      )}

                      <div className="flex justify-between items-center pt-2">
                        <span className="text-sm dark:text-gray-400 text-gray-600">
                          {formatDistanceToNow(new Date(course.updatedAt), {
                            addSuffix: true,
                          })}
                        </span>
                        <Link
                          href={`/Dashboard/TeacherDashboard/Courses/${course._id}`}
                        >
                          <Button size="sm">
                            Manage
                            <ChevronRight className="ml-1 h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Challenges Tab */}
          <TabsContent value="challenges" className="space-y-6">
            <div className="flex justify-between items-center gap-3">
              <h3 className="text-lg font-semibold">Challenge Management</h3>
              <Button onClick={() => openCreateChallengeDialog()}>
                <Plus className="h-4 w-4 mr-2" />
                Create Challenge
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Sample challenges would be mapped here */}
              {context.challenges.map((challenge) => (
                <Card key={challenge._id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">
                        {challenge.title}
                      </CardTitle>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => openEditChallengesDialog(challenge)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Challenge
                          </DropdownMenuItem>

                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>

                          <DropdownMenuItem>
                            <Download className="mr-2 h-4 w-4" />
                            Export Data
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDeleteChallenge(challenge._id)}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Challenge
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">
                          Course
                        </p>
                        <p className="font-semibold">
                          {challenge.course.title}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">
                          Difficulty
                        </p>
                        <Badge variant="destructive">
                          {challenge.difficulty}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">
                          Submissions Date
                        </p>
                        <p className="font-semibold">
                          {challenge.createdAt.split("T")[0]}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">
                          Status
                        </p>
                        <Badge>{challenge.status}</Badge>
                      </div>
                    </div>
                    <Link
                      href={`/Dashboard/TeacherDashboard/Challenges/${challenge._id}`}
                    >
                      <Button size="sm" className="w-full">
                        View Details
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Students Tab */}
          <TabsContent value="students" className="space-y-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              {/* Title */}
              <h3 className="text-lg font-semibold">Student Management</h3>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                {/* Search */}
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search students..."
                    className="pl-10 w-full"
                  />
                </div>

                {/* Buttons */}
                <Button variant="outline" className="w-full sm:w-auto">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>

                <Button className="w-full sm:w-auto">
                  <Upload className="h-4 w-4 mr-2" />
                  Import
                </Button>
              </div>
            </div>

            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Courses</TableHead>
                    <TableHead>Avg Score</TableHead>
                    <TableHead>Streak</TableHead>
                    <TableHead>Points</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {context.allUsers
                    .filter(
                      (user) => user.role === "student" || "admin" || "teacher"
                    )
                    .map((student) => (
                      <TableRow key={student._id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>
                                {(student.firstName + " " + student.lastName)
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">
                                {student.firstName} {student.lastName}
                              </p>
                              <p className="text-sm dark:text-gray-400 text-gray-600">
                                {student.email}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{student.courses.length || 4}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              student.avgScore >= 90
                                ? "default"
                                : student.avgScore >= 80
                                ? "secondary"
                                : "destructive"
                            }
                          >
                            {student.avgScore.toFixed(2) || 50}%
                          </Badge>
                        </TableCell>
                        <TableCell>{student.streaks || 1} days</TableCell>
                        <TableCell>{student.points || 0}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              student.status === "active"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {student.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => openProfileDialog(student)}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                View Profile
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => openProgressDialog(student)}
                              >
                                <BarChart3 className="mr-2 h-4 w-4" />
                                View Progress
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          {/* Assistant Tab */}
          <TabsContent value="assistant" className="space-y-6 pb-5 lg:pb-3">
            <Card className="flex-1 flex flex-col h-[80vh] md:h-[85vh] bg-gray-50 dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle
                    className="h-5 w-5 text-blue-600 dark:text-purple-600"
                    aria-hidden="true"
                  />
                  <span className="text-pretty">{"AI Assistant"}</span>
                </CardTitle>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col p-2 pt-0 overflow-hidden">
                <div
                  className="flex-1 pr-4 overflow-y-auto overflow-x-hidden custom-scrollbar"
                  aria-live="polite"
                  aria-relevant="additions"
                >
                  <div className="space-y-4">
                    {/* Empty state */}
                    {messages.length === 0 && (
                      <div className="text-center dark:text-gray-400 text-gray-500 text-sm py-4">
                        {"Ask me anything about you Like!"}
                      </div>
                    )}

                    {messages.map((msg, idx) => {
                      const isUser = msg.role === "user";
                      return (
                        <div
                          key={idx}
                          className={`flex w-full items-end gap-2 ${
                            isUser ? "justify-end" : "justify-start"
                          }`}
                        >
                          {/* Assistant avatar */}
                          {!isUser && (
                            <Avatar className="lg:h-8 lg:w-8 h-4 w-4 shrink-0">
                              <AvatarFallback aria-label="Assistant">
                                <Bot className="lg:h-5 lg:w-5 h-2 w-2" />
                              </AvatarFallback>
                            </Avatar>
                          )}

                          {/* Message bubble */}
                          <div
                            className={[
                              "lg:p-3 px-4 rounded-lg break-words overflow-x-auto",
                              "sm:max-w-[75%] lg:max-w-[65%] ",
                              isUser
                                ? "bg-blue-600 text-white rounded-br-none"
                                : "bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-none",
                            ].join(" ")}
                          >
                            <div
                              className="text-sm prose dark:prose-invert break-words leading-relaxed
                [&_h1]:mt-5 [&_h2]:mt-4 [&_h3]:mt-3 [&_h4]:mt-3
                [&_p]:mt-2 [&_p]:mb-3
                [&_pre]:my-4 [&_code]:text-[0.9em]
                [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:my-3
                [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:my-3
                [&_li]:mt-1 [&_li]:leading-relaxed
                [&_blockquote]:border-l-4 [&_blockquote]:pl-3 [&_blockquote]:italic [&_blockquote]:text-gray-600
                dark:[&_blockquote]:text-gray-300"
                            >
                              <ReactMarkdown
                                components={{
                                  pre: ({ node, ...props }) => (
                                    <pre
                                      {...props}
                                      className="overflow-x-auto p-3 rounded-md bg-gray-100 dark:bg-gray-900 text-sm"
                                    />
                                  ),
                                  code: ({ node, inline, ...props }) =>
                                    inline ? (
                                      <code
                                        {...props}
                                        className="px-1.5 py-0.5 rounded bg-gray-200 dark:bg-gray-800 text-sm"
                                      />
                                    ) : (
                                      <code {...props} />
                                    ),
                                }}
                              >
                                {msg.content}
                              </ReactMarkdown>
                            </div>
                          </div>

                          {/* User avatar */}
                          {isUser && (
                            <Avatar className="lg:h-8 lg:w-8 h-4 w-4 shrink-0">
                              <AvatarFallback aria-label="You">
                                <User className="lg:h-5 lg:w-5 h-2 w-2" />
                              </AvatarFallback>
                            </Avatar>
                          )}
                        </div>
                      );
                    })}

                    {/* Loading State */}
                    {isLoading && (
                      <div className="flex items-start gap-3 justify-start">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback aria-label="Assistant typing">
                            <Bot className="h-5 w-5" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="max-w-[80%] p-3 rounded-lg bg-gray-200 text-gray-900 dark:bg-slate-800 dark:text-gray-100 rounded-bl-none">
                          <Loader2
                            className="h-4 w-4 animate-spin"
                            aria-label="Loading"
                          />
                        </div>
                      </div>
                    )}

                    <div ref={messagesEndRef} />
                  </div>
                </div>

                {/* Input box */}
                <form onSubmit={handleSendMessage} className="mt-4 flex gap-2">
                  <label htmlFor="assistant-input" className="sr-only">
                    Message input
                  </label>
                  <Input
                    id="assistant-input"
                    placeholder={"Type your question..."}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={isLoading}
                    className="flex-1"
                    aria-disabled={isLoading}
                  />
                  <Button
                    type="submit"
                    size="icon"
                    disabled={isLoading}
                    aria-label="Send message"
                  >
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
        </Tabs>
      </main>

      {/* Create Course Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Course</DialogTitle>
            <DialogDescription>
              Fill in the course details below.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Title */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="course-title" className="text-right">
                Title
              </Label>
              <Input
                id="course-title"
                placeholder="Course title"
                value={courseData.title}
                onChange={(e) =>
                  setCourseData({ ...courseData, title: e.target.value })
                }
                className="col-span-3"
              />
            </div>

            {/* Description */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="course-description" className="text-right">
                Description
              </Label>
              <Textarea
                id="course-description"
                placeholder="Course description"
                value={courseData.description}
                onChange={(e) =>
                  setCourseData({ ...courseData, description: e.target.value })
                }
                className="col-span-3"
              />
            </div>

            {/* Category */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="course-category" className="text-right">
                Category
              </Label>
              <Input
                id="course-category"
                placeholder="e.g., Mathematics"
                value={courseData.category}
                onChange={(e) =>
                  setCourseData({ ...courseData, category: e.target.value })
                }
                className="col-span-3"
              />
            </div>

            {/* Price */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="course-price" className="text-right">
                Price
              </Label>
              <Input
                id="course-price"
                type="number"
                min="0"
                value={courseData.price}
                onChange={(e) =>
                  setCourseData({
                    ...courseData,
                    price: Number(e.target.value),
                  })
                }
                className="col-span-3"
              />
            </div>

            {/* Status */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="course-status" className="text-right">
                Status
              </Label>
              <Select
                onValueChange={(value) =>
                  setCourseData({ ...courseData, status: value })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Published */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Published</Label>
              <input
                type="checkbox"
                checked={courseData.published}
                onChange={(e) =>
                  setCourseData({ ...courseData, published: e.target.checked })
                }
                className="col-span-3 w-5 h-5"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              onClick={handleSaveCourse}
              disabled={
                !courseData.title ||
                !courseData.description ||
                !courseData.category
              }
            >
              Create Course
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Challenge Dialog */}
      <Dialog
        open={isCreateChallengeOpen}
        onOpenChange={setIsCreateChallengeOpen}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Challenge</DialogTitle>
            <DialogDescription>
              Fill in the challenge details below.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Title */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="challenge-title" className="text-right">
                Title
              </Label>
              <Input
                id="challenge-title"
                placeholder="Challenge title"
                value={challengeData.title}
                onChange={(e) =>
                  setChallengeData({ ...challengeData, title: e.target.value })
                }
                className="col-span-3"
              />
            </div>

            {/* Description */}
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="challenge-description" className="text-right">
                Description
              </Label>
              <Textarea
                id="challenge-description"
                placeholder="Challenge description"
                value={challengeData.description}
                onChange={(e) =>
                  setChallengeData({
                    ...challengeData,
                    description: e.target.value,
                  })
                }
                className="col-span-3"
              />
            </div>

            {/* Course */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="challenge-course" className="text-right">
                Course
              </Label>
              <Select
                onValueChange={(val) =>
                  setChallengeData({ ...challengeData, course: val })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select course" />
                </SelectTrigger>
                <SelectContent>
                  {context.courses.map((course) => (
                    <SelectItem key={course._id} value={course._id.toString()}>
                      {course.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="challenge-status" className="text-right">
                Status
              </Label>
              <Select
                onValueChange={(val) =>
                  setChallengeData({ ...challengeData, status: val })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Difficulty */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="challenge-difficulty" className="text-right">
                Difficulty
              </Label>
              <Select
                onValueChange={(val) =>
                  setChallengeData({ ...challengeData, difficulty: val })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              onClick={handleSaveChallenge}
              disabled={!challengeData.title || !challengeData.course}
            >
              Create Challenge
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* // progress card */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-2xl shadow-lg bg-white dark:bg-gray-900">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold flex items-center gap-2 text-gray-900 dark:text-gray-100">
              <User className="h-5 w-5 text-blue-600" />
              Student Progress
            </DialogTitle>
          </DialogHeader>

          <Card className="rounded-2xl border shadow-md bg-white dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="p-6 space-y-5">
              {/* Student Info */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    {selectedUser?.firstName || "John"}{" "}
                    {selectedUser?.lastName || "Doe"}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {selectedUser?.email || "student@email.com"}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className="capitalize dark:border-gray-600 dark:text-gray-300"
                >
                  {selectedUser?.status || "active"}
                </Badge>
              </div>

              {/* Course Info */}
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <BookOpen className="h-5 w-5 text-indigo-600 mt-1" />
                <div className="flex flex-wrap gap-2">
                  {selectedUser?.courses?.length > 0 ? (
                    selectedUser.courses.map((c, idx) => {
                      const matchedCourse = context.courses?.find(
                        (course) => course._id === c.courseId
                      );

                      return (
                        <Badge
                          key={idx}
                          variant="outline"
                          className="bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-900 dark:text-indigo-300 dark:border-indigo-700"
                        >
                          {matchedCourse
                            ? matchedCourse.title
                            : "Unknown Course"}
                        </Badge>
                      );
                    })
                  ) : (
                    <Badge
                      variant="outline"
                      className="bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                    >
                      Mathematics
                    </Badge>
                  )}
                </div>
              </div>

              {/* Progress */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Progress
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedUser?.avgScore?.toFixed(2) || 0}%
                  </span>
                </div>
                <Progress
                  value={selectedUser?.avgScore || 0}
                  className="h-2 [&>div]:transition-colors
                              dark:[&>div]:bg-yellow-700"
                />
              </div>

              {/* Extra Info */}
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Completed:{" "}
                  {selectedUser?.courses?.filter(
                    (c) => c.status === "completed"
                  ).length || 0}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-yellow-600" />
                  Pending:{" "}
                  {selectedUser?.courses?.filter((c) => c.status === "active")
                    .length || 0}
                </div>
              </div>

              {/* Points & Streaks */}
              <div className="flex items-center justify-between text-lg font-semibold text-gray-800 dark:text-gray-200">
                {/* Points */}
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  Points: {selectedUser?.points || 0}
                </div>

                {/* Streaks */}
                <div className="flex items-center gap-2">
                  <Flame className="h-5 w-5 text-orange-600" />
                  Streaks: {selectedUser?.streaks || 0}
                </div>
              </div>

              {/* Achievements */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
                  <Award className="h-4 w-4 text-purple-600" /> Achievements
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedUser?.achievements?.length > 0 ? (
                    selectedUser.achievements.map((ach, index) => (
                      <Badge
                        key={index}
                        className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
                      >
                        {ach}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      No achievements yet
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>

      {/* // Profile card */}
      <Dialog open={open1} onOpenChange={setOpen1}>
        <DialogContent className="sm:max-w-[550px] rounded-2xl shadow-lg bg-background text-foreground">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Student Profile
            </DialogTitle>
          </DialogHeader>

          <Card className="rounded-2xl border border-border shadow-md bg-card text-card-foreground">
            <CardContent className="p-6 space-y-6">
              {/* Name & Status */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">
                    {selectedUser?.firstName || "John"}{" "}
                    {selectedUser?.lastName || "Doe"}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Enrollment No: {selectedUser?.enrollmentNumber || "N/A"}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className="capitalize px-3 py-1 text-sm font-medium border-border text-foreground"
                >
                  {selectedUser?.status || "Active"}
                </Badge>
              </div>

              {/* Contact Info */}
              <div className="grid gap-3 text-foreground">
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-primary" />
                  <span>{selectedUser?.email || "student@email.com"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-green-500 dark:text-green-400" />
                  <span>{selectedUser?.phone || "+91 98765 43210"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-pink-500 dark:text-pink-400" />
                  <span>
                    {selectedUser?.dateOfBirth?.split("T")[0] || "01 Jan 2000"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-purple-500 dark:text-purple-400" />
                  <span>{selectedUser?.department || "Computer Science"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-yellow-500 dark:text-yellow-400" />
                  <span>{selectedUser?.qualification || "B.Tech"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-red-500 dark:text-red-400" />
                  <span>{selectedUser?.address || "New Delhi, India"}</span>
                </div>
              </div>

              {/* Bio */}
              <div className="pt-4 border-t border-border">
                <h3 className="text-sm font-semibold flex items-center gap-1 mb-1">
                  <Info className="h-4 w-4 text-primary" />
                  Bio
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {selectedUser?.bio ||
                    "Enthusiastic learner, passionate about technology and innovation."}
                </p>
              </div>
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>
    </div>
  );
}
