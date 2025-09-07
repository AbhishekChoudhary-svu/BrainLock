"use client";

import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useState, useRef, useEffect, useContext } from "react";
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
import MyContext from "@/context/ThemeProvider";
import ReactMarkdown from "react-markdown";

import { CourseContent, TheoryPageLoading } from "@/components/Loader/loading";

export default function SubjectTheoryPage() {
  const context = useContext(MyContext);
  const params = useParams();
  const { courseid, subtopicid } = params;

  useEffect(() => {
    context.fetchCourses();
  }, []);
  const subtopic = context.courses
    .flatMap((course) => course.subtopics || [])
    .find((s) => String(s._id) === String(subtopicid));

  // 2. Get its contents array safely
  const contents = Array.isArray(subtopic?.contents) ? subtopic?.contents : [];

  if (!contents) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
        <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Theory Not Found
        </h2>
        <p className="text-gray-600 mb-6">
          The theory content for subject "{contents._id}" could not be found.
        </p>
        <Link href="/Dashboard/StudentDashboard">
          <Button>Back to Dashboard</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link
              href={`/Dashboard/StudentDashboard/Courses/${courseid}`}
              className="flex items-center space-x-3 text-gray-900 dark:text-gray-100 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <Brain className="h-8 w-8 text-purple-600" />
              <div>
                <h1 className="text-xl font-bold">Brain Lock</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Student Dashboard
                </p>
              </div>
            </Link>
            <Badge
              variant="secondary"
              className="text-sm hidden lg:flex bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border dark:border-gray-700"
            >
              {subtopic?.title} Theory
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content Area */}

      <main className="flex-1 flex flex-col lg:flex-row max-w-8xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 gap-6">
        {/* Left Column: Theory Content */}
        <div className="flex-1 min-w-0">
          <Card className="h-full flex flex-col shadow-lg border border-gray-200 dark:border-gray-700">
            <CardHeader className="border-b border-gray-200 dark:border-gray-700">
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {subtopic?.title}
              </CardTitle>
            </CardHeader>
            {!subtopic ? (
              <TheoryPageLoading />
            ) : (
              <CardContent className="flex-1 overflow-hidden">
                <ScrollArea className="h-[62vh] pr-4">
                  {contents?.map((c) => (
                    <div key={c?._id} className="mb-8">
                      {c?.videoUrl && (
                        <iframe
                          className="w-full h-64 mb-4 rounded-lg shadow"
                          src={c?.videoUrl}
                          title={c?.title}
                          frameBorder="0"
                          allowFullScreen
                        />
                      )}
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
                                              {c?.description}
                                            </ReactMarkdown>
                                          </div>
                      

                     

                      {c?.fileUrl && (
                        <a
                          href={c?.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:underline mt-3 inline-block"
                        >
                          📄 Download / View File
                        </a>
                      )}
                    </div>
                  ))}
                </ScrollArea>
              </CardContent>
            )}
          </Card>
        </div>

        {/* Right Column: AI Assistant */}
        <div className="w-full lg:w-96 flex-shrink-0">
          <iframe
            src={`https://www.chatbase.co/chatbot-iframe/${process.env.NEXT_PUBLIC_CHATBASE_ID}`}
            width="100%"
            height="615"
            className="rounded-lg bg-gray-900"
            frameBorder="0"
          />
        </div>
      </main>
    </div>
  );
}
