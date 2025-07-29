"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search, Filter } from "lucide-react"

type Tag = {
  id: number
  name: string
  parentId?: number | null
}

export default function SearchAndFilter({
  tags,
  subtags,
  locations,
}: {
  tags: Tag[]
  subtags: Tag[]
  locations: { location: string | null }[]
}) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Initialize state from URL query parameters
  const [title, setTitle] = useState(searchParams.get("title") || "")
  const [tag, setTag] = useState(searchParams.get("tag") || "")
  const [subtag, setSubtag] = useState(searchParams.get("subtag") || "")
  const [location, setLocation] = useState(searchParams.get("location") || "")
  const [deadline, setDeadline] = useState(searchParams.get("deadline") || "")
  const [email, setEmail] = useState(searchParams.get("email") || "")
  const [showAdvanced, setShowAdvanced] = useState(false)

  const filteredSubtags = subtags.filter((s) => s.parentId === parseInt(tag))

  const handleSearch = () => {
    // Create new URLSearchParams with current filter values
    const params = new URLSearchParams()
    if (title) params.set("title", title)
    if (tag) params.set("tag", tag)
    if (subtag) params.set("subtag", subtag)
    if (location) params.set("location", location)
    if (deadline) params.set("deadline", deadline)
    if (email) params.set("email", email)
    // Reset page to 1 when filters change
    params.set("page", "1")

    // Update URL to trigger server-side re-render
    router.push(`/home?${params.toString()}`)
  }

  // Update state when searchParams change (e.g., on browser back/forward)
  useEffect(() => {
    setTitle(searchParams.get("title") || "")
    setTag(searchParams.get("tag") || "")
    setSubtag(searchParams.get("subtag") || "")
    setLocation(searchParams.get("location") || "")
    setDeadline(searchParams.get("deadline") || "")
    setEmail(searchParams.get("email") || "")
  }, [searchParams])

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col gap-4 mb-10 border border-gray-200">
      <div className="flex flex-wrap gap-4 justify-center items-center">
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Tender title"
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800 text-sm"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            aria-label="Search by tender title"
          />
          <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" aria-hidden="true" />
        </div>

        <select
          className="w-full sm:w-64 pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800 text-sm"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          aria-label="Select tag"
        >
          <option value="">Select Tag</option>
          {tags.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>

        {showAdvanced && (
          <div className="w-full flex flex-wrap gap-4 justify-center items-center animate-slide-down">
            <select
              className="w-full sm:w-64 pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800 text-sm"
              value={subtag}
              onChange={(e) => setSubtag(e.target.value)}
              aria-label="Select subtag"
            >
              <option value="">Select Subtag</option>
              {filteredSubtags.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>

            <select
              className="w-full sm:w-64 pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800 text-sm"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              aria-label="Select tender location"
            >
              <option value="">Select Location</option>
              {locations.map((loc, i) =>
                loc.location ? (
                  <option key={i} value={loc.location}>
                    {loc.location}
                  </option>
                ) : null
              )}
            </select>

            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full sm:w-64 pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800 text-sm"
              aria-label="Select deadline date"
            />

            <input
              type="text"
              placeholder="Poster email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full sm:w-64 pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800 text-sm"
              aria-label="Search by poster email"
            />
          </div>
        )}

        <button
          onClick={handleSearch}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md"
          aria-label="Search tenders"
        >
          <Search className="h-5 w-5" aria-hidden="true" />
          Search
        </button>
        <button
          onClick={() => setShowAdvanced((prev) => !prev)}
          className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-md"
          aria-label={showAdvanced ? "Hide advanced filters" : "Show advanced filters"}
        >
          <Filter className="h-5 w-5" aria-hidden="true" />
          {showAdvanced ? "Hide Filters" : "Show Filters"}
        </button>
      </div>
    </div>
  )
}