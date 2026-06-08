import { createClient } from "@/utils/supabase/server";
import { findDiscordIdentity } from "@/utils/discord/identity";

export async function checkLinked() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUserIdentities();

    if (error || !data?.identities) {
      return false;
    }

    return Boolean(findDiscordIdentity(data.identities));
  } catch (error) {
    console.error("Unexpected error: ", error);
    return false;
  }
}
