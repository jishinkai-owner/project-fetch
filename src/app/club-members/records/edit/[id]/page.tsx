import EditPastRecord from "@/components/tiptap/edit-past";
import { ErrorMessage } from "@/components/load-status";
import React from "react";

type EditRecordPageProps = {
  params: Promise<{
    id: number;
  }>;
};

const EditRecordPage = async ({ params }: EditRecordPageProps) => {
  const { id } = await params;

  if (!id) {
    return <ErrorMessage />;
  }
  return <EditPastRecord id={Number(id)} />;
};

export default EditRecordPage;
