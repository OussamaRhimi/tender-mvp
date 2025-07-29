import { getCurrentUser } from "@/lib/getCurrentUser"
import Navbar from "@/components/Navbar"
import NavbarLoggedIn from "@/components/NavbarLoggedIn"
import Footer from "@/components/Footer"
import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"
import { Suspense } from "react"
import { FileText, User, Mail, MapPin, Calendar, Tag, File, ExternalLink } from "lucide-react"

type Props = {
  params: { id: string }
}

export default async function TenderDetailPage({ params }: Props) {
  const user = await getCurrentUser()
  const userInfo = {
    firstName: typeof user?.firstName === "string" ? user.firstName : undefined,
    lastName: typeof user?.lastName === "string" ? user.lastName : undefined,
  }

  const tender = await prisma.tender.findUnique({
    where: { id: Number(params.id) },
    include: {
      buyer: true,
      tags: {
        include: { tag: true },
      },
    },
  })

  if (!tender) return notFound()

  const deadline = new Date(tender.deadline)
  const now = new Date()
  const daysRemaining = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  const maxDays = 30 // For progress bar scaling
  const progress = daysRemaining > 0 ? Math.min((daysRemaining / maxDays) * 100, 100) : 0

  const getDeadlineStatus = () => {
    if (daysRemaining < 0) return { text: "Overdue", color: "bg-red-100 text-red-800" }
    if (daysRemaining <= 7) return { text: "Due Soon", color: "bg-yellow-100 text-yellow-800" }
    return { text: "Active", color: "bg-green-100 text-green-800" }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-blue-100 text-gray-800">
      {user ? <NavbarLoggedIn user={userInfo} /> : <Navbar />}

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-12 sm:py-16 animate-slide-up">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 flex items-center justify-center md:justify-start gap-2 mb-8">
          <FileText className="h-8 w-8 text-blue-600" aria-hidden="true" />
          Tender Details
        </h1>

        <Suspense
          fallback={
            <div className="grid md:grid-cols-2 gap-6 sm:gap-12">
              <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-6 sm:p-8 space-y-4">
                <div className="animate-pulse bg-gray-200 h-8 w-3/4 rounded" />
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="animate-pulse bg-gray-200 h-4 w-full rounded" />
                ))}
              </div>
              <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-6 sm:p-8">
                <div className="animate-pulse bg-gray-200 h-6 w-1/2 rounded" />
                <div className="animate-pulse bg-gray-200 h-4 w-full mt-2 rounded" />
              </div>
            </div>
          }
        >
          <div className="grid md:grid-cols-2 gap-6 sm:gap-12">
            {/* Main Details */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-6 sm:p-8 transition-all duration-300 hover:shadow-xl">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">{tender.title}</h2>

              <div className="space-y-6">
                <div className="flex items-start gap-2">
                  <User className="h-5 w-5 text-gray-500" aria-hidden="true" />
                  <div>
                    <span className="font-medium text-gray-700">Buyer:</span>{" "}
                    <span className="text-gray-800">
                      {tender.buyer.firstName} {tender.buyer.lastName}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Mail className="h-5 w-5 text-gray-500" aria-hidden="true" />
                  <div>
                    <span className="font-medium text-gray-700">Email:</span>{" "}
                    <a
                      href={`mailto:${tender.buyer.email}`}
                      className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                      aria-label={`Email ${tender.buyer.email}`}
                    >
                      {tender.buyer.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <MapPin className="h-5 w-5 text-gray-500" aria-hidden="true" />
                  <div>
                    <span className="font-medium text-gray-700">Location:</span>{" "}
                    <span className="text-gray-800">{tender.location ?? "Not specified"}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Calendar className="h-5 w-5 text-gray-500" aria-hidden="true" />
                  <div>
                    <span className="font-medium text-gray-700">Deadline:</span>{" "}
                    <span className="text-gray-800">
                      {deadline.toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>{" "}
                    <span
                      className={`inline-block text-xs font-medium px-2.5 py-0.5 rounded-full ml-2 ${getDeadlineStatus().color}`}
                      aria-label={`Deadline status: ${getDeadlineStatus().text}`}
                    >
                      {getDeadlineStatus().text}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="font-medium text-gray-700">Progress:</span>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all duration-300 ${
                        daysRemaining > 0 ? "bg-blue-600" : "bg-red-600"
                      }`}
                      style={{ width: `${progress}%` }}
                      aria-label={`Progress: ${progress}%`}
                    />
                  </div>
                  <p className="text-sm text-gray-600">
                    {daysRemaining > 0
                      ? `${daysRemaining} day${daysRemaining === 1 ? "" : "s"} remaining`
                      : "Deadline passed"}
                  </p>
                </div>

                <div className="flex items-start gap-2">
                  <Tag className="h-5 w-5 text-gray-500" aria-hidden="true" />
                  <div>
                    <span className="font-medium text-gray-700">Tags:</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {tender.tags.length > 0 ? (
                        tender.tags.map((t, i) => (
                          <span
                            key={i}
                            className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full"
                            aria-label={`Tag: ${t.tag.name}`}
                          >
                            {t.tag.name}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-600 italic">No tags</span>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <span className="font-medium text-gray-700">Description:</span>
                  <p className="mt-2 text-gray-700 whitespace-pre-wrap">{tender.description}</p>
                </div>
              </div>
            </div>

            {/* Source Info */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-6 sm:p-8 transition-all duration-300 hover:shadow-xl">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <File className="h-5 w-5 text-gray-500" aria-hidden="true" />
                Source
              </h2>
              {tender.source ? (
                <div className="text-gray-800">
                  {tender.source.startsWith("http") ? (
                    <a
                      href={tender.source}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 transition-colors duration-200 flex items-center gap-2"
                      aria-label="View tender source"
                    >
                      <ExternalLink className="h-4 w-4" aria-hidden="true" />
                      View Source
                    </a>
                  ) : (
                    <p className="whitespace-pre-wrap">{tender.source}</p>
                  )}
                </div>
              ) : (
                <p className="text-gray-600 italic">No source information provided.</p>
              )}
            </div>
          </div>
        </Suspense>
      </main>

      <Footer />
    </div>
  )
}