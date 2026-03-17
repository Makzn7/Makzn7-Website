export type Person = {
  id: number;
  name: string;
  title?: string;
  photo?: string | null;
  departmentIds: number[];
};
