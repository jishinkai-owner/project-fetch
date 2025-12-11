import { Editor } from "@tiptap/core";
import Grid from "@mui/material/Grid2";
import { Button } from "@mui/material";
import FormalBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import HeadingSelector from "./heading-selector";
import InsertImage from "./insert-image";
import { useEditorState } from "@tiptap/react";
import React from "react";

type ToolbarProps = {
  editor: Editor;
};

const Toolbar = ({ editor }: ToolbarProps) => {
  const editorState = useEditorState({
    editor,
    selector: ({ editor }: { editor: Editor }) => ({
      isBold: editor.isActive("bold"),
      isItalic: editor.isActive("italic"),
      isUnderline: editor.isActive("underline"),
      isBulletList: editor.isActive("bulletList"),
      isOrderedList: editor.isActive("orderedList"),
      undoDisabled: !editor.can().chain().focus().undo().run(),
      redoDisabled: !editor.can().chain().focus().redo().run(),
    }),
  });

  return (
    <Grid
      container
      spacing={{ sm: 0, md: 0.5 }}
      columns={{ xs: 4, sm: 8, md: 12 }}
      justifyContent="flex-start"
    >
      <Button
        variant="outlined"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={editorState.undoDisabled}
      >
        <UndoIcon />
      </Button>
      <Button
        variant="outlined"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={editorState.redoDisabled}
      >
        <RedoIcon />
      </Button>
      <HeadingSelector editor={editor} />
      <Button
        variant={editorState.isBold ? "contained" : "outlined"}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <FormalBoldIcon />
      </Button>
      <Button
        variant={editorState.isItalic ? "contained" : "outlined"}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <FormatItalicIcon />
      </Button>
      <Button
        variant={editorState.isUnderline ? "contained" : "outlined"}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <FormatUnderlinedIcon />
      </Button>
      <InsertImage editor={editor} />
      <Button
        variant="outlined"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <FormatListBulletedIcon />
      </Button>
      <Button
        variant="outlined"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <FormatListNumberedIcon />
      </Button>
    </Grid>
  );
};

export default Toolbar;
