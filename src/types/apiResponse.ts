import { PostHikeContent, Record, Content, User } from "@prisma/client";
import { Diff } from "./diff";
import { ActivityType } from "@/app/(mainLayout)/record/[type]/activityTypes";

// export type RecordAuthorRes = {
//   title: string | null;
//   content: string | null;
//   images: string[] | null;
//   filename: string | null;
//   recordId: number;
//   authorId: string | null;
// };

// export type RecordsAuthorRes = {
//   id: number;
//   title: string | null;
//   content: string | null;
//   Record: Record;
// };

export type AuthoredRecordRes = Diff<
  Content,
  {
    content: string | null;
    images: string[];
    filename: string | null;
    recordId: number;
  }
> &
  Diff<
    Record,
    {
      id: number;
      activityType: ActivityType | null;
      details: string | null;
    }
  >;

// export type RecordRes = {
//   id: number;
//   year: number | null;
//   place: string | null;
//   date: string | null;
// };

export type RecordRes = Record;

// export type ContentRes = {
//   title: string | null;
//   content: string | null;
//   recordId: number | null;
// };
export type ContentRes = Diff<
  Content,
  {
    images: string[];
    filename: string;
  }
> &
  Diff<
    Record,
    {
      id: number;
      activityType: ActivityType | null;
      details: string | null;
    }
  >;

// export type UserRes = {
//   id: string;
//   name: string1;
//   grade: number | null;
//   Role: Role | null;
// };
export type Role = {
  name: string;
};

export type UserRes = Diff<
  User,
  {
    email: string;
    createdAt: Date;
    updatedAt: Date;
    Content: Content[];
    PostHikeContents: PostHikeContent[];
  }
> & {
  roles: Role[];
};

// export type PostHikeContentRes = {
//   id: number;
//   equipmentPerson: string | null;
//   weatherPerson: string | null;
//   mealPerson: string | null;
//   sl: string | null;
//   equipmentComment: string | null;
//   weatherComment: string | null;
//   mealComment: string | null;
//   slComemnt: string | null;
//   impression: string[];
//   recordId: number;
//   clId: string;
//   clName: string | null;
// };

export type CLComments = {
  equipment: string | null;
  weather: string | null;
  meal: string | null;
  sl: string | null;
};

export type RoleComments = {
  equipment: string | null;
  weather: string | null;
  meal: string | null;
  sl: string | null;
};

export type PostHikeContentBaseRes = Diff<
  PostHikeContent,
  {
    sl: string | null;
    equipmentPerson: string | null;
    weatherPerson: string | null;
    mealPerson: string | null;
    slComment: string | null;
    equipmentComment: string | null;
    weatherComment: string | null;
    mealComment: string | null;
  }
> & {
  clComments: CLComments;
  roleComments: RoleComments;
};

// export type PostHikeRes = Diff<Record, {}
export type PostHikeRes = Diff<
  Record,
  {
    id: number;
    activityType: ActivityType | null;
    details: string | null;
  }
> & {
  postHikeContents: (PostHikeContentBaseRes & { clName: string })[];
};

// export type PostHikeRes = PostHikeContentBaseRes &
//   Diff<
//     Record,
//     {
//       id: number;
//       activityType: ActivityType | null;
//       details: string | null;
//     }
//   > &
//   Diff<
//     User,
//     {
//       email: string;
//       id: string;
//       createdAt: Date;
//       grade: number | null;
//       updatedAt: Date;
//     }
//   >;

export type PostHikeOverviewRes = {
  id: string;
} & Diff<
  Record,
  {
    id: number;
    activityType: ActivityType | null;
    details: string | null;
  }
>;

// export type PostHikeContentResWithRecord = {
//   id: number;
//   year: number | null;
//   place: string | null;
//   date: string | null;
//   PostHikeContents: PostHikeContent[];
// };
//
// export type ActivityRes = {
//   data: {
//     id: number;
//     year: number | null;
//     place: string | null;
//     date: string | null;
//     activityType: string | null;
//   };
// };
//
// export type ActivitiesRes = {
//   id: number;
//   year: number | null;
//   place: string | null;
//   date: string | null;
// };
//
// export type ActivityWithIdRes = {
//   id: number;
//   year: number | null;
//   place: string | null;
//   date: string | null;
//   activityType: string | null;
// };

export type CLRes = {
  userId: string;
  User: {
    name: string;
  };
};
