"use client";
import { useState } from "react";
import { Button, Box, Stack, TextField } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import handleSubmit from "../hook";
import { Dayjs } from "dayjs";

type HikeInfoEntryProps = {
  year: number | null;
  date: string | null;
  place: string | null;
};

const HikeInfoEntry = () => {
  //   const router = useRouter();

  const [entry, setEntry] = useState<HikeInfoEntryProps>({
    year: null,
    date: null,
    place: null,
  });

  const handleYearChange = (e: Dayjs | null) => {
    if (e) {
      setEntry({ ...entry, year: e.year() });
    } else {
      setEntry({ ...entry, year: null });
    }
  };

  return (
    <Box
      component="form"
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(entry);
      }}
    >
      <Stack direction="column" spacing={2}>
        <Stack direction="row" spacing={2}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="年"
              //   onChange={(e) => setYear(e.year())}
              onChange={handleYearChange}
              views={["year"]}
            />
          </LocalizationProvider>
          <TextField
            id="date-required"
            label="日付"
            onChange={(e) => setEntry({ ...entry, date: e.target.value })}
            required
          />
        </Stack>
        <TextField
          id="mountain-required"
          label="場所"
          defaultValue=""
          required
          onChange={(e) => setEntry({ ...entry, place: e.target.value })}
        />
        <Grid container spacing={2} justifyContent="end">
          <Button
            variant="contained"
            type="submit"
            color="primary"
            disabled={!entry.year || !entry.date || !entry.place}
          >
            登録
          </Button>
        </Grid>
      </Stack>
    </Box>
  );
};

export default HikeInfoEntry;
