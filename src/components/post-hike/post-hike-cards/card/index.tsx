import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  CardActions,
} from "@mui/material";
import { Fragment } from "react";
import { RecordProps } from "@/types/record";

const PostHikeCard = (postHike: RecordProps) => {
  return (
    <Box sx={{ minWidth: 200 }}>
      <Card variant="outlined">
        <Fragment>
          <CardContent>
            <Typography variant="h5" component="div">
              {postHike.place}
            </Typography>
            <Typography sx={{ color: "text.secondary", mb: 1.5 }}>
              {postHike.year}/{postHike.date}
            </Typography>
            <Typography variant="body2">well meaning and kindly.</Typography>
          </CardContent>
          <CardActions>
            <Button size="small">反省を見る</Button>
          </CardActions>
        </Fragment>
      </Card>
    </Box>
  );
};

export default PostHikeCard;
