// File: src/app/api/register/route.ts
import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function POST(req: Request) {
  try {
    const data = await req.json()
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      country,
      company,
      role,
      subscription,
    } = data

    // 1. Validate required fields
    if (!email || !password || !confirmPassword || !firstName || !lastName || !role || !subscription) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 })
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ message: 'Passwords do not match' }, { status: 400 })
    }

    // 2. Check if email already exists
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json({ message: 'Email already in use' }, { status: 409 })
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // 4. Create user
 const fullName = `${firstName} ${lastName}`

const newUser = await prisma.user.create({
  data: {
    email,
    password: hashedPassword,
    firstName,
    lastName,
    name: fullName, // <--- This line sets the combined name
    country,
    company,
    role,
    subscription,
  }
})


    return NextResponse.json({ message: 'User created successfully', userId: newUser.id }, { status: 201 })
  } catch (error) {
    console.error('Registration Error:', error)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}
