import { TextField, MenuItem } from "@mui/material";
import { ChangeEvent } from "react";
import React from "react";
import { CLRes } from "@/types/apiResponse";

type CLSelectProps = {
  clMembers: CLRes[];
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

const CLSelect = ({ clMembers, handleChange }: CLSelectProps) => {
  return (
    <TextField
      id="cl-select"
      select
      label="班"
      onChange={handleChange}
      defaultValue=""
    >
      {clMembers.map((option) => (
        <MenuItem key={option.id} value={`${option.id}|${option.name}`}>
          {option.name}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default CLSelect;
