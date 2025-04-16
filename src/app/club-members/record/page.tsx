"use client";
import { useSearchParams } from "next/navigation";
import EditPastRecord from "@/components/tiptap/edit-past";

const EditRecordPage = () => {
  const searchParams = useSearchParams();
  const recordId = searchParams.get("id");

  //   return <>here I insert an edit record page</>;
  return <EditPastRecord id={Number(recordId)} />;
};

export default EditRecordPage;
