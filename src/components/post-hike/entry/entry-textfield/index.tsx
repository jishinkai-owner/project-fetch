import { TextField } from "@mui/material";
import { ChangeEvent } from "react";

type EntryTextFieldProps = {
  id: string;
  label: string;
  name?: string;
  defaultValue: string | null;
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

const EntryTextField = ({ id, label, handleChange }: EntryTextFieldProps) => {
  return (
    <TextField
      id={id}
      label={label}
      multiline
      rows={4}
      onChange={handleChange}
    />
  );
};

export default EntryTextField;
