import { Dispatch, SetStateAction } from "react";
import { useEffect, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import "./styles.scss";
// import styles from "./Tiptap.module.scss";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import Toolbar from "./toolbar/index";
import FloatingBar from "./floating-menu";
import { Toaster } from "react-hot-toast";
import { isMarkdown, isFlickrEmbed } from "./paste-markdown/pasteMD";
import { generateJSON } from "@tiptap/react";
import MarkdownIt from "markdown-it";

type SetContentProps = {
  content: string | null;
  setContent: Dispatch<SetStateAction<string | null>>;
};

const TipTapEditor = ({ content, setContent }: SetContentProps) => {
  const isExternalUpdate = useRef(false);
  const isFirstRender = useRef(true);
  const markdownParser = new MarkdownIt();

  const extensions = [
    StarterKit,
    Underline,
    Image,
    Placeholder.configure({ placeholder: "記録を記入してね..." }),
  ];

  const editor = useEditor({
    immediatelyRender: false,
    extensions,
    content: content || "",
    onUpdate: ({ editor }) => {
      if (!isExternalUpdate.current) {
        setContent(editor.getHTML());
      }
    },
    editorProps: {
      handlePaste: (view, event) => {
        const plainText = event.clipboardData?.getData("text/plain");
        if (plainText && isFlickrEmbed(plainText)) {
          event.preventDefault();
          editor?.commands.insertContent(plainText);

          return true;
        } else if (plainText && isMarkdown(plainText)) {
          event.preventDefault();
          const html = markdownParser.render(plainText);

          const json = generateJSON(html, extensions);
          editor?.commands.insertContent(json);
          return true;
        }

        return false;
      },
    },
  });

  useEffect(() => {
    if (editor && content && isFirstRender.current) {
      isExternalUpdate.current = true;
      isFirstRender.current = false;

      const currentContent = editor.getHTML();
      if (content !== currentContent) {
        editor.commands.setContent(content);
      }

      // Reset flag after update
      setTimeout(() => {
        isExternalUpdate.current = false;
      }, 0);
    }
  }, [editor, content]);

  if (!editor) {
    return null;
  }

  return (
    <>
      <Toolbar editor={editor} />
      <FloatingBar editor={editor} />
      <EditorContent editor={editor} />
      <Toaster />
    </>
  );
};

export default TipTapEditor;
