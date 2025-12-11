import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { authenticateRequest } from "@/utils/supabase/auth";
import { APIResponse } from "@/types/response";
import { UserRes } from "@/types/apiResponse";

const prisma = new PrismaClient();

export async function GET() {
  const { user, error } = await authenticateRequest();
  if (error || !user) {
    const response: APIResponse<null> = {
      data: null,
      status: "error",
      error: "user is not authenticated",
    };
    return NextResponse.json(response, { status: 401 });
  }

  try {
    console.log("Getting members with CL role...");

    const clMembers = await prisma.user.findMany({
      where: {
        UserRoles: {
          some: {
            Role: {
              name: "CL",
            },
          },
        },
      },
      select: {
        id: true,
        name: true,
        grade: true,
        UserRoles: {
          select: {
            Role: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    if (clMembers.length === 0) {
      return NextResponse.json(
        { error: "No CL members found" },
        { status: 404 },
      );
    }

    console.log("CL members retrieved successfully:", clMembers);

    const res: UserRes[] = clMembers.map((m) => {
      return {
        id: m.id,
        name: m.name,
        grade: m.grade,
        roles: m.UserRoles.map((ur) => ({
          name: ur.Role.name,
        })),
      };
    });

    const response: APIResponse<UserRes[]> = {
      data: res,
      status: "success",
      error: null,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("API Error: ", error);
    const response: APIResponse<null> = {
      data: null,
      status: "error",
      error: "Internal Server Error",
    };
    return NextResponse.json(response, { status: 500 });
  }
}
