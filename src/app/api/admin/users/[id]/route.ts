import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const userId = parseInt(params.id)

  try {
    await prisma.user.delete({ where: { id: userId } })
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: "Could not delete user" }, { status: 500 })
  }
}
