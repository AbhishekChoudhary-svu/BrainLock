import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Brain,
  Users,
  Trophy,
  MessageCircle,
  Shield,
  GraduationCap,
  BookOpen,
  Target,
  TrendingUp,
  ArrowRight,
  Github,
  Twitter,
  Linkedin,
  Mail,
  LayoutGrid,
  BarChart2,
} from "lucide-react"
import { useContext } from "react"
import MyContext from "@/context/ThemeProvider"
import Link from "next/link"

export default function LandingPage() {

 
  return (
    <div className="min-h-screen   bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="border-b bg-white/80 dark:bg-slate-950 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold dark:text-gray-100 text-gray-900">Brain Lock</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost">About</Button>
              <Button variant="ghost">Contact</Button>
              <Link href={"/LoginPage"}>
              <Button variant="outline">Login</Button>
              </Link>
              <Link href={"/Dashboard/StudentDashboard"}>
              <Button>Get Started!</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto text-center">
          <Badge variant="secondary" className="mb-4">
            AI-Powered Learning Platform
          </Badge>
          <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            Unlock your learning potential with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              AI-powered study plans
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Track your progress, challenge your focus, and compete with your peers in an intelligent learning
            environment designed for success.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-3">
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-3 bg-transparent">
              Login
            </Button>
          </div>
        </div>
      </section>

      {/* Feature Highlights Section */}
     <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-200 dark:bg-gray-900">
  <div className="max-w-7xl mx-auto">
    <div className="text-center mb-16">
      <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
        Smart Tools for Better Learning & Teaching
      </h2>
      <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
        Unlock your potential with AI-driven learning paths, progress tracking, and real-time performance insights.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {/* AI Challenge Generator */}
      <Card className="text-center hover:shadow-lg transition-shadow">
        <CardHeader>
          <Brain className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <CardTitle>AI-Generated Daily Challenges</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>
            Stay consistent with smart daily tasks tailored to your pace and course structure.
          </CardDescription>
        </CardContent>
      </Card>

      {/* Leaderboard */}
      <Card className="text-center hover:shadow-lg transition-shadow">
        <CardHeader>
          <Trophy className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
          <CardTitle>Leaderboards & Streaks</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>
            Compete with classmates and track your learning streaks to stay motivated every day.
          </CardDescription>
        </CardContent>
      </Card>

      {/* AI Chat Assistant */}
      <Card className="text-center hover:shadow-lg transition-shadow">
        <CardHeader>
          <MessageCircle className="h-12 w-12 text-purple-600 mx-auto mb-4" />
          <CardTitle>Course-Specific AI Assistant</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>
            Get instant answers and learning support with smart AI chatbots trained on your course content.
          </CardDescription>
        </CardContent>
      </Card>

      {/* Performance Tools for Teachers */}
      <Card className="text-center hover:shadow-lg transition-shadow">
        <CardHeader>
          <BarChart2 className="h-12 w-12 text-green-600 mx-auto mb-4" />
          <CardTitle>Student Performance Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>
            Teachers can monitor scores, view trends, and personalize support with real-time performance graphs.
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  </div>
     </section>


      {/* User Roles Overview Section */}
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-100 dark:bg-slate-950">
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Smarter Learning for Students & Teachers
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Brain Lock helps students stay consistent and empowers teachers to guide better with smart tools and insights.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Student Card */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="text-center">
            <BookOpen className="h-16 w-16 text-purple-600 mx-auto mb-4" />
            <CardTitle>For Students</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-center">
              Start daily challenges, get AI assistance, track streaks, and climb the leaderboard while learning smarter every day.
            </CardDescription>
          </CardContent>
        </Card>

        {/* Teacher Card */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="text-center">
            <GraduationCap className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <CardTitle>For Teachers</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-center">
              Manage your assigned courses, monitor student scores, and analyze performance with real-time insights.
            </CardDescription>
          </CardContent>
        </Card>

        {/* Courses Card */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="text-center">
            <LayoutGrid className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <CardTitle>Explore Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-center">
              Discover subject-based learning paths, AI-generated challenge plans, and detailed topic breakdowns for each course.
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    </div>
    </section>


      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-300 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold dark:text-gray-100 text-gray-900 mb-4">How Brain Lock Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get started in four simple steps and transform your learning experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">1. Choose a Course</h3>
              <p className="text-gray-600">
                Browse our extensive catalog and select the course that matches your learning goals
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">2. Start a Challenge</h3>
              <p className="text-gray-600">
                Begin with AI-generated challenges tailored to your skill level and learning pace
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Brain className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">3. Solve AI-Scheduled Tasks</h3>
              <p className="text-gray-600">
                Complete intelligently scheduled tasks and quizzes designed to optimize your learning
              </p>
            </div>

            <div className="text-center">
              <div className="bg-yellow-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">4. Track Your Progress</h3>
              <p className="text-gray-600">Monitor your streaks, performance metrics, and compete on leaderboards</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial/Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Join Thousands of Successful Learners</h2>
          <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto">
            Experience the power of AI-driven education and unlock your full potential
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">10K+</div>
              <div className="text-blue-100">Active Students</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">500+</div>
              <div className="text-blue-100">Courses Available</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">95%</div>
              <div className="text-blue-100">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <Brain className="h-8 w-8 text-blue-400" />
                <span className="text-2xl font-bold">Brain Lock</span>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                Empowering learners worldwide with AI-driven education technology. Unlock your potential and achieve
                your learning goals.
              </p>
              <div className="flex space-x-4">
                <Github className="h-6 w-6 text-gray-400 hover:text-white cursor-pointer" />
                <Twitter className="h-6 w-6 text-gray-400 hover:text-white cursor-pointer" />
                <Linkedin className="h-6 w-6 text-gray-400 hover:text-white cursor-pointer" />
                <Mail className="h-6 w-6 text-gray-400 hover:text-white cursor-pointer" />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Blog
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Cookie Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    GDPR
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 Brain Lock. All rights reserved. Built with ❤️ for learners everywhere.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
