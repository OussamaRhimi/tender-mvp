// File: src/app/contact/page.tsx
import { getCurrentUser } from "@/lib/getCurrentUser"
import Navbar from "@/components/Navbar"
import NavbarLoggedIn from "@/components/NavbarLoggedIn"
import Footer from "@/components/Footer"
import { Mail, User, Phone, MessageSquare } from "lucide-react"

export default async function ContactPage() {
  const user = await getCurrentUser()
  // Extract what you need from the JWT payload
  const userInfo = {
    firstName: typeof user?.firstName === "string" ? user.firstName : undefined,
    lastName: typeof user?.lastName === "string" ? user.lastName : undefined,
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-blue-50 text-gray-800">
      {/* Conditionally render nav */}
      {user ? (
        <NavbarLoggedIn user={userInfo} />
      ) : (
        <Navbar />
      )}

      <main className="flex-1 p-6 sm:p-8 md:p-12 lg:p-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Left side */}
          <div className="bg-white shadow-lg rounded-xl p-8 border border-gray-200 animate-slide-up">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 flex items-center gap-2 mb-4">
              <Mail className="h-8 w-8 text-blue-500" aria-hidden="true" />
              Contact Us
            </h1>
            <p className="text-gray-600 leading-relaxed">
              Have a big idea or urgent matter to discuss? Reach out – we’re here to listen and provide assistance with your tender management needs.
            </p>
          </div>

          {/* Right side (form) */}
          <form
            action="/api/contact"
            method="POST"
            className="bg-white shadow-lg rounded-xl p-8 border border-gray-200 animate-slide-up"
          >
            <div className="space-y-6">
              <div>
                <label className="block mb-1 font-medium text-gray-700 flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" aria-hidden="true" />
                  First Name*
                </label>
                <input
                  name="firstName"
                  required
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800 text-sm"
                  aria-label="First Name"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium text-gray-700 flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" aria-hidden="true" />
                  Last Name
                </label>
                <input
                  name="lastName"
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800 text-sm"
                  aria-label="Last Name"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium text-gray-700 flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" aria-hidden="true" />
                  E-Mail*
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800 text-sm"
                  placeholder="example@gmail.com"
                  aria-label="Email Address"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium text-gray-700 flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-500" aria-hidden="true" />
                  Phone Number*
                </label>
                <input
                  name="phone"
                  required
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800 text-sm"
                  placeholder="+44 123 456 7890"
                  aria-label="Phone Number"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium text-gray-700 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-gray-500" aria-hidden="true" />
                  Message
                </label>
                <textarea
                  name="message"
                  rows={4}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800 text-sm"
                  aria-label="Message"
                ></textarea>
              </div>

              <button
                type="submit"
                className="flex items-center gap-2 w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md"
                aria-label="Send message"
              >
                <Mail className="h-5 w-5" aria-hidden="true" />
                Send Message
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  )
}