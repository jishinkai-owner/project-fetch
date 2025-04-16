import { TextField, MenuItem } from "@mui/material";
import { ChangeEvent } from "react";
import { RecordProps } from "@/types/record";
import { memo, useMemo } from "react";

type HikeSelectProps = {
  records: RecordProps[];
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

const HikeSelect = memo(({ records, handleChange }: HikeSelectProps) => {
  const menuItems = useMemo(
    () =>
      records.map((e: RecordProps) => (
        <MenuItem key={e.id} value={e.id}>
          {e.place} - {e.date}, {e.year}
        </MenuItem>
      )),
    [records]
  );

  return (
    <TextField
      id="select-mountain-required"
      select
      label="山行"
      onChange={handleChange}
      defaultValue=""
      fullWidth
    >
      {menuItems}
    </TextField>
  );
});

HikeSelect.displayName = "HikeSelect"; // Set display name for easier debugging

export default HikeSelect;
