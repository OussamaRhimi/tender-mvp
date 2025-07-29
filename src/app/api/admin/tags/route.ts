import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const search = searchParams.get("search") || ""
    const page = parseInt(searchParams.get("page") || "1")
    const perPage = 10

    const whereClause = search
      ? {
          name: {
            contains: search,
          },
        }
      : {}

    const [tags, total] = await Promise.all([
      prisma.tag.findMany({
        where: whereClause,
        skip: (page - 1) * perPage,
        take: perPage,
        include: {
          parent: true,
          tenders: true,
        },
      }),
      prisma.tag.count({ where: whereClause }),
    ])

    const formatted = tags.map((tag) => ({
      id: tag.id,
      name: tag.name,
      parentName: tag.parent?.name ?? null,
      tenderCount: tag.tenders.length,
    }))

    return NextResponse.json({
      tags: formatted,
      totalPages: Math.ceil(total / perPage),
    })
  } catch (error) {
    console.error("GET /api/admin/tags error:", error)
    return NextResponse.json({ tags: [], totalPages: 0 }, { status: 500 })
  }
}
