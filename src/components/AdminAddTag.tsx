"use client"

import { useState } from "react"

export default function AdminAddTag({ existingTags }: { existingTags: { id: number, name: string }[] }) {
  const [name, setName] = useState("")
  const [parentId, setParentId] = useState<number | null>(null)
  const [success, setSuccess] = useState(false)

  const handleAddTag = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch("/api/admin/tags", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, parentId }),
    })
    if (res.ok) {
      setName("")
      setParentId(null)
      setSuccess(true)
    }
  }

  return (
    <form onSubmit={handleAddTag} className="bg-white p-4 rounded shadow w-full max-w-md mb-6">
      <h2 className="text-lg font-bold mb-4">Add New Tag</h2>

      {success && <p className="text-green-500 mb-2">Tag added successfully!</p>}

      <input
        type="text"
        placeholder="Tag name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full border p-2 mb-4"
        required
      />

      <select
        value={parentId ?? ""}
        onChange={(e) => setParentId(e.target.value ? parseInt(e.target.value) : null)}
        className="w-full border p-2 mb-4"
      >
        <option value="">No parent (top-level tag)</option>
        {existingTags.map((tag) => (
          <option key={tag.id} value={tag.id}>{tag.name}</option>
        ))}
      </select>

      <button
        type="submit"
        className="bg-cyan-500 text-white py-2 px-4 rounded hover:bg-cyan-600"
      >
        Add Tag
      </button>
    </form>
  )
}
