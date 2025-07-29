"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import InboxSidebar from "@/components/InboxSidebar"
import Footer from "@/components/Footer"
import { Search, Eye, Trash2, FileText } from "lucide-react"

type Tender = {
  id: number
  title: string
  location: string | null
  tags: { tag: { name: string } }[]
  deadline: string
  status: string
}

export default function MyTendersPage() {
  const [tenders, setTenders] = useState<Tender[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const fetchMyTenders = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/inbox/my-tenders")
      const data = await res.json()
      setTenders(data.tenders || [])
    } catch (err) {
      console.error("Failed to fetch my tenders", err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this tender?")) return

    const res = await fetch(`/api/admin/tenders/${id}`, {
      method: "DELETE",
    })

    if (res.ok) {
      fetchMyTenders()
    } else {
      alert("Failed to delete tender.")
    }
  }

  const handleView = (id: number) => {
    router.push(`/tenders/${id}`)
  }

  useEffect(() => {
    fetchMyTenders()
  }, [])

  // Filter tenders based on search query
  const filteredTenders = tenders.filter(
    (tender) =>
      tender.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tender.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tender.tags.some((t) => t.tag.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      tender.status.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-blue-50 text-gray-800">
      <div className="flex flex-1">
        {/* Sidebar */}
        <InboxSidebar />

        {/* Main content */}
        <main className="flex-1 p-6 sm:p-8 md:p-12 lg:p-16">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 flex items-center gap-2">
              <FileText className="h-8 w-8 text-blue-500" aria-hidden="true" />
              My Tenders
              {filteredTenders.length > 0 && (
                <span className="ml-3 inline-flex items-center justify-center px-2.5 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full animate-pulse-short transition-all duration-300">
                  {filteredTenders.length}
                </span>
              )}
            </h1>
            <div className="mt-4 sm:mt-0 relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search tenders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm"
                aria-label="Search my tenders"
              />
              <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" aria-hidden="true" />
            </div>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, index) => (
                <div
                  key={index}
                  className="bg-white shadow-lg rounded-xl p-4 border border-gray-200 animate-pulse"
                >
                  <div className="flex justify-between items-center">
                    <div className="h-4 bg-gray-200 rounded w-1/12"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/6"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/6"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/6"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/12"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredTenders.length === 0 ? (
            <p className="text-lg text-gray-600 text-center py-12">
              {searchQuery ? "No tenders match your search." : "You haven't posted any tenders yet."}
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full bg-white shadow-lg rounded-xl border border-gray-200">
                <thead className="bg-gray-50 text-gray-700 text-left text-sm font-semibold">
                  <tr>
                    <th className="p-4">ID</th>
                    <th className="p-4">Title</th>
                    <th className="p-4">Tags</th>
                    <th className="p-4">Location</th>
                    <th className="p-4">Deadline</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTenders.map((tender, index) => (
                    <tr
                      key={tender.id}
                      className={`border-t border-gray-200 animate-slide-in transition-all duration-300 ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                      } hover:bg-blue-50/70`}
                    >
                      <td className="p-4 text-gray-800">{tender.id}</td>
                      <td className="p-4 text-gray-800 font-medium">{tender.title}</td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-2">
                          {tender.tags.map((t) => (
                            <span
                              key={t.tag.name}
                              className="inline-block bg-blue-100 text-blue-800 text-xs px-2.5 py-1 rounded-full font-medium"
                            >
                              {t.tag.name}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-4 text-gray-800">{tender.location || "—"}</td>
                      <td className="p-4 text-gray-800">
                        {new Date(tender.deadline).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                            tender.status.toLowerCase() === "open"
                              ? "bg-green-100 text-green-800"
                              : tender.status.toLowerCase() === "closed"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {tender.status}
                        </span>
                      </td>
                      <td className="p-4 flex gap-2">
                        <div className="group relative">
                          <button
                            onClick={() => handleView(tender.id)}
                            className="p-2 rounded-full hover:bg-blue-100 text-blue-500 hover:text-blue-700 transition-colors duration-200"
                            aria-label={`View tender ${tender.title}`}
                          >
                            <Eye className="h-5 w-5" />
                          </button>
                          <span className="absolute left-1/2 -translate-x-1/2 bottom-10 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2">
                            View
                          </span>
                        </div>
                        <div className="group relative">
                          <button
                            onClick={() => handleDelete(tender.id)}
                            className="p-2 rounded-full hover:bg-red-100 text-red-500 hover:text-red-700 transition-colors duration-200"
                            aria-label={`Delete tender ${tender.title}`}
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                          <span className="absolute left-1/2 -translate-x-1/2 bottom-10 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2">
                            Delete
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}