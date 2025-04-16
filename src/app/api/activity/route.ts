import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const id = searchParams.get("id");
  try {
    console.log("Getting activity data...");
    const activity = await prisma.record.findUnique({
      where: {
        id: Number(id),
      },
      select: {
        id: true,
        year: true,
        place: true,
        date: true,
        activityType: true,
      },
    });
    if (!activity) {
      return NextResponse.json(
        { error: "Activity not found" },
        { status: 404 }
      );
    }
    console.log("Activity data fetched: ", activity);
    return NextResponse.json(
      { success: true, data: activity },
      { status: 200 }
    );
  } catch (error) {
    console.error("API Error: ", error);
    return NextResponse.json(
      { error: "Failed to fetch activity data", details: error },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const { year, place, date, activityType } = await req.json();

  try {
    console.log("posting new activity...");
    if (!year || !place || !date || !activityType) {
      return NextResponse.json(
        { error: "year, place, date, and activityType are all required" },
        { status: 400 }
      );
    }

    const newActivity = await prisma.record.create({
      data: {
        year,
        place,
        date,
        activityType,
      },
    });

    console.log("New activity posted: ", newActivity);
    return NextResponse.json(
      { success: true, data: newActivity },
      { status: 201 }
    );
  } catch (error) {
    console.error("API Error: ", error);
    return NextResponse.json(
      { error: "Failed to post new activity", details: error },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const { id, year, place, date, activityType } = await req.json();
  try {
    console.log("Updating activity...");
    if (!id || !year || !place || !date || !activityType) {
      return NextResponse.json(
        { error: "id, year, place, date, and activityType are all required" },
        { status: 400 }
      );
    }

    const updatedActivity = await prisma.record.update({
      where: { id: Number(id) },
      data: {
        year,
        place,
        date,
        activityType,
      },
    });

    console.log("Activity updated: ", updatedActivity);
    return NextResponse.json(
      { success: true, data: updatedActivity },
      { status: 200 }
    );
  } catch (error) {
    console.error("API Error: ", error);
    return NextResponse.json(
      { error: "Failed to update activity", details: error },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const id = searchParams.get("id");

  try {
    console.log("Deleting activity...", id);
    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }
    const deletedActivity = await prisma.record.delete({
      where: { id: Number(id) },
    });
    console.log("Activity deleted: ", deletedActivity);
    return NextResponse.json(
      { success: true, data: deletedActivity },
      { status: 200 }
    );
  } catch (error) {
    console.error("API Error: ", error);
    return NextResponse.json(
      { error: "Failed to delete activity", details: error },
      { status: 500 }
    );
  }
}
