"use client"

import { useEffect, useState } from "react"
import { getCurrentUser } from "@/lib/getCurrentUser"
import InboxSidebar from "@/components/InboxSidebar"
import Footer from "@/components/Footer"
import { Mail, Search, X, User } from "lucide-react"

type Message = {
  id: number
  content: string
  createdAt: string
  senderEmail: string
  senderFirstName: string
  senderLastName: string
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMessages = async () => {
      const res = await fetch("/api/inbox/messages")
      const data = await res.json()
      setMessages(data.messages || [])
      setLoading(false)
    }

    fetchMessages()
  }, [])

  // Filter messages based on search query
  const filteredMessages = messages.filter(
    (msg) =>
      msg.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.senderEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `${msg.senderFirstName} ${msg.senderLastName}`.toLowerCase().includes(searchQuery.toLowerCase())
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
              <Mail className="h-8 w-8 text-blue-500" aria-hidden="true" />
              My Messages
              {filteredMessages.length > 0 && (
                <span className="ml-3 inline-flex items-center justify-center px-2.5 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full animate-pulse-short transition-all duration-300">
                  {filteredMessages.length}
                </span>
              )}
            </h1>
            <div className="mt-4 sm:mt-0 relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm"
                aria-label="Search messages"
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
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mt-2"></div>
                </div>
              ))}
            </div>
          ) : filteredMessages.length === 0 ? (
            <p className="text-lg text-gray-600 text-center py-12">
              {searchQuery ? "No messages match your search." : "You have no messages."}
            </p>
          ) : (
            <ul className="space-y-4">
              {filteredMessages.map((msg) => (
                <li
                  key={msg.id}
                  className="bg-white shadow-lg rounded-xl p-4 border border-gray-200 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                  onClick={() => setSelectedMessage(msg)}
                  aria-label={`View message from ${msg.senderFirstName} ${msg.senderLastName}`}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <User className="h-5 w-5 text-blue-500" aria-hidden="true" />
                      <span className="text-blue-600 font-medium">
                        {msg.senderFirstName} {msg.senderLastName} ({msg.senderEmail})
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(msg.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="mt-2 text-gray-800 line-clamp-1">{msg.content}</p>
                </li>
              ))}
            </ul>
          )}
        </main>
      </div>

      {/* Footer */}
      <Footer />

      {selectedMessage && (
        <div className="fixed inset-0 bg-gray-600/30 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-lg relative animate-slide-up border border-gray-200">
            <button
              onClick={() => setSelectedMessage(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors duration-200"
              aria-label="Close message"
            >
              <X className="h-6 w-6" />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <User className="h-8 w-8 text-blue-500" aria-hidden="true" />
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedMessage.senderFirstName} {selectedMessage.senderLastName}
                </h2>
                <p className="text-sm text-gray-500">{selectedMessage.senderEmail}</p>
              </div>
            </div>
            <div className="text-sm text-gray-600 mb-4 flex items-center gap-2">
              <Mail className="h-4 w-4" aria-hidden="true" />
              <span>{new Date(selectedMessage.createdAt).toLocaleString()}</span>
            </div>
            <p className="text-gray-800 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg border border-gray-200 max-h-96 overflow-y-auto">
              {selectedMessage.content}
            </p>
            <button
              onClick={() => setSelectedMessage(null)}
              className="mt-6 w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md"
              aria-label="Close message"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}