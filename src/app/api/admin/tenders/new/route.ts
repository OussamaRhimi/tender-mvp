import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/getCurrentUser";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser() as { id: number; role: string };
    if (!user || !["BUYER", "ADMIN", "SUPPLIER"].includes(user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, description, deadline, tags, location, source } = await req.json();

    // Validate required fields
    if (!title || !description || !deadline || !tags || !Array.isArray(tags)) {
      return NextResponse.json(
        { error: "Title, description, deadline, and tags are required" },
        { status: 400 }
      );
    }

    // Common data for both Tender and PendingTender
    const tenderData = {
      title,
      description,
      deadline: new Date(deadline),
      location,
      source,
      buyer: { connect: { id: user.id } },
      tags: {
        create: tags.map((tagId: number) => ({
          tag: { connect: { id: tagId } },
        })),
      },
    };

    let response;
    if (user.role === "ADMIN") {
      // Admins save directly to Tender
      const tender = await prisma.tender.create({
        data: tenderData,
        include: { tags: true, buyer: true },
      });
      response = { tender, status: "PUBLISHED" };
    } else {
      // Non-admins save to PendingTender
      const pendingTender = await prisma.pendingTender.create({
        data: {
          ...tenderData,
          tags: {
            create: tags.map((tagId: number) => ({
              tag: { connect: { id: tagId } },
            })),
          },
        },
        include: { tags: true, buyer: true },
      });
      response = { pendingTender, status: "PENDING" };
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error("Tender POST error:", error);
    return NextResponse.json({ error: "Failed to create tender" }, { status: 500 });
  }
}