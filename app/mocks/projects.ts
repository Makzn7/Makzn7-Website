import type { Project } from "~/types/project";

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
