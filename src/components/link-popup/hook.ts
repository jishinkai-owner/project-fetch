import { checkLinked } from "@/utils/discord/checkLinked";
import { useState, useEffect } from "react";
import { getDiscordInfo } from "@/app/actions";
import { getUserRoles } from "@/utils/discord/getRoles";
import { RoleType } from "@/types/user";
import { postRoles } from "@/utils/discord/postRoles";

export const useLinked = (
  userId?: string | null,
  grade?: number | null,
  role?: RoleType | null,
  isLoading: boolean = false,
  isError: boolean = false,
) => {
  const [isLinked, setIsLinked] = useState(false);
  // const [id, setId] = useState<string | null>(null);
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
    console.log("fetchandpost useeffect is running");
    const fetchAndPostRoles = async () => {
      if (isLinked) {
        try {
          const discordInfo = await getDiscordInfo();
          const discordId = discordInfo?.userIdentity?.id;

          if (discordId) {
            // const data = await getUserRoles(id);
            const data = await getUserRoles(discordId);

            if (data.grade !== grade) {
              console.log(
                "Grades do not match, posting new grades... ",
                data.grade,
              );
              await postRoles(userId, data.grade, null);
            }

            const shouldUpdateRoles =
              data.Role.isAdmin !== role?.isAdmin ||
              data.Role.isCL !== role?.isCL ||
              data.Role.isSL !== role?.isSL ||
              data.Role.isWeather !== role?.isWeather ||
              data.Role.isMeal !== role?.isMeal ||
              data.Role.isEquipment !== role?.isEquipment;

            if (shouldUpdateRoles) {
              console.log(
                "Roles do not match, posting new roles... ",
                data.Role,
              );
              await postRoles(userId, null, data.Role);
            }
          }
        } catch (error) {
          console.error("Error fetching and posting Discord roles: ", error);
        }
      }
    };

    if (!isLoading && !isError) {
      fetchAndPostRoles();
    }
  }, [isLinked, userId, grade, role, isLoading, isError]);

  return { open };
};
