// File: src/app/api/favorites/route.ts

import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getUserFromCookie } from "@/lib/auth"

export async function POST(req: NextRequest) {
  const user = await getUserFromCookie()
  if (!user || typeof user.id !== "number") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const { tenderId } = body

  if (!tenderId) {
    return NextResponse.json({ error: "Missing tenderId" }, { status: 400 })
  }

  try {
    const existing = await prisma.favorite.findUnique({
      where: {
        userId_tenderId: {
          userId: user.id,
          tenderId: tenderId,
        },
      },
    })

    if (existing) {
      return NextResponse.json({ message: "Already favorited" })
    }

    await prisma.favorite.create({
      data: {
        userId: user.id,
        tenderId: tenderId,
      },
    })

    return NextResponse.json({ success: true, message: "Added to favorites" })
  } catch (error) {
    console.error("Favorite error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
  
}
