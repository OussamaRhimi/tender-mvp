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
      parentTagId, // ✅ Accept parentTagId
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

    // 3. Validate parentTagId if subscription is PARTIAL
    if (subscription === 'PARTIAL') {
      if (!parentTagId) {
        return NextResponse.json(
          { message: 'Premium (Partial) plan requires a category selection.' },
          { status: 400 }
        )
      }

      // Ensure parentTagId is a number
      const tagId = parseInt(parentTagId, 10)
      if (isNaN(tagId)) {
        return NextResponse.json({ message: 'Invalid category ID.' }, { status: 400 })
      }

      // Check if the tag exists and is a parent (i.e., parentId is null)
      const tag = await prisma.tag.findUnique({
        where: { id: tagId },
      })

      if (!tag) {
        return NextResponse.json({ message: 'Selected category does not exist.' }, { status: 400 })
      }

      if (tag.parentId !== null) {
        return NextResponse.json(
          { message: 'You must select a main category, not a subcategory.' },
          { status: 400 }
        )
      }
    } else {
      // For FREE or FULL plans, ensure no parentTagId is enforced
      // (ignore if passed, or optionally reject it)
    }

    // 4. Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // 5. Create user
    const fullName = `${firstName} ${lastName}`

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        name: fullName,
        country,
        company,
        role,
        subscription,
        parentTagId: subscription === 'PARTIAL' ? parseInt(parentTagId, 10) : null, // ✅ Set only for PARTIAL
      },
    })

    return NextResponse.json({ message: 'User created successfully', userId: newUser.id }, { status: 201 })
  } catch (error) {
    console.error('Registration Error:', error)
    return NextResponse.json({ message: 'Server error during registration' }, { status: 500 })
  }
}