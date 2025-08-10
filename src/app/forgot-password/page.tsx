"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { Mail, Loader2 } from "lucide-react"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setIsLoading(true)

    try {
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Failed to send reset link")
        setIsLoading(false)
        return
      }

      setSuccess("A password reset link has been sent to your email.")
      setEmail("")
      formRef.current?.reset()
    } catch (err) {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-blue-100 text-gray-800">
      <Navbar />
      <main className="flex-grow flex justify-center items-center p-6 sm:p-8 md:p-12">
        <form
          ref={formRef}
          onSubmit={handleForgotPassword}
          className="bg-white p-8 sm:p-10 rounded-xl w-full max-w-md shadow-xl border border-gray-200 animate-slide-up"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 flex items-center justify-center gap-2 mb-8">
            <Mail className="h-8 w-8 text-blue-600" aria-hidden="true" />
            Reset Password
          </h1>

          <div className="space-y-6">
            <div className="relative">
              <label className="block mb-1 font-medium text-gray-700 flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-500" aria-hidden="true" />
                Email Address
              </label>
              <input
                type="email"
                placeholder="example@gmail.com"
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white text-gray-800 text-sm transition-all duration-200"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-label="Email Address"
                disabled={isLoading}
              />
            </div>

            {error && (
              <div className="bg-red-50 text-red-700 p-3 rounded-lg flex items-center gap-2 animate-slide-down">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 text-green-700 p-3 rounded-lg flex items-center gap-2 animate-slide-down">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                {success}
              </div>
            )}

            <p className="text-sm text-center text-gray-600">
              Remember your password?{" "}
              <a
                href="/login"
                className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
              >
                Sign in
              </a>
            </p>

            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md"
              aria-label="Send reset link"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
              ) : (
                <Mail className="h-5 w-5" aria-hidden="true" />
              )}
              {isLoading ? "Sending..." : "Send Reset Link"}
            </button>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  )
}