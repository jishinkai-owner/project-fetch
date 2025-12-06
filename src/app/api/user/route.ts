import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { authenticateRequest } from "@/utils/supabase/auth";
import { APIResponse } from "@/types/response";
import { UserRes } from "@/types/apiResponse";
const prisma = new PrismaClient();

//get user data including id, name, and role
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
    console.log("Getting user data...");
    const id = user.id;

    console.log("User data retrieved successfully:", id);

    const userFromTable = await prisma.user.findUnique({
      where: {
        id: id,
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

    if (!userFromTable) {
      const response: APIResponse<null> = {
        data: null,
        status: "error",
        error: "User not found in database",
      };
      return NextResponse.json(response, { status: 404 });
    }
    console.log("User found in database:", userFromTable);

    const res: UserRes = {
      id: userFromTable.id,
      name: userFromTable.name,
      grade: userFromTable.grade,
      roles: userFromTable.UserRoles.map((ur) => ({
        name: ur.Role.name,
      })),
    };

    const response: APIResponse<UserRes> = {
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
