import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const [totalUsers, totalTenders, totalPendingTenders, totalTags, totalSubtags] = await Promise.all([
      prisma.user.count(),
      prisma.tender.count(),
      prisma.pendingTender.count(),
      prisma.tag.count({ where: { parentId: null } }),
      prisma.tag.count({ where: { parentId: { not: null } } }),
    ])

    return NextResponse.json({
      totalUsers,
      totalTenders,
      totalPendingTenders,
      totalTags,
      totalSubtags,
    })
  } catch (error) {
    console.error("Failed to fetch admin metrics:", error)
    return NextResponse.json(
      {
        totalUsers: 0,
        totalTenders: 0,
        totalPendingTenders: 0,
        totalTags: 0,
        totalSubtags: 0,
      },
      { status: 500 }
    )
  }
}
