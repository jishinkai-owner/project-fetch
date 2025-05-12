"use server";
import { createClient } from "./server";

export async function getUserData() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      console.error("Error fetching user data:", error);
      return null;
    }
    if (!user) {
      console.error("No user data found");
      return null;
    }
    return {
      id: user.id,
      email: user.email,
    };
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
}
