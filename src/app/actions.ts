"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function login() {
  const supabase = await createClient();
  const nextUrl = "/club-members";
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `http://localhost:3000/api/auth/callback?next=${encodeURIComponent(
        nextUrl
      )}`,
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });

  if (error) {
    console.log("error while sign in: ", error);
  }
  if (data.url) {
    redirect(data.url);
  }
}

export async function logout() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("error while signing out: ", error);
  }

  redirect("/");
}

//link discord account to get role data
export async function linkDiscord() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.linkIdentity({
    provider: "discord",
    options: {
      redirectTo: "http://localhost:3000/club-members",
    },
  });
  if (error) {
    console.error("Error linking Discord: ", error);
  }
  if (data.url) {
    console.log("Redirecting to: ", data.url);
    redirect(data.url);
  }
}

export async function getUser() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    console.error("Error getting user: ", error);
    return null;
  }

  return data.user.id;
}

export async function getDiscordInfo() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    console.error("Error getting user: ", error);
    return null;
  }
  if (!data.user) {
    console.error("User not found");
    return null;
  }

  const discordIdentity = data.user.identities?.find(
    (identity) => identity.provider === "discord"
  );

  if (!discordIdentity) {
    console.error("Discord identity not found");
    return null;
  }

  const userIdentity = discordIdentity.identity_data;

  // const userId = userIdentity?.id;
  // const userName = userIdentity?.username;

  return {
    userIdentity,
  };
}
