import { createClient } from "@/utils/supabase/client";

export async function checkLinked() {
  const supabase = createClient();
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) {
      console.error("Error fetching user data: ", userError);
      return false;
    }

    if (!userData.user) {
      console.error("User not found");
      return false;
    }

    const isDiscordLinked = userData.user.identities?.some(
      (identity) => identity.provider === "discord"
    );
    if (isDiscordLinked) {
      console.log("Discord account is linked.");
      return true;
    } else {
      console.log("Discord account is not linked.");
      return false;
    }
  } catch (error) {
    console.error("Unexpected error: ", error);
    return false;
  }
}
