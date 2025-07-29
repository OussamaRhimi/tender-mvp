import { getCurrentUser } from "@/lib/getCurrentUser"
import Navbar from "@/components/Navbar"
import NavbarLoggedIn from "@/components/NavbarLoggedIn"
import Footer from "@/components/Footer"
import { redirect } from "next/navigation"
import { User, Mail, MapPin, Building, Shield } from "lucide-react"

export default async function ProfilePage({
  searchParams,
}: {
  searchParams?: Promise<{ success?: string }>
}) {
  // Resolve searchParams
  const resolvedSearchParams = await searchParams

  // Get current user
  const user = await getCurrentUser()

  // If no user, redirect to login
  if (!user) {
    redirect("/login")
  }

  // Normalize user data
  const userInfo = {
    id: user?.id ?? null,
    firstName: typeof user?.firstName === "string" ? user.firstName : "",
    lastName: typeof user?.lastName === "string" ? user.lastName : "",
    email: typeof user?.email === "string" ? user.email : "",
    country: typeof user?.country === "string" ? user.country : "",
    company: typeof user?.company === "string" ? user.company : "",
    role: typeof user?.role === "string" ? user.role : "",
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-blue-50 text-gray-800">
      {user ? <NavbarLoggedIn user={userInfo} /> : <Navbar />}

      {/* Show success message if present */}
      {resolvedSearchParams?.success === "1" && (
        <div className="bg-green-100 text-green-800 px-4 py-3 text-center font-semibold rounded-lg max-w-4xl mx-auto mt-4 animate-slide-down">
          <span className="flex items-center justify-center gap-2">
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            Profile updated successfully!
          </span>
        </div>
      )}

      <main className="flex-1 max-w-4xl mx-auto mt-8 sm:mt-12 px-6 py-10 bg-white rounded-xl shadow-lg border border-gray-200">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 flex items-center justify-center gap-2 mb-8">
          <User className="h-8 w-8 text-blue-500" aria-hidden="true" />
          My Account
        </h1>

        {/* Center the form content */}
        <div className="flex justify-center">
          <form
            id="profile-form"
            action="/api/profile/update"
            method="POST"
            className="w-full max-w-2xl animate-slide-up"
          >
            <input type="hidden" name="id" value={String(userInfo.id)} />

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-1 font-medium text-gray-700 flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" aria-hidden="true" />
                    First Name*
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    defaultValue={userInfo.firstName}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800 text-sm"
                    required
                    aria-label="First Name"
                  />
                </div>

                <div>
                  <label className="block mb-1 font-medium text-gray-700 flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" aria-hidden="true" />
                    Last Name*
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    defaultValue={userInfo.lastName}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800 text-sm"
                    required
                    aria-label="Last Name"
                  />
                </div>

                <div>
                  <label className="block mb-1 font-medium text-gray-700 flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" aria-hidden="true" />
                    E-mail
                  </label>
                  <input
                    type="email"
                    value={userInfo.email}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed"
                    readOnly
                    aria-label="Email Address"
                  />
                </div>

                <div>
                  <label className="block mb-1 font-medium text-gray-700 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" aria-hidden="true" />
                    Country
                  </label>
                  <input
                    type="text"
                    name="country"
                    defaultValue={userInfo.country}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800 text-sm"
                    aria-label="Country"
                  />
                </div>

                <div>
                  <label className="block mb-1 font-medium text-gray-700 flex items-center gap-2">
                    <Building className="h-4 w-4 text-gray-500" aria-hidden="true" />
                    Company/Entity Name
                  </label>
                  <input
                    type="text"
                    name="company"
                    defaultValue={userInfo.company}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800 text-sm"
                    aria-label="Company Name"
                  />
                </div>

                <div>
                  <label className="block mb-1 font-medium text-gray-700 flex items-center gap-2">
                    <Shield className="h-4 w-4 text-gray-500" aria-hidden="true" />
                    Role
                  </label>
                  <input
                    type="text"
                    value={userInfo.role}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed"
                    readOnly
                    aria-label="Role"
                  />
                </div>
              </div>
            </div>
          </form>
        </div>

        <div className="flex justify-center mt-10">
          <button
            form="profile-form"
            type="submit"
            className="flex items-center gap-2 w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md"
            aria-label="Submit profile updates"
          >
            <User className="h-5 w-5" aria-hidden="true" />
            Update Profile
          </button>
        </div>
      </main>

      <Footer />
    </div>
  )
}