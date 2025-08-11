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
  User,
  Phone,
  Building,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function SignupPage() {

    const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("student");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    adminCode: "",
    teacherCode: "",
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate password confirmation
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords don't match!");
      return;
    }

    try {
      // Prepare request body
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
        password: formData.password,
        ...(activeTab === "admin" && { adminCode: formData.adminCode }),
        ...(activeTab === "teacher" && { teacherCode: formData.teacherCode }),
      };

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        toast.error(data.error || "Registration failed!");
        return;
      }

      toast.success(
        data.message || "Registration successful! Please check your email."
      );
      localStorage.setItem("userEmail",formData.email)

      // Reset form fields
      setFormData({
        firstName: "",
        lastName: "",
        phoneNumber: "",
        email: "",
        password: "",
        confirmPassword: "",
        adminCode: "",
        teacherCode: "",
      });
      router.push("/VerifyEmailPage")
      setActiveTab("student");
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  const getRoleConfig = (role) => {
    const configs = {
      admin: {
        title: "Admin Registration",
        description: "Create an administrative account",
        icon: Shield,
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
      },
      teacher: {
        title: "Teacher Registration",
        description: "Join as an educator",
        icon: GraduationCap,
        color: "text-green-600",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
      },
      student: {
        title: "Student Registration",
        description: "Start your learning journey",
        icon: BookOpen,
        color: "text-purple-600",
        bgColor: "bg-purple-50",
        borderColor: "border-purple-200",
      },
    };
    return configs[role] || configs.student;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col">
      {/* Header */}
      <div className="p-4 sm:p-6">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <Link
            href="/"
            className="flex items-center space-x-2 text-gray-900 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <Brain className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold">Brain Lock</span>
          </Link>
          <Badge variant="secondary">Registration Portal</Badge>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-2xl">
          <Card className="shadow-2xl border-0">
            <CardHeader className="space-y-1 text-center pb-4">
              <div className="flex justify-center mb-4">
                <Brain className="h-12 w-12 text-blue-600" />
              </div>
              <CardTitle className="text-2xl font-bold">
                Join Brain Lock
              </CardTitle>
              <CardDescription>
                Create your account and unlock your learning potential
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
                        className={`p-4 rounded-lg ${config.bgColor} ${config.borderColor} border mb-6`}
                      >
                        <div className="flex items-center space-x-3">
                          <Icon className={`h-6 w-6 ${config.color}`} />
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {config.title}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {config.description}
                            </p>
                          </div>
                        </div>
                      </div>

                      <form
                        onSubmit={(e) => handleSubmit(e, role)}
                        className="space-y-4"
                      >
                        {/* Basic Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <div className="relative">
                              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                              <Input
                                id="firstName"
                                name="firstName"
                                type="text"
                                placeholder="Enter first name"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                className="pl-10"
                                required
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <div className="relative">
                              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                              <Input
                                id="lastName"
                                name="lastName"
                                type="text"
                                placeholder="Enter last name"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                className="pl-10"
                                required
                              />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              placeholder="Enter your email"
                              value={formData.email}
                              onChange={handleInputChange}
                              className="pl-10"
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="phoneNumber">Phone Number</Label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              id="phoneNumber"
                              name="phoneNumber"
                              type="tel"
                              placeholder="Enter phone number"
                              value={formData.phoneNumber}
                              onChange={handleInputChange}
                              className="pl-10"
                              required
                            />
                          </div>
                        </div>

                        {/* Bio field for teachers and admins */}
                        {(role === "teacher" || role === "admin") && (
                          <div className="space-y-2">
                            <Label htmlFor="activationCode">
                              Activation Code
                            </Label>
                            <div className="relative">
                              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                              <Input
                                id="activationCode"
                                name={
                                  role === "teacher"
                                    ? "teacherCode"
                                    : "adminCode"
                                } // dynamic name
                                type={showPassword ? "text" : "password"}
                                placeholder={`Enter ${
                                  role === "teacher" ? "Teacher" : "Admin"
                                } Activation Code...`}
                                value={
                                  role === "teacher"
                                    ? formData.teacherCode
                                    : formData.adminCode
                                }
                                onChange={handleInputChange}
                                className="pl-10 pr-10"
                                required
                                minLength={8}
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                              >
                                {showPassword ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Password fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                              <Input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Create password"
                                value={formData.password}
                                onChange={handleInputChange}
                                className="pl-10 pr-10"
                                required
                                minLength={8}
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                              >
                                {showPassword ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </button>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="confirmPassword">
                              Confirm Password
                            </Label>
                            <div className="relative">
                              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                              <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirm password"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                className="pl-10 pr-10"
                                required
                                minLength={8}
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  setShowConfirmPassword(!showConfirmPassword)
                                }
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                              >
                                {showConfirmPassword ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Password requirements */}
                        <div className="text-xs text-gray-500 space-y-1">
                          <p>Password must contain:</p>
                          <ul className="list-disc list-inside space-y-1 ml-2">
                            <li>At least 8 characters</li>
                            <li>One uppercase and one lowercase letter</li>
                            <li>One number and one special character</li>
                          </ul>
                        </div>

                        {/* Checkboxes */}
                        {/* <div className="space-y-3">
                          <div className="flex items-start space-x-2">
                            <input
                              id="agreeToTerms"
                              name="agreeToTerms"
                              type="checkbox"
                              checked={formData.agreeToTerms}
                              onChange={handleInputChange}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-1"
                              
                            />
                            <Label htmlFor="agreeToTerms" className="text-sm text-gray-600 leading-5">
                              I agree to the{" "}
                              <Link href="/terms" className="text-blue-600 hover:underline">
                                Terms of Service
                              </Link>{" "}
                              and{" "}
                              <Link href="/privacy" className="text-blue-600 hover:underline">
                                Privacy Policy
                              </Link>
                            </Label>
                          </div>

                          <div className="flex items-center space-x-2">
                            <input
                              id="subscribeNewsletter"
                              name="subscribeNewsletter"
                              type="checkbox"
                              checked={formData.subscribeNewsletter}
                              onChange={handleInputChange}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <Label htmlFor="subscribeNewsletter" className="text-sm text-gray-600">
                              Subscribe to our newsletter for updates and tips
                            </Label>
                          </div>
                        </div> */}

                        <Button type="submit" className="w-full" size="lg">
                          Create {role.charAt(0).toUpperCase() + role.slice(1)}{" "}
                          Account
                        </Button>
                      </form>
                    </TabsContent>
                  );
                })}
              </Tabs>

              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500">
                      Already have an account?
                    </span>
                  </div>
                </div>

                <div className="text-center">
                  <Link href="/LoginPage">
                    <Button variant="outline" className="w-full bg-transparent">
                      Sign In Instead
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500">
              By creating an account, you agree to our{" "}
              <Link href="/terms" className="text-blue-600 hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-blue-600 hover:underline">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
