import type { ProjectType } from "~/types/projectType";

export const projectTypes: ProjectType[] = [
  { id: 1, slug: "tvc", name_en: "TVC", name_ar: "إعلان تلفزيوني" },
  {
    id: 2,
    slug: "feature-film",
    name_en: "Feature Film",
    name_ar: "فيلم طويل",
  },
  { id: 3, slug: "short-film", name_en: "Short Film", name_ar: "فيلم قصير" },
  { id: 4, slug: "tv-show", name_en: "TV SHOW", name_ar: "برنامج تلفزيوني" },
  {
    id: 5,
    slug: "internet-content",
    name_en: "INTERNET CONTENT",
    name_ar: "محتوى الإنترنت",
  },
  {
    id: 6,
    slug: "space-design",
    name_en: "SPACE DESIGN",
    name_ar: "تصميم الفضاء",
  },
];
