import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {ThemeProvider} from "@/context/ThemeProvider";
import { Toaster } from "sonner";



const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Brain Lock",
  description: "Brain Lock - AI Powered Learning Tools Helps Students to Focus on Study",
};


export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <meta name="google-site-verification" content="T8IhaxzjzvzCTRsStkOfdbg2XyQv4U-Go0GMBU9wTkE" />
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider>
          {children}
          <Toaster position="top-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
