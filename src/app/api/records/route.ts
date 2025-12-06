import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { authenticateRequest } from "@/utils/supabase/auth";
import { APIResponse } from "@/types/response";
import { RecordRes } from "@/types/apiResponse";

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
  const getAll = searchParams.get("getAll") === "true";
  const currentYear = new Date().getFullYear();

  const whereClause = getAll
    ? {
        year: {
          gte: currentYear,
        },
      }
    : {
        activityType: "yama",
        year: {
          gte: currentYear,
        },
      };

  try {
    console.log("getting records data...");
    const res = await prisma.record.findMany({
      where: whereClause,
      select: {
        id: true,
        year: true,
        place: true,
        date: true,
        details: true,
        activityType: true,
      },
    });

    console.log("records found: ", res);

    const response: APIResponse<RecordRes[]> = {
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
      error: "Failed to fetch records data",
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

  try {
    console.log("posting new hike info...");
    const res = await prisma.record.create({
      data: {
        year,
        place,
        date,
        activityType,
      },
    });

    console.log("new hike info successfully posted:", res);

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
      error: "Failed to post hike info data",
    };
    return NextResponse.json(response, { status: 500 });
  }
}
