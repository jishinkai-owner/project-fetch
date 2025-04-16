import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  CardActions,
} from "@mui/material";
import { Fragment } from "react";
import { useRouter } from "next/navigation";
import { MouseEvent } from "react";

type RecordCardProps = {
  buttonTitle: string;
  title: string;
  description: string;
  pushUrl: string;
  includeDelete?: boolean;
  onDelete?: () => void;
};

const RecordCard = ({
  buttonTitle,
  title,
  description,
  pushUrl,
  includeDelete,
  onDelete,
}: RecordCardProps) => {
  const router = useRouter();

  return (
    <Box sx={{ minWidth: 200 }}>
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h5" component="div">
            {/* {record.place} */}
            {title}
          </Typography>
          <Typography sx={{ color: "text.secondary", mb: 1.5 }}>
            {/* {record.year}/{record.date} */}
            {description}
          </Typography>
          <Typography variant="body2">well meaning and kindly.</Typography>
        </CardContent>
        <CardActions>
          {includeDelete && (
            <Button
              size="small"
              onClick={(e: MouseEvent<HTMLButtonElement>) => {
                e.stopPropagation();
                onDelete && onDelete();
              }}
            >
              削除
            </Button>
          )}
          <Button
            size="small"
            onClick={(e: MouseEvent<HTMLButtonElement>) => {
              e.stopPropagation();
              // router.push(`/${pushUrl}/${pushParams}`);
              router.push(`${pushUrl}`);
              // router.push(`/${pushUrl}?id=${pushParams}`);
            }}
          >
            {buttonTitle}
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
};

export default RecordCard;
