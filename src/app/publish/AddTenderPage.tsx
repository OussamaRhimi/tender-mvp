"use client"

import { useEffect, useState, FormEvent } from "react"
import { useRouter } from "next/navigation"
import NavbarLoggedIn from "@/components/NavbarLoggedIn"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { FileText, Tag, Calendar, MapPin, Text, UploadCloud } from "lucide-react"

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
  const [sourceLink, setSourceLink] = useState("")
  const [sourceFile, setSourceFile] = useState<File | null>(null)
  const [tags, setTags] = useState<Tag[]>([])
  const [selectedTags, setSelectedTags] = useState<number[]>([])

  useEffect(() => {
    fetch("/api/admin/tags")
      .then((res) => res.json())
      .then((data) => setTags(data.tags || []))
      .catch((err) => console.error("Failed to fetch tags", err))
  }, [])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append("title", title)
    formData.append("description", description)
    formData.append("deadline", deadline)
    formData.append("location", location)
    formData.append("tags", JSON.stringify(selectedTags))
    if (sourceFile) {
      formData.append("file", sourceFile)
    } else if (sourceLink) {
      formData.append("source", sourceLink)
    }

    const res = await fetch("/api/admin/tenders/new", {
      method: "POST",
      body: formData,
    })

    const data = await res.json()

    if (res.ok) {
      alert(data.status === "PUBLISHED" ? "Tender published!" : "Submitted for review.")
      router.push("/home")
    } else {
      alert("Failed: " + (data.error || "Unknown error"))
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-blue-50 text-gray-800">
      {userInfo.firstName ? <NavbarLoggedIn user={userInfo} /> : <Navbar />}
      <main className="flex-1 p-6 sm:p-8 md:p-12 lg:p-16">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 flex items-center gap-2 mb-8">
          <FileText className="h-8 w-8 text-blue-500" />
          Add Tender
        </h1>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto"
          encType="multipart/form-data"
        >
          <div className="bg-white shadow-lg rounded-xl p-8 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-2">
              <UploadCloud className="h-5 w-5 text-gray-500" />
              Upload or Link Source
            </h2>
            <input
              type="file"
              onChange={(e) => setSourceFile(e.target.files?.[0] || null)}
              className="block w-full mb-4 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50"
              accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.gif"
            />
            <p className="text-gray-600 text-sm mb-2">Or provide a link:</p>
            <input
              type="text"
              value={sourceLink}
              onChange={(e) => setSourceLink(e.target.value)}
              placeholder="https://example.com/file.pdf"
              className="w-full pl-3 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-sm text-gray-800"
            />
          </div>

          <div className="bg-white shadow-lg rounded-xl p-8 border border-gray-200 space-y-6">
            <div>
              <label className="block mb-1 font-medium text-gray-700">Tender Title*</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-lg text-sm"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700">Tags</label>
              <select
                multiple
                className="w-full px-4 py-2 border rounded-lg text-sm"
                value={selectedTags.map(String)}
                onChange={(e) =>
                  setSelectedTags(
                    Array.from(e.target.selectedOptions, (option) => parseInt(option.value))
                  )
                }
              >
                {tags.map((tag) => (
                  <option key={tag.id} value={tag.id}>
                    {tag.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700">Deadline*</label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-lg text-sm"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg text-sm"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700">Description*</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={4}
                className="w-full px-4 py-2 border rounded-lg text-sm"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all"
            >
              Submit Tender
            </button>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  )
}
