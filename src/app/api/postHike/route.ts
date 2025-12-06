import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { APIResponse } from "@/types/response";
import {
  PostHikeContentBaseRes,
  CLComments,
  RoleComments,
} from "@/types/apiResponse";
import { authenticateRequest } from "@/utils/supabase/auth";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const { user, error } = await authenticateRequest();

  if (error || !user) {
    const response: APIResponse<null> = {
      data: null,
      status: "error",
      error: "User not authenticated",
    };

    return NextResponse.json(
      response,

      { status: 401 }
    );
  }

  const searchParams = req.nextUrl.searchParams;
  const recordId = searchParams.get("recordId");
  const clId = searchParams.get("clId");

  if (!recordId) {
    const response: APIResponse<null> = {
      data: null,
      status: "error",
      error: "recordId is required",
    };

    return NextResponse.json(response, { status: 400 });
  }
  if (!clId) {
    const response: APIResponse<null> = {
      data: null,
      status: "error",
      error: "clId is required",
    };

    return NextResponse.json(response, { status: 400 });
  }

  try {
    console.log(
      "getting posthike retrospective data for recordId:",
      recordId,
      "and clId:",
      clId
    );

    const data = await prisma.postHikeContent.findFirst({
      where: {
        recordId: Number(recordId),
        clId: clId,
      },
      select: {
        id: true,
        sl: true,
        clId: true,
        recordId: true,
        equipmentPerson: true,
        weatherPerson: true,
        mealPerson: true,
        slComment: true,
        equipmentComment: true,
        weatherComment: true,
        mealComment: true,
        impression: true,
      },
    });

    if (!data) {
      const response: APIResponse<null> = {
        data: null,
        status: "error",
        error: "No posthike data found for the given recordId and clId",
      };
      return NextResponse.json(response, { status: 404 });
    }
    const clComments: CLComments = {
      equipment: data.equipmentComment,
      weather: data.weatherComment,
      meal: data.mealComment,
      sl: data.slComment,
    };
    const roleComments: RoleComments = {
      equipment: data.equipmentPerson,
      weather: data.weatherPerson,
      meal: data.mealPerson,
      sl: data.sl,
    };

    const postHikes = {
      id: data.id,
      clComments: clComments,
      roleComments: roleComments,
      clId: data.clId,
      recordId: data.recordId,
      impression: data.impression,
    };

    const response: APIResponse<PostHikeContentBaseRes> = {
      data: postHikes,
      status: "success",
      error: null,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("API Error: ", error);
    const response: APIResponse<null> = {
      data: null,
      status: "error",
      error: "Failed to fetch posthike retrospective data",
    };
    return NextResponse.json(response, { status: 500 });
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
      slComemnt: slComment,
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
  const { user, error } = await authenticateRequest();

  if (error || !user) {
    const response: APIResponse<null> = {
      data: null,
      status: "error",
      error: "User not authenticated",
    };

    return NextResponse.json(
      response,

      { status: 401 }
    );
  }

  const body = await req.json();

  if (!body || typeof body !== "object") {
    const response: APIResponse<null> = {
      data: null,
      status: "error",
      error: "Request body is required",
    };

    return NextResponse.json(response, { status: 400 });
  }

  if (!body.recordId || typeof body.recordId !== "number") {
    const response: APIResponse<null> = {
      data: null,
      status: "error",
      error: "recordId is required and must be a number",
    };

    return NextResponse.json(response, { status: 400 });
  }

  if (!body.clId || typeof body.clId !== "string") {
    const response: APIResponse<null> = {
      data: null,
      status: "error",
      error: "clId is required and must be a string",
    };

    return NextResponse.json(response, { status: 400 });
  }

  const {
    clId,
    recordId,
    reflectionMeal,
    reflectionEquipment,
    reflectionWeather,
    reflectionSL,
    commentMeal,
    commentWeather,
    commentEquipment,
    commentSL,
  } = body;

  let data = {};

  if (reflectionMeal !== undefined && reflectionMeal !== null) {
    data = { ...data, mealPerson: reflectionMeal };
  }
  if (reflectionEquipment !== undefined && reflectionEquipment !== null) {
    data = { ...data, equipmentPerson: reflectionEquipment };
  }
  if (reflectionWeather !== undefined && reflectionWeather !== null) {
    data = { ...data, weatherPerson: reflectionWeather };
  }
  if (reflectionSL !== undefined && reflectionSL !== null) {
    data = { ...data, sl: reflectionSL };
  }
  if (commentMeal !== undefined && commentMeal !== null) {
    data = { ...data, mealComment: commentMeal };
  }
  if (commentEquipment !== undefined && commentEquipment !== null) {
    data = { ...data, equipmentComment: commentEquipment };
  }
  if (commentWeather !== undefined && commentWeather !== null) {
    data = { ...data, weatherComment: commentWeather };
  }
  if (commentSL !== undefined && commentSL !== null) {
    data = { ...data, slComemnt: commentSL };
  }

  try {
    console.log(
      "updating posthike retrospective info for recordId:",
      recordId,
      "and clId:",
      clId
    );

    const res = await prisma.postHikeContent.upsert({
      where: {
        clId_recordId_unique: {
          clId: String(clId),
          recordId: Number(recordId),
        },
      },
      update: {
        ...data,
      },
      create: {
        ...data,
        clId: String(clId),
        recordId: Number(recordId),
      },
    });
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
      error: "Failed to upsert posthike retrospective data",
    };
    return NextResponse.json(response, { status: 500 });
  }
}
