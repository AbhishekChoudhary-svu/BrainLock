"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Brain,
  Shield,
  GraduationCap,
  BookOpen,
  Eye,
  EyeOff,
  ArrowLeft,
  Mail,
  Lock,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [activeTab, setActiveTab] = useState("student");

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e, role) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          role: role,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        toast.error(data.error || "Login failed");
        return;
      }

      toast.success(data.message || "Login successful");

      // Redirect based on role
      if (role === "student") {
        router.push("/Dashboard/StudentDashboard");
      } else if (role === "teacher") {
        router.push("/Dashboard/TeacherDashboard");
      } else if (role === "admin") {
        router.push("/Dashboard/AdminDashboard");
      }
    } catch (error) {
      toast.error("Something went wrong, please try again");
      console.error(error);
    }
  };

  const handleForgetSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/auth/forgetPassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        toast.error(data.error || "Login failed");
        return;
      }
      localStorage.setItem("otpType", "forget");
      localStorage.setItem("forgetEmail", formData.email);

      toast.success(data.message || "Login successful");

      router.push("/VerifyEmailPage");
    } catch (error) {
      toast.error("Something went wrong, please try again");
      console.error(error);
    }
  };

  function getRoleConfig(role) {
    switch (role) {
      case "admin":
        return {
          title: "Admin Panel",
          description: "Manage system settings and users",
          icon: Shield,
          bgColor: "bg-purple-100",
          borderColor: "border-purple-300",
          textColor: "text-purple-800",
          darkBgColor: "dark:bg-purple-950",
          darkBorderColor: "dark:border-purple-900",
          darkTextColor: "dark:text-purple-400",
        };
      case "teacher":
        return {
          title: "Teacher Dashboard",
          description: "Manage your classes and assignments",
          icon: GraduationCap,
          bgColor: "bg-green-100",
          borderColor: "border-green-300",
          textColor: "text-green-800",
          darkBgColor: "dark:bg-green-950",
          darkBorderColor: "dark:border-green-900",
          darkTextColor: "dark:text-green-400",
        };
      case "student":
        return {
          title: "Student Panel",
          description: "Access your courses and assignments",
          icon: BookOpen,
          bgColor: "bg-blue-100",
          borderColor: "border-blue-300",
          textColor: "text-blue-800",
          darkBgColor: "dark:bg-blue-950",
          darkBorderColor: "dark:border-blue-900",
          darkTextColor: "dark:text-blue-400",
        };
      default:
        return {
          title: "",
          description: "",
          icon: Shield,
          bgColor: "bg-gray-100",
          borderColor: "border-gray-300",
          textColor: "text-gray-800",
          darkBgColor: "dark:bg-gray-950",
          darkBorderColor: "dark:border-gray-900",
          darkTextColor: "dark:text-gray-400",
        };
    }
  }

  return (
    <div className="min-h-screen dark:from-slate-900 dark:via-slate-950 dark:to-purple-950 bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col">
      {/* Header */}
      <div className="p-4 sm:p-6 dark:from-slate-900 dark:via-slate-950 dark:to-purple-950">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <Link
            href="/"
            className="flex items-center space-x-2 dark:text-gray-100 text-gray-900 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <Brain className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold">Brain Lock</span>
          </Link>
          <Badge variant="secondary">Login Portal</Badge>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 dark:from-slate-900 dark:via-slate-950 dark:to-purple-950">
        <div className="w-full max-w-md">
          <Card className="shadow-2xl border-0 bg-white dark:bg-slate-900">
            <CardHeader className="space-y-1 text-center pb-4">
              <div className="flex justify-center mb-4">
                <Brain className="h-12 w-12 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Welcome Back
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Select your role and sign in to your account
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="admin" className="text-xs sm:text-sm">
                    <Shield className="h-4 w-4 mr-1" />
                    Admin
                  </TabsTrigger>
                  <TabsTrigger value="teacher" className="text-xs sm:text-sm">
                    <GraduationCap className="h-4 w-4 mr-1" />
                    Teacher
                  </TabsTrigger>
                  <TabsTrigger value="student" className="text-xs sm:text-sm">
                    <BookOpen className="h-4 w-4 mr-1" />
                    Student
                  </TabsTrigger>
                </TabsList>

                {["admin", "teacher", "student"].map((role) => {
                  const config = getRoleConfig(role);
                  const Icon = config.icon;

                  return (
                    <TabsContent key={role} value={role} className="mt-6">
                      <div
                        className={`p-4 rounded-lg border mb-6 
                        ${config.bgColor} ${config.borderColor} 
                        ${config.darkBgColor} ${config.darkBorderColor}`}
                      >
                        <div className="flex items-center space-x-3">
                          <Icon
                            className={`h-6 w-6 ${config.textColor} ${config.darkTextColor}`}
                          />
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                              {config.title}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {config.description}
                            </p>
                          </div>
                        </div>
                      </div>

                      <form
                        onSubmit={(e) => handleSubmit(e, role)}
                        className="space-y-4"
                      >
                        <div className="space-y-2">
                          <Label
                            htmlFor="email"
                            className="text-gray-700 dark:text-gray-300"
                          >
                            Email Address
                          </Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              placeholder="Enter your email"
                              value={formData.email}
                              onChange={handleInputChange}
                              className="pl-10 placeholder-gray-400 dark:placeholder-gray-500"
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="password"
                            className="text-gray-700 dark:text-gray-300"
                          >
                            Password
                          </Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                            <Input
                              id="password"
                              name="password"
                              type={showPassword ? "text" : "password"}
                              placeholder="Enter your password"
                              value={formData.password}
                              onChange={handleInputChange}
                              className="pl-10 pr-10 placeholder-gray-400 dark:placeholder-gray-500"
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <input
                              id="remember"
                              name="rememberMe"
                              type="checkbox"
                              checked={formData.rememberMe}
                              onChange={handleInputChange}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600"
                            />
                            <Label
                              htmlFor="remember"
                              className="text-sm text-gray-600 dark:text-gray-400"
                            >
                              Remember me
                            </Label>
                          </div>
                          <Link
                            href={""}
                            onClick={handleForgetSubmit}
                            className="text-sm text-blue-600 hover:underline dark:text-blue-400"
                          >
                            Forgot password?
                          </Link>
                        </div>

                        <Button
                          type="submit"
                          className="w-full  "
                          size="lg"
                        >
                          Sign in as{" "}
                          {role.charAt(0).toUpperCase() + role.slice(1)}
                        </Button>
                      </form>
                    </TabsContent>
                  );
                })}
              </Tabs>

              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="dark:border-gray-700" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white dark:bg-slate-950 px-2 text-gray-500 dark:text-gray-400">
                      Need an account?
                    </span>
                  </div>
                </div>

                <div className="text-center space-y-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Don't have an account yet?
                  </p>
                  <Link href="/SignupPage">
                    <Button
                      variant="outline"
                      className="w-full bg-transparent dark:border-gray-600 dark:text-gray-200"
                    >
                      Create New Account
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              By signing in, you agree to our{" "}
              <Link
                href="/terms"
                className="text-blue-600 hover:underline dark:text-blue-400"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="text-blue-600 hover:underline dark:text-blue-400"
              >
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
