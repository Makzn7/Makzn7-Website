import { projects } from "~/mocks/projects";
import { team } from "~/mocks/team";

export default defineEventHandler(() => {
  const featured = projects.filter((p) => (p as any).isFeatured).slice(0, 6);
  const people = team.slice(0, 8);
  return {
    featuredProjects: featured,
    team: people,
  };
});
