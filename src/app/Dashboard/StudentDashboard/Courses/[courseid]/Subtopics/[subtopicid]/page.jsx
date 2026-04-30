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

  const contents = Array.isArray(subtopic?.contents) ? subtopic?.contents : [];

  if (!contents) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
        <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Theory Not Found
        </h2>
        <p className="text-gray-600 mb-6">
          The theory content could not be found.
        </p>
        <Link href="/Dashboard/StudentDashboard">
          <Button>Back to Dashboard</Button>
        </Link>
      </div>
    );
  }

  return (
    //  h-screen + overflow-hidden = nothing escapes the viewport
    <div className="h-screen w-full overflow-hidden bg-gray-50 dark:bg-slate-950 flex flex-col">

      {/* Header — fixed height, never shrinks */}
      <header className="shrink-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <Link
              href={`/Dashboard/StudentDashboard/Courses/${courseid}`}
              className="flex items-center space-x-2 text-gray-900 dark:text-gray-100 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              <Brain className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />
              <div>
                <h1 className="text-base sm:text-xl font-bold">Brain Lock</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
                  Student Dashboard
                </p>
              </div>
            </Link>
            <Badge
              variant="secondary"
              className="text-xs sm:text-sm hidden sm:flex bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border dark:border-gray-700 max-w-[180px] truncate"
            >
              {subtopic?.title} Theory
            </Badge>
          </div>
        </div>
      </header>

      {/*  Main fills ALL remaining height. min-h-0 is critical for nested flex scroll */}
      <main className="flex-1 min-h-0 flex flex-col lg:flex-row
                       max-w-8xl mx-auto w-full
                       px-3 sm:px-6 lg:px-8
                       py-3 sm:py-6 lg:py-8
                       gap-3 sm:gap-6">

        {/* Left Column: Theory Content */}
        {/*  min-h-0 allows this flex child to shrink and scroll internally */}
        <div className="flex-1 min-w-0 min-h-0 flex flex-col overflow-hidden">
          <Card className="flex-1 min-h-0 flex flex-col shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">

            {/* Card Header — never shrinks */}
            <CardHeader className="shrink-0 border-b border-gray-200 dark:border-gray-700 px-4 py-3 sm:px-6 sm:py-4">
              <CardTitle className="text-base sm:text-2xl font-bold text-gray-900 dark:text-gray-100 break-words leading-snug">
                {subtopic?.title}
              </CardTitle>
            </CardHeader>

            {!subtopic ? (
              <TheoryPageLoading />
            ) : (
              // flex-1 min-h-0 = grows to fill card, but won't push past it
              <CardContent className="flex-1 min-h-0 overflow-hidden p-0">
                {/*  h-full fills the CardContent exactly */}
                <ScrollArea className="h-full w-full">
                  <div className="px-4 py-4 sm:px-6">
                    {contents?.map((c) => (
                      <div key={c?._id} className="mb-6 sm:mb-8">

                        {/*  Aspect-ratio box so video never overflows */}
                        {c?.videoUrl && (
                          <div className="relative w-full mb-4" style={{ paddingTop: "56.25%" }}>
                            <iframe
                              className="absolute inset-0 w-full h-full rounded-lg shadow"
                              src={c?.videoUrl}
                              title={c?.title}
                              frameBorder="0"
                              allowFullScreen
                            />
                          </div>
                        )}

                        <div className="text-sm prose dark:prose-invert max-w-none break-words leading-relaxed
                          [&_h1]:mt-4 [&_h1]:text-lg sm:[&_h1]:text-2xl [&_h1]:font-bold
                          [&_h2]:mt-3 [&_h2]:text-base sm:[&_h2]:text-xl [&_h2]:font-semibold
                          [&_h3]:mt-3 [&_h3]:text-sm sm:[&_h3]:text-lg [&_h3]:font-semibold
                          [&_h4]:mt-2
                          [&_p]:mt-2 [&_p]:mb-2 [&_p]:text-sm
                          [&_pre]:my-3 [&_pre]:max-w-full [&_pre]:overflow-x-auto
                          [&_code]:text-[0.85em]
                          [&_ul]:list-disc [&_ul]:ml-4 [&_ul]:my-2
                          [&_ol]:list-decimal [&_ol]:ml-4 [&_ol]:my-2
                          [&_li]:mt-1 [&_li]:leading-relaxed [&_li]:text-sm
                          [&_blockquote]:border-l-4 [&_blockquote]:pl-3 [&_blockquote]:italic [&_blockquote]:text-gray-600
                          dark:[&_blockquote]:text-gray-300
                          [&_table]:block [&_table]:w-full [&_table]:overflow-x-auto
                          [&_img]:max-w-full [&_img]:h-auto">
                          <ReactMarkdown
                            components={{
                              pre: ({ node, ...props }) => (
                                <pre
                                  {...props}
                                  //  wrap on mobile so code never widens the card
                                  className="overflow-x-auto max-w-full p-3 rounded-md
                                             bg-gray-100 dark:bg-gray-900
                                             text-xs sm:text-sm
                                             whitespace-pre-wrap sm:whitespace-pre"
                                />
                              ),
                              code: ({ node, inline, ...props }) =>
                                inline ? (
                                  <code
                                    {...props}
                                    className="px-1 py-0.5 rounded bg-gray-200 dark:bg-gray-800 text-xs sm:text-sm break-all"
                                  />
                                ) : (
                                  <code {...props} className="text-xs sm:text-sm" />
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
                            className="text-blue-600 dark:text-blue-400 hover:underline mt-3 inline-block text-sm"
                          >
                            📄 Download / View File
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            )}
          </Card>
        </div>

        {/* Right Column: AI Assistant */}
        {/*  Hidden on mobile (iPhone SE), visible from sm breakpoint upward */}
        <div className="hidden sm:flex w-full lg:w-96 shrink-0 flex-col min-h-0">
          <iframe
            src={`https://www.chatbase.co/chatbot-iframe/${process.env.NEXT_PUBLIC_CHATBASE_ID}`}
            width="100%"
            className="flex-1 min-h-[400px] lg:min-h-0 rounded-lg bg-gray-900"
            frameBorder="0"
          />
        </div>

      </main>
    </div>
  );
}