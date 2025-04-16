import EditorPage from "@/components/tiptap";
import { UserContextProvider } from "@/providers/user";

const EnterRecords = () => {
  return (
    <UserContextProvider>
      <EditorPage />
    </UserContextProvider>
  );
};

export default EnterRecords;
