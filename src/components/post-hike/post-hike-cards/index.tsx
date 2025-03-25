import PostHikeCard from "./card";
import Grid from "@mui/material/Grid2";
import usePostHikes from "../hook";
import { RecordProps } from "@/types/record";
import { Loading, ErrorMessage } from "@/components/load-status";
import { useEffect, useMemo } from "react";

const PostHikeCards = () => {
  const { postHikes, isLoading, isError } = usePostHikes();

  const Card = useMemo(() => {
    return postHikes.map((e: RecordProps) => (
      <PostHikeCard key={e.id} {...e} />
    ));
  }, [postHikes]);

  if (isError) return <ErrorMessage />;

  return (
    <Grid
      container
      spacing={{ md: 4, sm: 2, xs: 1 }}
      columns={{ md: 2, sm: 1 }}
      sx={{
        justifyContent: "center",
      }}
    >
      {isLoading ? <Loading /> : Card}
    </Grid>
  );
};

export default PostHikeCards;
