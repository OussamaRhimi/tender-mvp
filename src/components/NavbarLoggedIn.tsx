"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Home, MessageSquare, PlusCircle, Mail, User, LogOut, FileText } from "lucide-react"

type Props = {
  user: {
    firstName?: string
    lastName?: string
  }
}

export default function NavbarLoggedIn({ user }: Props) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const router = useRouter()

  const fullName = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim()

  const handleLogout = async () => {
    await fetch("/api/logout", {
      method: "POST",
    })
    router.push("/login")
  }

  return (
    <nav className="bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 text-white py-4 px-6 sm:px-8 md:px-12 shadow-lg flex justify-between items-center fixed top-0 left-0 right-0 z-50 backdrop-blur-md">
      <div className="font-extrabold text-xl tracking-tight">
        <Link href="/home" className="hover:text-blue-300 transition-colors duration-200 flex items-center gap-2">
          <FileText className="h-6 w-6" aria-hidden="true" />
          My Tenders
        </Link>
      </div>

      <div className="flex items-center gap-4 sm:gap-6">
        <Link
          href="/home"
          className="flex items-center gap-2 text-sm sm:text-base font-medium hover:text-blue-300 transition-colors duration-200"
          aria-label="Home"
        >
          <Home className="h-5 w-5" aria-hidden="true" />
          <span className="hidden sm:inline">Home</span>
        </Link>
        <Link
          href="/message"
          className="flex items-center gap-2 text-sm sm:text-base font-medium hover:text-blue-300 transition-colors duration-200"
          aria-label="Messages"
        >
          <MessageSquare className="h-5 w-5" aria-hidden="true" />
          <span className="hidden sm:inline">Message</span>
        </Link>
        <Link
          href="/publish"
          className="flex items-center gap-2 text-sm sm:text-base font-medium hover:text-blue-300 transition-colors duration-200"
          aria-label="Publish tender"
        >
          <PlusCircle className="h-5 w-5" aria-hidden="true" />
          <span className="hidden sm:inline">Publish</span>
        </Link>
        <Link
          href="/contact"
          className="flex items-center gap-2 text-sm sm:text-base font-medium hover:text-blue-300 transition-colors duration-200"
          aria-label="Contact"
        >
          <Mail className="h-5 w-5" aria-hidden="true" />
          <span className="hidden sm:inline">Contact</span>
        </Link>

        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 text-sm sm:text-base font-semibold hover:text-blue-300 transition-colors duration-200 focus:outline-none"
            aria-label={`Toggle user menu for ${fullName || "User"}`}
            aria-expanded={dropdownOpen}
          >
            <User className="h-5 w-5" aria-hidden="true" />
            <span className="hidden sm:inline">{fullName || "User"}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`w-4 h-4 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {dropdownOpen && (
            <div
              className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50 animate-slide-down"
              style={{ top: "100%", right: 0 }}
            >
              <Link
                href="/profile"
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-blue-50 transition-colors duration-200"
                aria-label="View profile"
              >
                <User className="h-5 w-5 text-gray-500" aria-hidden="true" />
                Profile
              </Link>
              <Link
                href="/inbox/messages"
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-blue-50 transition-colors duration-200"
                aria-label="View inbox"
              >
                <MessageSquare className="h-5 w-5 text-gray-500" aria-hidden="true" />
                Inbox
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 transition-colors duration-200"
                aria-label="Log out"
              >
                <LogOut className="h-5 w-5 text-gray-500" aria-hidden="true" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}