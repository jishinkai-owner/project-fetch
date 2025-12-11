"use client";
import {
  Box,
  Tooltip,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
} from "@mui/material";
import { logout } from "@/app/actions";
import React from "react";

import { useState, MouseEvent } from "react";

const UserInfo = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <Box sx={{ flexGrow: 0 }}>
      <Tooltip title="ユーザー情報">
        <IconButton onClick={handleClick}>
          <Avatar
            alt="user"
            src="/jishinkaiboard.svg"
            sx={{ width: 40, height: 40 }}
          />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        id="user-controll-menu"
        keepMounted
        onClose={handleClose}
      >
        <MenuItem>
          <Typography variant="body2" onClick={() => logout()}>
            ログアウト
          </Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default UserInfo;
