// File: lib/sendMessage.ts
"use server"

import prisma from "@/lib/prisma"
import { getCurrentUser } from "./getCurrentUser"

type SendMessageInput = {
  to: string
  content: string
}

// 👇 Define type of the expected user
type UserType = {
  id: number
  email: string
  firstName?: string
  lastName?: string
}

export async function sendMessage({ to, content }: SendMessageInput) {
  const sender = await getCurrentUser() as UserType | null

  if (!sender) {
    return { success: false, error: "You must be logged in." }
  }

  const receiver = await prisma.user.findUnique({ where: { email: to } })
  if (!receiver) {
    return { success: false, error: "Recipient not found." }
  }

  await prisma.message.create({
    data: {
      content,
      senderId: sender.id,
      receiverId: receiver.id,
    },
  })

  return { success: true }
}
