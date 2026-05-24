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
  { value: "impression", label: "感想" },
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
    case "impression":
      payload.impression = trimmed;
      break;
  }

  return payload;
};
