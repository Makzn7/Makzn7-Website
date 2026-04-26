export type Person = {
  id: number;
  name_ar: string;
  name_en: string;
  title_ar?: string;
  title_en?: string;
  photo?: string | null;
  departmentIds: number[];
};
