import { RecordProps } from "@/types/record";
import RecordCard from "@/components/shared/record-card";
import React from "react";

const PostHikeCard = (postHike: RecordProps) => {
  return (
    <RecordCard
      key={postHike.id}
      buttonTitle={"反省を見る"}
      title={postHike.place || "山行"}
      description={`${postHike.year}/${postHike.date}`}
      pushUrl={`/club-members/post-hikes/view/${postHike.id}`}
    />
  );
};

export default PostHikeCard;
