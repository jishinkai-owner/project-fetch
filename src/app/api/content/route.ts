import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const id = searchParams.get("id");
    if (!id) {
      return new Response("id is required", { status: 400 });
    }

    console.log("getting record data...");
    const record = await prisma.content.findUnique({
      where: {
        id: Number(id),
      },
      select: {
        title: true,
        content: true,
        recordId: true,
      },
    });

    if (!record) {
      return new Response("Record not found", { status: 404 });
    }
    console.log("record data fetched: ", record);
    return NextResponse.json({ success: true, data: record }, { status: 200 });
  } catch (error) {
    console.error("API Error: ", error);
    return NextResponse.json(
      { error: "Failed to fetch record data", details: error },
      { status: 500 }
    );
  }
}

//getting record content with
