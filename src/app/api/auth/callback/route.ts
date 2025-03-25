import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (!code) {
    return NextResponse.redirect("/");
  }
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (error || !data) {
      return NextResponse.redirect("/");
    }
    // const user = prisma.user.findUnique({
    //   where: { email: data.user.email },
    // })

    // if (!user) {
    //   await supabase.auth.signOut();
    //   //redirect to unauthorized page. change later
    //   return NextResponse.redirect("/");
    // }

    const forwardedHost = request.headers.get("x-forwarded-host"); // original origin before load balancer
    const isLocalEnv = process.env.NODE_ENV === "development";
    if (isLocalEnv) {
      // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
      return NextResponse.redirect(`${origin}${next}`);
    } else if (forwardedHost) {
      return NextResponse.redirect(`https://${forwardedHost}${next}`);
    } else {
      return NextResponse.redirect(`${origin}${next}`);
    }

    // return the user to an error page with instructions
    // return NextResponse.redirect(`${origin}/auth/auth-code-error`);
  } catch (error) {
    console.error("unexpected error during callback", error);
    return NextResponse.redirect("/");
  }
}
