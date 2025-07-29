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

    // Fetch the pending tender to get its details for the notification
    const pendingTender = await prisma.pendingTender.findUnique({
      where: { id: pendingTenderId },
      include: { buyer: true },
    });

    if (!pendingTender) {
      return NextResponse.json({ error: "Pending tender not found" }, { status: 404 });
    }

    // Delete the pending tender and its tags
    await prisma.pendingTenderTag.deleteMany({ where: { pendingTenderId } });
    await prisma.pendingTender.delete({ where: { id: pendingTenderId } });

    // Create notification for the user
    await prisma.notification.create({
      data: {
        message: `Your tender "${pendingTender.title}" has been rejected.`,
        userId: pendingTender.buyerId,
      },
    });

    return NextResponse.json({ message: "Tender rejected successfully" });
  } catch (error) {
    console.error("Tender reject error:", error);
    return NextResponse.json({ error: "Failed to reject tender" }, { status: 500 });
  }
}