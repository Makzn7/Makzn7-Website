import type { Department } from "~/types/department";

export const departments: Department[] = [
  {
    id: 1,
    slug: "art",
    name_ar: "ارت",
    name_en: "Art",
    hero_image: "/logos/departments/Art.svg",
  },
  {
    id: 2,
    slug: "mansj",
    name_ar: "منسج",
    name_en: "Mansj",
    hero_image: "/logos/departments/Mansj.svg",
  },
  {
    id: 3,
    slug: "manjra",
    name_ar: "منجرة",
    name_en: "Manjra",
    hero_image: "/logos/departments/Manjra.svg",
  },
  {
    id: 4,
    slug: "prophouse",
    name_ar: "بروب هاوس",
    name_en: "Prop House",
    hero_image: "/logos/departments/Prophouse.svg",
  },
];
