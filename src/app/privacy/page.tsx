import { getCurrentUser } from "@/lib/getCurrentUser"
import Navbar from "@/components/Navbar"
import NavbarLoggedIn from "@/components/NavbarLoggedIn"
import Footer from "@/components/Footer"
import { Shield } from "lucide-react"

export default async function PrivacyPolicyPage() {
  const user = await getCurrentUser()
  const userInfo = {
    firstName: typeof user?.firstName === "string" ? user.firstName : undefined,
    lastName: typeof user?.lastName === "string" ? user.lastName : undefined,
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-blue-50 text-gray-800">
      {user ? <NavbarLoggedIn user={userInfo} /> : <Navbar />}
      <main className="flex-1 p-6 sm:p-8 md:p-12 lg:p-16">
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-8 border border-gray-200 animate-slide-up">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 flex items-center gap-2 mb-8">
            <Shield className="h-8 w-8 text-blue-500" aria-hidden="true" />
            Privacy Policy
          </h1>
          <div className="space-y-6 text-gray-600 leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">1. Introduction</h2>
              <p>
                AL-IDHAFA is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your personal information when you use our tender management platform.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">2. Information We Collect</h2>
              <p>
                We collect personal information you provide, such as your name, email, company details, and tender submissions. We may also collect usage data, such as IP addresses and browsing activity, to improve our services.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">3. How We Use Your Information</h2>
              <p>
                Your information is used to provide and improve our services, process tender submissions, communicate with you, and ensure the security of our platform.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">4. Data Sharing</h2>
              <p>
                We do not sell or share your personal information with third parties, except as required by law or to provide our services (e.g., with service providers under strict confidentiality agreements).
              </p>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">5. Your Rights</h2>
              <p>
                You have the right to access, correct, or delete your personal information. You can update your profile through the{" "}
                <a href="/profile" className="text-blue-500 hover:text-blue-700 transition-colors duration-200">
                  profile page
                </a>{" "}
                or contact us to exercise your rights.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">6. Data Security</h2>
              <p>
                We implement reasonable security measures to protect your data, but no system is completely secure. You are responsible for maintaining the confidentiality of your account credentials.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">7. Contact</h2>
              <p>
                For questions about this Privacy Policy, please contact us at{" "}
                <a href="/contact" className="text-blue-500 hover:text-blue-700 transition-colors duration-200">
                  our contact page
                </a>.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}