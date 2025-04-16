// import { getUserData } from "@/utils/supabase/user";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getUser } from "@/app/actions";

const prisma = new PrismaClient();

//get user data including id, name, and role
export async function GET() {
  try {
    console.log("Getting user data...");

    // const userData = await getUserData();
    const id = await getUser();
    if (!id) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    // if (!userData) {
    //   return NextResponse.json({ error: "User not found" }, { status: 404 });
    // }
    // const { id } = userData;

    console.log("User data retrieved successfully:", id);

    const userFromTable = await prisma.user.findUnique({
      where: {
        id: String(id),
      },
      select: {
        id: true,
        name: true,
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
        { status: 404 }
      );
    }
    console.log("User found in database:", userFromTable);

    return NextResponse.json(
      {
        success: true,
        data: {
          id: userFromTable.id,
          name: userFromTable.name,
          isAdmin: userFromTable.Role?.isAdmin,
          isCL: userFromTable.Role?.isCL,
          isSL: userFromTable.Role?.isSL,
          isMeal: userFromTable.Role?.isMeal,
          isEquipment: userFromTable.Role?.isEquipment,
          isWeather: userFromTable.Role?.isWeather,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("API Error: ", error);
    return NextResponse.json(
      { error: "Failed to fetch user data", details: error },
      { status: 500 }
    );
  }
}
