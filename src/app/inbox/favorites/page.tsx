"use client"

import { useEffect, useState } from "react"
import InboxSidebar from "@/components/InboxSidebar"
import Link from "next/link"
import Footer from "@/components/Footer"
import { MapPin, Calendar, Trash2, Info, Search, Star } from "lucide-react"

type Tender = {
  id: number
  title: string
  description: string
  location: string | null
  deadline: string
  buyer: {
    firstName: string
    lastName: string
    email: string
  }
  tags: {
    tag: { name: string }
  }[]
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Tender[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const fetchFavorites = async () => {
      const res = await fetch("/api/inbox/favorites")
      const data = await res.json()
      setFavorites(data.tenders || [])
      setLoading(false)
    }

    fetchFavorites()
  }, [])

  const handleRemove = async (tenderId: number) => {
    const res = await fetch("/api/inbox/favorites", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tenderId }),
    })

    if (res.ok) {
      setFavorites((prev) => prev.filter((t) => t.id !== tenderId))
    } else {
      alert("Failed to remove from favorites.")
    }
  }

  // Filter tenders based on search query
  const filteredFavorites = favorites.filter(
    (tender) =>
      tender.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tender.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tender.tags.some((t) => t.tag.name.toLowerCase().includes(searchQuery.toLowerCase()))
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
              <Star className="h-8 w-8 text-yellow-500" aria-hidden="true" />
              My Favorite Tenders
            </h1>
            <div className="mt-4 sm:mt-0 relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search tenders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm"
                aria-label="Search favorite tenders"
              />
              <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" aria-hidden="true" />
            </div>
          </div>

          {loading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(3)].map((_, index) => (
                <div
                  key={index}
                  className="bg-white shadow-lg rounded-xl p-6 border border-gray-200 animate-pulse"
                >
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-1"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6 mb-2"></div>
                  <div className="flex gap-2">
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-1/4 mt-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4 mt-2"></div>
                </div>
              ))}
            </div>
          ) : filteredFavorites.length === 0 ? (
            <p className="text-lg text-gray-600 text-center py-12">
              {searchQuery
                ? "No tenders match your search."
                : "You haven't added any favorites yet."}
            </p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredFavorites.map((tender) => (
                <div
                  key={tender.id}
                  className="bg-white shadow-lg rounded-xl p-6 border border-gray-200 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">{tender.title}</h2>
                      <p className="text-sm text-gray-600 mt-1">
                        Posted by {tender.buyer.firstName} {tender.buyer.lastName}
                      </p>
                      <p className="text-xs text-gray-500">{tender.buyer.email}</p>
                    </div>

                    <div className="flex gap-2">
                      <Link
                        href={`/tenders/${tender.id}`}
                        title="View tender details"
                        className="p-2 rounded-full hover:bg-blue-100 text-blue-500 hover:text-blue-700 transition-colors duration-200"
                        aria-label={`View details for ${tender.title}`}
                      >
                        <Info className="h-5 w-5" />
                      </Link>

                      <button
                        onClick={() => handleRemove(tender.id)}
                        title="Remove from favorites"
                        className="p-2 rounded-full hover:bg-red-100 text-red-500 hover:text-red-700 transition-colors duration-200"
                        aria-label={`Remove ${tender.title} from favorites`}
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  <p className="mt-4 text-gray-700 italic text-sm leading-relaxed line-clamp-3">
                    {tender.description}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <strong className="text-sm text-gray-800">Tags:</strong>
                    {tender.tags.map((t) => (
                      <span
                        key={t.tag.name}
                        className="inline-block bg-blue-100 text-blue-800 text-xs px-2.5 py-1 rounded-full font-medium"
                      >
                        {t.tag.name}
                      </span>
                    ))}
                  </div>

                  <div className="mt-3 text-sm text-gray-600 flex items-center gap-2">
                    <MapPin className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                    <span>{tender.location || "No location"}</span>
                  </div>

                  <div className="text-sm text-gray-600 flex items-center gap-2">
                    <Calendar className="h-three w-4 flex-shrink-0" aria-hidden="true" />
                    <span>{new Date(tender.deadline).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}