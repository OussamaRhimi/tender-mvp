import { getCurrentUser } from "@/lib/getCurrentUser"
import Navbar from "@/components/Navbar"
import NavbarLoggedIn from "@/components/NavbarLoggedIn"
import Footer from "@/components/Footer"
import { FileText } from "lucide-react"

export default async function TermsOfServicePage() {
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
            <FileText className="h-8 w-8 text-blue-500" aria-hidden="true" />
            Terms of Service
          </h1>
          <div className="space-y-6 text-gray-600 leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">1. Acceptance of Terms</h2>
              <p>
                By accessing or using AL-IDHAFA, you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use our services.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">2. Use of Services</h2>
              <p>
                AL-IDHAFA provides a platform for managing tenders. You agree to use our services only for lawful purposes and in accordance with these Terms. You are responsible for all content you submit, including tenders, messages, and profile information.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">3. User Responsibilities</h2>
              <p>
                You must provide accurate and complete information when creating an account or submitting tenders. You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">4. Intellectual Property</h2>
              <p>
                All content on AL-IDHAFA, including text, graphics, and logos, is the property of AL-IDHAFA or its licensors. You may not reproduce, distribute, or modify any content without prior written consent.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">5. Limitation of Liability</h2>
              <p>
                AL-IDHAFA is not liable for any damages arising from the use or inability to use our services, including but not limited to errors in tender submissions or delays in communication.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">6. Termination</h2>
              <p>
                We reserve the right to suspend or terminate your account if you violate these Terms or engage in prohibited activities.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">7. Contact</h2>
              <p>
                For questions about these Terms, please contact us at{" "}
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