import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// PATCH /api/admin/tags/[id]
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();
    const { name, parentId } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Tag name is required" },
        { status: 400 }
      );
    }

    const updatedTag = await prisma.tag.update({
      where: { id },
      data: {
        name,
        parentId: parentId ? parseInt(parentId) : null,
      },
    });

    return NextResponse.json(updatedTag);
  } catch (error) {
    console.error("Error updating tag:", error);
    return NextResponse.json(
      { error: "Failed to update tag" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/tags/[id]
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    // Optional: Check if tag has tenders before deleting
    const tenderCount = await prisma.tenderTag.count({ where: { tagId: id } });
    if (tenderCount > 0) {
      return NextResponse.json(
        { error: "Cannot delete tag with associated tenders" },
        { status: 400 }
      );
    }

    await prisma.tag.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Tag not found" }, { status: 404 });
    }

    console.error("Error deleting tag:", error);
    return NextResponse.json(
      { error: "Failed to delete tag" },
      { status: 500 }
    );
  }
}