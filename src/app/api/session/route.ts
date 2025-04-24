import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getUserUsingSession } from "@/app/actions";

const prisma = new PrismaClient();

export async function GET() {
  console.log("Getting session data...");

  try {
    const sessionUser = await getUserUsingSession();
    if (!sessionUser) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // const id = session?.user.id;
    const id = sessionUser.id;

    const userFromTable = await prisma.user.findUnique({
      where: {
        id: String(id),
      },
      select: {
        name: true,
        grade: true,
        Role: {
          select: {
            isAdmin: true,
            isCL: true,
            isSL: true,
            isMeal: true,
            isEquipment: true,
            isWeather: true,
          },
        },
      },
    });

    if (!userFromTable) {
      return NextResponse.json(
        { error: "User not found in database" },
        { status: 404 },
      );
    }
    console.log("User found in database:", userFromTable);

    return NextResponse.json(
      { sucess: true, data: userFromTable },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error getting session data: ", error);
    return NextResponse.json(
      { error: "Error getting session data" },
      { status: 500 },
    );
  }
}
