import type { Project } from "~/types/project";

const data = [
  {
    ar: "ارامكو يوم التأسيس 2024",
    en: "ARAMCO FOUNDING DAY 2024",
    image: "/images/sample_project/ARAMCO COMMERCIAL TOWER DIMENTION ISO.png",
  },
  {
    ar: "فيـــلم جرس إنذار",
    en: "JARAS ENTHAR FEATURE FILM",
    image: "/images/sample_project/JARAS ENTHAR.png",
  },
  {
    ar: "برنامج شقة الملز",
    en: "SHEQAT AL MALAZ TV SHOW",
    image: "/images/sample_project/SHEQAT ALMALAZ.png",
  },
  {
    ar: "فيــــلم الـــــزرفـة",
    en: "ALZARFAH FEATURE FILM",
    image: "/images/sample_project/ZARFAH.png",
  },
  {
    ar: "الفيديوهات الموسيقية جلســـات الريــــاض",
    en: "JALASAT ARRIYADH MUSIC VIDEOS",
    image: "/images/sample_project/JALSAT.png",
  },
];
export const featuredProjects = data.map((item, i) => ({
  id: i + 1,
  slug: `project-${i + 1}`,
  name: item.en,
  year: 2020 + (i % 5),
  summary: "Sample project description",
  heroMedia: {
    type: "image",
    src: "https://via.placeholder.com/1200x800",
  },
  hoverMedia: {
    type: "image",
    src: item.image,
  },
  isFeatured: true,
  gallery: [],
  departmentId: (i % 4) + 1,
  scopeIds: [(i % 3) + 1],
  typeId: (i % 3) + 1,
  teamIds: [],
}));

export const projects: Project[] = Array.from({ length: 120 }).map((_, i) => ({
  id: i + 1,
  slug: `project-${i + 1}`,
  name: `Project ${i + 1}`,
  year: 2020 + (i % 5),
  summary: "Sample project description",
  heroMedia: {
    type: "image",
    src: "https://via.placeholder.com/1200x800",
  },
  hoverMedia: {
    type: "image",
    src: `https://via.placeholder.com/400x300?text=Project+${i + 1}`,
  },
  isFeatured: i % 10 === 0,
  gallery: [],
  departmentId: (i % 4) + 1,
  scopeIds: [(i % 3) + 1],
  typeId: (i % 3) + 1,
  teamIds: [],
}));
