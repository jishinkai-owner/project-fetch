import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    console.log("getting activity data...");

    const currentYear = new Date().getFullYear();

    console.log("current year: ", currentYear);

    const records = await prisma.record.findMany({
      where: {
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

    console.log("activity data fetched: ", records);

    return NextResponse.json({ success: true, data: records }, { status: 200 });
  } catch (error) {
    console.error("API Error: ", error);
    return NextResponse.json(
      { error: "Failed to fetch activity data", details: error },
      { status: 500 }
    );
  }
}
