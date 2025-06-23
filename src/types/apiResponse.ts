import { PostHikeContent, Record, Role } from "@prisma/client";

export type RecordAuthorRes = {
  title: string | null;
  content: string | null;
  images: string[] | null;
  filename: string | null;
  recordId: number;
  authorId: string | null;
};

export type RecordsAuthorRes = {
  id: number;
  title: string | null;
  content: string | null;
  Record: Record;
};

export type RecordRes = {
  id: number;
  year: number | null;
  place: string | null;
  date: string | null;
};

export type ContentRes = {
  title: string | null;
  content: string | null;
  recordId: number | null;
};

export type UserRes = {
  id: string;
  name: string;
  grade: number | null;
  Role: Role | null;
};

export type PostHikeContentRes = {
  id: number;
  equipmentPerson: string | null;
  weatherPerson: string | null;
  mealPerson: string | null;
  sl: string | null;
  equipmentComment: string | null;
  weatherComment: string | null;
  mealComment: string | null;
  slComemnt: string | null;
  impression: string[];
  recordId: number;
  clId: string;
  clName: string | null;
};

export type PostHikeContentResWithRecord = {
  id: number;
  year: number | null;
  place: string | null;
  date: string | null;
  PostHikeContents: PostHikeContent[];
};

export type ActivityRes = {
  data: {
    id: number;
    year: number | null;
    place: string | null;
    date: string | null;
    activityType: string | null;
  };
};

export type ActivitiesRes = {
  id: number;
  year: number | null;
  place: string | null;
  date: string | null;
};

export type ActivityWithIdRes = {
  id: number;
  year: number | null;
  place: string | null;
  date: string | null;
  activityType: string | null;
};

export type CLRes = {
  userId: string;
  User: {
    name: string;
  };
};

export type FlickrPhotoSize = {
  label: string;
  width: number;
  height: number;
  source: string;
  url: string;
  media: string;
};
