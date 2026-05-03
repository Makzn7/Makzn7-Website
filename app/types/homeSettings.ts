export type HomeSettings = {
  hero: {
    title_ar: string;
    title_en: string;
    description_ar: string;
    description_en: string;
  };
  hero_3d: {
    type: string;
    image_en: string | null;
    image_ar: string | null;
    image_dark_en: string | null;
    image_dark_ar: string | null;
    mode_color?: string | null;
    mode_color_dark?: string | null;
  };
  about: {
    description_ar: string;
    description_en: string;
  };
};
