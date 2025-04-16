import { checkLinked } from "@/utils/discord/checkLinked";
import { useMemo } from "react";

export const useLinked = () => {
  const isLinked = checkLinked();
  const isLinkedMemo = useMemo(() => isLinked, [isLinked]);
  return { isLinked: isLinkedMemo };
};
