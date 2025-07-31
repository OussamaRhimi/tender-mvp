"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Bar } from "react-chartjs-2"
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from "chart.js"
import { Users, FileText, Clock, Tag, Loader2 } from "lucide-react"
import AdminSidebar from "@/components/AdminSidebar"
import Footer from "@/components/Footer"

// Register ChartJS components
ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend)

type DashboardMetrics = {
  totalUsers: number
  totalTenders: number
  totalPendingTenders: number
  totalTags: number
  totalSubtags: number
}

type User = {
  id: number
  email: string
  role: string // Assuming role is a string based on the provided User model
}

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/check", {
          credentials: "include", // Ensure cookies are sent with the request
        })
        const data = await res.json()

        if (data.authenticated && data.user?.role === "ADMIN") {
          setIsAuthenticated(true)
          setIsAdmin(true)
        } else {
          // Redirect to login or unauthorized page if not authenticated or not an admin
          router.push("/")
        }
      } catch (error) {
        console.error("Authentication check failed:", error)
        router.push("/")
      }
    }

    checkAuth()
  }, [router])

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) return

    const fetchMetrics = async () => {
      try {
        const res = await fetch("/api/admin/metrics", {
          credentials: "include", // Ensure cookies are sent with the request
        })
        const data = await res.json()
        setMetrics(data)
      } catch (error) {
        console.error("Failed to fetch metrics:", error)
        setMetrics({
          totalUsers: 0,
          totalTenders: 0,
          totalPendingTenders: 0,
          totalTags: 0,
          totalSubtags: 0,
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchMetrics()
  }, [isAuthenticated, isAdmin])

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    )
  }

  const chartData = {
    labels: ["Users", "Tenders", "Pending", "Tags", "Subtags"],
    datasets: [
      {
        label: "Dashboard Stats",
        data: metrics
          ? [
              metrics.totalUsers,
              metrics.totalTenders,
              metrics.totalPendingTenders,
              metrics.totalTags,
              metrics.totalSubtags,
            ]
          : [],
        backgroundColor: ["#2563eb", "#1e40af", "#1d4ed8", "#3b82f6", "#60a5fa"],
        borderColor: "#1e3a8a",
        borderWidth: 1,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: true },
    },
    scales: {
      y: { beginAtZero: true },
    },
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-blue-100 text-gray-800">
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="flex-1 p-6 sm:p-10 ml-64">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2 mb-8">
            <Users className="h-8 w-8 text-blue-600" /> Welcome, Admin
          </h1>

          {/* Stats Cards */}
          {isLoading || !metrics ? (
            <div className="h-64 flex justify-center items-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <StatCard title="Total Users" value={metrics.totalUsers} icon={<Users className="h-6 w-6 text-blue-600" />} />
                <StatCard title="Total Tenders" value={metrics.totalTenders} icon={<FileText className="h-6 w-6 text-blue-600" />} />
                <StatCard title="Pending Tenders" value={metrics.totalPendingTenders} icon={<Clock className="h-6 w-6 text-blue-600" />} />
                <StatCard title="Tags & Subtags" value={metrics.totalTags + metrics.totalSubtags} icon={<Tag className="h-6 w-6 text-blue-600" />} />
              </div>

              {/* Chart */}
              <div className="bg-white rounded-xl shadow-lg p-6 border">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" /> Dashboard Chart
                </h2>
                <Bar data={chartData} options={chartOptions} />
              </div>
            </>
          )}
        </main>
      </div>
      <Footer />
    </div>
  )
}

// Reusable stat card
function StatCard({ title, value, icon }: { title: string; value: number; icon: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 text-center border hover:shadow-xl transition-all duration-300">
      <div className="flex justify-center mb-2">{icon}</div>
      <h2 className="text-lg font-semibold text-gray-900 mb-2">{title}</h2>
      <p className="text-2xl font-extrabold text-gray-900">{value.toLocaleString()}</p>
    </div>
  )
}