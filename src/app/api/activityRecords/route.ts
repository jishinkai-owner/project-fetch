import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const records = await prisma.activityRecord.findMany();
  return NextResponse.json(records);
}
