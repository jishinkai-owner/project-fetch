import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { APIResponse } from "@/types/response";
import { authenticateRequest } from "@/utils/supabase/auth";

const prisma = new PrismaClient();

// export async function GET(req: NextRequest) {
//   const { user, error } = await authenticateRequest();
//   if (error || !user) {
//     const response: APIResponse<null> = {
//       data: null,
//       status: "error",
//       error: "user is not authenticated",
//     };
//     return NextResponse.json(response, { status: 401 });
//   }
// }

export async function PUT(req: NextRequest) {
  const { user, error } = await authenticateRequest();
  if (error || !user) {
    const response: APIResponse<null> = {
      data: null,
      status: "error",
      error: "user is not authenticated",
    };
    return NextResponse.json(response, { status: 401 });
  }
  const body = await req.json();
  console.log("role body", body);
  if (!body || typeof body !== "object") {
    const response: APIResponse<null> = {
      data: null,
      status: "error",
      error: "Invalid request body",
    };
    return NextResponse.json(response, { status: 400 });
  }

  const { id, grade, roleIds } = body;

  console.log("Posting new role...", { id, grade, roleIds });
  if (!id) {
    const response: APIResponse<null> = {
      data: null,
      status: "error",
      error: "user's id is required",
    };
    return NextResponse.json(response, { status: 400 });
  }

  if (!grade && !roleIds) {
    const response: APIResponse<null> = {
      data: null,
      status: "error",
      error: "either grade or role is required",
    };
    return NextResponse.json(response, { status: 400 });
  }

  if (grade && isNaN(Number(grade))) {
    const response: APIResponse<null> = {
      data: null,
      status: "error",
      error: "grade must be a number",
    };
    return NextResponse.json(response, { status: 400 });
  }

  if (roleIds && !Array.isArray(roleIds)) {
    const response: APIResponse<null> = {
      data: null,
      status: "error",
      error: "role must be an array of role IDs",
    };
    return NextResponse.json(response, { status: 400 });
  }

  // if (roleIds && roleIds.some((roleId: string) => isNaN(Number(roleId)))) {
  //   const response: APIResponse<null> = {
  //     data: null,
  //     status: "error",
  //     error: "each role ID must be a number",
  //   };
  //   return NextResponse.json(response, { status: 400 });
  // }

  try {
    let res;
    if (grade) {
      res = await prisma.user.update({
        where: { id: String(id) },
        data: {
          grade: Number(grade),
        },
      });
    }
    if (!roleIds || roleIds.length === 0) {
      console.log(
        "New grade created successfully. Skipping update of user roles: no roleIds provided",
      );
      const response: APIResponse<typeof res> = {
        data: res,
        status: "success",
        error: null,
      };
      return NextResponse.json(response, { status: 200 });
    }

    const foundRoles = await prisma.role.findMany({
      where: {
        discordRoleId: {
          in: roleIds,
        },
      },
      select: {
        id: true,
      },
    });

    const internalRoleIds = foundRoles.map((role) => role.id);

    await prisma.userRole.deleteMany({
      where: { userId: String(id) },
    });

    res = await prisma.userRole.createMany({
      data: internalRoleIds.map((roleId: number) => ({
        userId: String(id),
        roleId: Number(roleId),
      })),
    });

    console.log("New roles assigned successfully to user");
    const response: APIResponse<typeof res> = {
      data: res,
      status: "success",
      error: null,
    };
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    // return NextResponse.json({ error: "no action taken" }, { status: 400 });
    console.error("API Error: ", error);
    const response: APIResponse<null> = {
      data: null,
      status: "error",
      error: "Failed to create role",
    };
    return NextResponse.json(response, { status: 500 });
  }
}
