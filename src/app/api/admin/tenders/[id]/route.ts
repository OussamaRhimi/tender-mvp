import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 })
    }

    const tender = await prisma.tender.findUnique({
      where: { id },
      include: {
        buyer: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    })

    if (!tender) {
      return NextResponse.json({ error: "Tender not found" }, { status: 404 })
    }

    return NextResponse.json({
      tender: {
        id: tender.id,
        title: tender.title,
        description: tender.description,
        deadline: tender.deadline,
        location: tender.location,
        source: tender.source,
        buyerName: `${tender.buyer.firstName} ${tender.buyer.lastName}`,
        tags: tender.tags.map((tt) => tt.tag.name),
      },
    })
  } catch (error) {
    console.error("GET tender error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const tenderId = parseInt(params.id)

  try {
    await prisma.tenderTag.deleteMany({ where: { tenderId } })
    await prisma.tender.delete({ where: { id: tenderId } })

    return NextResponse.json({ message: "Tender deleted" })
  } catch (err) {
    console.error("Failed to delete tender:", err)
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 })
  }
}

