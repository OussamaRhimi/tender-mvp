"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Star, FileText, MessageSquare } from "lucide-react"

export default function InboxSidebar() {
  const pathname = usePathname()

  const navLinks = [
    { label: "My Favorites", href: "/inbox/favorites", icon: Star },
    { label: "My Tenders", href: "/inbox/my-tenders", icon: FileText },
    { label: "My Messages", href: "/inbox/messages", icon: MessageSquare },
  ]

  return (
    <aside className="w-64 h-screen bg-gradient-to-b from-gray-50 to-white border-r border-gray-200 p-6 flex flex-col justify-between shadow-lg transition-all duration-300">
      <div>
        <h2 className="text-2xl font-bold mb-8 text-gray-800 flex items-center gap-2">
          <MessageSquare className="h-6 w-6 text-blue-500" />
          Inbox
        </h2>
        <nav className="flex flex-col space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-lg transition-all duration-200 ${
                pathname === link.href
                  ? "bg-blue-50 text-blue-600 font-semibold"
                  : "text-gray-600 hover:bg-gray-100 hover:text-blue-600"
              }`}
            >
              <link.icon className="h-5 w-5" />
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      <div>
        <Link
          href="/home"
          className="flex items-center justify-center gap-2 px-4 py-3 text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md"
        >
          <Home className="h-5 w-5" />
          Home
        </Link>
      </div>
    </aside>
  )
}