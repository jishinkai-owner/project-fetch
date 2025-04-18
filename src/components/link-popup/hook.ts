import { checkLinked } from "@/utils/discord/checkLinked";
import { useState, useEffect } from "react";
import { getDiscordInfo } from "@/app/actions";
import { getUserRoles } from "@/utils/discord/getRoles";

type RoleMap = {
  [key: string]: boolean;
};

export const useLinked = () => {
  const [isLinked, setIsLinked] = useState(false);
  const [id, setId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [discordData, setDiscordData] = useState<RoleMap>({});

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
    const fetchDiscordInfo = async () => {
      if (isLinked) {
        try {
          const discordInfo = await getDiscordInfo();
          const id = discordInfo?.userIdentity?.id;
          id && setId(id);
        } catch (error) {
          console.error("Error fetching Discord info: ", error);
        }
      }
    };
    fetchDiscordInfo();
  }, [isLinked]);

  useEffect(() => {
    const fetchRoles = async () => {
      if (id) {
        try {
          const data = await getUserRoles(id);
          setDiscordData(data);
        } catch (error) {
          console.error("Error fetching Discord roles: ", error);
        }
      }
    };

    fetchRoles();
  }, [id]);

  return { isLinked, open, setOpen, id, setId, discordData, setDiscordData };
};
