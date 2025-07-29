import { cookies } from "next/headers"
import { encrypt } from "@/lib/crypto"
import { Role } from "@prisma/client"
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const body = await req.json()
  const { email, password } = body

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
  }

  const isCorrectPassword = await bcrypt.compare(password, user.password)

  if (!isCorrectPassword) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
  }

const session = await encrypt({
  id: user.id,
  email: user.email,
  role: user.role,
  firstName: user.firstName,
  lastName: user.lastName,
})

const cookieStore = await cookies()
cookieStore.set("session", session, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
})


// 👇 Redirect based on role
const redirectUrl =
  user.role === Role.ADMIN ? "/dashboard" : "/home"

  return NextResponse.json({ success: true, redirectTo: redirectUrl })
}
