import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const perPage = 10;

    const whereClause = search
      ? {
          title: {
            contains: search,
            mode: "insensitive", // optional but useful
          },
        }
      : {};

    const [tenders, total] = await Promise.all([
      prisma.tender.findMany({
        where: whereClause,
        skip: (page - 1) * perPage,
        take: perPage,
        include: {
          buyer: true,
          tags: {
            include: {
              tag: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.tender.count({
        where: whereClause,
      }),
    ]);

    const formatted = tenders.map((tender) => ({
      id: tender.id,
      title: tender.title,
      buyerName: tender.buyer.firstName + " " + tender.buyer.lastName,
      location: tender.buyer.country || "Unknown",
      tags: tender.tags.map((tt) => tt.tag.name),
      deadline: tender.deadline.toISOString(), // make sure it's string
      status: new Date(tender.deadline) < new Date() ? "awarded" : "open",
    }));

    return NextResponse.json({
      tenders: formatted,
      totalPages: Math.ceil(total / perPage),
    });

  } catch (error) {
    console.error("API Error:", error); // 👈 Add this line
    return NextResponse.json(
      { error: "Failed to fetch tenders" },
      { status: 500 }
    );
  }
}