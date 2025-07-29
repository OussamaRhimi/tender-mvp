"use client"

import { useState } from "react"
import TenderActions from "@/components/TenderActions"

type Tender = {
  id: number
  title: string
  description: string
  deadline: string
  location: string
  buyerName: string
  tags: string[]
}

export default function TenderTable({ tenders }: { tenders: Tender[] }) {
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set())

  const toggleDescription = (id: number) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  if (!tenders.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-8 text-center text-gray-600 flex flex-col items-center gap-4">
        <svg
          className="w-12 h-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <p className="text-lg font-medium">No tenders found.</p>
        <p className="text-sm text-gray-500">Try adjusting your search filters to find available tenders.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto bg-white shadow-lg rounded-lg border border-gray-200">
      {/* Desktop Table */}
      <table
        className="w-full text-sm text-left text-gray-800 hidden md:table"
        role="grid"
        aria-label="Tenders table"
      >
        <thead className="bg-gray-100 text-gray-900 font-semibold">
          <tr>
            <th className="px-6 py-4 border-b border-gray-200">ID</th>
            <th className="px-6 py-4 border-b border-gray-200">Title</th>
            <th className="px-6 py-4 border-b border-gray-200">Description</th>
            <th className="px-6 py-4 border-b border-gray-200">Tags</th>
            <th className="px-6 py-4 border-b border-gray-200">Location</th>
            <th className="px-6 py-4 border-b border-gray-200">Buyer</th>
            <th className="px-6 py-4 border-b border-gray-200">Deadline</th>
            <th className="px-6 py-4 border-b border-gray-200">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tenders.map((tender, index) => (
            <tr
              key={tender.id}
              className={`border-b border-gray-200 transition-colors duration-200 hover:bg-gray-50 ${
                index % 2 === 0 ? "bg-white" : "bg-gray-50"
              }`}
              role="row"
            >
              <td className="px-6 py-4">{tender.id}</td>
              <td className="px-6 py-4 font-medium">{tender.title}</td>
              <td className="px-6 py-4 text-gray-600">
                {expandedRows.has(tender.id) ? (
                  tender.description
                ) : (
                  <>
                    {tender.description.length > 100
                      ? `${tender.description.slice(0, 100)}...`
                      : tender.description}
                    {tender.description.length > 100 && (
                      <button
                        onClick={() => toggleDescription(tender.id)}
                        className="text-blue-600 hover:underline text-sm ml-2"
                        aria-label={
                          expandedRows.has(tender.id)
                            ? "Collapse description"
                            : "Expand description"
                        }
                      >
                        {expandedRows.has(tender.id) ? "Show less" : "Read more"}
                      </button>
                    )}
                  </>
                )}
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-wrap gap-2">
                  {tender.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </td>
              <td className="px-6 py-4">{tender.location}</td>
              <td className="px-6 py-4">{tender.buyerName}</td>
              <td className="px-6 py-4">
                {new Date(tender.deadline).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </td>
              <td className="px-6 py-4">
                <TenderActions tenderId={tender.id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile Card Layout */}
      <div className="md:hidden grid gap-4 p-4">
        {tenders.map((tender) => (
          <div
            key={tender.id}
            className="bg-white border border-gray-200 rounded-lg shadow-md p-4"
            role="article"
            aria-label={`Tender ${tender.title}`}
          >
            <h3 className="text-lg font-semibold text-gray-900">{tender.title}</h3>
            <p className="text-sm text-gray-600 mt-1">
              <span className="font-medium">ID:</span> {tender.id}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              <span className="font-medium">Location:</span> {tender.location}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              <span className="font-medium">Buyer:</span> {tender.buyerName}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              <span className="font-medium">Deadline:</span>{" "}
              {new Date(tender.deadline).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </p>
            <p className="text-sm text-gray-600 mt-2">
              <span className="font-medium">Description:</span>{" "}
              {expandedRows.has(tender.id) ? (
                tender.description
              ) : (
                <>
                  {tender.description.length > 100
                    ? `${tender.description.slice(0, 100)}...`
                    : tender.description}
                  {tender.description.length > 100 && (
                    <button
                      onClick={() => toggleDescription(tender.id)}
                      className="text-blue-600 hover:underline text-sm ml-2"
                      aria-label={
                        expandedRows.has(tender.id)
                          ? "Collapse description"
                          : "Expand description"
                      }
                    >
                      {expandedRows.has(tender.id) ? "Show less" : "Read more"}
                    </button>
                  )}
                </>
              )}
            </p>
            <div className="mt-2">
              <span className="font-medium text-sm">Tags:</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {tender.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-4">
              <TenderActions tenderId={tender.id} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}