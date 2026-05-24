export type PostHikeContentProps = {
  clId: string | null;
  recordId: number | null;
  equipmentPerson: string | null;
  weatherPerson: string | null;
  mealPerson: string | null;
  sl: string | null;
  equipmentComment: string | null;
  weatherComment: string | null;
  mealComment: string | null;
  slComment: string | null;
  impression: string | null;
};

export const ENTRY_TYPE_OPTIONS = [
  { value: "meal", label: "食事係の反省" },
  { value: "equipment", label: "装備係の反省" },
  { value: "weather", label: "天気図係の反省" },
  { value: "sl", label: "SLの反省" },
  { value: "cl", label: "CL" },
  { value: "impression", label: "感想" },
] as const;

export const CL_COMMENT_SECTIONS = [
  {
    role: "食事係",
    reflectionKey: "mealPerson",
    commentKey: "mealComment",
    label: "コメント - 食事係",
  },
  {
    role: "装備係",
    reflectionKey: "equipmentPerson",
    commentKey: "equipmentComment",
    label: "コメント - 装備係",
  },
  {
    role: "天気図係",
    reflectionKey: "weatherPerson",
    commentKey: "weatherComment",
    label: "コメント - 天気図係",
  },
  {
    role: "SL",
    reflectionKey: "sl",
    commentKey: "slComment",
    label: "コメント - SL",
  },
] as const;

export type EntryType = (typeof ENTRY_TYPE_OPTIONS)[number]["value"];

export const getEntryValue = (
  type: EntryType,
  entries: PostHikeContentProps,
): string => {
  switch (type) {
    case "meal":
      return entries.mealPerson ?? "";
    case "equipment":
      return entries.equipmentPerson ?? "";
    case "weather":
      return entries.weatherPerson ?? "";
    case "sl":
      return entries.sl ?? "";
    case "cl":
      return "";
    case "impression":
      return entries.impression ?? "";
  }
};

export const setEntryValue = (
  type: EntryType,
  value: string,
  entries: PostHikeContentProps,
): PostHikeContentProps => {
  switch (type) {
    case "meal":
      return { ...entries, mealPerson: value };
    case "equipment":
      return { ...entries, equipmentPerson: value };
    case "weather":
      return { ...entries, weatherPerson: value };
    case "sl":
      return { ...entries, sl: value };
    case "cl":
      return entries;
    case "impression":
      return { ...entries, impression: value };
  }
};

export const buildSubmitPayload = (
  clId: string,
  recordId: number,
  type: EntryType,
  value: string,
) => {
  const payload: Record<string, string | number> = { clId, recordId };
  const trimmed = value.trim();

  switch (type) {
    case "meal":
      payload.reflectionMeal = trimmed;
      break;
    case "equipment":
      payload.reflectionEquipment = trimmed;
      break;
    case "weather":
      payload.reflectionWeather = trimmed;
      break;
    case "sl":
      payload.reflectionSL = trimmed;
      break;
    case "cl":
      break;
    case "impression":
      payload.impression = trimmed;
      break;
  }

  return payload;
};

export const buildClCommentsPayload = (
  clId: string,
  recordId: number,
  entries: PostHikeContentProps,
) => {
  const payload: Record<string, string | number> = { clId, recordId };

  const addComment = (apiKey: string, value: string | null) => {
    const trimmed = value?.trim();
    if (trimmed) {
      payload[apiKey] = trimmed;
    }
  };

  addComment("commentMeal", entries.mealComment);
  addComment("commentEquipment", entries.equipmentComment);
  addComment("commentWeather", entries.weatherComment);
  addComment("commentSL", entries.slComment);

  return payload;
};
