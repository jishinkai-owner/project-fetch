import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

//for indivisual posthike

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const recordId = searchParams.get("recordId");
    const clId = searchParams.get("clId");

    if (!recordId || !clId) {
      return NextResponse.json(
        {
          error: "recordId and clId are both required",
        },
        { status: 400 }
      );
    }

    console.log("getting posthike retrospective data...");

    const postHikes = await prisma.postHikeContent.findMany({
      where: {
        recordId: Number(recordId),
        clId: clId,
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

export async function POST(req: NextRequest) {
  const {
    clName,
    recordId,
    equipmentPerson,
    weatherPerson,
    mealPerson,
    sl,
    equipmentComment,
    weatherComment,
    mealComment,
    slComment,
    clId,
  } = await req.json();

  try {
    if (!recordId) {
      return NextResponse.json(
        { error: "recordId is required" },
        { status: 400 }
      );
    }
    if (!clId) {
      return NextResponse.json({ error: "clId is required" }, { status: 400 });
    }

    console.log("posting new posthike retrospective info...");

    //if equipmentPerson, weatherPerson, or mealPerson is null, set to empty array
    const data = {
      clName,
      recordId,
      equipmentPerson,
      weatherPerson,
      mealPerson,
      sl,
      equipmentComment,
      weatherComment,
      mealComment,
      slComment,
      clId,
    };

    const newPostHike = await prisma.postHikeContent.create({
      data: data,
    });

    if (!newPostHike) {
      return NextResponse.json(
        {
          error:
            "Failed to post new posthike retrospective info. new posthike info is null.",
        },
        { status: 500 }
      );
    }

    console.log(
      "new posthike retrospective info successfully posted:",
      newPostHike
    );
    return NextResponse.json(
      { success: true, data: newPostHike },
      { status: 201 }
    );
  } catch (error) {
    console.error("API Error: ", error);

    return NextResponse.json(
      {
        error: "Failed to post new posthike retrospective data",
        details: error,
      },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const {
    clName,
    reflectionEquipment,
    reflectionWeather,
    reflectionMeal,
    reflectionSL,
    impression,
    commentMeal,
    commentWeather,
    commentEquipment,
    commentSL,
    recordId,
    clId,
  } = await req.json();

  try {
    if (!recordId) {
      return NextResponse.json(
        { error: "recordId is required" },
        { status: 400 }
      );
    }
    if (!clId) {
      return NextResponse.json({ error: "clId is required" }, { status: 400 });
    }

    const dataBefore = await prisma.postHikeContent.findFirst({
      where: {
        clId: clId,
        recordId: recordId,
      },
    });

    console.log("posthike retrospective info before upsert:", dataBefore);

    console.log("upserting posthike retrospective info...");

    if (!dataBefore) {
      console.log("posthike retrospective info not found");
    }

    const data = !dataBefore
      ? {
          clName: clName,
          equipmentPerson: reflectionEquipment ?? null,
          weatherPerson: reflectionWeather ?? null,
          mealPerson: reflectionMeal ?? null,
          sl: reflectionSL ?? null,
          equipmentComment: commentEquipment ?? null,
          weatherComment: commentWeather ?? null,
          mealComment: commentMeal ?? null,
          slComemnt: commentSL ?? null,
          impression: [impression],
        }
      : {
          clName: clName,
          equipmentPerson:
            reflectionEquipment ?? dataBefore.equipmentPerson ?? null,
          weatherPerson: reflectionWeather ?? dataBefore.weatherPerson ?? null,
          mealPerson: reflectionMeal ?? dataBefore.mealPerson ?? null,
          sl: reflectionSL ?? dataBefore.sl ?? null,
          equipmentComment:
            commentEquipment ?? dataBefore.equipmentComment ?? null,
          weatherComment: commentWeather ?? dataBefore.weatherComment ?? null,
          mealComment: commentMeal ?? dataBefore.mealComment ?? null,
          impression: [...dataBefore.impression, impression],
          slComemnt: commentSL ?? dataBefore.slComemnt ?? null,
        };
    if (!dataBefore) {
      console.log("posthike retrospective info not found");
    }

    const dataUpsert = await prisma.postHikeContent.upsert({
      where: {
        id: dataBefore?.id ?? 0,
      },
      update: {
        ...data,
      },
      create: {
        ...data,
        clId: clId,
        recordId: Number(recordId),
      },
    });
    if (!dataUpsert) {
      return NextResponse.json(
        {
          error:
            "Failed to upsert posthike retrospective info. new posthike info is null.",
        },
        { status: 500 }
      );
    }
    console.log(
      "posthike retrospective info successfully upserted:",
      dataUpsert
    );
    return NextResponse.json(
      { success: true, data: dataUpsert },
      { status: 201 }
    );
  } catch (error) {
    console.error("API Error: ", error);
    return NextResponse.json(
      { error: "Failed to upsert posthike retrospective data", details: error },
      { status: 500 }
    );
  }
}
