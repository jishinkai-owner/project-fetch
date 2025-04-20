import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(req: NextRequest) {
  const { id, grade, role } = await req.json();

  console.log("Posting new role...", { id, grade, role });
  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  if (!grade && !role) {
    return NextResponse.json(
      { error: "grade or role is required" },
      { status: 400 }
    );
  }
  try {
    if (grade) {
      const newGrade = await prisma.user.update({
        where: { id: String(id) },
        data: {
          grade: grade,
        },
      });

      if (!newGrade) {
        return NextResponse.json(
          { error: "Failed to update grade" },
          { status: 400 }
        );
      }
      if (!role) {
        console.log("New grade created successfully:", newGrade);
        return NextResponse.json(
          { success: true, data: newGrade },
          { status: 200 }
        );
      }
    }

    if (role) {
      const newRole = await prisma.role.upsert({
        where: { userId: id },
        update: {
          userId: id,
          isAdmin: role.isAdmin,
          isCL: role.isCL,
          isSL: role.isSL,
          isMeal: role.isMeal,
          isEquipment: role.isEquipment,
          isWeather: role.isWeather,
        },
        create: {
          userId: id,
          isAdmin: role.isAdmin,
          isCL: role.isCL,
          isSL: role.isSL,
          isMeal: role.isMeal,
          isEquipment: role.isEquipment,
          isWeather: role.isWeather,
        },
      });
      if (!newRole) {
        return NextResponse.json(
          { error: "Failed to create or update role" },
          { status: 400 }
        );
      }
      console.log("New role created successfully:", newRole);
      return NextResponse.json(
        { success: true, data: newRole },
        { status: 200 }
      );
    }

    return NextResponse.json({ error: "no action taken" }, { status: 400 });
  } catch (error) {
    console.error("API Error: ", error);
    return NextResponse.json(
      { error: "Failed to create role", details: error },
      { status: 500 }
    );
  }
}
