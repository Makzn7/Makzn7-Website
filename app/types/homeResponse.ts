import type { HomeSettings } from "./homeSettings";
import type { Project } from "./project";

export type HomeResponse = {
  data: HomeSettings;
  projects: Project[];
};
