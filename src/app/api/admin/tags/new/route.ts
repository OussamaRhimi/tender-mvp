// route.ts or app/api/admin/tags/new/route.ts
import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const { name, parentId } = await req.json()

    if (!name) {
      return NextResponse.json({ error: "Tag name is required" }, { status: 400 })
    }

    await prisma.tag.create({
      data: {
        name,
        parentId: parentId ? Number(parentId) : null,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error creating tag:", error)
    return NextResponse.json({ error: "Failed to create tag" }, { status: 500 })
  }
}