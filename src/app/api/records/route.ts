import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    console.log("getting record data...");

    const currentYear = new Date().getFullYear();

    const records = await prisma.record.findMany({
      where: {
        // activityType: "yama",
        year: {
          gte: currentYear,
        },
      },
      select: {
        id: true,
        year: true,
        place: true,
        date: true,
      },
    });

    console.log("record data fetched: ", records);

    return NextResponse.json({ success: true, data: records }, { status: 200 });
  } catch (error) {
    console.error("API Error: ", error);
    return NextResponse.json(
      { error: "Failed to fetch record data", details: error },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const { year, place, date, activityType } = await req.json();

  try {
    console.log("posting new hike info...");

    if (!year || !place || !date || !activityType) {
      return NextResponse.json(
        { error: "year, place, date, and activityType are all required" },
        { status: 400 }
      );
    }

    const newRecord = await prisma.record.create({
      data: {
        year,
        place,
        date,
        activityType,
      },
    });
    if (!newRecord) {
      return NextResponse.json(
        { error: "Failed to post new hike info. new record info is null." },
        { status: 500 }
      );
    }

    console.log("new hike info successfully posted:", newRecord);

    return NextResponse.json(
      { success: true, data: newRecord },
      { status: 201 }
    );
  } catch (error) {
    console.error("API Error: ", error);

    return NextResponse.json(
      { error: "Failed to post new hike info", details: error },
      { status: 500 }
    );
  }
}
