//for all posthikes data with the same recordId
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

//this is for getting all retrospective data
//with the same recordId.

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const recordId = searchParams.get("recordId");
    if (!recordId) {
      return new Response("recordId is required", { status: 400 });
    }
    console.log("getting posthike retrospective data...");
    const postHikes = await prisma.record.findUnique({
      where: {
        id: Number(recordId),
      },
      include: {
        PostHikeContents: true,
      },
    });

    console.log("posthike retrospective data fetched: ", postHikes);
    return NextResponse.json(
      { success: true, data: postHikes },
      { status: 200 }
    );
  } catch (error) {
    console.error("API Error: ", error);
    return NextResponse.json(
      { error: "Failed to fetch posthike retrospective data", details: error },
      { status: 500 }
    );
  }
}
