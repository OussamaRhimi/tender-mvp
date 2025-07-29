import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import Link from "next/link"
import { FileText, Download, Tag, Search, ArrowRight } from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen font-sans bg-gradient-to-br from-gray-50 to-blue-100 text-gray-800">
      <Navbar />

      {/* Hero Section */}
      <section className="text-center py-16 sm:py-24 px-4 sm:px-6 md:px-8 max-w-5xl mx-auto animate-slide-up">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-2">
          <FileText className="h-8 w-8 sm:h-10 sm:w-10 text-blue-600" aria-hidden="true" />
          Discover Tenders Effortlessly
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
          The easiest and most affordable way to find and manage tenders tailored to your business.
        </p>
        <Link href="/login">
          <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-8 rounded-lg text-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md flex items-center gap-2 mx-auto">
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
            Get Started
          </button>
        </Link>
      </section>

      {/* Pricing Section */}
      <section className="flex flex-col items-center py-16 px-4 sm:px-6 md:px-8 bg-white">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-12 flex items-center gap-2">
          <Tag className="h-8 w-8 text-blue-600" aria-hidden="true" />
          Choose Your Plan
        </h2>
        <div className="flex flex-wrap justify-center gap-6 sm:gap-8 max-w-6xl mx-auto">
          {/* Free Plan */}
          <div className="bg-white rounded-xl p-8 w-full sm:w-80 flex flex-col items-center gap-4 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-xl font-bold text-gray-900">Free</h3>
            <h2 className="text-3xl font-bold text-gray-900">$0<span className="text-base text-gray-600">/mo</span></h2>
            <ul className="text-sm text-gray-600 list-none w-full space-y-2">
              <li className="flex items-center gap-2">
                <svg
                  className="h-5 w-5 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                View recently added tenders
              </li>
            </ul>
            <Link href="/register" className="mt-auto">
              <button className="w-full bg-gradient-to-r from-gray-700 to-gray-800 text-white py-2 px-4 rounded-lg font-semibold hover:from-gray-800 hover:to-gray-900 transition-all duration-200">
                Sign Up
              </button>
            </Link>
          </div>

          {/* Premium Plan */}
          <div className="bg-white rounded-xl p-8 w-full sm:w-80 relative flex flex-col items-center gap-4 shadow-xl border-2 border-blue-500 hover:shadow-2xl transition-shadow duration-300">
            <div className="bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full absolute -top-4 left-1/2 -translate-x-1/2 animate-pulse-short">
              MOST POPULAR
            </div>
            <h3 className="text-xl font-bold text-gray-900">Premium</h3>
            <h2 className="text-3xl font-bold text-gray-900">$9.99<span className="text-base text-gray-600">/mo</span></h2>
            <ul className="text-sm text-gray-600 list-none w-full space-y-2">
              <li className="flex items-center gap-2">
                <svg
                  className="h-5 w-5 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                View all tenders
              </li>
              <li className="flex items-center gap-2">
                <svg
                  className="h-5 w-5 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Download related documents
              </li>
              <li className="flex items-center gap-2">
                <svg
                  className="h-5 w-5 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Full access to a tag and all sub-tags
              </li>
              <li className="flex items-center gap-2">
                <svg
                  className="h-5 w-5 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Access to advanced search
              </li>
            </ul>
            <Link href="/register" className="mt-auto">
              <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200">
                Sign Up
              </button>
            </Link>
          </div>

          {/* Business Plan */}
          <div className="bg-white rounded-xl p-8 w-full sm:w-80 flex flex-col items-center gap-4 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-xl font-bold text-gray-900">Business</h3>
            <h2 className="text-3xl font-bold text-gray-900">$29.99<span className="text-base text-gray-600">/mo</span></h2>
            <ul className="text-sm text-gray-600 list-none w-full space-y-2">
              <li className="flex items-center gap-2">
                <svg
                  className="h-5 w-5 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                View all tenders
              </li>
              <li className="flex items-center gap-2">
                <svg
                  className="h-5 w-5 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Download related documents
              </li>
              <li className="flex items-center gap-2">
                <svg
                  className="h-5 w-5 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Full access to all tags and sub-tags
              </li>
              <li className="flex items-center gap-2">
                <svg
                  className="h-5 w-5 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Access to advanced search
              </li>
            </ul>
            <Link href="/register" className="mt-auto">
              <button className="w-full bg-gradient-to-r from-gray-700 to-gray-800 text-white py-2 px-4 rounded-lg font-semibold hover:from-gray-800 hover:to-gray-900 transition-all duration-200">
                Sign Up
              </button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}