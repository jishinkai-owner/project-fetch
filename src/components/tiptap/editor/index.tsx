import { Dispatch, SetStateAction } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import "./styles.scss";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import Toolbar from "./toolbar/index";
import FloatingBar from "./floating-menu";

type SetContentProps = {
  setContent: Dispatch<SetStateAction<string>>;
};

const TipTapEditor = ({ setContent }: SetContentProps) => {
  // const [content, setContent] = useState("");
  const extensions = [
    StarterKit,
    Underline,
    Image,
    Placeholder.configure({ placeholder: "記録を記入してね..." }),
  ];

  const editor = useEditor({
    immediatelyRender: false,
    extensions,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <>
      <Toolbar editor={editor} />
      <FloatingBar editor={editor} />
      <EditorContent editor={editor} />
    </>
  );
};

export default TipTapEditor;
