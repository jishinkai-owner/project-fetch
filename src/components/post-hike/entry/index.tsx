import { Button, Stack, Box } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { ChangeEvent } from "react";
import { useEntriesState, useCL } from "../hook";
import { useUserContext } from "@/providers/user";
import EntryTextField from "./entry-textfield";
import { Loading, ErrorMessage } from "@/components/load-status";
import CLSelect from "./cl-select";
import HikeSelect from "./hike-select";
import { usePostHikes } from "../hook";
import { useSnackbar } from "@/components/snackbar/hook";
import SubmitSnackbar from "@/components/snackbar";
import { useFormSubmit } from "../hook";

const PostHikeForm = () => {
  const { isCL, isSL, isMeal, isEquipment, isWeather, isLoading, isError } =
    useUserContext();

  const { entries, setEntries } = useEntriesState();

  const { cl } = useCL();
  const { postHikes } = usePostHikes();
  const { open, setOpen, message, setMessage, handleClose, status, setStatus } =
    useSnackbar();
  const submitForm = useFormSubmit({
    entries,
    setEntries,
    setMessage,
    setOpen,
    setStatus,
  });

  if (isLoading) return <Loading />;
  if (isError) return <ErrorMessage />;

  return (
    <Box component="form" id="post-hike-form">
      <Stack direction="column" spacing={2}>
        <CLSelect
          clMembers={cl}
          handleChange={(e: ChangeEvent<HTMLInputElement>) => {
            const [clId, name] = e.target.value.split("|");
            setEntries((prevEntries) => ({
              ...prevEntries,
              clId: clId,
              clName: name,
            }));
          }}
        />
        <HikeSelect
          records={postHikes}
          handleChange={(e: ChangeEvent<HTMLInputElement>) =>
            setEntries((prevEntries) => ({
              ...prevEntries,
              recordId: Number(e.target.value),
            }))
          }
        />
        {isMeal && (
          <EntryTextField
            id="reflection-meal-required"
            defaultValue=""
            label="食事係の反省"
            handleChange={(e: ChangeEvent<HTMLInputElement>) =>
              setEntries((prevEntries) => ({
                ...prevEntries,
                mealPerson: e.target.value,
              }))
            }
          />
        )}
        {isWeather && (
          <EntryTextField
            id="reflection-weather"
            defaultValue=""
            label="天気図係の反省"
            handleChange={(e: ChangeEvent<HTMLInputElement>) =>
              setEntries((prevEntries) => ({
                ...prevEntries,
                weatherPerson: e.target.value,
              }))
            }
          />
        )}
        {isEquipment && (
          <EntryTextField
            id="reflection-equipment"
            defaultValue=""
            label="装備の反省"
            handleChange={(e: ChangeEvent<HTMLInputElement>) =>
              setEntries((prevEntries) => ({
                ...prevEntries,
                equipmentPerson: e.target.value,
              }))
            }
          />
        )}
        {isSL && (
          <EntryTextField
            id="reflection-sl"
            label="SLの反省"
            defaultValue=""
            // handleChange={handleChange}
            handleChange={(e: ChangeEvent<HTMLInputElement>) =>
              setEntries((prevEntries) => ({
                ...prevEntries,
                sl: e.target.value,
              }))
            }
          />
        )}
        {isCL && (
          <>
            <EntryTextField
              id="ccomment-meal"
              defaultValue=""
              label="コメント - 食事係"
              // handleChange={handleChange}
              handleChange={(e: ChangeEvent<HTMLInputElement>) =>
                setEntries((prevEntries) => ({
                  ...prevEntries,
                  slComment: e.target.value,
                }))
              }
            />
            <EntryTextField
              defaultValue=""
              id="comment-weather"
              label="コメント - 天気図係"
              handleChange={(e: ChangeEvent<HTMLInputElement>) =>
                setEntries((prevEntries) => ({
                  ...prevEntries,
                  mealComment: e.target.value,
                }))
              }
            />
            <EntryTextField
              defaultValue=""
              id="comment-equipment"
              label="コメント - 装備係"
              handleChange={(e: ChangeEvent<HTMLInputElement>) =>
                setEntries((prevEntries) => ({
                  ...prevEntries,
                  weatherComment: e.target.value,
                }))
              }
            />
          </>
        )}
        <EntryTextField
          defaultValue=""
          id="impression"
          label="感想"
          handleChange={(e: ChangeEvent<HTMLInputElement>) =>
            setEntries((prevEntries) => ({
              ...prevEntries,
              impression: e.target.value,
            }))
          }
        />
      </Stack>
      <Grid container justifyContent="end">
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          disabled={!entries.clId || !entries.recordId}
          onClick={() => {
            submitForm();
            // handleSubmit(entries);
          }}
        >
          提出
        </Button>
      </Grid>
      <SubmitSnackbar
        open={open}
        handleClose={handleClose}
        message={message}
        status={status}
      />
    </Box>
  );
};

export default PostHikeForm;
