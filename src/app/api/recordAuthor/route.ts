import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

//both get and post indivudual record

//from record
const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        {
          error: "authorId and recordId are both required",
        },
        { status: 400 }
      );
    }
    console.log("getting record data with id ", id);

    const record = await prisma.content.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!record) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 });
    }

    console.log("record data fetched: ", record);
    return NextResponse.json({ success: true, data: record }, { status: 200 });
  } catch (error) {
    console.error("API Error: ", error);
    return NextResponse.json(
      {
        error: "Failed to fetch record data",
        details: error,
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const { authorId, title, content, filename, recordId } = await req.json();

  try {
    console.log("posting new content...");
    if (!authorId || !title || !content || !recordId) {
      return NextResponse.json(
        { error: "title, content, filename, and recordId are all required" },
        { status: 400 }
      );
    }

    const newContent = await prisma.content.create({
      data: {
        authorId,
        title,
        content,
        filename,
        recordId,
      },
    });

    if (!newContent) {
      return NextResponse.json(
        { error: "Failed to post new content" },
        { status: 500 }
      );
    }

    console.log("new content successfully posted: ", newContent);
    return NextResponse.json(
      { success: true, data: newContent },
      { status: 201 }
    );
  } catch (error) {
    console.error("API Error: ", error);

    return NextResponse.json(
      { error: "Failed to post new content", details: error },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const { id, title, content, recordId } = await req.json();

  try {
    console.log("updating content...");
    if (!id || !title || !content) {
      return NextResponse.json(
        { error: "id, title, and content are all required" },
        { status: 400 }
      );
    }

    const updatedContent = await prisma.content.update({
      where: { id: Number(id) },
      data: {
        title,
        content,
        recordId: Number(recordId),
      },
    });

    if (!updatedContent) {
      return NextResponse.json(
        { error: "Failed to update content" },
        { status: 500 }
      );
    }
    console.log("content successfully updated: ", updatedContent);
    return NextResponse.json(
      { success: true, data: updatedContent },
      { status: 201 }
    );
  } catch (error) {
    console.error("API Error: ", error);

    return NextResponse.json(
      { error: "Failed to update content", details: error },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  try {
    console.log("deleting content with id: ", id);
    const deletedContent = await prisma.content.delete({
      where: { id: Number(id) },
    });

    if (!deletedContent) {
      return NextResponse.json(
        { error: "Failed to delete content" },
        { status: 500 }
      );
    }

    console.log("content successfully deleted: ", deletedContent);
    return NextResponse.json(
      { success: true, data: deletedContent },
      { status: 200 }
    );
  } catch (error) {
    console.error("API Error: ", error);

    return NextResponse.json(
      { error: "Failed to delete content", details: error },
      { status: 500 }
    );
  }
}
