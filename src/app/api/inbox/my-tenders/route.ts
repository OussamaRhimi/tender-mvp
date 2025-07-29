import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/getCurrentUser"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user || !user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const tenders = await prisma.tender.findMany({
      where: { buyerId: user.id },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    const now = new Date()

    const tendersWithStatus = tenders.map(tender => ({
      ...tender,
      status: new Date(tender.deadline) > now ? "Active" : "Expired",
    }))

    return NextResponse.json({ tenders: tendersWithStatus })
  } catch (error) {
    console.error("Failed to fetch my tenders:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
