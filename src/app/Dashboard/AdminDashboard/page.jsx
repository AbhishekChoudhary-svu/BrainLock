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
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import MyContext from "@/context/ThemeProvider";
import { formatDistanceToNow } from "date-fns";

export default function AdminDashboard() {
  const context = useContext(MyContext);
  const router = useRouter();
  const [isSystemSettingsOpen, setIsSystemSettingsOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    context.fetchAllUsers();
    context.fetchCourses();
    context.fetchChallenges();
    context.fetchProfile();
  }, []);

  // Mock data for admin (includes all teacher data plus admin-specific)
  const adminData = {
    name: "Dr. Michael Thompson",
    email: "michael.thompson@school.edu",
    role: "admin",
    department: "Administration",
    institution: "Lincoln High School",
    avatar: "/placeholder.svg?height=40&width=40",
    totalUsers: 1247,
    totalTeachers: 45,
    totalStudents: 1156,
    totalCourses: 89,
    systemUptime: "99.9%",
    activeUsers: 892,
  };

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

  const totalSeconds =
    days * 86400 + hours * 3600 + minutes * 60 + seconds;

  // percentage of 24h (86400s)
  return ((totalSeconds / 86400) * 100).toFixed(2);
}


  const systemStats = [
    {
      title: "Server Status",
      value: context.stats?.dbOnline ? "Online" : "Offline",
      icon: Server,
      color: context.stats?.dbOnline ? "text-green-600" : "text-red-600" ,
      bgColor: context.stats?.dbOnline ? "bg-green-100" : "bg-red-100" ,
    },
    {
      title: "Database Health",
      value: context.stats?.dbHealth,
      icon: Database,
      color: context.stats?.dbHealth === "Healthy" ? "text-green-600" : "text-red-600",
      bgColor: context.stats?.dbHealth === "Healthy" ? "bg-green-50" : "bg-red-50",

    },
    {
      title: "DB Load",
      value:`${context.stats?.dbLoad}%`,
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

  const recentAdminActivities = [
    {
      id: 1,
      type: "user_created",
      title: "New teacher account created: Dr. Lisa Chen",
      time: "1 hour ago",
    },
    {
      id: 2,
      type: "system_update",
      title: "System maintenance completed successfully",
      time: "2 hours ago",
    },
    {
      id: 3,
      type: "course_approved",
      title: "Approved new course: Advanced Biology",
      time: "4 hours ago",
    },
    {
      id: 4,
      type: "user_suspended",
      title: "Suspended user account: john.doe@student.edu",
      time: "1 day ago",
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
        return "bg-red-100 text-red-800";
      case "teacher":
        return "bg-green-100 text-green-800";
      case "student":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  

  const getActivityIcon = (type) => {
    switch (type) {
      case "user_created":
        return <UserPlus className="h-4 w-4 text-green-600" />;
      case "system_update":
        return <Settings className="h-4 w-4 text-blue-600" />;
      case "course_approved":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "user_suspended":
        return <UserMinus className="h-4 w-4 text-red-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <Brain className="h-8 w-8 text-red-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Brain Lock</h1>
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

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center space-x-2"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={adminData.avatar || "/placeholder.svg"}
                        alt={adminData.name}
                      />
                      <AvatarFallback>MT</AvatarFallback>
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
                  <Link href={"/Dashboard/StudentDashboard"}>
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      Student Page
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
                    System Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Shield className="mr-2 h-4 w-4" />
                    Security Center
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome back, {context.user?.firstName}! 👋
          </h2>
          <p className="text-gray-600">
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
              <p className="text-xs text-gray-600">+2 this month</p>
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
              <p className="text-xs text-gray-600">71% of total users</p>
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
              <p className="text-xs text-gray-600">12 pending approval</p>
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
              <p className="text-xs text-gray-600">Last 30 days</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="courses">Course Oversight</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
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
                            className={`p-4 rounded-lg ${stat.bgColor}`}
                          >
                            <div className="flex items-center space-x-2 mb-2">
                              <Icon className={`h-5 w-5 ${stat.color}`} />
                              <span className="text-sm font-medium">
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
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Students</span>
                        <span className="text-sm text-gray-600">
                          {
                            context.allUsers.filter((c)=>c.role=== "student").length || 0
                          }
                        </span>
                      </div>
                      <Progress
                        value={
                          (context.allUsers.filter((c)=>c.role=== "student").length || 0) * 100
                        }
                        className="h-2"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Teachers</span>
                        <span className="text-sm text-gray-600">
                          {context.allUsers.filter((c)=>c.role=== "teacher").length || 0}
                        </span>
                      </div>
                      <Progress
                        value={
                          (context.allUsers.filter((c)=>c.role=== "teacher").length || 0) * 100
                        }
                        className="h-2"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Admins</span>
                        <span className="text-sm text-gray-600">{context.allUsers.filter((c)=>c.role=== "admin").length || 0}</span>
                      </div>
                      <Progress
                        value={(context.allUsers.filter((c)=>c.role=== "admin").length || 0) * 100}
                        className="h-2"
                      />
                    </div>
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
                      {recentAdminActivities.map((activity) => (
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
                            <p className="text-xs text-gray-500 mt-1">
                              {activity.time}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Quick Admin Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button
                      className="w-full justify-start bg-transparent"
                      variant="outline"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Export User Data
                    </Button>
                    <Button
                      className="w-full justify-start bg-transparent"
                      variant="outline"
                    >
                      <Shield className="mr-2 h-4 w-4" />
                      Security Audit
                    </Button>
                    <Button
                      className="w-full justify-start bg-transparent"
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
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription className="text-sm">
                        Scheduled maintenance in 2 days. Users will be notified.
                      </AlertDescription>
                    </Alert>
                    <Alert>
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
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <div className="text-lg font-bold text-blue-600">
                          {context.challenges.length}
                        </div>
                        <div className="text-xs text-gray-600">
                          Total Challenges
                        </div>
                      </div>
                      <div className="p-3 bg-green-50 rounded-lg">
                        <div className="text-lg font-bold text-green-600">
                          {(() => {
                          const courses = context.user?.courses || [];
                          if (!courses.length) return "0%";

                          const completed = courses.filter(
                            (c) => c.progress === 100
                          ).length;
                          const successRate =
                            (completed / courses.length) * 100;
                          return `${successRate.toFixed(2)}%`; // e.g. 33.33%
                        })()}
                        </div>
                        <div className="text-xs text-gray-600">
                          Success Rate
                        </div>
                      </div>
                      <div className="p-3 bg-purple-50 rounded-lg">
                        <div className="text-lg font-bold text-purple-600">
                          156K
                        </div>
                        <div className="text-xs text-gray-600">
                          Hours Studied
                        </div>
                      </div>
                      <div className="p-3 bg-yellow-50 rounded-lg">
                        <div className="text-lg font-bold text-yellow-600">
                          {parseUptimeToPercent(context.stats?.uptime)}%
                        </div>
                        <div className="text-xs text-gray-600">Uptime</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* User Management Tab */}
          <TabsContent value="users" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">User Management</h3>
              <div className="flex space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input placeholder="Search users..." className="pl-10 w-64" />
                </div>
                <Button variant="outline">
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
                            <p className="text-sm text-gray-600">
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
                      <TableCell>{formatDistanceToNow(new Date(user.lastActive), {
                                      addSuffix: true,
                                    })}</TableCell>
                      <TableCell>
                        {user.role === "teacher" ? (
                          <span className="text-sm text-gray-600">
                            {user.courses || 4} courses, {user.students || 50}{" "}
                            students
                          </span>
                        ) : user.role === "student" ? (
                          <span className="text-sm text-gray-600">
                            {user.courses.length || 4} courses, {user.avgScore || 50}%
                            avg
                          </span>
                        ) : (
                          <span className="text-sm text-gray-600">
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
                            <DropdownMenuItem>
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
              <h3 className="text-lg font-semibold">Course Oversight</h3>
              <div className="flex space-x-2">
                
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">Active Courses</CardTitle>
                    <Badge className="bg-green-100 text-green-800">
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
                          className="flex justify-between border-b last:border-b-0 pb-1"
                        >
                          <span>{course.title}</span>
                          <span>{course.subtopics?.length || 0} subtopics</span>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">Active Challenges</CardTitle>
                    <Badge className="bg-green-100 text-green-800">
                      {
                        context.challenges.filter((c) => c.status === "active")
                          .length
                      }{" "}
                      Challenges
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    {context.challenges
                      .filter((challenge) => challenge.status === "active")
                      .map((challenge) => (
                        <div
                          key={challenge._id}
                          className="flex justify-between border-b last:border-b-0 pb-1"
                        >
                          {/* Challenge Title */}
                          <span>
                            {challenge.title}{" "}
                            <span className="text-xs text-gray-500">
                              ({challenge.course?.title})
                            </span>
                          </span>

                          {/* Number of MCQs */}
                          <span>{challenge.mcqs?.length || 0} MCQs</span>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">
                      Performance Metrics
                    </CardTitle>
                    <Badge className="bg-blue-100 text-blue-800">
                      Analytics
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* Avg Completion */}
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-lg font-bold text-blue-600">
                        {(() => {
                          const courses = context.user?.courses || [];
                          if (!courses.length) return "0%";

                          const totalProgress = courses.reduce(
                            (sum, c) => sum + (c.progress || 0),
                            0
                          );
                          const avg = totalProgress / courses.length;
                          return `${avg.toFixed(2)}%`; // e.g. 56.25%
                        })()}
                      </div>
                      <div className="text-xs text-gray-600">
                        Avg Completion
                      </div>
                    </div>

                    {/* Student Success Rate */}
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="text-lg font-bold text-purple-600">
                        {(() => {
                          const courses = context.user?.courses || [];
                          if (!courses.length) return "0%";

                          const completed = courses.filter(
                            (c) => c.progress === 100
                          ).length;
                          const successRate =
                            (completed / courses.length) * 100;
                          return `${successRate.toFixed(2)}%`; // e.g. 33.33%
                        })()}
                      </div>
                      <div className="text-xs text-gray-600">
                        Student Success Rate
                      </div>
                    </div>

                    {/* Student Satisfaction (placeholder) */}
                    {/* <div className="text-center p-3 bg-green-50 rounded-lg">
        <div className="text-lg font-bold text-green-600">92%</div>
        <div className="text-xs text-gray-600">Student Satisfaction</div>
      </div> */}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-6">
            <div className="">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-orange-600" />
                    <span>Recent Admin Activities</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentAdminActivities.map((activity) => (
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
                          <p className="text-xs text-gray-500 mt-1">
                            {activity.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Alert>
              <BarChart3 className="h-4 w-4" />
              <AlertDescription>
                Here we can see the all recent activities of all user like Admin
                , Teacher and Student also ..
              </AlertDescription>
            </Alert>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
    </div>
  );
}
