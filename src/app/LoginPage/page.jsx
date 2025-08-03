"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Brain, Shield, GraduationCap, BookOpen, Eye, EyeOff, ArrowLeft, Mail, Lock } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })
  const [activeTab, setActiveTab] = useState("student")

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = (e, role) => {
    e.preventDefault()
    // Handle login logic here
    console.log("Login attempt:", { ...formData, role })
    // You would typically make an API call here
  }

  const getRoleConfig = (role) => {
    const configs = {
      admin: {
        title: "Admin Login",
        description: "Access your administrative dashboard",
        icon: Shield,
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
      },
      teacher: {
        title: "Teacher Login",
        description: "Manage your courses and students",
        icon: GraduationCap,
        color: "text-green-600",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
      },
      student: {
        title: "Student Login",
        description: "Continue your learning journey",
        icon: BookOpen,
        color: "text-purple-600",
        bgColor: "bg-purple-50",
        borderColor: "border-purple-200",
      },
    }
    return configs[role] || configs.student
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col">
      {/* Header */}
      <div className="p-4 sm:p-6">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <Link href="/" className="flex items-center space-x-2 text-gray-900 hover:text-blue-600 transition-colors">
            <ArrowLeft className="h-5 w-5" />
            <Brain className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold">Brain Lock</span>
          </Link>
          <Badge variant="secondary">Login Portal</Badge>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md">
          <Card className="shadow-2xl border-0">
            <CardHeader className="space-y-1 text-center pb-4">
              <div className="flex justify-center mb-4">
                <Brain className="h-12 w-12 text-blue-600" />
              </div>
              <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
              <CardDescription>Select your role and sign in to your account</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
                  const config = getRoleConfig(role)
                  const Icon = config.icon

                  return (
                    <TabsContent key={role} value={role} className="mt-6">
                      <div className={`p-4 rounded-lg ${config.bgColor} ${config.borderColor} border mb-6`}>
                        <div className="flex items-center space-x-3">
                          <Icon className={`h-6 w-6 ${config.color}`} />
                          <div>
                            <h3 className="font-semibold text-gray-900">{config.title}</h3>
                            <p className="text-sm text-gray-600">{config.description}</p>
                          </div>
                        </div>
                      </div>

                      <form onSubmit={(e) => handleSubmit(e, role)} className="space-y-4">
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
                          <Label htmlFor="password">Password</Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              id="password"
                              name="password"
                              type={showPassword ? "text" : "password"}
                              placeholder="Enter your password"
                              value={formData.password}
                              onChange={handleInputChange}
                              className="pl-10 pr-10"
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
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
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <Label htmlFor="remember" className="text-sm text-gray-600">
                              Remember me
                            </Label>
                          </div>
                          <Link href="/VerifyEmailPage" className="text-sm text-blue-600 hover:underline">
                            Forgot password?
                          </Link>
                        </div>

                        <Button type="submit" className="w-full" size="lg">
                          Sign in as {role.charAt(0).toUpperCase() + role.slice(1)}
                        </Button>
                      </form>
                    </TabsContent>
                  )
                })}
              </Tabs>

              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500">Need an account?</span>
                  </div>
                </div>

                <div className="text-center space-y-2">
                  <p className="text-sm text-gray-600">Don't have an account yet?</p>
                  <Link href="/SignupPage">
                    <Button variant="outline" className="w-full bg-transparent">
                      Create New Account
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500">
              By signing in, you agree to our{" "}
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
  )
}
