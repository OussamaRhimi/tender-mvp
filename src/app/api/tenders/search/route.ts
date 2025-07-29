import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function POST(req: Request) {
  const { title, tag, subtag, country, deadline, email } = await req.json()

  const filters: any = {
    ...(title && { title: { contains: title, mode: "insensitive" } }),
    ...(country && { location: { contains: country, mode: "insensitive" } }),
    ...(deadline && { deadline: { lte: new Date(deadline) } }),
    ...(tag && {
      tags: {
        some: { tagId: parseInt(tag) },
      },
    }),
    ...(subtag && {
      tags: {
        some: { tagId: parseInt(subtag) },
      },
    }),
    ...(email && {
      buyer: {
        email: { contains: email, mode: "insensitive" },
      },
    }),
  }

  const tenders = await prisma.tender.findMany({
    where: filters,
    include: {
      tags: { include: { tag: true } },
      buyer: true,
    },
    orderBy: { createdAt: "desc" },
  })

  const formatted = tenders.map((t) => ({
    id: t.id,
    title: t.title,
    description: t.description,
    location: t.location || "",
    deadline: t.deadline,
    source: t.source || "",
    buyerName: `${t.buyer.firstName} ${t.buyer.lastName}`,
    tags: t.tags.map((tt) => tt.tag.name),
  }))

  return NextResponse.json({ tenders: formatted })
}
