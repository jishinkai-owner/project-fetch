import { TextField } from "@mui/material";
import { ChangeEvent } from "react";
import React from "react";

type AuthorNameFieldProps = {
  value: string;
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

const AuthorNameField = ({ value, handleChange }: AuthorNameFieldProps) => {
  return (
    <TextField
      id="author-name"
      label="名前"
      value={value}
      onChange={handleChange}
      fullWidth
      required
      helperText="同じ係に複数人いる場合は、名前で区別されます"
    />
  );
};

export default AuthorNameField;
