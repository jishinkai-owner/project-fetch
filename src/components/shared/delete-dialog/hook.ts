import { useState } from "react";
export const useDeleteDialog = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(!open);
  };

  return { open, handleOpen };
};
