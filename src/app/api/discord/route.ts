import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { authenticateRequest } from "@/utils/supabase/auth";
import { APIResponse } from "@/types/response";

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
  // const { id } = await req.json();
  const id = req.nextUrl.searchParams.get("id");

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

    const roles: string[] = res.data.roles;

    console.log("Discord roles retrieved successfully:", roles);

    const response: APIResponse<typeof roles> = {
      data: roles,
      status: "success",
      error: null,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("API Error: ", error);
    const response: APIResponse<null> = {
      data: null,
      status: "error",
      error: "Failed to fetch Discord roles",
    };
    return NextResponse.json(response, { status: 500 });
  }
}
