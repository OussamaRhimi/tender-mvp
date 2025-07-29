import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getCurrentUser } from "@/lib/getCurrentUser"

// GET /api/inbox/favorites - Fetch current user's favorite tenders
export async function GET() {
  const user = await getCurrentUser()

  if (!user || !user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const favorites = await prisma.favorite.findMany({
    where: { userId: user.id },
    include: {
      tender: {
        include: {
          buyer: {
            select: { firstName: true, lastName: true, email: true },
          },
          tags: {
            include: { tag: true },
          },
        },
      },
    },
  })

  const tenders = favorites.map((f) => f.tender)

  return NextResponse.json({ tenders })
}

// DELETE /api/inbox/favorites - Remove tender from favorites
export async function DELETE(req: Request) {
  const user = await getCurrentUser()

  if (!user || !user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const tenderId = Number(body.tenderId)

  if (!tenderId) {
    return NextResponse.json({ error: "Missing tenderId" }, { status: 400 })
  }

  await prisma.favorite.deleteMany({
    where: {
      userId: user.id,
      tenderId,
    },
  })

  return NextResponse.json({ success: true })
}
