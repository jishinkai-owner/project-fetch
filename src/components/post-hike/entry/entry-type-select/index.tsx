import { TextField, MenuItem } from "@mui/material";
import { ChangeEvent } from "react";
import React from "react";
import {
  ENTRY_TYPE_OPTIONS,
  EntryType,
} from "../entry-types";

type EntryTypeSelectProps = {
  value: EntryType | "";
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

const EntryTypeSelect = ({ value, handleChange }: EntryTypeSelectProps) => {
  return (
    <TextField
      id="entry-type-select"
      select
      label="係"
      value={value}
      onChange={handleChange}
      fullWidth
    >
      {ENTRY_TYPE_OPTIONS.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default EntryTypeSelect;
