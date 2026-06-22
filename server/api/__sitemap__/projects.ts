import type { SitemapUrlInput } from "#sitemap/types";

type ProjectSitemapRecord = {
  slug?: unknown;
  updated_at?: unknown;
  updatedAt?: unknown;
  modified_at?: unknown;
  published_at?: unknown;
};

type ProjectsApiResponse = {
  data?: ProjectSitemapRecord[];
  meta?: {
    page?: number;
    current_page?: number;
    totalPages?: number;
    last_page?: number;
  };
};

const PAGE_SIZE = 100;
const MAX_PAGES = 1000;

function validLastmod(project: ProjectSitemapRecord): string | undefined {
  const value =
    project.updated_at ??
    project.updatedAt ??
    project.modified_at ??
    project.published_at;

  if (typeof value !== "string" || Number.isNaN(Date.parse(value))) {
    return undefined;
  }

  return value;
}

export default defineSitemapEventHandler(async () => {
  const config = useRuntimeConfig();
  const apiBase = String(config.public.apiBase).replace(/\/+$/, "");
  const projects: ProjectSitemapRecord[] = [];

  try {
    for (let page = 1; page <= MAX_PAGES; page += 1) {
      const response = await $fetch<ProjectsApiResponse>(`${apiBase}/projects`, {
        query: { page, perPage: PAGE_SIZE },
      });
      const pageProjects = Array.isArray(response.data) ? response.data : [];
      projects.push(...pageProjects);

      const lastPage =
        response.meta?.totalPages ?? response.meta?.last_page ?? page;
      if (page >= lastPage || pageProjects.length === 0) break;
    }
  } catch (error) {
    console.error("[sitemap] Unable to load project URLs from the API", error);
  }

  return projects
    .filter(
      (project): project is ProjectSitemapRecord & { slug: string } =>
        typeof project.slug === "string" && project.slug.length > 0,
    )
    .map(
      (project) =>
        ({
          loc: `/projects/${project.slug}`,
          lastmod: validLastmod(project),
          changefreq: "monthly",
          priority: 0.7,
          _i18nTransform: true,
        }) satisfies SitemapUrlInput,
    );
});
