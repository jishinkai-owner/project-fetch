import EditorPage from "@/components/tiptap";
import { UserContextProvider } from "@/providers/user";
import { Suspense } from "react";

const EnterRecords = () => {
  return (
    <Suspense>
      <UserContextProvider>
        <EditorPage />
      </UserContextProvider>
    </Suspense>
  );
};

export default EnterRecords;
