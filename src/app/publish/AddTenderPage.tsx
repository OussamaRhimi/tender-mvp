"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import NavbarLoggedIn from "@/components/NavbarLoggedIn"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { FileText, Tag, Calendar, MapPin, Text, Link as LinkIcon } from "lucide-react"

interface UserInfo {
  firstName?: string
  lastName?: string
}

interface AddTenderPageProps {
  userInfo: UserInfo
}

interface Tag {
  id: number
  name: string
}

export default function AddTenderPage({ userInfo }: AddTenderPageProps) {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [deadline, setDeadline] = useState("")
  const [location, setLocation] = useState("")
  const [source, setSource] = useState("")
  const [tags, setTags] = useState<Tag[]>([])
  const [selectedTags, setSelectedTags] = useState<number[]>([])

  useEffect(() => {
    fetch("/api/admin/tags")
      .then((res) => res.json())
      .then((data) => setTags(data.tags || []))
      .catch((err) => console.error("Failed to fetch tags", err))
  }, [])

  const handleSubmit = async () => {
    const res = await fetch("/api/admin/tenders/new", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        deadline,
        location,
        tags: selectedTags,
        source,
      }),
    })

    const data = await res.json()

    if (res.ok) {
      if (data.status === "PUBLISHED") {
        alert("Tender published successfully!")
        router.push("/home")
      } else if (data.status === "PENDING") {
        alert("Tender submitted for approval. It will be published after admin review.")
        router.push("/home")
      }
    } else {
      alert("Failed to submit tender: " + (data.error || "Unknown error"))
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-blue-50 text-gray-800">
      {userInfo.firstName ? (
        <NavbarLoggedIn user={userInfo} />
      ) : (
        <Navbar />
      )}
      <main className="flex-1 p-6 sm:p-8 md:p-12 lg:p-16">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 flex items-center gap-2 mb-8">
          <FileText className="h-8 w-8 text-blue-500" aria-hidden="true" />
          Add Tender
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <div className="bg-white shadow-lg rounded-xl p-8 border border-gray-200 animate-slide-up">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-2">
              <LinkIcon className="h-5 w-5 text-gray-500" aria-hidden="true" />
              Source
            </h2>
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
              Provide a link or any additional information to support your tender submission.
            </p>
            <textarea
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="w-full h-48 pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800 text-sm"
              placeholder="Enter source details or URL"
              aria-label="Source information"
            />
          </div>
          <div className="bg-white shadow-lg rounded-xl p-8 border border-gray-200 animate-slide-up">
            <div className="space-y-6">
              <div>
                <label className="block mb-1 font-medium text-gray-700 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gray-500" aria-hidden="true" />
                  Tender Title*
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800 text-sm"
                  aria-label="Tender Title"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-700 flex items-center gap-2">
                  <Tag className="h-4 w-4 text-gray-500" aria-hidden="true" />
                  Tags
                </label>
                <select
                  multiple
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800 text-sm"
                  value={selectedTags.map(String)}
                  onChange={(e) =>
                    setSelectedTags(
                      Array.from(e.target.selectedOptions, (option) =>
                        parseInt(option.value)
                      )
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
                <label className="block mb-1 font-medium text-gray-700 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" aria-hidden="true" />
                  Deadline*
                </label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800 text-sm"
                  aria-label="Deadline date"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-700 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" aria-hidden="true" />
                  Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800 text-sm"
                  aria-label="Location"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-700 flex items-center gap-2">
                  <Text className="h-4 w-4 text-gray-500" aria-hidden="true" />
                  Description*
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800 text-sm"
                  rows={4}
                  aria-label="Tender description"
                  required
                />
              </div>
              <button
                onClick={handleSubmit}
                className="flex items-center gap-2 w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md"
                aria-label="Publish tender"
              >
                <FileText className="h-5 w-5" aria-hidden="true" />
                Publish Tender
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}