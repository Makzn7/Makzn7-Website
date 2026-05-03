import type { Award } from "./award";
import type { Page } from "./page";

export type AboutResponse = {
  data: Page;
  awards: Award[];
};
