"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import AdminSidebar from "@/components/AdminSidebar"
import Footer from "@/components/Footer"
import {
  FileText,
  Search,
  Trash2,
  Eye,
  Plus,
  Tag,
  User,
  MapPin,
  Calendar,
  AlertTriangle,
  Loader2,
  Clock,
} from "lucide-react"

type Tender = {
  id: number
  title: string
  buyerName: string
  location: string
  tags: string[]
  status: "active" | "expired" | "pending" | "awarded"
  deadline: string
}

export default function TendersDashboard() {
  const [tenders, setTenders] = useState<Tender[]>([])
  const [search, setSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const fetchTenders = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch(
        `/api/admin/tenders?page=${currentPage}&search=${encodeURIComponent(search)}`
      )
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
      
      const data = await res.json()
      console.log("API Response:", data)

      if (Array.isArray(data.tenders)) {
        setTenders(data.tenders)
        setTotalPages(Math.max(1, data.totalPages || 1))
      } else {
        console.error("Invalid data format received:", data)
        setTenders([])
        setTotalPages(1)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred"
      console.error("Failed to fetch tenders", err)
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this tender? This action cannot be undone.")) return
    try {
      const res = await fetch(`/api/admin/tenders/${id}`, { method: "DELETE" })
      if (res.ok) {
        fetchTenders() // Refresh list
      } else {
        const text = await res.text()
        throw new Error(`Delete failed: ${res.status} - ${text}`)
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "An unknown error occurred"
      alert(message)
    }
  }

  const handleView = (id: number) => {
    router.push(`/dashboard/tenders/${id}`)
  }

  useEffect(() => {
    fetchTenders()
  }, [search, currentPage])

  // Status badge color mapping
  const getStatusColor = (status: Tender["status"]) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800"
      case "pending": return "bg-yellow-100 text-yellow-800"
      case "expired": return "bg-red-100 text-red-800"
      case "awarded": return "bg-blue-100 text-blue-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
          <p className="mt-4 text-lg text-gray-700">Loading tenders...</p>
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
            onClick={fetchTenders}
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

        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-10 animate-slide-up">
          <h1 className="text-3xl sm:text-4xl font-bold flex items-center gap-3 mb-8 text-gray-900">
            <FileText className="h-9 w-9 text-blue-600" aria-hidden="true" />
            Tenders Management
          </h1>

          {/* Search & Add Button */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-6 mb-8">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              {/* Search */}
              <div className="relative max-w-md w-full">
                <Search className="absolute left-3 top-1/2 h-5 w-5 text-gray-400 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search tenders by title, buyer, or location..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-800 placeholder-gray-500"
                  aria-label="Search tenders"
                />
              </div>

              {/* Add Tender Button */}
              <button
                onClick={() => router.push("/dashboard/tenders/new")}
                className="flex items-center justify-center gap-2 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors font-medium whitespace-nowrap"
                aria-label="Add new tender"
              >
                <Plus className="h-5 w-5" /> Add Tender
              </button>
            </div>
          </div>

          {/* Tenders List */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
            {tenders.length === 0 ? (
              <div className="p-12 text-center">
                <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-700">No Tenders Found</h3>
                <p className="text-gray-500 mt-2">
                  {search
                    ? "No tenders match your search criteria."
                    : "There are no tenders in the system yet."}
                </p>
              </div>
            ) : (
              <>
                {/* Header (Desktop) */}
                <div className="hidden md:grid grid-cols-12 gap-4 bg-gray-50 px-6 py-4 text-sm font-semibold text-gray-700 border-b">
                  <div className="col-span-1">ID</div>
                  <div className="col-span-3">Title</div>
                  <div className="col-span-2">Buyer</div>
                  <div className="col-span-2">Tags</div>
                  <div className="col-span-2">Location</div>
                  <div className="col-span-1">Status</div>
                  <div className="col-span-1 text-center">Actions</div>
                </div>

                {/* Tenders */}
                <div className="divide-y divide-gray-100">
                  {tenders.map((tender) => {
                    const deadline = new Date(tender.deadline).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                    return (
                      <div
                        key={tender.id}
                        className="p-4 md:p-6 hover:bg-gray-50 transition-colors group"
                      >
                        <div className="md:grid md:grid-cols-12 md:gap-4 items-center">
                          {/* ID */}
                          <div className="col-span-1 mb-2 md:mb-0">
                            <span className="font-mono text-sm text-gray-500">#{tender.id}</span>
                          </div>

                          {/* Title */}
                          <div className="col-span-3 mb-3 md:mb-0">
                            <h3 className="font-semibold text-gray-900 line-clamp-2">{tender.title}</h3>
                          </div>

                          {/* Buyer */}
                          <div className="col-span-2 mb-3 md:mb-0 flex items-center gap-2 text-sm">
                            <User className="h-4 w-4 text-gray-400" />
                            <span>{tender.buyerName}</span>
                          </div>

                          {/* Tags */}
                          <div className="col-span-2 mb-3 md:mb-0">
                            {tender.tags.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {tender.tags.slice(0, 2).map((tag, i) => (
                                  <span
                                    key={i}
                                    className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full"
                                  >
                                    {tag}
                                  </span>
                                ))}
                                {tender.tags.length > 2 && (
                                  <span className="text-xs text-gray-500">+{tender.tags.length - 2}</span>
                                )}
                              </div>
                            ) : (
                              <span className="text-gray-400 text-sm italic">No tags</span>
                            )}
                          </div>

                          {/* Location */}
                          <div className="col-span-2 mb-3 md:mb-0 flex items-center gap-2 text-sm">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span>{tender.location}</span>
                          </div>

                          {/* Status */}
                          <div className="col-span-1 mb-3 md:mb-0">
                            <span
                              className={`inline-block text-xs font-medium px-2.5 py-0.5 rounded-full ${getStatusColor(tender.status)}`}
                            >
                              {tender.status.charAt(0).toUpperCase() + tender.status.slice(1)}
                            </span>
                          </div>

                          {/* Actions */}
                          <div className="col-span-1 flex justify-center gap-3">
                            <button
                              onClick={() => handleView(tender.id)}
                              className="flex flex-col items-center text-blue-600 hover:text-blue-800 transition-colors group-hover:scale-105"
                              aria-label={`View tender ${tender.id}`}
                            >
                              <Eye className="h-6 w-6" />
                              <span className="text-xs mt-1">View</span>
                            </button>
                            <button
                              onClick={() => handleDelete(tender.id)}
                              className="flex flex-col items-center text-red-600 hover:text-red-800 transition-colors group-hover:scale-105"
                              aria-label={`Delete tender ${tender.id}`}
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