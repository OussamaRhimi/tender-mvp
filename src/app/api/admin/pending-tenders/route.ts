import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/getCurrentUser";

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser() as { id: number; role: string } | null;
    console.log("User from getCurrentUser:", user);
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const search = url.searchParams.get("search") || "";
    const pageSize = 10;

    if (page < 1) {
      return NextResponse.json({ error: "Page must be greater than 0" }, { status: 400 });
    }

    const where = {
      OR: [
        { title: { contains: search } }, // Removed mode: "insensitive"
        { buyer: { firstName: { contains: search } } }, // Removed mode: "insensitive"
        { buyer: { lastName: { contains: search } } }, // Removed mode: "insensitive"
      ],
    };

    const [pendingTenders, total] = await prisma.$transaction([
      prisma.pendingTender.findMany({
        where,
        include: { tags: { include: { tag: true } }, buyer: true },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.pendingTender.count({ where }),
    ]);

    if (!Array.isArray(pendingTenders)) {
      throw new Error("Invalid data returned from Prisma");
    }

    const totalPages = Math.ceil(total / pageSize);

    return NextResponse.json({
      tenders: pendingTenders,
      totalPages,
    });
  } catch (error) {
    console.error("Pending tenders GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch pending tenders", details: (error as Error).message },
      { status: 500 }
    );
  }
}