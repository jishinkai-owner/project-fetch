import { Button, Box, Stack, TextField, MenuItem } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { HikeInfoEntryProps } from "@/types/hike";
import Grid from "@mui/material/Grid2";
import dayjs from "dayjs";

const activityType = [
  {
    label: "登山",
    value: "yama",
  },
  {
    label: "釣り",
    value: "turi",
  },
  {
    label: "旅行",
    value: "tabi",
  },
  {
    label: "その他",
    value: "other",
  },
];

type RegisterFormProps = {
  entry: HikeInfoEntryProps;
  setEntry: React.Dispatch<React.SetStateAction<HikeInfoEntryProps>>;
  submitForm: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  handleYearChange: (date: dayjs.Dayjs | null) => void;
};
const RegisterForm = ({
  entry,
  setEntry,
  submitForm,
  handleYearChange,
}: RegisterFormProps) => {
  return (
    <Box
      component="form"
      onSubmit={(e) => {
        e.preventDefault();
        submitForm(e);
      }}
    >
      <Stack direction="column" spacing={2}>
        <Stack direction="row" spacing={2}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="年"
              value={entry.year ? dayjs().year(entry.year) : null}
              onChange={handleYearChange}
              views={["year"]}
            />
          </LocalizationProvider>
          <TextField
            id="date-required"
            label="日付"
            value={entry.date ?? ""}
            onChange={(e) => setEntry({ ...entry, date: e.target.value })}
            required
          />
        </Stack>
        <TextField
          id="mountain-required"
          label="場所"
          value={entry.place ?? ""}
          required
          onChange={(e) => setEntry({ ...entry, place: e.target.value })}
        />
        <TextField
          id="activity-type-required"
          select
          label="活動種別"
          value={entry.activityType ?? "yama"}
          required
          onChange={(e) => setEntry({ ...entry, activityType: e.target.value })}
        >
          {activityType.map((option) => (
            <MenuItem key={option.label} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <Grid container spacing={2} justifyContent="end">
          <Button
            variant="contained"
            type="submit"
            color="primary"
            disabled={
              !entry.year || !entry.date || !entry.place || !entry.activityType
            }
          >
            登録
          </Button>
        </Grid>
      </Stack>
    </Box>
  );
};

export default RegisterForm;
