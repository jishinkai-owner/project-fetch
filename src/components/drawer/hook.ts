import { useMediaQuery, useTheme } from "@mui/material";
import { useEffect, useState } from "react";

export default function useDrawerLayout() {
  const theme = useTheme();
  const isTemporary = useMediaQuery(theme.breakpoints.down("md"));
  const [open, setOpen] = useState(true);

  useEffect(() => {
    setOpen(!isTemporary);
  }, [isTemporary]);

  const handleDrawerOpen = () => {
    setOpen(!open);
  };

  return {
    isTemporary,
    open,
    handleDrawerOpen,
  };
}
