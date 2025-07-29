// File: src/app/api/inbox/messages/route.ts
import { getCurrentUser } from "@/lib/getCurrentUser"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  const user = await getCurrentUser()
  if (!user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const messages = await prisma.message.findMany({
    where: { receiverId: user.id },
    include: { sender: true },
    orderBy: { createdAt: "desc" },
  })

  const formatted = messages.map((msg) => ({
    id: msg.id,
    content: msg.content,
    createdAt: msg.createdAt.toISOString(),
    senderEmail: msg.sender.email,
    senderFirstName: msg.sender.firstName,
    senderLastName: msg.sender.lastName,
  }))

  return NextResponse.json({ messages: formatted })
}
