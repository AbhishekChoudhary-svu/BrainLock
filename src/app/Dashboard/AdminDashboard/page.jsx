"use client";

import { useContext, useEffect, useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Award,
  TrendingUp,
  Clock,
  AlertCircle,
  CheckCircle,
  Download,
  Filter,
  Search,
  MoreHorizontal,
  Shield,
  Database,
  Server,
  Activity,
  UserPlus,
  UserMinus,
  Lock,
  Unlock,
  User,
  CircuitBoard,
  Mail,
  Phone,
  Calendar,
  Building2,
  GraduationCap,
  MapPin,
  Info,
  Sun,
  Home,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import MyContext from "@/context/ThemeProvider";
import { formatDistanceToNow } from "date-fns";
import ThemeToggleButton from "@/components/ui/theme-toggle-button";

export default function AdminDashboard() {
  const context = useContext(MyContext);
  const router = useRouter();
  const [isSystemSettingsOpen, setIsSystemSettingsOpen] = useState(false);
  const [open1, setOpen1] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    context.fetchAllUsers();
    context.fetchCourses();
    context.fetchChallenges();
    context.fetchProfile();
    context.fetchActivities();
  }, []);

  const handleDelete = async (userId) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/user/allUsers/${userId}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
        context.fetchAllUsers();
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error("Error deleting user: " + error.message);
    }
    setLoading(false);
  };

  const handleSuspend = async (userId, currentStatus) => {
    setLoading(true);
    try {
      const newStatus = currentStatus === "active" ? "inactive" : "active";

      const res = await fetch(`/api/user/allUsers/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(`User is now ${newStatus}`);
        context.fetchAllUsers();
      } else {
        toast.error(data.error || "Failed to update user status");
      }
    } catch (error) {
      toast.error("Error updating user: " + error.message);
    }
    setLoading(false);
  };

  const handleToggleRole = async (userId, currentRole) => {
    setLoading(true);
    try {
      // Decide new role
      const newRole = currentRole === "teacher" ? "student" : "teacher";

      const res = await fetch(`/api/user/allUsers/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(`User role updated to ${newRole}`);
        context.fetchAllUsers(); // refresh list
      } else {
        toast.error(data.error || "Failed to update role");
      }
    } catch (error) {
      toast.error("Error updating role: " + error.message);
    }
    setLoading(false);
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
  function parseUptimeToPercent(uptimeStr) {
    const regex = /(?:(\d+)d)?\s*(?:(\d+)h)?\s*(?:(\d+)m)?\s*(?:(\d+)s)?/;
    const match = uptimeStr?.match(regex);

    if (!match) return 0;

    const days = parseInt(match[1] || 0);
    const hours = parseInt(match[2] || 0);
    const minutes = parseInt(match[3] || 0);
    const seconds = parseInt(match[4] || 0);

    const totalSeconds = days * 86400 + hours * 3600 + minutes * 60 + seconds;

    // percentage of 24h (86400s)
    return ((totalSeconds / 86400) * 100).toFixed(2);
  }

  const systemStats = [
    {
      title: "Server Status",
      value: context.stats?.dbOnline ? "Online" : "Offline",
      icon: Server,
      color: context.stats?.dbOnline ? "text-green-600" : "text-red-600",
      bgColor: context.stats?.dbOnline ? "bg-green-100" : "bg-red-100",
    },
    {
      title: "Database Health",
      value: context.stats?.dbHealth,
      icon: Database,
      color:
        context.stats?.dbHealth === "Healthy"
          ? "text-green-600"
          : "text-red-600",
      bgColor:
        context.stats?.dbHealth === "Healthy" ? "bg-green-50" : "bg-red-50",
    },
    {
      title: "DB Load",
      value: `${context.stats?.dbLoad}%`,
      icon: Activity,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "System uptime",
      value: `${parseUptimeToPercent(context.stats?.uptime)}%`,
      icon: BarChart3,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
  ];

  useEffect(() => {
    // Run once on mount
    context.fetchStats();

    // Run every 10 seconds
    const interval = setInterval(() => {
      context.fetchStats();
    }, 60000 * 15);

    return () => clearInterval(interval);
  }, []);

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
 
  const openProfileDialog = (student) => {
    setSelectedUser(student);
    setOpen1(true);
  };

  return (
    <div className="min-h-screen dark:bg-slate-950  bg-gray-50">
      {/* Header */}
      <header className="bg-white dark:bg-slate-950 border-b dark:border-gray-900 border-gray-200 sticky top-0 z-40">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <Brain className="h-8 w-8 text-red-600" />
              <div>
                <h1 className="text-xl font-bold dark:text-gray-100 text-gray-900">
                  Brain Lock
                </h1>
                <p className="text-xs text-gray-500">Admin Dashboard</p>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center space-x-4">
              {/* Quick Actions */}

              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsSystemSettingsOpen(true)}
                className="hidden lg:flex"
              >
                <Settings className="h-4 w-4 mr-2" />
                System
              </Button>

              {/* Notifications */}
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  8
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
                      <p className="text-xs text-gray-500">System Admin</p>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Admin Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {context?.user?.role === "admin" && (
                    <>
                      <Link href={"/Dashboard/TeacherDashboard"}>
                        <DropdownMenuItem>
                          <CircuitBoard className="mr-2 h-4 w-4" />
                          Teacher Dashboard
                        </DropdownMenuItem>
                      </Link>
                      <Link href={"/Dashboard/StudentDashboard"}>
                        <DropdownMenuItem>
                          <User className="mr-2 h-4 w-4" />
                          Student Dashboard
                        </DropdownMenuItem>
                      </Link>
                    </>
                  )}
                  <Link href={"/Dashboard/ProfilePage"}>
                    <DropdownMenuItem>
                      <CircuitBoard className="mr-2 h-4 w-4" />
                      My Profile
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem
                    onClick={() => setIsSystemSettingsOpen(true)}
                    className="lg:hidden"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    System Updates
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Support
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
      <main className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-15 lg:pb-0">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold dark:text-gray-100 text-gray-900 mb-2">
            Welcome back, {context.user?.firstName}! 👋
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Monitor system performance and manage all platform users
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {context.allUsers.length}
              </div>
              <p className="text-xs dark:text-gray-400 text-gray-600">
                +2 this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Users
              </CardTitle>
              <Activity className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {context.allUsers.length}
              </div>
              <p className="text-xs dark:text-gray-400 text-gray-600">
                71% of total users
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Courses
              </CardTitle>
              <BookOpen className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {context.courses.length}
              </div>
              <p className="text-xs dark:text-gray-400 text-gray-600">
                12 pending approval
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                System Uptime
              </CardTitle>
              <Server className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {context.stats?.uptime}
              </div>
              <p className="text-xs dark:text-gray-400 text-gray-600">
                Last 30 days
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          {/* Desktop Tabs (shown on md and up) */}
          <TabsList className="hidden lg:grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="courses">Course Oversight</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
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
              value="users"
              className="flex flex-col items-center text-xs py-7"
            >
              <User className="h-5 w-5" />
              Users
            </TabsTrigger>
            <TabsTrigger
              value="courses"
              className="flex flex-col items-center text-xs py-7"
            >
              <BookOpen className="h-5 w-5" />
              Courses
            </TabsTrigger>
            <TabsTrigger
              value="activity"
              className="flex flex-col items-center text-xs py-7"
            >
              <Activity className="h-5 w-5" />
              Activity
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="flex flex-col items-center text-xs py-7"
            >
              <Settings className="h-5 w-5" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column */}
              <div className="lg:col-span-2 space-y-6">
                {/* System Health Overview */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Activity className="h-5 w-5 text-green-600" />
                      <span>System Health</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {systemStats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                          <div
                            key={index}
                            className={`p-4 rounded-lg ${stat.bgColor} dark:bg-gray-800`}
                          >
                            <div className="flex items-center space-x-2 mb-2">
                              <Icon className={`h-5 w-5 ${stat.color}`} />
                              <span className="text-sm font-medium dark:text-gray-200">
                                {stat.title}
                              </span>
                            </div>
                            <div className={`text-lg font-bold ${stat.color}`}>
                              {stat.value}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* User Distribution */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Users className="h-5 w-5 text-blue-600" />
                      <span>User Distribution</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {["student", "teacher", "admin"].map((role) => (
                      <div key={role} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium capitalize dark:text-gray-200">
                            {role}s
                          </span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {context.allUsers.filter((c) => c.role === role)
                              .length || 0}
                          </span>
                        </div>
                        <Progress
                          value={
                            ((context.allUsers.filter((c) => c.role === role)
                              .length || 0) /
                              (context.allUsers.length || 1)) *
                            100
                          }
                          className="h-2 [&>div]:transition-colors dark:[&>div]:bg-yellow-700"
                        />
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Recent Admin Activities */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Clock className="h-5 w-5 text-orange-600" />
                      <span>Recent Admin Activities</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {context.activities.length > 0 ? (
                        context.activities
                          .filter((c) => c.role === "admin")
                          .map((activity) => (
                            <div
                              key={activity._id}
                              className="flex flex-col sm:flex-row sm:items-start sm:space-x-3 gap-2"
                            >
                              {/* Icon */}
                              <div className="flex-shrink-0 sm:mt-1">
                                {getActivityIcon(activity.action)}
                              </div>

                              {/* Content */}
                              <div className="flex-1 min-w-0 break-words">
                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
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
                                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    {activity.details.score !== undefined
                                      ? `Score: ${activity.details.score}, Progress: ${activity.details.progress}%`
                                      : typeof activity.details === "string"
                                      ? activity.details
                                      : JSON.stringify(activity.details)}
                                  </p>
                                )}

                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                  {new Date(
                                    activity.createdAt
                                  ).toLocaleString()}
                                </p>
                              </div>
                            </div>
                          ))
                      ) : (
                        <p className="text-gray-400 dark:text-gray-500">
                          No recent admin activities
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Quick Admin Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="dark:text-gray-100">
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button
                      className="w-full justify-start bg-transparent dark:bg-purple-800 dark:text-gray-200"
                      variant="outline"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Export User Data
                    </Button>
                    <Button
                      className="w-full justify-start bg-transparent dark:bg-blue-800 dark:text-gray-200"
                      variant="outline"
                    >
                      <Shield className="mr-2 h-4 w-4" />
                      Security Audit
                    </Button>
                    <Button
                      className="w-full justify-start bg-transparent dark:bg-green-800 dark:text-gray-200"
                      variant="outline"
                      onClick={() => setIsSystemSettingsOpen(true)}
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      System Settings
                    </Button>
                  </CardContent>
                </Card>

                {/* System Alerts */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <AlertCircle className="h-5 w-5 text-yellow-600" />
                      <span>System Alerts</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Alert className="dark:bg-gray-800 dark:text-gray-200">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription className="text-sm">
                        Scheduled maintenance in 2 days. Users will be notified.
                      </AlertDescription>
                    </Alert>
                    <Alert className="dark:bg-gray-800 dark:text-gray-200">
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription className="text-sm">
                        Database backup completed successfully.
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>

                {/* Platform Statistics */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <BarChart3 className="h-5 w-5 text-purple-600" />
                      <span>Platform Stats</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="p-3 bg-blue-50 dark:bg-blue-900 rounded-lg">
                        <div className="text-lg font-bold text-blue-600">
                          {context.challenges.length}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          Total Challenges
                        </div>
                      </div>
                      <div className="p-3 bg-green-50 dark:bg-green-900 rounded-lg">
                        <div className="text-lg font-bold text-green-600">
                          {(() => {
                            const courses = context.user?.courses || [];
                            if (!courses.length) return "0%";

                            const completed = courses.filter(
                              (c) => c.progress === 100
                            ).length;
                            const successRate =
                              (completed / courses.length) * 100;
                            return `${successRate.toFixed(2)}%`;
                          })()}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          Success Rate
                        </div>
                      </div>
                      <div className="p-3 bg-purple-50 dark:bg-purple-900 rounded-lg">
                        <div className="text-lg font-bold text-purple-600">
                          156K
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          Hours Studied
                        </div>
                      </div>
                      <div className="p-3 bg-yellow-50 dark:bg-yellow-900 rounded-lg">
                        <div className="text-lg font-bold text-yellow-600">
                          {parseUptimeToPercent(context.stats?.uptime)}%
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          Uptime
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* User Management Tab */}
          <TabsContent value="users" className="space-y-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
              <h3 className="text-lg font-semibold">User Management</h3>

              {/* Search + Filter */}
              <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search users..."
                    className="pl-10 w-full"
                  />
                </div>

                <Button variant="outline" className="w-full sm:w-auto">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>

            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Activity</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {context.allUsers.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>
                              {(user.firstName + " " + user.lastName)
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">
                              {user.firstName + " " + user.lastName}
                            </p>
                            <p className="text-sm dark:text-gray-400 text-gray-600">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getRoleColor(user.role)}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.department || "Mathematics"}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            user.status === "active" ? "default" : "secondary"
                          }
                        >
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {formatDistanceToNow(new Date(user.lastActive), {
                          addSuffix: true,
                        })}
                      </TableCell>
                      <TableCell>
                        {user.role === "teacher" ? (
                          <span className="text-sm dark:text-gray-400 text-gray-600">
                            {user.courses || 4} courses, {user.students || 50}{" "}
                            students
                          </span>
                        ) : user.role === "student" ? (
                          <span className="text-sm dark:text-gray-400 text-gray-600">
                            {user.courses.length || 0} courses,{" "}
                            {user.avgScore.toFixed(2) || 0}% avg
                          </span>
                        ) : (
                          <span className="text-sm dark:text-gray-400 text-gray-600">
                            System Admin
                          </span>
                        )}
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
                              onClick={() => openProfileDialog(user)}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Profile
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() =>
                                handleToggleRole(user._id, user.role)
                              }
                            >
                              {user.role === "student" ? (
                                <>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Make Teacher
                                </>
                              ) : (
                                <>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Make Student
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleSuspend(user._id, user.status)
                              }
                            >
                              {user.status === "active" ? (
                                <>
                                  <Lock className="mr-2 h-4 w-4" />
                                  Suspend User
                                </>
                              ) : (
                                <>
                                  <Unlock className="mr-2 h-4 w-4" />
                                  Activate User
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDelete(user._id)}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete User
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

          {/* Course Oversight Tab */}
          <TabsContent value="courses" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Course Oversight
              </h3>
              <div className="flex space-x-2"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Active Courses */}
              <Card className="bg-white dark:bg-gray-800 border dark:border-gray-700">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg text-gray-900 dark:text-gray-100">
                      Active Courses
                    </CardTitle>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                      {
                        context.courses.filter((c) => c.status === "active")
                          .length
                      }{" "}
                      Courses
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    {context.courses
                      .filter((course) => course.status === "active")
                      .map((course) => (
                        <div
                          key={course._id}
                          className="flex justify-between border-b last:border-b-0 pb-1 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300"
                        >
                          <span>{course.title}</span>
                          <span>{course.subtopics?.length || 0} subtopics</span>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              {/* Active Challenges */}
              <Card className="bg-white dark:bg-gray-800 border dark:border-gray-700">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg text-gray-900 dark:text-gray-100">
                      Active Challenges
                    </CardTitle>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                      {
                        context.challenges.filter((c) => c.status === "active")
                          .length
                      }{" "}
                      Challenges
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="max-h-[200px] overflow-y-auto space-y-2 text-sm scrollbar-none">
                  {context.challenges
                    .filter((challenge) => challenge.status === "active")
                    .map((challenge) => (
                      <div
                        key={challenge._id}
                        className="flex justify-between border-b last:border-b-0 pb-1 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300"
                      >
                        {/* Challenge Title */}
                        <div className="flex-col flex">
                          <span>{challenge.title}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            ({challenge.course?.title})
                          </span>
                        </div>

                        {/* Number of MCQs */}
                        <span>{challenge.mcqs?.length || 0} MCQs</span>
                      </div>
                    ))}
                </CardContent>
              </Card>

              {/* Performance Metrics */}
              <Card className="bg-white dark:bg-gray-800 border dark:border-gray-700">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg text-gray-900 dark:text-gray-100">
                      Performance Metrics
                    </CardTitle>
                    <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                      Analytics
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* Avg Completion */}
                    <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/40 rounded-lg">
                      <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                        {(() => {
                          const courses = context.user?.courses || [];
                          if (!courses.length) return "0%";

                          const totalProgress = courses.reduce(
                            (sum, c) => sum + (c.progress || 0),
                            0
                          );
                          const avg = totalProgress / courses.length;
                          return `${avg.toFixed(2)}%`;
                        })()}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        Avg Completion
                      </div>
                    </div>

                    {/* Student Success Rate */}
                    <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/40 rounded-lg">
                      <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                        {(() => {
                          const courses = context.user?.courses || [];
                          if (!courses.length) return "0%";

                          const completed = courses.filter(
                            (c) => c.progress === 100
                          ).length;
                          const successRate =
                            (completed / courses.length) * 100;
                          return `${successRate.toFixed(2)}%`;
                        })()}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        Student Success Rate
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Activity Tab */}

          <TabsContent value="activity" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-900 dark:text-gray-100">
                <Clock className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                All Activites
              </h3>
              <div className="flex space-x-2"></div>
            </div>
            <div>
              <Card className="bg-white dark:bg-slate-900">
                <CardContent>
                  <div className="space-y-4">
                    {context.activities.length > 0 ? (
                      context.activities.map((activity) => (
                        <div
                          key={activity._id}
                          className="flex flex-col sm:flex-row sm:items-start sm:space-x-3 gap-2"
                        >
                          {/* Icon */}
                          <div className="flex-shrink-0 sm:mt-1">
                            {getActivityIcon(activity.action)}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0 break-words">
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
                              <span className="font-semibold text-gray-900 dark:text-gray-200">
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

            <Alert className="bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-gray-700">
              <BarChart3 className="h-4 w-4 text-gray-700 dark:text-gray-300" />
              <AlertDescription className="text-gray-600 dark:text-gray-300">
                Here we can see all recent activities of all users like Admin,
                Teacher and Student also ..
              </AlertDescription>
            </Alert>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-2">
              <Card>
                <CardHeader>
                  <CardTitle>System Configuration</CardTitle>
                  <CardDescription>
                    Manage global system settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    className="w-full justify-start bg-transparent"
                    variant="outline"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    General Settings
                  </Button>
                  <Button
                    className="w-full justify-start bg-transparent"
                    variant="outline"
                  >
                    <Shield className="mr-2 h-4 w-4" />
                    Security Settings
                  </Button>
                  <Button
                    className="w-full justify-start bg-transparent"
                    variant="outline"
                  >
                    <Bell className="mr-2 h-4 w-4" />
                    Notification Settings
                  </Button>
                  <Button
                    className="w-full justify-start bg-transparent"
                    variant="outline"
                  >
                    <Database className="mr-2 h-4 w-4" />
                    Backup Settings
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Platform Management</CardTitle>
                  <CardDescription>
                    Control platform-wide features
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    className="w-full justify-start bg-transparent"
                    variant="outline"
                  >
                    <Users className="mr-2 h-4 w-4" />
                    User Permissions
                  </Button>
                  <Button
                    className="w-full justify-start bg-transparent"
                    variant="outline"
                  >
                    <BookOpen className="mr-2 h-4 w-4" />
                    Course Templates
                  </Button>
                  <Button
                    className="w-full justify-start bg-transparent"
                    variant="outline"
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    AI Assistant Config
                  </Button>
                  <Button
                    className="w-full justify-start bg-transparent"
                    variant="outline"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Data Export
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* System Settings Dialog */}
      <Dialog
        open={isSystemSettingsOpen}
        onOpenChange={setIsSystemSettingsOpen}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>System Settings</DialogTitle>
            <DialogDescription>
              Configure global system parameters.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="maintenance-mode">Maintenance Mode</Label>
                <input
                  type="checkbox"
                  id="maintenance-mode"
                  className="rounded"
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="user-registration">
                  Allow User Registration
                </Label>
                <input
                  type="checkbox"
                  id="user-registration"
                  className="rounded"
                  defaultChecked
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="ai-features">Enable AI Features</Label>
                <input
                  type="checkbox"
                  id="ai-features"
                  className="rounded"
                  defaultChecked
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="max-users">Maximum Users</Label>
                <Input id="max-users" type="number" defaultValue="5000" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="session-timeout">
                  Session Timeout (minutes)
                </Label>
                <Input id="session-timeout" type="number" defaultValue="60" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline">Cancel</Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={open1} onOpenChange={setOpen1}>
        <DialogContent className="sm:max-w-[550px] rounded-2xl shadow-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold capitalize flex items-center gap-2">
              <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              {selectedUser?.role} Profile
            </DialogTitle>
          </DialogHeader>

          <Card className="rounded-2xl border shadow-md bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent className="p-6 space-y-6">
              {/* Name & Status */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {selectedUser?.firstName || "John"}{" "}
                    {selectedUser?.lastName || "Doe"}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Enrollment No: {selectedUser?.enrollmentNumber || "N/A"}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className="capitalize px-3 py-1 text-sm font-medium border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
                >
                  {selectedUser?.status || "Active"}
                </Badge>
              </div>

              {/* Contact Info */}
              <div className="grid gap-3 text-gray-700 dark:text-gray-300">
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  <span>{selectedUser?.email || "student@email.com"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <span>{selectedUser?.phone || "+91 98765 43210"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-pink-600 dark:text-pink-400" />
                  <span>
                    {selectedUser?.dateOfBirth?.split("T")[0] || "01 Jan 2000"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  <span>{selectedUser?.department || "Computer Science"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                  <span>{selectedUser?.qualification || "B.Tech"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-red-600 dark:text-red-400" />
                  <span>{selectedUser?.address || "New Delhi, India"}</span>
                </div>
              </div>

              {/* Bio */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">
                <h3 className="text-sm font-semibold flex items-center gap-1 mb-1">
                  <Info className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                  Bio
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
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
