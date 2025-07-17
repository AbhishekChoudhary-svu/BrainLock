"use client";

import Image from "next/image";

export default function Home() {
  return (
    <div className="relative min-h-screen  w-full font-sans">
      <Image
        src="/black.jpg"       // replace with your real image in public folder
        alt="Background"
        fill                // makes it fill the container
        className="object-cover  -z-10" // cover + send behind content
        priority           // optional: load faster
      />
       <div className="absolute inset-0 bg-black/50 -z-10"></div> {/* <-- overlay */}
      <main className="flex flex-col items-start justify-center w-full h-screen gap-8 text-start p-46 ">
                  <h1
              className="text-7xl font-[900] text-start bg-[url('/thumd.jpg')] bg-cover bg-center text-transparent bg-clip-text"
            >
              WELCOME TO BRAIN-LOCK.
            </h1>

        <p className="max-w-6xl text-lg font-[500] text-white">
          <strong>BrainLock</strong> is an AI-powered study and productivity assistant designed to help users set daily goals and actually finish them. If the user misses a goal, the app vibrates or rings — and to stop it, the user must answer a question related to their topic. This playful but strict system keeps you accountable, engaged, and motivated all day. Built with Next.js (App Router), MongoDB & Mongoose, shadcn/ui, and Tailwind CSS, BrainLock offers a clean, modern interface, real-time progress tracking, and secure authentication. Perfect for students, developers, or anyone who struggles to stay focused.
        </p>
      </main>
    </div>
  );
}
