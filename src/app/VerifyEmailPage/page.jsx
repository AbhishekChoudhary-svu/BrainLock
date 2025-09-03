"use client";

import { useState, useEffect, useRef, use } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Brain,
  Mail,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
export default function VerifyEmailPage({ searchParams }) {
  const router = useRouter();
  const { role = "student" } = use(searchParams);

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState("pending"); // pending, success, error
  const [errorMessage, setErrorMessage] = useState("");
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [canResend, setCanResend] = useState(false);
  const mode = localStorage.getItem("otpType");
  const emailKey = mode === "forget" ? "forgetEmail" : "userEmail";
  const email = localStorage.getItem(emailKey) || "user@example.com";
  const inputRefs = useRef([]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  // Format time display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Handle OTP input change
  const handleOtpChange = (index, value) => {
    if (value.length > 1) return; // Prevent multiple characters

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all fields are filled
    if (newOtp.every((digit) => digit !== "") && newOtp.join("").length === 6) {
      handleVerifyOtp(newOtp.join(""));
    }
  };

  // Handle backspace
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    const newOtp = [...otp];

    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i];
    }

    setOtp(newOtp);

    // Focus the next empty field or the last field
    const nextEmptyIndex = newOtp.findIndex((digit) => digit === "");
    const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
    inputRefs.current[focusIndex]?.focus();

    // Auto-submit if complete
    if (pastedData.length === 6) {
      handleVerifyOtp(pastedData);
    }
  };

  const handleVerifyOtp = async (otpValue) => {
    const otpCode = otpValue || otp.join("");

    if (otpCode.length !== 6) {
      toast.error("Please enter the 6-digit code.");
      return;
    }

    const mode = localStorage.getItem("otpType");
    const emailKey = mode === "forget" ? "forgetEmail" : "userEmail";
    const email = localStorage.getItem(emailKey);

    if (!email) {
      toast.error("Email not found. Please try again.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const endpoint = "/api/auth/verifyEmail";

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otpCode }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        toast.error(data.error || "Invalid OTP");
        setIsLoading(false);
        return;
      }

      toast.success("OTP verified successfully");

      if (mode === "forget") {
        router.push("/ForgetPassPage");
      } else {
        router.push("/LoginPage");
      }
    } catch (error) {
      toast.error("Something went wrong, please try again");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    setIsResending(true);
    setErrorMessage("");

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Reset timer and states
      setTimeLeft(300);
      setCanResend(false);
      setVerificationStatus("pending");
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (error) {
      setErrorMessage("Failed to resend code. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  const getRoleConfig = (role) => {
    const configs = {
      admin: { color: "text-blue-600", name: "Admin" },
      teacher: { color: "text-green-600", name: "Teacher" },
      student: { color: "text-purple-600", name: "Student" },
    };
    return configs[role] || configs.student;
  };

  const roleConfig = getRoleConfig(role);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-950 dark:to-purple-950 flex flex-col">
      {/* Header */}
      <div className="p-4 sm:p-6">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <Link
            href="/SignupPage"
            className="flex items-center space-x-2 text-gray-900 hover:text-blue-600 dark:text-gray-100 dark:hover:text-blue-400 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <Brain className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <span className="text-2xl font-bold">Brain Lock</span>
          </Link>
          <Badge variant="secondary">Email Verification</Badge>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md">
          <Card className="shadow-2xl border-0 bg-white dark:bg-slate-900">
            <CardHeader className="space-y-1 text-center pb-6">
              <div className="flex justify-center mb-4">
                {verificationStatus === "success" ? (
                  <div className="bg-green-100 dark:bg-green-900 rounded-full p-3">
                    <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
                  </div>
                ) : verificationStatus === "error" ? (
                  <div className="bg-red-100 dark:bg-red-900 rounded-full p-3">
                    <AlertCircle className="h-12 w-12 text-red-600 dark:text-red-400" />
                  </div>
                ) : (
                  <div className="bg-blue-100 dark:bg-blue-900 rounded-full p-3">
                    <Mail className="h-12 w-12 text-blue-600 dark:text-blue-400" />
                  </div>
                )}
              </div>

              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {verificationStatus === "success"
                  ? "Email Verified!"
                  : "Verify Your Email"}
              </CardTitle>

              <CardDescription className="text-base text-gray-600 dark:text-gray-400">
                {verificationStatus === "success" ? (
                  <span>
                    Welcome to Brain Lock! Your {roleConfig.name.toLowerCase()}{" "}
                    account has been successfully created.
                  </span>
                ) : (
                  <span>
                    We've sent a 6-digit verification code to{" "}
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      {email}
                    </span>
                  </span>
                )}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {verificationStatus === "success" ? (
                <div className="text-center space-y-4">
                  <Alert className="border-green-200 bg-green-50 dark:border-green-700 dark:bg-green-900">
                    <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <AlertDescription className="text-green-800 dark:text-green-200">
                      Your account has been verified successfully. Redirecting
                      to your dashboard...
                    </AlertDescription>
                  </Alert>

                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Redirecting to {roleConfig.name} Dashboard...</span>
                  </div>
                </div>
              ) : (
                <>
                  {/* OTP Input */}
                  <div className="space-y-4">
                    <div className="flex justify-center space-x-2">
                      {otp.map((digit, index) => (
                        <Input
                          key={index}
                          ref={(el) => (inputRefs.current[index] = el)}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) =>
                            handleOtpChange(
                              index,
                              e.target.value.replace(/\D/g, "")
                            )
                          }
                          onKeyDown={(e) => handleKeyDown(index, e)}
                          onPaste={index === 0 ? handlePaste : undefined}
                          className="w-12 h-12 text-center text-lg font-semibold border-2 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100"
                          disabled={
                            isLoading || verificationStatus === "success"
                          }
                        />
                      ))}
                    </div>

                    {/* Timer */}
                    <div className="text-center">
                      {timeLeft > 0 ? (
                        <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                          <Clock className="h-4 w-4" />
                          <span>Code expires in {formatTime(timeLeft)}</span>
                        </div>
                      ) : (
                        <div className="text-sm text-red-600 dark:text-red-400">
                          Verification code has expired
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Error Message */}
                  {errorMessage && (
                    <Alert className="border-red-200 bg-red-50 dark:border-red-700 dark:bg-red-900">
                      <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                      <AlertDescription className="text-red-800 dark:text-red-200">
                        {errorMessage}
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Verify Button */}
                  <Button
                    onClick={() => handleVerifyOtp(otp.join(""))}
                    disabled={otp.some((digit) => digit === "") || isLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white"
                    size="lg"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      "Verify Email"
                    )}
                  </Button>

                  {/* Resend Section */}
                  <div className="text-center space-y-3">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Didn't receive the code?
                    </p>

                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        onClick={handleResendOtp}
                        disabled={!canResend || isResending}
                        className="w-full bg-transparent dark:border-gray-600 dark:text-gray-200"
                      >
                        {isResending ? (
                          <>
                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          "Resend Code"
                        )}
                      </Button>

                      <Button
                        variant="ghost"
                        asChild
                        className="w-full text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        <Link href={`/LoginPage?email=${email}`}>
                          Change Email Address
                        </Link>
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Help Text */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Having trouble? Check your spam folder or{" "}
              <Link
                href="/support"
                className="text-blue-600 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
              >
                contact support
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
