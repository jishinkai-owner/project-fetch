import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { APIResponse } from "@/types/response";
import { AuthoredRecordRes } from "@/types/apiResponse";
import { authenticateRequest } from "@/utils/supabase/auth";
//get all records with the user's authorId

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
  const authorId = searchParams.get("authorId");

  if (!authorId) {
    const response: APIResponse<null> = {
      data: null,
      status: "error",
      error: "authorId is required",
    };
    return NextResponse.json(response, { status: 400 });
  }

  try {
    console.log("getting record data with authorId ", authorId);
    const res = await prisma.content.findMany({
      where: {
        authorId: authorId,
      },
      select: {
        id: true,
        title: true,
        authorId: true,
        Record: {
          select: {
            year: true,
            place: true,
            date: true,
          },
        },
      },
    });

    const resNormalized = res.map((r) => {
      return {
        id: r.id,
        title: r.title,
        year: r.Record.year,
        place: r.Record.place,
        date: r.Record.date,
        authorId: r.authorId,
      };
    });

    console.log("record data fetched: ", resNormalized);

    const response: APIResponse<AuthoredRecordRes[]> = {
      data: resNormalized,
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
