export type HikeInfoEntryProps = {
  year: number | null;
  date: string | null;
  place: string | null;
  activityType: string | null;
};

export type PostHikeContentProps = {
  clName: string | null;
  equipmentPerson: string | null;
  weatherPerson: string | null;
  mealPerson: string | null;
  sl: string | null;
  equipmentComment: string | null;
  weatherComment: string | null;
  mealComment: string | null;
  slComment: string | null;
  impression: string | null;
  recordId: number | null;
  clId: string | null;
};

export type PostHikeContentGetProps = {
  clName: string | null;
  equipmentPerson: string | null;
  weatherPerson: string | null;
  mealPerson: string | null;
  sl: string | null;
  equipmentComment: string | null;
  weatherComment: string | null;
  mealComment: string | null;
  slComment: string | null;
  impression: string[];
  recordId: number | null;
  clId: string | null;
};
