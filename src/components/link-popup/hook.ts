import { checkLinked } from "@/utils/discord/checkLinked";
import { useState, useEffect } from "react";
import { getDiscordInfo } from "@/app/actions";
import { RolesState } from "@/types/user";
import { role_map } from "@/utils/discord/constants";
import useData from "@/lib/swr/useSWR";
import { useMemo } from "react";
import axios from "axios";

export const useLinked = (
  roles: RolesState,
  userId?: string | null,
  grade?: number | null,
  // role?: RoleType | null,
  isLoading: boolean = false,
  isError: boolean = false,
) => {
  const [isLinked, setIsLinked] = useState(false);
  // const [id, setId] = useState<string | null>(null);
  const [discordId, setDiscordId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const checkIfLinked = async () => {
      try {
        const linked = await checkLinked();
        setIsLinked(linked);
        setOpen(!linked);
      } catch (error) {
        console.error("Error checking linked status: ", error);
      }
    };
    checkIfLinked();
  }, []);

  useEffect(() => {
    const fetchDiscordId = async () => {
      const discordInfo = await getDiscordInfo();
      const id = discordInfo?.userIdentity?.id || null;

      if (id) {
        setDiscordId(id);
      }
    };
    if (isLinked) {
      fetchDiscordId();
    }
  }, [isLinked]);

  const {
    grade: discordGrade,
    roles: discordRoles,
    rolesRaw: discordRolesRaw,
    isLoading: isDiscordLoading,
    isError: isDiscordError,
  } = useUserRoles(discordId);

  useEffect(() => {
    const syncRoles = async () => {
      // const discordInfo = await getDiscordInfo();
      // const discordId = discordInfo?.userIdentity?.id;
      if (
        isLoading ||
        isError ||
        isDiscordLoading ||
        isDiscordError ||
        !discordId ||
        !userId
      ) {
        return;
      }

      console.log("Syncing roles...");

      try {
        if (grade !== discordGrade) {
          console.log("updating grade!");
          await postRoles(userId, discordGrade, null);
        }

        const shouldUpdateRoles =
          discordRoles.isAdmin !== roles.isAdmin ||
          discordRoles.isCL !== roles.isCL ||
          discordRoles.isSL !== roles.isSL ||
          discordRoles.isWeather !== roles.isWeather ||
          discordRoles.isMeal !== roles.isMeal ||
          discordRoles.isEquipment !== roles.isEquipment;

        if (shouldUpdateRoles) {
          console.log("updating roles!", discordRolesRaw);
          await postRoles(userId, null, discordRolesRaw);
        }
      } catch (error) {
        console.error("Error fetching and posting Discord roles: ", error);
      }
    };
    syncRoles();
  }, [
    isLoading,
    isError,
    isDiscordLoading,
    isDiscordError,
    discordId,
    userId,
    grade,
    roles,
    discordGrade,
    discordRoles,
    discordRolesRaw,
  ]);

  return { open };
};

const INITIAL_ROLES: RolesState = {
  isAdmin: false,
  isCL: false,
  isSL: false,
  isWeather: false,
  isMeal: false,
  isEquipment: false,
};

export const useUserRoles = (id: string | null) => {
  const { data, isError, isLoading } = useData<string[]>(
    id ? `/api/discord?id=${id}` : "",
  );

  const result = useMemo(() => {
    if (!data?.data) {
      return {
        grade: null,
        roles: INITIAL_ROLES,
        rolesRaw: [],
      };
    }

    const [roles, grade] = roleIdsToRolesStateAndGrade(data.data);

    console.log("Fetched user roles: ", { grade, roles });

    return {
      grade,
      roles,
      rolesRaw: data.data,
    };
  }, [data]);

  return {
    grade: result.grade,
    roles: result.roles,
    rolesRaw: result.rolesRaw,
    isLoading,
    isError,
  };
};

type RolesAndGrade = [RolesState, number | null];

const roleIdsToRolesStateAndGrade = (roleIds: string[]): RolesAndGrade => {
  const roles: RolesState = { ...INITIAL_ROLES };
  let grade: number | null = null;

  roleIds.forEach((roleId: string) => {
    const roleValue = role_map[roleId];

    if (typeof roleValue === "string" && roleValue in roles) {
      roles[roleValue as keyof RolesState] = true;
    } else if (typeof roleValue === "number" && grade === null) {
      grade = roleValue;
    }
  });

  return [roles, grade];
};

const postRoles = async (
  id: string,
  grade: number | null,
  rolesRaw: string[] | null,
) => {
  try {
    const res = await axios.put("/api/roles", {
      id: id,
      grade: grade,
      roleIds: rolesRaw,
    });
    if (res.status === 201) {
      console.log("Roles posted successfully");
      return { success: true };
    }
    return { success: false, error: "Failed to post roles" };
  } catch (error) {
    console.error("Error posting roles: ", error);
    throw error;
  }
};
