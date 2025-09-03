"use client"
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  SparklesIcon,
} from "lucide-react";
import { useContext, useEffect, useState } from "react";
import MyContext from "@/context/ThemeProvider";
import Link from "next/link";
import ImageCursorTrail from "@/components/ui/image-cursortrail";
import { CardCarousel } from "@/components/ui/card-carousel";
import ThemeToggleButton from "@/components/ui/theme-toggle-button";
import { motion } from "framer-motion";

const steps = [
  {
    title: "1. Choose a Course",
    desc: "Browse our extensive catalog and select the course that matches your learning goals",
    icon: <BookOpen className="h-8 w-8 text-blue-600" />,
    bg: "bg-blue-100",
  },
  {
    title: "2. Start a Challenge",
    desc: "Begin with AI-generated challenges tailored to your skill level and learning pace",
    icon: <Target className="h-8 w-8 text-green-600" />,
    bg: "bg-green-100",
  },
  {
    title: "3. Solve AI-Scheduled Tasks",
    desc: "Complete intelligently scheduled tasks and quizzes designed to optimize your learning",
    icon: <Brain className="h-8 w-8 text-purple-600" />,
    bg: "bg-purple-100",
  },
  {
    title: "4. Track Your Progress",
    desc: "Monitor your streaks, performance metrics, and compete on leaderboards",
    icon: <TrendingUp className="h-8 w-8 text-yellow-600" />,
    bg: "bg-yellow-100",
  },
];

const stepVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.6, ease: "easeOut" },
  }),
};

const images = [
  "https://i.pinimg.com/736x/ff/53/b9/ff53b9536227d518d5165a5fb44b9a37.jpg",
  "https://imgcdn.stablediffusionweb.com/2024/11/15/34defe37-196e-419d-b1ab-4ab2788a0a3f.jpg",
  "https://e0.pxfuel.com/wallpapers/990/33/desktop-wallpaper-nodejs-node-js.jpg",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2ZYtHv2OLXmthRPbkmENZRXuqBVDwlsrZ1A&s",
  "https://sourcebae.com/blog/wp-content/uploads/2023/08/1665673562977-Best-way-to-learn-javascript.jpg",
];
const cardItems = [
  {
    icon: <Brain className="h-12 w-12 text-blue-600 mx-auto mb-4" />,
    title: "AI-Generated Daily Challenges",
    description:
      "Stay consistent with smart daily tasks tailored to your pace and course structure.",
  },
  {
    icon: <Trophy className="h-12 w-12 text-yellow-600 mx-auto mb-4" />,
    title: "Leaderboards & Streaks",
    description:
      "Compete with classmates and track your learning streaks to stay motivated every day.",
  },
  {
    icon: <MessageCircle className="h-12 w-12 text-purple-600 mx-auto mb-4" />,
    title: "Course-Specific AI Assistant",
    description:
      "Get instant answers and learning support with smart AI chatbots trained on your course content.",
  },
  {
    icon: <BarChart2 className="h-12 w-12 text-green-600 mx-auto mb-4" />,
    title: "Student Performance Insights",
    description:
      "Teachers can monitor scores, view trends, and personalize support with real-time performance graphs.",
  },
  {
    icon: <BookOpen className="h-16 w-16 text-purple-600 mx-auto mb-4" />,
    title: "For Students",
    description:
      "Start daily challenges, get AI assistance, track streaks, and climb the leaderboard while learning smarter every day.",
  },
  {
    icon: <GraduationCap className="h-16 w-16 text-green-600 mx-auto mb-4" />,
    title: "For Teachers",
    description:
      "Manage your assigned courses, monitor student scores, and analyze performance with real-time insights.",
  },
  {
    icon: <LayoutGrid className="h-16 w-16 text-blue-600 mx-auto mb-4" />,
    title: "Explore Courses",
    description:
      "Discover subject-based learning paths, AI-generated challenge plans, and detailed topic breakdowns for each course.",
  },
];

export default function LandingPage() {
  const context = useContext(MyContext);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    //context.fetchProfile();
  }, []);
  return (
    <div className="min-h-screen dark:bg-slate-950   bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="border-b bg-white/80 dark:bg-slate-950 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold dark:text-gray-100 text-gray-900">
                Brain Lock
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-4">
              <Button variant="ghost">About</Button>
              <Button variant="ghost">Contact</Button>
              <ThemeToggleButton
                variant="gif"
                url="https://media.giphy.com/media/5PncuvcXbBuIZcSiQo/giphy.gif?cid=ecf05e47j7vdjtytp3fu84rslaivdun4zvfhej6wlvl6qqsz&ep=v1_stickers_search&rid=giphy.gif&ct=s"
              />
              {context?.user?.role ? (
                <Link href={"/Dashboard/StudentDashboard"}>
                  <Button>Open App!</Button>
                </Link>
              ) : (
                <Link href={"/LoginPage"}>
                  <Button variant="outline">Login</Button>
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex gap-4 items-center">
              <ThemeToggleButton
                variant="gif"
                url="https://media.giphy.com/media/5PncuvcXbBuIZcSiQo/giphy.gif?cid=ecf05e47j7vdjtytp3fu84rslaivdun4zvfhej6wlvl6qqsz&ep=v1_stickers_search&rid=giphy.gif&ct=s"
              />
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-900 dark:text-gray-100 focus:outline-none"
              >
                {isOpen ? (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isOpen && (
            <div className="md:hidden mt-2 space-y-2 pb-4">
              <Button variant="ghost" className="w-full justify-start">
                About
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                Contact
              </Button>
              {context?.user?.role ? (
                <Link href={"/Dashboard/StudentDashboard"}>
                  <Button>Open App!</Button>
                </Link>
              ) : (
                <Link href={"/LoginPage"}>
                  <Button variant="outline">Login</Button>
                </Link>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative w-full lg:h-[90vh] h-[80vh] flex items-center justify-center overflow-hidden border bg-gray-50 border-black/5 dark:bg-slate-950">
        {/* Animated Cursor Trail */}
        <ImageCursorTrail
          items={images}
          maxNumberOfImages={3}
          distance={10}
          imgClass="sm:w-44 w-28 sm:h-56 h-36 rounded-xl shadow-md animate-float"
          className="absolute inset-0 w-full h-full z-20"
        />

        {/* Overlay */}
        <div className="absolute inset-0 dark:bg-transparent z-10" />

        {/* Hero Content */}
        <div className="relative z-30 text-center max-w-5xl px-6">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <Badge
              variant="secondary"
              className="mb-4 dark:bg-slate-800 dark:text-gray-200"
            >
              <SparklesIcon className="mr-1 h-4 w-4 text-purple-500" />
              BrainLock – AI-Powered Learning
            </Badge>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-4xl sm:text-6xl font-bold text-black dark:text-gray-100 mb-6 leading-tight drop-shadow-lg"
          >
            Unlock your learning potential with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              AI-powered study plans
            </span>
          </motion.h1>

          {/* Paragraph */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-lg sm:text-xl text-black dark:text-gray-300 mb-8 max-w-2xl mx-auto"
          >
            Track your progress, challenge your focus, and compete with peers in
            an intelligent learning environment designed for success.
          </motion.p>

          {/* Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7 }}
            whileHover={{ scale: 1.05 }}
            
          >
            <Link href={"/Dashboard/StudentDashboard"}>
              <Button size="lg" className="text-lg px-8 py-3 shadow-md">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <CardCarousel
        cards={cardItems} // pass the array of cards here
        autoplayDelay={2000}
        showPagination={false}
        showNavigation={true}
      />

      {/* How It Works Section */}
      <section className="lg:py-20 py-15 px-4 sm:px-6 lg:px-8 bg-gray-300 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold dark:text-gray-100 text-gray-900 mb-4">
            How Brain Lock Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-16">
            Get started in four simple steps and transform your learning
            experience
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={stepVariants}
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="text-center cursor-pointer"
              >
                <div
                  className={`${step.bg} rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4`}
                >
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 dark:text-gray-100">
                  {step.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial / Stats Section */}
      <section className="lg:py-20 py-15 px-4 sm:px-6 lg:px-8 bg-gray-900">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Join Thousands of Successful Learners
          </h2>
          <p className="text-lg text-blue-100 mb-12 max-w-2xl mx-auto">
            Experience the power of AI-driven education and unlock your full
            potential
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="text-4xl font-bold text-white mb-2">10K+</div>
              <div className="text-blue-100">Active Students</div>
            </motion.div>

            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="text-4xl font-bold text-white mb-2">500+</div>
              <div className="text-blue-100">Courses Available</div>
            </motion.div>

            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="text-4xl font-bold text-white mb-2">95%</div>
              <div className="text-blue-100">Success Rate</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <Brain className="h-8 w-8 text-blue-400" />
                <span className="text-2xl font-bold">Brain Lock</span>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                Empowering learners worldwide with AI-driven education
                technology. Unlock your potential and achieve your learning
                goals.
              </p>
              <div className="flex space-x-4">
                <Github className="h-6 w-6 text-gray-400 hover:text-white cursor-pointer" />
                <Linkedin className="h-6 w-6 text-gray-400 hover:text-white cursor-pointer" />
                <Twitter className="h-6 w-6 text-gray-400 hover:text-white cursor-pointer" />
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
              © 2025 Brain Lock. All rights reserved. Built with ❤️ for learners
              everywhere.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
