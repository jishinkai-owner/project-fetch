import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
  const { id } = await req.json();

  if (!id) {
    return NextResponse.json(
      { error: "user's id is required" },
      { status: 400 },
    );
  }

  try {
    const res = await axios.get(
      `https://discord.com/api/v10/guilds/${process.env.DISCORD_GUILD_ID}/members/${id}`,
      {
        headers: {
          Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
        },
      },
    );

    const roles = res.data.roles;

    console.log("Roles retrieved successfully:", roles);

    return NextResponse.json(
      {
        success: true,
        roles: roles,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("API Error: ", error);
    return NextResponse.json(
      { error: "error while retrieving roles from discord" },
      { status: 500 },
    );
  }
}
