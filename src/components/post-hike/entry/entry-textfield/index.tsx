import { TextField } from "@mui/material";
import { ChangeEvent } from "react";
import React from "react";

type EntryTextFieldProps = {
  id: string;
  label: string;
  name?: string;
  value: string;
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

const EntryTextField = ({
  id,
  value,
  label,
  handleChange,
}: EntryTextFieldProps) => {
  return (
    <TextField
      id={id}
      label={label}
      multiline
      value={value}
      rows={4}
      onChange={handleChange}
    />
  );
};

export default EntryTextField;
