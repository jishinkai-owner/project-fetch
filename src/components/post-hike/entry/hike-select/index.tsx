import { TextField, MenuItem } from "@mui/material";
import { ChangeEvent } from "react";
import { RecordProps } from "@/types/record";
import { memo } from "react";
import React from "react";

type HikeSelectProps = {
  records: RecordProps[];
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
  value?: number | null;
};

const HikeSelect = memo(({ records, handleChange, value }: HikeSelectProps) => {
  const menuItems = records.map((e: RecordProps) => (
    <MenuItem key={e.id} value={e.id}>
      {e.place} - {e.date}, {e.year}
    </MenuItem>
  ));

  return (
    <TextField
      id="select-mountain-required"
      select
      label="山行"
      onChange={handleChange}
      value={value ?? ""}
      fullWidth
    >
      {menuItems}
    </TextField>
  );
});

HikeSelect.displayName = "HikeSelect";

export default HikeSelect;
