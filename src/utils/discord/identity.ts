import type { UserIdentity } from "@supabase/supabase-js";

export function findDiscordIdentity(
  identities: UserIdentity[] | undefined,
): UserIdentity | undefined {
  return identities?.find((identity) => identity.provider === "discord");
}

export function getDiscordUserId(
  identity: UserIdentity | undefined,
): string | null {
  if (!identity) {
    return null;
  }

  const identityData = identity.identity_data as
    | { sub?: string; provider_id?: string }
    | undefined;

  return (
    identityData?.sub ||
    identityData?.provider_id ||
    identity.provider_id ||
    null
  );
}
