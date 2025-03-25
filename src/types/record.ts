export type RecordProps = {
  id: number;
  year?: number;
  place?: string;
  date?: string;
};

export type RecordContentProps = {
  title: string | null;
  filename: string | null;
  recordId: number | null;
};
