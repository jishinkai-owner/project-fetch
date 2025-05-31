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
import { Toaster } from "react-hot-toast";
import { useFormSubmit } from "../hook";
import { useIds } from "../hook";
import RetrospectiveText from "./retrospective-text";

const PostHikeForm = () => {
  const { contextValue } = useUserContext();

  const { ids, setIds } = useIds();
  const { cl, isLoadingCL, isErrorCL } = useCL();
  const { postHikes, isLoading, isError } = usePostHikes();
  const { entries, setEntries } = useEntriesState(ids.clId, ids.recordId);
  const submitForm = useFormSubmit({
    entries,
    setEntries,
  });

  if (isLoading || isLoadingCL) return <Loading />;
  if (isError || isErrorCL) return <ErrorMessage />;
  console.log("contextVlaue!! ", contextValue);

  return (
    <>
      <Box component="form" id="post-hike-form">
        <Stack direction="column" spacing={2}>
          {!isLoadingCL && (
            <CLSelect
              clMembers={cl}
              handleChange={(e: ChangeEvent<HTMLInputElement>) => {
                const [clId, name] = e.target.value.split("|");
                setIds((prevIds) => ({
                  ...prevIds,
                  clId: clId,
                }));
                setEntries((prevEntries) => ({
                  ...prevEntries,
                  clId: clId,
                  clName: name,
                }));
              }}
            />
          )}
          <HikeSelect
            records={postHikes}
            value={entries.recordId}
            handleChange={(e: ChangeEvent<HTMLInputElement>) => {
              setIds((prevIds) => ({
                ...prevIds,
                recordId: Number(e.target.value),
              }));

              setEntries((prevEntries) => ({
                ...prevEntries,
                recordId: Number(e.target.value),
              }));
            }}
          />
          {(contextValue.Role?.isMeal || contextValue.Role?.isSL) && (
            <EntryTextField
              id="reflection-meal-required"
              value={entries.mealPerson ?? ""}
              label="食事係の反省"
              handleChange={(e: ChangeEvent<HTMLInputElement>) =>
                setEntries((prevEntries) => ({
                  ...prevEntries,
                  mealPerson: e.target.value,
                }))
              }
            />
          )}
          {(contextValue.Role?.isWeather || contextValue.Role?.isSL) && (
            <EntryTextField
              id="reflection-weather"
              value={entries.weatherPerson ?? ""}
              label="天気図係の反省"
              handleChange={(e: ChangeEvent<HTMLInputElement>) =>
                setEntries((prevEntries) => ({
                  ...prevEntries,
                  weatherPerson: e.target.value,
                }))
              }
            />
          )}
          {(contextValue.Role?.isEquipment || contextValue.Role?.isSL) && (
            <EntryTextField
              id="reflection-equipment"
              value={entries.equipmentPerson ?? ""}
              label="装備の反省"
              handleChange={(e: ChangeEvent<HTMLInputElement>) =>
                setEntries((prevEntries) => ({
                  ...prevEntries,
                  equipmentPerson: e.target.value,
                }))
              }
            />
          )}
          {(contextValue.Role?.isSL || contextValue.Role?.isSL) && (
            <EntryTextField
              id="reflection-sl"
              label="SLの反省"
              value={entries.sl ?? ""}
              handleChange={(e: ChangeEvent<HTMLInputElement>) =>
                setEntries((prevEntries) => ({
                  ...prevEntries,
                  sl: e.target.value,
                }))
              }
            />
          )}
          {(contextValue.Role?.isCL || contextValue.Role?.isSL) && (
            <>
              <RetrospectiveText text={entries.mealPerson} role="食事係" />
              <EntryTextField
                id="ccomment-meal"
                value={entries.mealComment ?? ""}
                label="コメント - 食事係"
                handleChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setEntries((prevEntries) => ({
                    ...prevEntries,
                    mealComment: e.target.value,
                  }))
                }
              />
              <RetrospectiveText text={entries.weatherPerson} role="天気図係" />
              <EntryTextField
                value={entries.weatherComment ?? ""}
                id="comment-weather"
                label="コメント - 天気図係"
                handleChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setEntries((prevEntries) => ({
                    ...prevEntries,
                    weatherComment: e.target.value,
                  }))
                }
              />
              <RetrospectiveText text={entries.equipmentPerson} role="装備係" />
              <EntryTextField
                value={entries.equipmentComment ?? ""}
                id="comment-equipment"
                label="コメント - 装備係"
                handleChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setEntries((prevEntries) => ({
                    ...prevEntries,
                    equipmentComment: e.target.value,
                  }))
                }
              />
              <RetrospectiveText text={entries.sl} role="SL" />
              <EntryTextField
                value={entries.slComment ?? ""}
                id="comment-sl"
                label="コメント - SL"
                handleChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setEntries((prevEntries) => ({
                    ...prevEntries,
                    slComment: e.target.value,
                  }))
                }
              />
            </>
          )}
          <EntryTextField
            value={entries.impression ?? ""}
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
            }}
          >
            提出
          </Button>
        </Grid>
      </Box>
      <Toaster />
    </>
  );
};

export default PostHikeForm;
