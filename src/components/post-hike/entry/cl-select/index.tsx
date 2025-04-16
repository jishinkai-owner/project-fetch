import { TextField, MenuItem } from "@mui/material";
import { ChangeEvent } from "react";

type CLMember = {
  userId: string;
  name: string;
};

type CLSelectProps = {
  clMembers: CLMember[];
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
        <MenuItem
          // id={option.userId}
          key={option.userId}
          value={`${option.userId}|${option.name}`}
        >
          {option.name}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default CLSelect;
