"use client";

import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  ArrowLeft,
  Brain,
  MessageCircle,
  Search,
  Send,
  User,
  Bot,
  Loader2,
  AlertCircle,
} from "lucide-react";

// Mock theory content for subjects
const mockTheoryContent = {
  mathematics: {
    title: "Advanced Mathematics",
    subtopics: [
      {
        id: 101,
        title: "Calculus Derivatives",
        content: `
          <p>Derivatives measure the rate of change of a function. It’s a core concept in differential calculus.</p>
          <ul class="list-disc list-inside">
            <li><strong>Definition:</strong> A derivative represents an instantaneous rate of change (slope of a tangent line).</li>
            <li><strong>Notation:</strong> f'(x), dy/dx</li>
            <li><strong>Rules:</strong> Power rule, product rule, quotient rule, chain rule.</li>
            <li><strong>Applications:</strong> Optimization, motion problems, curve sketching.</li>
          </ul>
        `,
      },
      {
        id: 102,
        title: "Linear Equations Challenge",
        content: `
          <p>Linear equations form the backbone of algebra. They describe straight-line relationships.</p>
          <ul class="list-disc list-inside">
            <li><strong>Standard Form:</strong> ax + b = 0</li>
            <li><strong>Slope-Intercept Form:</strong> y = mx + c</li>
            <li><strong>Systems of Linear Equations:</strong> Solved using substitution, elimination, or matrices.</li>
            <li><strong>Applications:</strong> Modeling, prediction, geometry, economics.</li>
          </ul>
        `,
      },
    ],
  },
  physics: {
    title: "Physics Fundamentals",
    subtopics: [
      {
        title: "Newton’s Laws of Motion",
        content: `
          <p>Newton’s three laws form the basis of classical mechanics.</p>
          <ul class="list-disc list-inside">
            <li><strong>1st Law (Inertia):</strong> An object remains at rest or in uniform motion unless acted upon.</li>
            <li><strong>2nd Law:</strong> F = ma – Force equals mass times acceleration.</li>
            <li><strong>3rd Law:</strong> For every action, there is an equal and opposite reaction.</li>
          </ul>
        `,
      },
      {
        title: "Kinematics",
        content: `
          <p>Kinematics describes motion without considering its causes.</p>
          <ul class="list-disc list-inside">
            <li><strong>Quantities:</strong> Displacement, velocity, acceleration, time.</li>
            <li><strong>Equations of Motion:</strong> Used for uniformly accelerated motion.</li>
            <li><strong>Graphs:</strong> Position-time and velocity-time plots reveal motion patterns.</li>
          </ul>
        `,
      },
    ],
  },
  chemistry: {
    title: "Chemistry Basics",
    subtopics: [
      {
        title: "Atomic Structure",
        content: `
          <p>Atoms are the smallest unit of matter, made up of protons, neutrons, and electrons.</p>
          <ul class="list-disc list-inside">
            <li><strong>Subatomic Particles:</strong> Protons (+), Neutrons (0), Electrons (-)</li>
            <li><strong>Electron Configuration:</strong> Determines chemical properties.</li>
            <li><strong>Periodic Table:</strong> Arranges elements by atomic number and properties.</li>
          </ul>
        `,
      },
      {
        title: "Chemical Bonding",
        content: `
          <p>Atoms combine through bonding to achieve stability.</p>
          <ul class="list-disc list-inside">
            <li><strong>Ionic Bonds:</strong> Transfer of electrons, forming ions.</li>
            <li><strong>Covalent Bonds:</strong> Sharing of electrons.</li>
            <li><strong>Metallic Bonds:</strong> Sea of delocalized electrons.</li>
            <li><strong>Molecular Geometry:</strong> Shapes of molecules influence properties.</li>
          </ul>
        `,
      },
    ],
  },
};

export default function SubjectTheoryPage() {
  const params = useParams();
  const { subjectid } = params;

  const searchParams = useSearchParams();
  const subtopicId = Number(searchParams.get("subtopic")); // Make sure it's a number

  const currentSubtopic = mockTheoryContent[subjectid]?.subtopics.find(
    (s) => s.id === subtopicId
  );

  const theory = mockTheoryContent[subjectid];

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

  const getSubjectName = (id) => {
    switch (id) {
      case "mathematics":
        return "Advanced Mathematics";
      case "physics":
        return "Physics Fundamentals";
      case "chemistry":
        return "Chemistry Basics";
      default:
        return id.charAt(0).toUpperCase() + id.slice(1);
    }
  };

  const subjectName = getSubjectName(subjectid);

  if (!currentSubtopic) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
        <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Theory Not Found
        </h2>
        <p className="text-gray-600 mb-6">
          The theory content for subject "{subjectid}" could not be found.
        </p>
        <Link href="/Dashboard/StudentDashboard">
          <Button>Back to Dashboard</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link
              href={`/Dashboard/StudentDashboard/Courses/${subjectid}`}
              className="flex items-center space-x-3 text-gray-900 hover:text-purple-600 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <Brain className="h-8 w-8 text-purple-600" />
              <div>
                <h1 className="text-xl font-bold">Brain Lock</h1>
                <p className="text-xs text-gray-500">Student Dashboard</p>
              </div>
            </Link>
            <Badge variant="secondary" className="text-sm">
              {subjectName} Theory
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col lg:flex-row max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 gap-8">
        {/* Left Column: Theory Content */}
        <div className="flex-1 min-w-0">
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">
                {theory.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto">
              <ScrollArea className="h-[calc(100vh-250px)] pr-4">
                {currentSubtopic ? (
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-2">
                      {currentSubtopic.title}
                    </h3>
                    <div
                      className="prose max-w-none"
                      dangerouslySetInnerHTML={{
                        __html: currentSubtopic.content,
                      }}
                    />
                  </div>
                ) : (
                  <p className="text-red-500 text-sm">Subtopic not found.</p>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: AI Assistant & Search */}
        <div className="w-full lg:w-96 flex-shrink-0 space-y-8">
          {/* Search Bar */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Search className="h-5 w-5 text-blue-600" />
                <span>Search Theory</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Input
                  placeholder="Search within theory..."
                  className="pl-10"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                (Note: Search functionality is a placeholder for now)
              </p>
            </CardContent>
          </Card>

          {/* AI Assistant */}
          <Card className="flex-1 flex flex-col h-[calc(100vh-450px)] lg:h-[calc(100vh-320px)]">
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
                      Ask me anything about {subjectName}!
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
        </div>
      </main>
    </div>
  );
}
