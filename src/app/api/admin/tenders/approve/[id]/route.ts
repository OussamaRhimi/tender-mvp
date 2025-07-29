import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/getCurrentUser";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser() as { id: number; role: string };
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const pendingTenderId = parseInt(params.id);
    if (isNaN(pendingTenderId)) {
      return NextResponse.json({ error: "Invalid pending tender ID" }, { status: 400 });
    }

    // Fetch the pending tender with tags
    const pendingTender = await prisma.pendingTender.findUnique({
      where: { id: pendingTenderId },
      include: { tags: { include: { tag: true } }, buyer: true },
    });

    if (!pendingTender) {
      return NextResponse.json({ error: "Pending tender not found" }, { status: 404 });
    }

    // Create new tender
    const tender = await prisma.tender.create({
      data: {
        title: pendingTender.title,
        description: pendingTender.description,
        deadline: pendingTender.deadline,
        location: pendingTender.location,
        source: pendingTender.source,
        buyer: { connect: { id: pendingTender.buyerId } },
        tags: {
          create: pendingTender.tags.map((t) => ({
            tag: { connect: { id: t.tagId } },
          })),
        },
      },
      include: { tags: true, buyer: true },
    });

    // Delete the pending tender and its tags
    await prisma.pendingTenderTag.deleteMany({ where: { pendingTenderId } });
    await prisma.pendingTender.delete({ where: { id: pendingTenderId } });

    // Create notification for the user
    await prisma.notification.create({
      data: {
        message: `Your tender "${tender.title}" has been approved.`,
        userId: tender.buyerId,
      },
    });

    return NextResponse.json({ tender });
  } catch (error) {
    console.error("Tender approve error:", error);
    return NextResponse.json({ error: "Failed to approve tender" }, { status: 500 });
  }
}