import EditPastRecord from "@/components/tiptap/edit-past";
import { ErrorMessage } from "@/components/load-status";

const EditRecordPage = async ({ params }: { params: { id: number } }) => {
  const { id } = await params;

  if (!id) {
    return <ErrorMessage />;
  }

  return <EditPastRecord id={Number(id)} />;
};

export default EditRecordPage;
