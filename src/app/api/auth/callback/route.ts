import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (!code) {
    return NextResponse.redirect(`${baseUrl}/`);
  }
  // try {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);
  console.log("Exchange code for session: ", { data, error });
  if (error || !data) {
    return NextResponse.redirect(`${baseUrl}/`);
  }

  if (data.user && data.user.email) {
    console.log("User data: ", data.user);
    await prisma.user.upsert({
      where: {
        id: data.user.id,
      },
      update: {},
      create: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata.name,
      },
    });
  }

  const forwardedHost = request.headers.get("x-forwarded-host");
  const isLocalEnv = process.env.NODE_ENV === "development";
  if (isLocalEnv) {
    return NextResponse.redirect(`${origin}${next}`);
  } else if (forwardedHost) {
    return NextResponse.redirect(`https://${forwardedHost}${next}`);
  } else {
    return NextResponse.redirect(`${origin}${next}`);
  }
}
