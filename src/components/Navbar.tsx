"use client"

import Link from "next/link"
import { Home, MessageSquare, PlusCircle, Mail, LogIn, FileText } from "lucide-react"

export default function Navbar() {
  return (
    <nav className="bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 text-white py-4 px-6 sm:px-8 md:px-12 shadow-lg flex justify-between items-center fixed top-0 left-0 right-0 z-50 backdrop-blur-md">
      <div className="font-extrabold text-xl tracking-tight">
        <Link href="/" className="hover:text-blue-300 transition-colors duration-200 flex items-center gap-2">
          <FileText className="h-6 w-6" aria-hidden="true" />
          My Tenders
        </Link>
      </div>
      <div className="flex items-center gap-4 sm:gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm sm:text-base font-medium hover:text-blue-300 transition-colors duration-200"
          aria-label="Home"
        >
          <Home className="h-5 w-5" aria-hidden="true" />
          <span className="hidden sm:inline">Home</span>
        </Link>
        <Link
          href="message"
          className="flex items-center gap-2 text-sm sm:text-base font-medium hover:text-blue-300 transition-colors duration-200"
          aria-label="Messages"
        >
          <MessageSquare className="h-5 w-5" aria-hidden="true" />
          <span className="hidden sm:inline">Messages</span>
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
        <Link
          href="/login"
          className="flex items-center gap-2 text-sm sm:text-base font-medium hover:text-blue-300 transition-colors duration-200"
          aria-label="Login"
        >
          <LogIn className="h-5 w-5" aria-hidden="true" />
          <span className="hidden sm:inline">Login</span>
        </Link>
      </div>
    </nav>
  )
}