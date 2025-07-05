import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (!code) {
    return NextResponse.redirect(`${origin}/`);
  }
  const supabase = await createClient();

  try {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    console.log("Exchange code for session: ", { data, error });
    if (error || !data) {
      return NextResponse.redirect(`${origin}/`);
    }

    if (data.user && data.user.email) {
      console.log("User data: ", data.user);

      if (!data.user.email.endsWith("@dc.tohoku.ac.jp")) {
        console.log("Unauthorized email domain: ", data.user.email);
        await supabase.auth.signOut();
        await supabase.auth.admin.deleteUser(data.user.id);
        return NextResponse.redirect(`${origin}/error?code=403`);
      }

      try {
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
      } catch (error) {
        console.error("Error upserting user: ", error);
        //continue authentication flow even if upsert fails
      }
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
  } catch (error) {
    console.log("Error during authentication callback: ", error);
    return NextResponse.redirect(`${origin}/error?code=500`);
  }
}
