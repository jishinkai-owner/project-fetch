//page for viewing post-hike entries.
import PostHikeViewComp from "@/components/post-hike/view";
import { ErrorMessage } from "@/components/load-status";
import React from "react";

const PostHikeView = async ({
  params,
}: {
  params: Promise<{ recordId: string }>;
}) => {
  const { recordId } = await params;

  if (!recordId) {
    return <ErrorMessage />;
  }

  return <PostHikeViewComp recordId={Number(recordId)} />;
};

export default PostHikeView;
