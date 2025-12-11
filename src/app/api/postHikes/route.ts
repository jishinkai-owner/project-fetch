//for all posthikes data with the same recordId
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { APIResponse } from "@/types/response";
import { PostHikeRes, CLComments, RoleComments } from "@/types/apiResponse";
import { authenticateRequest } from "@/utils/supabase/auth";

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
  const recordId = searchParams.get("recordId");

  if (!recordId) {
    const response: APIResponse<null> = {
      data: null,
      status: "error",
      error: "recordId is required",
    };

    return NextResponse.json(response, { status: 400 });
  }

  try {
    console.log("getting posthike retrospective data for recordId:", recordId);
    const data = await prisma.record.findUnique({
      where: {
        id: Number(recordId),
      },
      select: {
        year: true,
        place: true,
        date: true,
        PostHikeContents: {
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
            User: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    if (!data) {
      const response: APIResponse<null> = {
        data: null,
        status: "error",
        error: "No posthike data found for the given recordId",
      };

      return NextResponse.json(response, { status: 404 });
    }

    // const response: APIesponse<PostHikeRes> = {
    //   data:
    // }

    const response: APIResponse<PostHikeRes> = {
      data: {
        year: data.year,
        place: data.place,
        date: data.date,
        postHikeContents: data.PostHikeContents.map((postHike) => {
          const clComments: CLComments = {
            equipment: postHike.equipmentComment,
            weather: postHike.weatherComment,
            meal: postHike.mealComment,
            sl: postHike.slComment,
          };
          const roleComments: RoleComments = {
            equipment: postHike.equipmentPerson,
            weather: postHike.weatherPerson,
            meal: postHike.mealPerson,
            sl: postHike.sl,
          };

          return {
            id: postHike.id,
            clComments: clComments,
            roleComments: roleComments,
            clId: postHike.clId,
            recordId: postHike.recordId,
            impression: postHike.impression,
            clName: postHike.User?.name || "",
          };
        }),
      },
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
