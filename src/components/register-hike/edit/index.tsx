import { Alert } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { ErrorMessage, Loading } from "@/components/load-status";
import { useMemo } from "react";
import RecordCard from "@/components/shared/record-card";
import { RecordProps } from "@/types/record";
import { useFormDelete } from "../hook";
import { useSnackbar } from "@/components/snackbar/hook";
import SubmitSnackbar from "@/components/snackbar";
import { useActivities } from "../hook";

// type RegisterHikeEditProps = {
//   setMessage: Dispatch<SetStateAction<string>>;
//   setOpen: Dispatch<SetStateAction<boolean>>;
//   setStatus: Dispatch<SetStateAction<"success" | "error">>;
// };

const RegisterHikeEdit = () => {
  const { activities, isLoadingActivities, isErrorActivities } =
    useActivities();
  const { open, setOpen, message, setMessage, handleClose, status, setStatus } =
    useSnackbar();
  const deleteForm = useFormDelete({ setMessage, setOpen, setStatus });

  const Card = useMemo(() => {
    if (activities.length === 0)
      return (
        <Alert
          severity="info"
          sx={{
            width: "100%",
            textAlign: "center",
          }}
        >
          記録がありません
        </Alert>
      );
    return activities.map((e: RecordProps) => (
      <RecordCard
        key={e.id}
        buttonTitle={"編集する"}
        title={e.place || "不明"}
        description={`${e.year}/${e.date}`}
        pushUrl={`/club-members/register-hikes/edit?id=${e.id}`}
        includeDelete
        onDelete={() => {
          deleteForm(e.id);
        }}
      />
    ));
  }, [deleteForm, activities]);

  if (isErrorActivities) return <ErrorMessage />;

  return (
    <>
      <Grid
        container
        spacing={{ md: 4, sm: 2, xs: 1 }}
        columns={{ md: 2, sm: 1 }}
        sx={{
          justifyContent: "center",
        }}
      >
        {isLoadingActivities ? <Loading /> : Card}
      </Grid>
      <SubmitSnackbar
        open={open}
        handleClose={handleClose}
        message={message}
        status={status}
      />
    </>
  );
};

export default RegisterHikeEdit;
