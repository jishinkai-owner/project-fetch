"use client";

import { Box } from "@mui/material";
import { Drawer } from "@mui/material";
import DrawerContent from "./drawer-content";
import AppBar from "./appbar";
import { Toolbar } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import UserInfo from "./appbar/user-controlls";
import MenuIcon from "@mui/icons-material/Menu";
import useDrawerLayout from "./hook";

const MenuDrawer = () => {
  const { open, handleDrawerOpen } = useDrawerLayout();
  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          boxShadow: "0px 0.1px 5px rgba(134, 134, 135, 0.5)",
          zIndex: (theme) => theme.zIndex.drawer - 1,
        }}
        open={open}
      >
        <Toolbar
          sx={{
            backgroundColor: "background.paper",
          }}
        >
          <Box
            sx={{
              flexGrow: 1,
            }}
          >
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={[
                {
                  color: "text.primary",
                },
                open && { display: "none" },
              ]}
            >
              <MenuIcon />
            </IconButton>
          </Box>
          <UserInfo />
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { sm: 0, md: open ? 280 : 0 }, flexShrink: 0 }}
      >
        <Drawer
          open={open}
          variant={"temporary"}
          onClose={handleDrawerOpen}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            flexShrink: 0,
            display: { sm: "block", md: "none" },
            "& .MuiDrawer-paper": {
              width: 280,
              bgcolor: "background.paper",
              color: "text.primary",
              boxSizing: "border-box",
            },
          }}
        >
          <DrawerContent />
        </Drawer>
        <Drawer
          open={open}
          variant={"persistent"}
          onClose={handleDrawerOpen}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: 280,
              bgcolor: "background.paper",
              color: "text.primary",
              boxSizing: "border-box",
            },
          }}
        >
          <DrawerContent />
        </Drawer>
      </Box>
    </>
  );
};

export default MenuDrawer;
