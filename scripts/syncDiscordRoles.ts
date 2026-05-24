/**
 * Discord サーバーのロールを DB（User / UserRole）に一括同期する。
 *
 * 使用方法:
 *   npx tsx scripts/syncDiscordRoles.ts          # 同期実行
 *   npx tsx scripts/syncDiscordRoles.ts --dry-run # 変更なしで確認のみ
 *
 * 必要な環境変数: DATABASE_URL, DISCORD_TOKEN, DISCORD_GUILD_ID,
 *   NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 */

import "dotenv/config";
import axios from "axios";
import { createClient } from "@supabase/supabase-js";
import { PrismaClient } from "@prisma/client";
import { role_map } from "../src/utils/discord/constants";

const prisma = new PrismaClient();
const dryRun = process.argv.includes("--dry-run");

const CL_DISCORD_ROLE_ID = "1091925379540852828";

type GuildMember = {
  user: { id: string; username: string; global_name?: string | null };
  roles: string[];
};

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

async function fetchAllGuildMembers(
  guildId: string,
  token: string,
): Promise<GuildMember[]> {
  const members: GuildMember[] = [];
  let after: string | undefined;

  while (true) {
    const res = await axios.get<GuildMember[]>(
      `https://discord.com/api/v10/guilds/${guildId}/members`,
      {
        params: { limit: 1000, ...(after ? { after } : {}) },
        headers: { Authorization: `Bot ${token}` },
      },
    );

    const batch = res.data;
    if (batch.length === 0) break;

    members.push(...batch);
    after = batch[batch.length - 1].user.id;
    if (batch.length < 1000) break;
  }

  return members;
}

function discordGrade(roleIds: string[]): number | null {
  let grade: number | null = null;
  for (const roleId of roleIds) {
    const mapped = role_map[roleId];
    if (typeof mapped === "number") {
      grade = mapped;
      break;
    }
  }
  return grade;
}

async function main() {
  const guildId = requireEnv("DISCORD_GUILD_ID");
  const discordToken = requireEnv("DISCORD_TOKEN");
  const supabaseUrl = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
  const serviceRoleKey = requireEnv("SUPABASE_SERVICE_ROLE_KEY");

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const dbRoles = await prisma.role.findMany({
    where: { discordRoleId: { not: null } },
    select: { id: true, name: true, discordRoleId: true },
  });
  const discordRoleIdToInternalId = new Map(
    dbRoles.map((r) => [r.discordRoleId!, r.id]),
  );

  console.log(dryRun ? "=== DRY RUN ===" : "=== SYNC DISCORD ROLES ===");

  const guildMembers = await fetchAllGuildMembers(guildId, discordToken);
  const clOnDiscord = guildMembers.filter((m) =>
    m.roles.includes(CL_DISCORD_ROLE_ID),
  );
  console.log(`Discord CL ロール: ${clOnDiscord.length} 人`);
  clOnDiscord.forEach((m) => {
    const display = m.user.global_name || m.user.username;
    console.log(`  - ${display} (discord:${m.user.id})`);
  });

  // listUsers は identities を返さないことがあるため、DB ユーザーごとに取得する
  const discordIdToUserId = new Map<string, string>();
  const dbUsers = await prisma.user.findMany({ select: { id: true, name: true } });

  for (const dbUser of dbUsers) {
    const { data, error } = await supabase.auth.admin.getUserById(dbUser.id);
    if (error || !data.user) continue;

    const discordIdentity = data.user.identities?.find(
      (i) => i.provider === "discord",
    );
    const discordUserId =
      discordIdentity?.id ||
      (discordIdentity?.identity_data as { sub?: string } | undefined)?.sub ||
      (discordIdentity?.identity_data as { provider_id?: string } | undefined)
        ?.provider_id;

    if (discordUserId) {
      discordIdToUserId.set(discordUserId, dbUser.id);
    }
  }

  console.log(`Discord 連携済みサイトユーザー: ${discordIdToUserId.size} 人`);

  let synced = 0;
  let skippedNoAccount = 0;
  const syncedNames: string[] = [];

  for (const member of guildMembers) {
    const userId = discordIdToUserId.get(member.user.id);
    if (!userId) continue;

    const dbUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true },
    });
    if (!dbUser) continue;

    const internalRoleIds = member.roles
      .map((discordRoleId) => discordRoleIdToInternalId.get(discordRoleId))
      .filter((id): id is number => id !== undefined);

    const grade = discordGrade(member.roles);

    if (dryRun) {
      const roleNames = dbRoles
        .filter((r) => internalRoleIds.includes(r.id))
        .map((r) => r.name);
      console.log(
        `[dry-run] ${dbUser.name}: grade=${grade ?? "—"}, roles=[${roleNames.join(", ")}]`,
      );
      synced += 1;
      syncedNames.push(dbUser.name);
      continue;
    }

    if (grade !== null) {
      await prisma.user.update({
        where: { id: userId },
        data: { grade },
      });
    }

    await prisma.userRole.deleteMany({ where: { userId } });
    if (internalRoleIds.length > 0) {
      await prisma.userRole.createMany({
        data: internalRoleIds.map((roleId) => ({ userId, roleId })),
        skipDuplicates: true,
      });
    }

    synced += 1;
    syncedNames.push(dbUser.name);
  }

  for (const member of clOnDiscord) {
    if (!discordIdToUserId.has(member.user.id)) {
      skippedNoAccount += 1;
      const display = member.user.global_name || member.user.username;
      console.log(
        `  ⚠ 未同期（サイト未登録 or Discord未連携）: ${display}`,
      );
    }
  }

  const clInDb = await prisma.user.findMany({
    where: {
      UserRoles: { some: { Role: { name: "CL" } } },
    },
    select: { name: true },
    orderBy: { name: "asc" },
  });

  console.log(`\n同期した Discord 連携ユーザー: ${synced} 人`);
  if (!dryRun) {
    console.log(`DB 上の CL: ${clInDb.length} 人`);
    clInDb.forEach((u) => console.log(`  - ${u.name}`));
  }
  console.log(`Discord CL のうち未連携: ${skippedNoAccount} 人`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
