import PostHikeComp from "@/components/post-hike";
import { UserContextProvider } from "@/providers/user";
import { Suspense } from "react";
import React from "react";

const PostHikePage = () => {
  return (
    <Suspense>
      <UserContextProvider>
        <PostHikeComp />
      </UserContextProvider>
    </Suspense>
  );
};

export default PostHikePage;
