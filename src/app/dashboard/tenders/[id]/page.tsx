"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import Footer from "@/components/Footer";
import {
  FileText,
  Clock,
  AlertTriangle,
  ExternalLink,
  Tag,
  MapPin,
  User,
  Loader2,
} from "lucide-react";

type Tender = {
  id: number;
  title: string;
  description: string;
  deadline: string;
  location: string | null;
  source: string | null;
  buyerName: string;
  tags: string[];
};

// Helper functions for file types
function isImageFile(filePath: string) {
  return /\.(jpg|jpeg|png|gif|webp)$/i.test(filePath);
}

function isPdfFile(filePath: string) {
  return /\.pdf$/i.test(filePath);
}

const downloadExtensions = ["doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt", "csv"];

function isDownloadFile(filePath: string) {
  return downloadExtensions.some((ext) => new RegExp(`\\.${ext}$`, "i").test(filePath));
}

function isFilePathOrUrl(str: string) {
  return /^https?:\/\//i.test(str) || /^\/uploads\//i.test(str);
}

export default function TenderDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [tender, setTender] = useState<Tender | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [daysRemaining, setDaysRemaining] = useState<number | null>(null);

  useEffect(() => {
    const fetchTender = async () => {
      setIsLoading(true);
      setError(null);
      try {
        if (!id || Array.isArray(id)) throw new Error("Invalid tender ID");

        const res = await fetch(`/api/admin/tenders/${id}`);
        if (!res.ok) throw new Error(`Failed to fetch tender: ${res.status}`);

        const data = await res.json();
        setTender(data.tender);

        // Calculate daysRemaining immediately after fetching tender
        if (data.tender?.deadline) {
          const deadline = new Date(data.tender.deadline);
          const now = new Date();
          const timeDiff = deadline.getTime() - now.getTime();
          setDaysRemaining(Math.ceil(timeDiff / (1000 * 60 * 60 * 24)));
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "An unknown error occurred";
        console.error("Failed to fetch tender:", err);
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTender();

    // Update days remaining every 5 seconds
    const interval = setInterval(() => {
      if (tender?.deadline) {
        const deadline = new Date(tender.deadline);
        const now = new Date();
        const timeDiff = deadline.getTime() - now.getTime();
        setDaysRemaining(Math.ceil(timeDiff / (1000 * 60 * 60 * 24)));
      }
    }, 5000); // Changed from 60000 to 5000 (5 seconds)

    return () => clearInterval(interval);
  }, [id, tender?.deadline]);

  // Compute deadline status
  const getDeadlineStatus = () => {
    if (daysRemaining === null) return { text: "Loading...", color: "bg-gray-100 text-gray-800" };
    if (daysRemaining < 0) return { text: "Overdue", color: "bg-red-100 text-red-800" };
    if (daysRemaining <= 7) return { text: "Due Soon", color: "bg-yellow-100 text-yellow-800" };
    return { text: "Active", color: "bg-green-100 text-green-800" };
  };

  const deadline = tender ? new Date(tender.deadline) : null;
  const progress = daysRemaining !== null ? Math.min(Math.max(daysRemaining / 30, 0), 1) * 100 : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" aria-label="Loading tender details" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50 p-6">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <p className="text-lg font-semibold text-red-700">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!tender) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">Tender not found.</div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-white text-gray-900">
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 animate-slide-up">
          <h1 className="text-3xl sm:text-4xl font-bold flex items-center justify-center md:justify-start gap-2 mb-8 text-gray-900">
            <FileText className="h-8 w-8 text-blue-600" aria-hidden="true" />
            Tender Details
          </h1>
          <div className="grid md:grid-cols-2 gap-6 sm:gap-12">
            <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-6 sm:p-8 transition-all duration-300 hover:shadow-xl">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">{tender.title}</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-2">
                  <User className="h-5 w-5 text-gray-500 mt-0.5" aria-hidden="true" />
                  <div>
                    <span className="font-medium text-gray-700">Buyer:</span>{" "}
                    <span className="text-gray-800">{tender.buyerName}</span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="h-5 w-5 text-gray-500 mt-0.5" aria-hidden="true" />
                  <div>
                    <span className="font-medium text-gray-700">Location:</span>{" "}
                    <span className="text-gray-800">{tender.location ?? "Not specified"}</span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="h-5 w-5 text-gray-500 mt-0.5" aria-hidden="true" />
                  <div>
                    <span className="font-medium text-gray-700">Deadline:</span>{" "}
                    <span className="text-gray-800">
                      {deadline?.toLocaleDateString("en-US", {
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
                      className={`h-3 rounded-full transition-all duration-500 ${
                        daysRemaining && daysRemaining > 0 ? "bg-blue-600" : "bg-red-600"
                      }`}
                      style={{ width: `${progress}%` }}
                      aria-label={`Progress: ${Math.round(progress)}%`}
                    />
                  </div>
                  <p className="text-sm text-gray-600">
                    {daysRemaining !== null
                      ? daysRemaining > 0
                        ? `${daysRemaining} day${daysRemaining === 1 ? "" : "s"} remaining`
                        : "Deadline passed"
                      : "Calculating..."}
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <Tag className="h-5 w-5 text-gray-500 mt-0.5" aria-hidden="true" />
                  <div>
                    <span className="font-medium text-gray-700">Tags:</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {tender.tags.length > 0 ? (
                        tender.tags.map((tag, i) => (
                          <span
                            key={i}
                            className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full"
                          >
                            {tag}
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
                  <p className="mt-2 text-gray-700 whitespace-pre-wrap break-words">{tender.description}</p>
                </div>
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-6 sm:p-8 transition-all duration-300 hover:shadow-xl">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5 text-gray-500" aria-hidden="true" />
                Source
              </h2>
              {tender.source ? (
                <div className="text-gray-800 break-words">
                  {isFilePathOrUrl(tender.source) ? (
                    tender.source.startsWith("http") ? (
                      <a
                        href={tender.source}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-2"
                        aria-label="Open source link"
                      >
                        <ExternalLink className="h-4 w-4" aria-hidden="true" />
                        {new URL(tender.source).hostname}
                      </a>
                    ) : isImageFile(tender.source) ? (
                      <img
                        src={tender.source}
                        alt="Tender uploaded file"
                        className="max-w-full rounded shadow"
                      />
                    ) : isPdfFile(tender.source) ? (
                      <embed
                        src={tender.source}
                        type="application/pdf"
                        width="100%"
                        height="500px"
                        aria-label="Tender uploaded PDF file"
                      />
                    ) : isDownloadFile(tender.source) ? (
                      <a
                        href={tender.source}
                        download
                        className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                        aria-label="Download tender file"
                      >
                        Download File
                      </a>
                    ) : (
                      <a
                        href={tender.source}
                        download
                        className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                        aria-label="Download tender file"
                      >
                        Download File
                      </a>
                    )
                  ) : (
                    <p className="whitespace-pre-wrap">{tender.source}</p>
                  )}
                </div>
              ) : (
                <p className="text-gray-600 italic">No source information provided.</p>
              )}
            </div>
          </div>
          <div className="mt-10 flex flex-wrap gap-4 justify-start">
            <button
              onClick={() => router.back()}
              className="px-6 py-2 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors"
            >
              Back
            </button>
            <button
              onClick={() => {
                if (
                  confirm("Are you sure you want to delete this tender? This action cannot be undone.")
                ) {
                  handleDelete();
                }
              }}
              className="px-6 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-colors"
            >
              Delete
            </button>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );

  async function handleDelete() {
    try {
      const res = await fetch(`/api/admin/tenders/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        router.push("/dashboard/tenders");
        router.refresh();
      } else {
        throw new Error(`Failed to delete tender: ${res.status}`);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "An unknown error occurred";
      alert(message);
    }
  }
}