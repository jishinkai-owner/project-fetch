import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
//get all records with the user's authorId

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const authorId = searchParams.get("authorId");

    if (!authorId) {
      return NextResponse.json(
        {
          error: "authorId is required",
        },
        { status: 400 }
      );
    }
    console.log("getting record data with authorId ", authorId);
    const records = await prisma.content.findMany({
      where: {
        authorId: authorId,
      },
      select: {
        id: true,
        title: true,
        content: true,
        Record: true,
      },
    });

    if (!records) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 });
    }
    console.log("record data fetched: ", records);
    return NextResponse.json({ success: true, data: records }, { status: 200 });
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
