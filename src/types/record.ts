export type RecordProps = {
  id: number;
  year: number | null;
  place: string | null;
  date: string | null;
};

export type RecordContentProps = {
  title: string | null;
  filename: string | null;
  recordId: number | null;
};
