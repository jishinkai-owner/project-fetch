import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { APIResponse } from "@/types/response";
import { ContentRes } from "@/types/apiResponse";
import { authenticateRequest } from "@/utils/supabase/auth";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const { user, error } = await authenticateRequest();
  if (error || !user) {
    const response: APIResponse<null> = {
      data: null,
      status: "error",
      error: "user is not authenticated",
    };
    return NextResponse.json(response, { status: 401 });
  }

  const searchParams = req.nextUrl.searchParams;
  const id = searchParams.get("id");

  if (!id) {
    const response: APIResponse<null> = {
      data: null,
      status: "error",
      error: "id is required",
    };

    return NextResponse.json(response, { status: 400 });
  }

  try {
    console.log("getting record content with id:", id);
    const data = await prisma.content.findUnique({
      where: {
        id: Number(id),
      },
      select: {
        id: true,
        title: true,
        content: true,
        recordId: true,
        authorId: true,
        Record: {
          select: {
            year: true,
            date: true,
            place: true,
          },
        },
      },
    });

    if (!data) {
      const response: APIResponse<null> = {
        data: null,
        status: "error",
        error: "Content not found",
      };
      return NextResponse.json(response, { status: 404 });
    }

    const content: ContentRes = {
      id: data.id,
      title: data.title,
      content: data.content,
      recordId: data.recordId,
      authorId: data.authorId,
      year: data.Record.year,
      date: data.Record.date,
      place: data.Record.place,
    };

    console.log("record content fetched: ", content);
    const response: APIResponse<ContentRes> = {
      data: content,
      status: "success",
      error: null,
    };
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("API Error: ", error);
    const response: APIResponse<null> = {
      data: null,
      status: "error",
      error: "Failed to fetch record content",
    };
    return NextResponse.json(response, { status: 500 });
  }
}

// use this from now one for getting content 11/16/2025
export async function POST(req: NextRequest) {
  const { user, error } = await authenticateRequest();
  if (error || !user) {
    const response: APIResponse<null> = {
      data: null,
      status: "error",
      error: "user is not authenticated",
    };
    return NextResponse.json(response, { status: 401 });
  }

  const body = await req.json();
  if (typeof body !== "object" || body === null) {
    const response: APIResponse<null> = {
      data: null,
      status: "error",
      error: "Invalid request body",
    };
    return NextResponse.json(response, { status: 400 });
  }

  const { authorId, title, content, recordId } = body;

  if (!authorId || !title || !content || !recordId) {
    const response: APIResponse<null> = {
      data: null,
      status: "error",
      error: "authorId, title, content, and recordId are all required",
    };
    return NextResponse.json(response, { status: 400 });
  }

  if (
    typeof authorId !== "string" ||
    typeof title !== "string" ||
    typeof content !== "string" ||
    typeof recordId !== "number"
  ) {
    const response: APIResponse<null> = {
      data: null,
      status: "error",
      error: "Invalid data types in request body",
    };
    return NextResponse.json(response, { status: 400 });
  }

  try {
    console.log("posting new content...");

    const res = await prisma.content.create({
      data: {
        authorId,
        title,
        content,
        recordId,
      },
    });

    const response: APIResponse<typeof res> = {
      data: res,
      status: "success",
      error: null,
    };

    console.log("new content successfully posted: ", res);
    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error("API Error: ", error);

    const response: APIResponse<null> = {
      data: null,
      status: "error",
      error: "Failed to post new content",
    };
    return NextResponse.json(response, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const { user, error } = await authenticateRequest();
  if (error || !user) {
    const response: APIResponse<null> = {
      data: null,
      status: "error",
      error: "user is not authenticated",
    };
    return NextResponse.json(response, { status: 401 });
  }

  const body = await req.json();
  if (typeof body !== "object" || body === null) {
    const response: APIResponse<null> = {
      data: null,
      status: "error",
      error: "Invalid request body",
    };
    return NextResponse.json(response, { status: 400 });
  }

  const { id, title, content, recordId } = body;

  if (!id || !title || !content) {
    const response: APIResponse<null> = {
      data: null,
      status: "error",
      error: "id, title, and content are all required",
    };
    return NextResponse.json(response, { status: 400 });
  }

  if (
    typeof id !== "number" ||
    typeof title !== "string" ||
    typeof content !== "string" ||
    typeof recordId !== "number"
  ) {
    const response: APIResponse<null> = {
      data: null,
      status: "error",
      error: "Invalid data types in request body",
    };
    return NextResponse.json(response, { status: 400 });
  }

  try {
    const res = await prisma.content.update({
      where: { id: Number(id), authorId: user.id },
      data: {
        title,
        content,
        recordId: Number(recordId),
      },
    });

    const response: APIResponse<typeof res> = {
      data: res,
      status: "success",
      error: null,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("API Error: ", error);

    const response: APIResponse<null> = {
      data: null,
      status: "error",
      error: "Failed to update content",
    };
    return NextResponse.json(response, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const { user, error } = await authenticateRequest();
  if (error || !user) {
    const response: APIResponse<null> = {
      data: null,
      status: "error",
      error: "user is not authenticated",
    };
    return NextResponse.json(response, { status: 401 });
  }

  const searchParams = req.nextUrl.searchParams;
  const id = searchParams.get("id");

  if (!id) {
    const response: APIResponse<null> = {
      data: null,
      status: "error",
      error: "id is required",
    };
    return NextResponse.json(response, { status: 400 });
  }

  if (isNaN(Number(id))) {
    const response: APIResponse<null> = {
      data: null,
      status: "error",
      error: "Invalid id format",
    };
    return NextResponse.json(response, { status: 400 });
  }

  try {
    console.log("deleting content with id: ", id);
    const res = await prisma.content.delete({
      where: { id: Number(id), authorId: user.id },
    });

    const response: APIResponse<typeof res> = {
      data: res,
      status: "success",
      error: null,
    };

    console.log("content successfully deleted: ", res);
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("API Error: ", error);

    const response: APIResponse<null> = {
      data: null,
      status: "error",
      error: "Failed to delete content",
    };
    return NextResponse.json(response, { status: 500 });
  }
}
