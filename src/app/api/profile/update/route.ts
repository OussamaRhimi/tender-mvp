import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getCurrentUser } from "@/lib/getCurrentUser"

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user || !user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await req.formData()
    const firstName = formData.get("firstName") as string
    const lastName = formData.get("lastName") as string
    const country = formData.get("country") as string
    const company = formData.get("company") as string

    const updatedUser = await prisma.user.update({
      where: { id: Number(user.id) },
      data: {
        firstName,
        lastName,
        country,
        company,
      },
    })

    // ✅ Use absolute URL
    const url = new URL("/profile", req.nextUrl.origin)
    url.searchParams.set("success", "1")

    return NextResponse.redirect(url.toString())
  } catch (error) {
    console.error("Error updating profile:", error)
    return NextResponse.json({ error: "Update failed" }, { status: 500 })
  }
}