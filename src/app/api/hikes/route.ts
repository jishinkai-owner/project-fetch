import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    console.log("getting posthike data...");
    const members = await prisma.posthike.findUnique({
      select: {
        id: true,
        year: true,
        place: true,
        date: true,
      },
    });
    console.log("posthike data fetched:", members);
    return NextResponse.json(members);
  } catch (error) {
    console.error("API Error: ", error);
    return NextResponse.json(
      { error: "Failed to fetch data", details: error },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
  } catch {}
}
