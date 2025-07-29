'use client'

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import {
  Home, FileText, Tag, Users, Clock, LogOut, Loader2,
  ChevronLeft, ChevronRight
} from "lucide-react"

const AdminSidebar = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      await fetch("/api/logout", { method: "POST" })
      router.push("/login")
    } catch (err) {
      console.error("Logout failed:", err)
      setIsLoading(false)
    }
  }

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`bg-white p-6 w-64 flex flex-col justify-between rounded-l-xl shadow-lg border-r border-gray-200 fixed top-0 left-0 h-screen z-40 transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-64'
        }`}
      >
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-700 flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" aria-hidden="true" />
              Admin Dashboard
            </h2>
          </div>

          <nav className="flex flex-col gap-3">
            <Link href="/dashboard">
              <button className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 px-4 rounded-lg hover:from-blue-700 hover:to-blue-800 w-full text-left text-sm font-medium">
                <Home className="h-5 w-5" />
                Home
              </button>
            </Link>
            <Link href="/dashboard/tenders">
              <button className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 px-4 rounded-lg hover:from-blue-700 hover:to-blue-800 w-full text-left text-sm font-medium">
                <FileText className="h-5 w-5" />
                Tenders
              </button>
            </Link>
            <Link href="/dashboard/tags">
              <button className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 px-4 rounded-lg hover:from-blue-700 hover:to-blue-800 w-full text-left text-sm font-medium">
                <Tag className="h-5 w-5" />
                Tags
              </button>
            </Link>
            <Link href="/dashboard/users">
              <button className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 px-4 rounded-lg hover:from-blue-700 hover:to-blue-800 w-full text-left text-sm font-medium">
                <Users className="h-5 w-5" />
                Users
              </button>
            </Link>
            <Link href="/dashboard/pending">
              <button className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 px-4 rounded-lg hover:from-blue-700 hover:to-blue-800 w-full text-left text-sm font-medium">
                <Clock className="h-5 w-5" />
                Pending
              </button>
            </Link>
          </nav>
        </div>

        <button
          onClick={handleLogout}
          disabled={isLoading}
          className="flex items-center gap-2 bg-gradient-to-r from-gray-700 to-gray-800 text-white py-2 px-4 rounded-lg hover:from-gray-800 hover:to-gray-900 disabled:opacity-50 disabled:cursor-not-allowed w-full text-sm font-medium"
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <LogOut className="h-5 w-5" />
          )}
          {isLoading ? "Logging Out..." : "Log Out"}
        </button>
      </aside>

      {/* Toggle Button - Outside Sidebar */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 bg-white border border-gray-300 rounded-full p-2 shadow-md hover:bg-gray-100 transition-all"
        aria-label={isSidebarOpen ? "Hide sidebar" : "Show sidebar"}
      >
        {isSidebarOpen ? (
          <ChevronLeft className="h-5 w-5 text-gray-600" />
        ) : (
          <ChevronRight className="h-5 w-5 text-gray-600" />
        )}
      </button>
    </>
  )
}

export default AdminSidebar
