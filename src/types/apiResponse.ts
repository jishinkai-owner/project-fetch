import { PostHikeContent, Record, Content, Role, User } from "@prisma/client";
import { Diff } from "./diff";
import { ActivityType } from "@/app/(mainLayout)/record/[type]/activityTypes";

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

// export type RecordRes = {
//   id: number;
//   year: number | null;
//   place: string | null;
//   date: string | null;
// };

export type RecordRes = Diff<
  Record,
  {
    activityType: ActivityType | null;
  }
>;

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
//   name: string;
//   grade: number | null;
//   Role: Role | null;
// };

export type UserRes = Diff<
  User,
  {
    email: string;
    createdAt: Date;
    updatedAt: Date;
    Content: Content[];
    PostHikeContents: PostHikeContent[];
  }
> &
  Diff<
    Role,
    {
      description: string | null;
    }
  >;

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

export type PostHikeRes = PostHikeContentBaseRes &
  Diff<
    Record,
    {
      id: number;
      activityType: ActivityType | null;
      details: string | null;
    }
  > &
  Diff<
    User,
    {
      email: string;
      id: string;
      createdAt: Date;
      grade: number | null;
      updatedAt: Date;
    }
  >;

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
