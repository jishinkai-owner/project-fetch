import { getUserfromSession } from "@/app/actions";

export async function checkLinked() {
  try {
    const user = await getUserfromSession();
    if (!user) {
      return false;
    }
    const isDiscordLinked = user.identities?.some(
      (identity) => identity.provider === "discord"
    );
    if (isDiscordLinked) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Unexpected error: ", error);
    return false;
  }
}
