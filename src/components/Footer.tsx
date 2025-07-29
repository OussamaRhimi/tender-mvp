// Server Component (no 'use client' needed)
import { Heart, Shield, FileText, Mail } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 text-gray-300 py-8 border-t border-gray-800 mt-12">
      <div className="container mx-auto px-6 sm:px-8 md:px-12 text-center">
        <div className="flex justify-center items-center gap-2 mb-4">
          <Heart className="h-5 w-5 text-blue-400" aria-hidden="true" />
          <p className="text-sm font-medium">
            © {new Date().getFullYear()} AL-IDHAFA. All rights reserved.
          </p>
        </div>
        <p className="text-xs text-gray-400 mb-6">
          Designed for a seamless tender management experience.
        </p>
        <div className="flex justify-center gap-6 animate-slide-up">
          <a
            href="/privacy"
            className="flex items-center gap-2 text-sm hover:text-blue-300 transition-colors duration-200"
            aria-label="Privacy Policy"
          >
            <Shield className="h-4 w-4" aria-hidden="true" />
            Privacy Policy
          </a>
          <a
            href="/terms"
            className="flex items-center gap-2 text-sm hover:text-blue-300 transition-colors duration-200"
            aria-label="Terms of Service"
          >
            <FileText className="h-4 w-4" aria-hidden="true" />
            Terms of Service
          </a>
          <a
            href="/contact"
            className="flex items-center gap-2 text-sm hover:text-blue-300 transition-colors duration-200"
            aria-label="Contact Us"
          >
            <Mail className="h-4 w-4" aria-hidden="true" />
            Contact Us
          </a>
        </div>
      </div>
    </footer>
  )
}