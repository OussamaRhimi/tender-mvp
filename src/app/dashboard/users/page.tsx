"use client"

import { useEffect, useState } from "react"
import AdminSidebar from "@/components/AdminSidebar"
import Footer from "@/components/Footer"
import {
  Users,
  Search,
  Eye,
  Trash2,
  Loader2,
  AlertTriangle,
  Shield,
  User as UserIcon,
  Calendar,
} from "lucide-react"

type User = {
  id: number
  firstName: string
  lastName: string
  email: string
  role: "ADMIN" | "BUYER" | "SUPPLIER"
  subscription: "FREE" | "PARTIAL" | "FULL"
  createdAt: string
}

export default function UsersDashboard() {
  const [users, setUsers] = useState<User[]>([])
  const [search, setSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUsers = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/users?page=${currentPage}&search=${encodeURIComponent(search)}`)
      if (!res.ok) throw new Error(`Failed to fetch users: ${res.status}`)
      const data = await res.json()

      if (Array.isArray(data.users)) {
        setUsers(data.users)
        setTotalPages(Math.max(1, data.totalPages || 1))
      } else {
        console.error("Invalid response format:", data)
        setUsers([])
        setTotalPages(1)
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "An unknown error occurred"
      console.error("Fetch users error:", err)
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [search, currentPage])

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Are you sure you want to delete the user "${name}"? This action cannot be undone.`)) return
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" })
      if (res.ok) {
        fetchUsers()
      } else {
        const text = await res.text()
        throw new Error(`Delete failed: ${res.status} - ${text}`)
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete user"
      alert(message)
    }
  }

  const handleView = (user: User) => {
    const fullName = `${user.firstName} ${user.lastName}`
    const registered = new Date(user.createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })

    alert(`User Details:
Name: ${fullName}
Email: ${user.email}
Role: ${user.role}
Subscription: ${user.subscription}
Registered: ${registered}`)
  }

  // Role badge color
  const getRoleColor = (role: User["role"]) => {
    switch (role) {
      case "ADMIN": return "bg-red-100 text-red-800"
      case "BUYER": return "bg-blue-100 text-blue-800"
      case "SUPPLIER": return "bg-green-100 text-green-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  // Subscription badge color
  const getSubColor = (sub: User["subscription"]) => {
    switch (sub) {
      case "FULL": return "bg-green-100 text-green-800"
      case "PARTIAL": return "bg-yellow-100 text-yellow-800"
      case "FREE": return "bg-gray-100 text-gray-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
          <p className="mt-4 text-lg text-gray-700">Loading users...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50 p-6">
        <div className="text-center max-w-sm">
          <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <p className="text-lg font-semibold text-red-700">Error</p>
          <p className="text-sm text-red-600 mt-1">{error}</p>
          <button
            onClick={fetchUsers}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-white text-gray-900">
      <div className="flex flex-1">
        <AdminSidebar />

        <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-10 animate-slide-up">
          <h1 className="text-3xl sm:text-4xl font-bold flex items-center gap-3 mb-8 text-gray-900">
            <Users className="h-9 w-9 text-blue-600" aria-hidden="true" />
            User Management
          </h1>

          {/* Search */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-6 mb-8">
            <div className="relative max-w-md mx-auto sm:mx-0">
              <Search className="absolute left-3 top-1/2 h-5 w-5 text-gray-400 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by name, email, or role..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setCurrentPage(1)
                }}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-800 placeholder-gray-500"
                aria-label="Search users"
              />
            </div>
          </div>

          {/* Users List */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
            {users.length === 0 ? (
              <div className="p-12 text-center">
                <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-700">No Users Found</h3>
                <p className="text-gray-500 mt-2">
                  {search
                    ? `No users match "${search}".`
                    : "There are no users in the system yet."}
                </p>
              </div>
            ) : (
              <>
                {/* Header (Desktop) */}
                <div className="hidden md:grid grid-cols-12 gap-4 bg-gray-50 px-6 py-4 text-sm font-semibold text-gray-700 border-b">
                  <div className="col-span-1">ID</div>
                  <div className="col-span-3">Name</div>
                  <div className="col-span-3">Email</div>
                  <div className="col-span-2">Role</div>
                  <div className="col-span-2">Subscription</div>
                  <div className="col-span-1 text-center">Actions</div>
                </div>

                {/* Users */}
                <div className="divide-y divide-gray-100">
                  {users.map((user) => {
                    const fullName = `${user.firstName} ${user.lastName}`
                    const registered = new Date(user.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                    return (
                      <div
                        key={user.id}
                        className="p-4 md:p-6 hover:bg-gray-50 transition-colors group"
                      >
                        <div className="md:grid md:grid-cols-12 md:gap-4 items-center">
                          {/* ID */}
                          <div className="col-span-1 mb-2 md:mb-0">
                            <span className="font-mono text-sm text-gray-500">#{user.id}</span>
                          </div>

                          {/* Name */}
                          <div className="col-span-3 mb-3 md:mb-0 flex items-center gap-2">
                            <UserIcon className="h-4 w-4 text-gray-500" />
                            <span className="font-semibold text-gray-900">{fullName}</span>
                          </div>

                          {/* Email */}
                          <div className="col-span-3 mb-3 md:mb-0">
                            <span className="text-gray-800">{user.email}</span>
                          </div>

                          {/* Role */}
                          <div className="col-span-2 mb-3 md:mb-0">
                            <span
                              className={`inline-block text-xs font-medium px-2.5 py-0.5 rounded-full ${getRoleColor(user.role)}`}
                            >
                              {user.role}
                            </span>
                          </div>

                          {/* Subscription */}
                          <div className="col-span-2 mb-3 md:mb-0">
                            <span
                              className={`inline-block text-xs font-medium px-2.5 py-0.5 rounded-full ${getSubColor(user.subscription)}`}
                            >
                              {user.subscription}
                            </span>
                          </div>

                          {/* Actions */}
                          <div className="col-span-1 flex justify-center gap-3">
                            <button
                              onClick={() => handleView(user)}
                              className="flex flex-col items-center text-blue-600 hover:text-blue-800 transition-colors group-hover:scale-105"
                              aria-label={`View user ${fullName}`}
                            >
                              <Eye className="h-6 w-6" />
                              <span className="text-xs mt-1">View</span>
                            </button>
                            <button
                              onClick={() => handleDelete(user.id, fullName)}
                              className="flex flex-col items-center text-red-600 hover:text-red-800 transition-colors group-hover:scale-105"
                              aria-label={`Delete user ${fullName}`}
                            >
                              <Trash2 className="h-6 w-6" />
                              <span className="text-xs mt-1">Delete</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-wrap justify-center gap-2 mt-8">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(1)}
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                First
              </button>
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 transition-colors"
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 flex items-center justify-center text-sm rounded-lg transition-colors ${
                    currentPage === page
                      ? "bg-blue-600 text-white"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 transition-colors"
              >
                Next
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(totalPages)}
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 transition-colors"
              >
                Last
              </button>
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  )
}