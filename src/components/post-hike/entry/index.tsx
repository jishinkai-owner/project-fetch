import { Button, Stack, MenuItem, TextField, Box } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useState, ChangeEvent } from "react";

const groups = [
  { value: 1, label: "寺尾" },
  { value: 2, label: "大崎" },
  { value: 3, label: "田中" },
  { value: 4, label: "築地原" },
];

const PostHikeForm = () => {
  const [entries, setEntries] = useState({
    group: "",
    reflection: "",
    impression: "",
  });

  const handleChange = (label: string, value: string) => {
    const entry = { ...entries };
    switch (label) {
      case "group":
        entry.group = value;
        setEntries(entry);
        break;
      case "reflection":
        setEntries({ ...entries, reflection: value });
        break;
      case "impression":
        setEntries({ ...entries, impression: value });
        break;
      default:
        setEntries(entry);
        break;
    }
  };

  return (
    <Box component="form">
      <Stack direction="column" spacing={2}>
        <TextField
          id="group-required"
          defaultValue=""
          select
          label="班"
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            handleChange("group", e.target.value)
          }
        >
          {groups.map((group) => (
            <MenuItem key={group.value} value={group.label}>
              {group.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          id="job-required"
          label="係の反省"
          multiline
          rows={4}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            handleChange("reflection", e.target.value)
          }
        />
        <TextField
          id="comments-required"
          label="感想"
          multiline
          rows={4}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            handleChange("impression", e.target.value)
          }
        />
      </Stack>
      <Grid container justifyContent="end">
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          disabled={
            !entries.group || !entries.reflection || !entries.impression
          }
        >
          提出
        </Button>
      </Grid>
    </Box>
  );
};

export default PostHikeForm;
