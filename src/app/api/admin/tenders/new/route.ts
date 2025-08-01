import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getCurrentUser } from "@/lib/getCurrentUser"
import path from "path"
import fs from "fs"

export const config = {
  api: {
    bodyParser: false, // disable Next.js body parser to handle multipart formData
  },
}

export async function POST(req: Request) {
  try {
    const user = (await getCurrentUser()) as { id: number; role: string } | null
    if (!user || !["BUYER", "ADMIN", "SUPPLIER"].includes(user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await req.formData()

    // Extract fields
    const title = formData.get("title")
    const description = formData.get("description")
    const deadline = formData.get("deadline")
    const location = formData.get("location")
    const sourceField = formData.get("source")
    const tagsRaw = formData.get("tags")

    if (
      typeof title !== "string" ||
      typeof description !== "string" ||
      typeof deadline !== "string" ||
      typeof tagsRaw !== "string"
    ) {
      return NextResponse.json(
        { error: "Title, description, deadline, and tags are required" },
        { status: 400 }
      )
    }

    let tags: number[]
    try {
      tags = JSON.parse(tagsRaw)
      if (!Array.isArray(tags)) throw new Error("Tags not an array")
    } catch {
      return NextResponse.json({ error: "Invalid tags format" }, { status: 400 })
    }

    // Handle file upload
    let source: string | null = sourceField && typeof sourceField === "string" ? sourceField : null

    const file = formData.get("file")
    if (file && file instanceof Blob && file.size > 0) {
      const uploadDir = path.join(process.cwd(), "/public/uploads")

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true })
      }

      // Create a unique filename to avoid collisions
      const filename = `${Date.now()}-${(file as any).name || "upload"}`
      const filePath = path.join(uploadDir, filename)

      // Save the file locally
      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      fs.writeFileSync(filePath, buffer)

      source = `/uploads/${filename}`
    }

    const tenderData = {
      title,
      description,
      deadline: new Date(deadline),
      location: location && typeof location === "string" ? location : null,
      source,
      buyer: { connect: { id: user.id } },
      tags: {
        create: tags.map((tagId: number) => ({
          tag: { connect: { id: tagId } },
        })),
      },
    }

    let response
    if (user.role === "ADMIN") {
      const tender = await prisma.tender.create({
        data: tenderData,
        include: { tags: true, buyer: true },
      })
      response = { tender, status: "PUBLISHED" }
    } else {
      const pendingTender = await prisma.pendingTender.create({
        data: tenderData,
        include: { tags: true, buyer: true },
      })
      response = { pendingTender, status: "PENDING" }
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Tender POST error:", error)
    return NextResponse.json({ error: "Failed to create tender" }, { status: 500 })
  }
}
