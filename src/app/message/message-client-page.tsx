// src/app/message/message-client-page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { sendMessage } from "@/lib/sendMessage";

// If you passed user data from the server component, type it here
// interface MessageClientPageProps {
//   user: { id: string; name: string /* ...other serializable user props */ };
// }

export default function MessageClientPage(
  // { user }: MessageClientPageProps // Accept props if passed
) {
  const router = useRouter();
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!to || !subject.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const res = await sendMessage({ to, content: subject });
      if (res?.success) { // Add optional chaining
        setSuccess("Message sent successfully!");
        setTo("");
        setSubject("");
        // Optional: Clear success message after delay
        // setTimeout(() => setSuccess(""), 5000);
      } else {
        setError(res?.error || "Failed to send message."); // Add optional chaining
        // Optional: Clear error message after delay
        // setTimeout(() => setError(""), 5000);
      }
    } catch (err) {
      console.error("Send message error:", err);
      setError("An unexpected error occurred.");
      // Optional: Clear error message after delay
      // setTimeout(() => setError(""), 5000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Subtle animated background dots */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-200 rounded-full opacity-30 blur-3xl"></div>
        <div className="absolute top-1/2 right-0 w-64 h-64 bg-purple-200 rounded-full opacity-40 blur-3xl"></div>
        <div className="absolute bottom-10 left-1/3 w-32 h-32 bg-indigo-100 rounded-full opacity-50 blur-2xl"></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3">
            Send a Message
          </h1>
          <p className="text-gray-600 text-sm leading-relaxed">
            Reach out securely with a personalized note.
          </p>
        </div>

        {/* Card with glassmorphic effect */}
        <div className="bg-white/80 backdrop-blur-lg shadow-xl rounded-2xl border border-gray-200/50 p-8 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* To Email */}
            <div>
              <label htmlFor="to" className="block text-sm font-semibold text-gray-700 mb-2">
                Recipient Email
              </label>
              <input
                id="to"
                type="email"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="name@company.com"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-3 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Message Content */}
            <div>
              <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">
                Your Message
              </label>
              <textarea
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Type your message here..."
                rows={5}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 placeholder-gray-500 resize-none focus:outline-none focus:ring-3 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Status Messages */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm font-medium animate-in fade-in slide-in-from-top duration-300">
                🚫 {error}
              </div>
            )}
            {success && (
              <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm font-medium animate-in fade-in slide-in-from-top duration-300">
                ✅ {success}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-200 transform hover:-translate-y-0.5"
            >
              📨 Send Message
            </button>

            {/* Back Button */}
            <button
              type="button"
              onClick={() => router.push("/home")} // Adjust route if needed
              className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-all duration-200"
            >
              ← Back to Home
            </button>
          </form>
        </div>

        {/* Footer */}
        <footer className="mt-10 text-center text-xs text-gray-500">
          © AL-IDHAFA 2025 • Secure & Fast Messaging
        </footer>
      </div>
    </div>
  );
}