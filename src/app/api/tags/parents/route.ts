// File: src/app/api/tags/parents/route.ts
import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const parentTags = await prisma.tag.findMany({
      where: {
        parentId: null, // Only top-level categories
      },
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: 'asc',
      },
    })

    return NextResponse.json(parentTags, { status: 200 })
  } catch (error) {
    console.error('Error fetching parent tags:', error)
    return NextResponse.json({ message: 'Failed to load categories' }, { status: 500 })
  }
}