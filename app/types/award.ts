export type Award = {
  id: number;
  title_ar: string;
  title_en: string;
  year: number;
  description_ar?: string | null;
  description_en?: string | null;
  image: string;
  link?: string | null;
  image_3d?: string | null;
};
