import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    console.log("Getting members with CL role...");

    const clMembers = await prisma.role.findMany({
      where: {
        isCL: true,
      },
      select: {
        userId: true,
        User: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!clMembers || clMembers.length === 0) {
      return NextResponse.json(
        { error: "No CL members found" },
        { status: 404 }
      );
    }
    console.log("CL members retrieved successfully:", clMembers);
    const clMembersWithName = clMembers.map((member) => ({
      userId: member.userId,
      name: member.User.name,
    }));
    return NextResponse.json(
      {
        success: true,
        data: clMembersWithName,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("API Error: ", error);
    return NextResponse.json(
      { error: "Failed to fetch CL members", details: error },
      { status: 500 }
    );
  }
}
