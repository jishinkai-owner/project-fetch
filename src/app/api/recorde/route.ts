import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { APIResponse } from "@/types/response";
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
  const recordId = searchParams.get("id");

  if (!recordId) {
    const response: APIResponse<null> = {
      data: null,
      status: "error",
      error: "recordId is required",
    };
    return NextResponse.json(response, { status: 400 });
  }

  try {
    console.log("getting records with recordId:", recordId);
    const data = await prisma.record.findUnique({
      where: {
        id: Number(recordId),
      },
      select: {
        id: true,
        year: true,
        place: true,
        date: true,
        details: true,
        activityType: true,
      },
    });

    if (!data) {
      const response: APIResponse<null> = {
        data: null,
        status: "error",
        error: "Record not found",
      };
      return NextResponse.json(response, { status: 404 });
    }

    const response: APIResponse<typeof data> = {
      data,
      status: "success",
      error: null,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("API Error: ", error);
    const response: APIResponse<null> = {
      data: null,
      status: "error",
      error: "Failed to fetch record data",
    };
    return NextResponse.json(response, { status: 500 });
  }
}

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

  if (typeof body !== "object" || body == null || body == undefined) {
    const response: APIResponse<null> = {
      data: null,
      status: "error",
      error: "Invalid request body",
    };
    return NextResponse.json(response, { status: 400 });
  }

  const { year, place, date, activityType } = body;

  if (!year || !place || !date || !activityType) {
    const response: APIResponse<null> = {
      data: null,
      status: "error",
      error: "year, place, date, and activityType are all required",
    };
    return NextResponse.json(response, { status: 400 });
  }

  if (typeof year !== "number") {
    const response: APIResponse<null> = {
      data: null,
      status: "error",
      error: "year must be a number",
    };
    return NextResponse.json(response, { status: 400 });
  }

  if (
    typeof place !== "string" ||
    typeof date !== "string" ||
    typeof activityType !== "string"
  ) {
    const response: APIResponse<null> = {
      data: null,
      status: "error",
      error: "place, date, and activityType must be strings",
    };
    return NextResponse.json(response, { status: 400 });
  }

  console.log("posting new record...", { year, place, date, activityType });

  try {
    const res = await prisma.record.create({
      data: {
        year,
        place,
        date,
        activityType,
      },
    });

    const response: APIResponse<typeof res> = {
      data: res,
      status: "success",
      error: null,
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error("API Error: ", error);
    const response: APIResponse<null> = {
      data: null,
      status: "error",
      error: "Failed to create new record",
    };
    return NextResponse.json(response, { status: 500 });
  }

  // const { year, place, date, activityType } = await req.json();
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
  if (typeof body !== "object" || body == null || body == undefined) {
    const response: APIResponse<null> = {
      data: null,
      status: "error",
      error: "Invalid request body",
    };
    return NextResponse.json(response, { status: 400 });
  }

  const { id, year, place, date, activityType } = body;

  if (!id || !year || !place || !date || !activityType) {
    const response: APIResponse<null> = {
      data: null,
      status: "error",
      error: "id, year, place, date, and activityType are all required",
    };
    return NextResponse.json(response, { status: 400 });
  }

  if (typeof year !== "number") {
    const response: APIResponse<null> = {
      data: null,
      status: "error",
      error: "year must be a number",
    };
    return NextResponse.json(response, { status: 400 });
  }

  if (
    typeof place !== "string" ||
    typeof date !== "string" ||
    typeof activityType !== "string"
  ) {
    const response: APIResponse<null> = {
      data: null,
      status: "error",
      error: "place, date, and activityType must be strings",
    };
    return NextResponse.json(response, { status: 400 });
  }

  try {
    const res = await prisma.record.update({
      where: { id: Number(id) },
      data: {
        year,
        place,
        date,
        activityType,
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
      error: "Failed to update record",
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
      error: "id must be a valid number",
    };
    return NextResponse.json(response, { status: 400 });
  }

  try {
    console.log("Deleting record...", id);
    const deletedRecord = await prisma.record.delete({
      where: { id: Number(id) },
    });
    console.log("Record deleted: ", deletedRecord);
    const response: APIResponse<typeof deletedRecord> = {
      data: deletedRecord,
      status: "success",
      error: null,
    };
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("API Error: ", error);
    const response: APIResponse<null> = {
      data: null,
      status: "error",
      error: "Failed to delete record",
    };
    return NextResponse.json(response, { status: 500 });
  }
}
