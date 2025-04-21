import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  CardActions,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { MouseEvent } from "react";
import DeleteDialog from "../delete-dialog";
import { useDeleteDialog } from "../delete-dialog/hook";

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
  const { open, handleOpen } = useDeleteDialog();

  return (
    <Box sx={{ minWidth: 200 }}>
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h5" component="div">
            {title}
          </Typography>
          <Typography sx={{ color: "text.secondary", mb: 1.5 }}>
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
                handleOpen();
                // if (onDelete !== undefined) onDelete();
              }}
            >
              削除
            </Button>
          )}
          <Button
            size="small"
            onClick={(e: MouseEvent<HTMLButtonElement>) => {
              e.stopPropagation();
              router.push(`${pushUrl}`);
            }}
          >
            {buttonTitle}
          </Button>
        </CardActions>
      </Card>
      <DeleteDialog open={open} handleOpen={handleOpen} onDelete={onDelete} />
    </Box>
  );
};

export default RecordCard;
