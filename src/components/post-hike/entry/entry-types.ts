import { upsertNamedEntry } from "../role-entries";

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

export type ClCommentDrafts = {
  meal: string;
  equipment: string;
  weather: string;
  sl: string;
};

export const CL_COMMENT_SECTIONS = [
  {
    role: "食事係",
    reflectionKey: "mealPerson",
    commentKey: "mealComment",
    draftKey: "meal",
    label: "コメント - 食事係",
  },
  {
    role: "装備係",
    reflectionKey: "equipmentPerson",
    commentKey: "equipmentComment",
    draftKey: "equipment",
    label: "コメント - 装備係",
  },
  {
    role: "天気図係",
    reflectionKey: "weatherPerson",
    commentKey: "weatherComment",
    draftKey: "weather",
    label: "コメント - 天気図係",
  },
  {
    role: "SL",
    reflectionKey: "sl",
    commentKey: "slComment",
    draftKey: "sl",
    label: "コメント - SL",
  },
] as const;

export type EntryType = (typeof ENTRY_TYPE_OPTIONS)[number]["value"];

type RoleFieldKey = "mealPerson" | "equipmentPerson" | "weatherPerson" | "sl";

const ROLE_FIELD_MAP: Record<
  Exclude<EntryType, "cl" | "impression">,
  RoleFieldKey
> = {
  meal: "mealPerson",
  equipment: "equipmentPerson",
  weather: "weatherPerson",
  sl: "sl",
};

export const getRoleFieldKey = (type: EntryType): RoleFieldKey | null => {
  if (type === "cl" || type === "impression") return null;
  return ROLE_FIELD_MAP[type];
};

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
  authorName: string,
  body: string,
  entries: PostHikeContentProps,
) => {
  const payload: Record<string, string | number> = { clId, recordId };
  const trimmedBody = body.trim();
  const trimmedName = authorName.trim();

  if (type === "impression") {
    if (trimmedBody) {
      payload.impression = trimmedName
        ? upsertNamedEntry(entries.impression, trimmedName, trimmedBody)
        : trimmedBody;
    }
    return payload;
  }

  const fieldKey = getRoleFieldKey(type);
  if (!fieldKey || !trimmedBody || !trimmedName) return payload;

  const merged = upsertNamedEntry(entries[fieldKey], trimmedName, trimmedBody);

  switch (type) {
    case "meal":
      payload.reflectionMeal = merged;
      break;
    case "equipment":
      payload.reflectionEquipment = merged;
      break;
    case "weather":
      payload.reflectionWeather = merged;
      break;
    case "sl":
      payload.reflectionSL = merged;
      break;
  }

  return payload;
};

export const buildClCommentsPayload = (
  clId: string,
  recordId: number,
  authorName: string,
  entries: PostHikeContentProps,
  drafts: ClCommentDrafts,
) => {
  const payload: Record<string, string | number> = { clId, recordId };
  const trimmedName = authorName.trim();
  if (!trimmedName) return payload;

  const addComment = (
    apiKey: string,
    existing: string | null,
    comment: string,
  ) => {
    const trimmed = comment.trim();
    if (!trimmed) return;
    payload[apiKey] = upsertNamedEntry(existing, trimmedName, trimmed);
  };

  addComment("commentMeal", entries.mealComment, drafts.meal);
  addComment("commentEquipment", entries.equipmentComment, drafts.equipment);
  addComment("commentWeather", entries.weatherComment, drafts.weather);
  addComment("commentSL", entries.slComment, drafts.sl);

  return payload;
};
