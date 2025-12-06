import { Typography, Button, Menu, MenuItem } from "@mui/material";
import { useState, MouseEvent } from "react";
import { Editor } from "@tiptap/react";
import React from "react";

type HeadingSelectorProps = {
  editor: Editor;
};

const HeadingSelector = (editor: HeadingSelectorProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <>
      <Button variant="outlined" onClick={handleClick}>
        文字サイズ
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        id="heading-selector"
        keepMounted
        onClose={handleClose}
      >
        <MenuItem
          onClick={() => {
            // handleCloseSelect("Heading 1");
            handleClose();
            editor.editor.chain().focus().setHeading({ level: 1 }).run();
            editor.editor.commands.focus("end");
          }}
        >
          <Typography variant="h1">Heading 1</Typography>
        </MenuItem>
        <MenuItem
          onClick={() => {
            // handleCloseSelect("Heading 2");
            handleClose();
            editor.editor.chain().focus().setHeading({ level: 2 }).run();
            editor.editor.commands.focus("end");
          }}
        >
          <Typography variant="h2">Heading 2</Typography>
        </MenuItem>
        <MenuItem
          onClick={() => {
            // handleCloseSelect("Heading 3");
            handleClose();
            editor.editor.chain().focus().setHeading({ level: 3 }).run();
            editor.editor.commands.focus("end");
          }}
        >
          <Typography variant="h3">Heading 3</Typography>
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleClose();
            editor.editor.commands.setParagraph();
            editor.editor.commands.focus("end");
          }}
        >
          <Typography variant="body1">Paragraph</Typography>
        </MenuItem>
      </Menu>
    </>
  );
};

export default HeadingSelector;
