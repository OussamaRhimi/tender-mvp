"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import AdminSidebar from "@/components/AdminSidebar"
import Footer from "@/components/Footer"
import { FileText, Plus, Check } from "lucide-react"

type Tag = {
  id: number
  name: string
}

export default function AddTenderPage() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [deadline, setDeadline] = useState("")
  const [location, setLocation] = useState("")
  const [source, setSource] = useState("")
  const [tags, setTags] = useState<Tag[]>([])
  const [selectedTags, setSelectedTags] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    const fetchTags = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const res = await fetch("/api/admin/tags")
        if (!res.ok) throw new Error(`Failed to fetch tags: ${res.status}`)
        const data = await res.json()
        setTags(data.tags || [])
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An unknown error occurred"
        console.error("Failed to fetch tags:", err)
        setError(errorMessage)
      } finally {
        setIsLoading(false)
      }
    }
    fetchTags()
  }, [])

  const validateForm = () => {
    const errors: Record<string, string> = {}
    if (!title.trim()) errors.title = "Tender title is required"
    if (!deadline) errors.deadline = "Deadline is required"
    if (!location.trim()) errors.location = "Location is required"
    return errors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errors = validateForm()
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/admin/tenders/new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          deadline,
          location: location.trim(),
          tags: selectedTags,
          source: source.trim(),
        }),
      })

      if (res.ok) {
        router.push("/dashboard/tenders")
      } else {
        const errorText = await res.text()
        throw new Error(`Failed to add tender: ${res.status} - ${errorText || "Unknown error"}`)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred"
      console.error("Failed to add tender:", err)
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-white text-gray-900">
      <div className="flex flex-1">
        <AdminSidebar />

        <main className="flex-1 p-6 sm:p-8 lg:p-10">
          <h1 className="text-3xl font-bold flex items-center gap-2 mb-6">
            <FileText className="h-8 w-8 text-blue-600" aria-hidden="true" />
            Add New Tender
          </h1>

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6" role="alert">
              <p>{error}</p>
            </div>
          )}

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Source Card */}
              <div className="bg-white shadow-lg rounded-xl p-6 border w-full">
                <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-gray-600" /> Source
                </h2>
                <p className="text-sm mb-4 text-gray-600">
                  Add a link or additional information here
                </p>
                <textarea
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  className="w-full h-48 border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Paste link or notes here..."
                  aria-label="Source information"
                />
              </div>

              {/* Tender Form */}
              <div className="bg-white shadow-lg rounded-xl p-6 border w-full">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tender Title *</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${
                        formErrors.title ? "border-red-500" : "focus:ring-blue-500"
                      }`}
                      placeholder="Enter tender title"
                      aria-label="Tender title"
                      aria-invalid={!!formErrors.title}
                      aria-describedby={formErrors.title ? "title-error" : undefined}
                    />
                    {formErrors.title && (
                      <p id="title-error" className="mt-1 text-sm text-red-600">{formErrors.title}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                    <select
                      multiple
                      className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={selectedTags.map(String)}
                      onChange={(e) =>
                        setSelectedTags(
                          Array.from(e.target.selectedOptions, (option) => parseInt(option.value))
                        )
                      }
                      aria-label="Select tags"
                    >
                      {tags.map((tag) => (
                        <option key={tag.id} value={tag.id}>
                          {tag.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Deadline *</label>
                    <input
                      type="date"
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                      className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${
                        formErrors.deadline ? "border-red-500" : "focus:ring-blue-500"
                      }`}
                      aria-label="Deadline"
                      aria-invalid={!!formErrors.deadline}
                      aria-describedby={formErrors.deadline ? "deadline-error" : undefined}
                    />
                    {formErrors.deadline && (
                      <p id="deadline-error" className="mt-1 text-sm text-red-600">{formErrors.deadline}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${
                        formErrors.location ? "border-red-500" : "focus:ring-blue-500"
                      }`}
                      placeholder="Enter location"
                      aria-label="Location"
                      aria-invalid={!!formErrors.location}
                      aria-describedby={formErrors.location ? "location-error" : undefined}
                    />
                    {formErrors.location && (
                      <p id="location-error" className="mt-1 text-sm text-red-600">{formErrors.location}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full border rounded-lg px-3 py-2 h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter tender description"
                      aria-label="Description"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Publish tender"
                  >
                    {isLoading ? <Check className="h-5 w-5 animate-pulse" /> : <Plus className="h-5 w-5" />}
                    {isLoading ? "Publishing..." : "Publish Tender"}
                  </button>
                </div>
              </div>
            </form>
          )}
        </main>
      </div>
      <Footer />
    </div>
  )
}