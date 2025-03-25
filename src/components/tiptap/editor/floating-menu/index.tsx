import { FloatingMenu, Editor } from "@tiptap/react";
import FormatListBulleted from "@mui/icons-material/FormatListBulleted";
import FormatListNumbered from "@mui/icons-material/FormatListNumbered";
import { FloatingButton } from "./floating-button";

const FloatingBar = ({ editor }: { editor: Editor }) => {
  return (
    <>
      <FloatingMenu editor={editor} tippyOptions={{ duration: 100 }}>
        <FloatingButton
          onClick={() => editor.chain().focus().setHeading({ level: 1 }).run()}
        >
          H1
        </FloatingButton>
        <FloatingButton
          onClick={() => editor.chain().focus().setHeading({ level: 2 }).run()}
        >
          H2
        </FloatingButton>
        <FloatingButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <FormatListBulleted
            sx={{
              fontSize: "1.275rem",
            }}
          />
        </FloatingButton>
        <FloatingButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <FormatListNumbered
            sx={{
              fontSize: "1.275rem",
            }}
          />
        </FloatingButton>
      </FloatingMenu>
    </>
  );
};

export default FloatingBar;
