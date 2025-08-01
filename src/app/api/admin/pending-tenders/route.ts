import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getCurrentUser } from "@/lib/getCurrentUser"

export async function GET(req: Request) {
  try {
    const user = (await getCurrentUser()) as { id: number; role: string } | null
    console.log("User from getCurrentUser:", user)

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const url = new URL(req.url)
    const page = parseInt(url.searchParams.get("page") || "1", 10)
    const search = url.searchParams.get("search")?.trim() || ""
    const pageSize = 10

    if (page < 1 || isNaN(page)) {
      return NextResponse.json({ error: "Invalid page number" }, { status: 400 })
    }

    // Prepare Prisma `where` clause for searching
    const where = search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { buyer: { firstName: { contains: search, mode: "insensitive" } } },
            { buyer: { lastName: { contains: search, mode: "insensitive" } } },
            { buyer: { email: { contains: search, mode: "insensitive" } } },
          ],
        }
      : {}

    // Query pending tenders with pagination
    const [pendingTenders, total] = await prisma.$transaction([
      prisma.pendingTender.findMany({
        where,
        include: {
          tags: { include: { tag: true } },
          buyer: true,
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: "desc" },
      }),
      prisma.pendingTender.count({ where }),
    ])

    const totalPages = Math.ceil(total / pageSize)

    return NextResponse.json({
      tenders: pendingTenders,
      totalPages,
      currentPage: page,
    })
  } catch (error) {
    console.error("Pending tenders GET error:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch pending tenders",
        details: (error as Error).message,
      },
      { status: 500 }
    )
  }
}
