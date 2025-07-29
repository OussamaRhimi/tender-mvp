"use client"

import { useState } from "react"

type TenderActionsProps = {
  tenderId: number
}

export default function TenderActions({ tenderId }: TenderActionsProps) {
  const [loading, setLoading] = useState(false)
  const [favorited, setFavorited] = useState(false)

  const handleFavorite = async () => {
    setLoading(true)

    try {
      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tenderId }),
      })

      const data = await res.json()

      if (res.ok) {
        setFavorited(true)
        alert("✅ Tender added to favorites!")
      } else {
        alert(`⚠️ ${data.error || "Failed to add to favorites."}`)
      }
    } catch (err) {
      alert("❌ Something went wrong.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex gap-2 justify-center">
      <form action={`/tenders/${tenderId}`}>
        <button
          type="submit"
          className="hover:text-blue-500 text-xl"
          title="More Info"
        >
          ❔
        </button>
      </form>

      <button
        type="button"
        onClick={handleFavorite}
        disabled={loading || favorited}
        title={favorited ? "Already added" : "Add to favorites"}
        className={`text-xl ${
          favorited
            ? "text-red-400 cursor-not-allowed"
            : "hover:text-red-500"
        }`}
      >
        {favorited ? "❤️" : "🤍"}
      </button>
    </div>
  )
}
