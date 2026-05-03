# Projects Module

## Endpoints

### GET /projects-filters
Returns available filter options for the projects page.

**Response:**
```json
{
  "data": {
    "departments": [{ "id", "slug", "name_ar", "name_en", "description_ar", "description_en", "hero_image" }],
    "scopes":      [{ "id", "slug", "name_ar", "name_en" }],
    "types":       [{ "id", "slug", "name_ar", "name_en" }]
  }
}
```

### GET /projects
Returns a paginated list of projects with optional filters.

**Query params:**
| Param        | Type   | Description              |
|--------------|--------|--------------------------|
| `department` | string | Department slug          |
| `type`       | string | Project type slug        |
| `scope`      | string | Scope slug               |
| `page`       | number | Page number (default: 1) |
| `perPage`    | number | Items per page (max: 60) |

**Example:** `GET /projects?department=mansj&type=tvc&scope=set-design`

**Response:**
```json
{
  "data": {
    "data": [ ...Project[] ],
    "meta": { "page", "perPage", "total", "totalPages" }
  }
}
```

---

## Composables

### `useProjectFilters()`
Fetches departments, scopes, and types from `/projects-filters`.
- Key: `"project-filters"` (cached, fetched once per session)
- Returns: `{ data: ProjectsFiltersResponse, pending, error }`

### `useProjects(filters?)`
Fetches projects with optional reactive filters.
- Key: dynamic — changes when filters change, triggers re-fetch automatically
- Returns: `{ data: ProjectsResponse, pending, error }`

### `useProject(slug)`
Fetches a single project by slug.
- Key: `project-${slug}`
- Returns: `{ data: Project, pending, error }`

---

## Types

| Type | File | Description |
|------|------|-------------|
| `ProjectsFiltersResponse` | `types/projectsFilters.ts` | Response shape for `/projects-filters` |
| `ProjectFilters` | `composables/useProjects.ts` | Query params for `/projects` |
| `ProjectsResponse` | `composables/useProjects.ts` | Paginated projects response |
| `Department` | `types/department.ts` | Department with bilingual name + hero_image |
| `Scope` | `types/scope.ts` | Scope with bilingual name |
| `ProjectType` | `types/projectType.ts` | Project type with bilingual name |

---

## Component Tree

```
pages/projects/index.vue
  └── ProjectsHero.vue          ← fetches filters + projects, manages activeFilters
        ├── PageContent.vue     ← passes data + states down (3 instances: ceil/wall/floor)
        │     ├── FilterSection.vue   ← renders filters, emits toggle-filter
        │     └── ProjectsList.vue   ← renders project grid
        ├── LeftSideContent.vue
        ├── RightSideContent.vue
        └── CustomCursor.vue
```

## Filter Flow

1. `ProjectsHero` calls `useProjectFilters()` → `filtersData`
2. `filters` computed maps API data to `FilterItem[]` with `type` field added
3. User clicks a filter → `toggleFilter()` updates `activeFilters` ref
4. `apiFilters` computed converts `activeFilters` → `ProjectFilters` query object
5. `useProjects(apiFilters)` auto re-fetches when `apiFilters` key changes
6. URL query params updated via `router.replace()` for shareable links
7. On mount: URL params parsed and applied to `activeFilters`

## States

| State | Source | Used in |
|-------|--------|---------|
| `filtersPending` | `useProjectFilters().pending` | `FilterSection` skeleton |
| `filtersError` | `useProjectFilters().error` | `FilterSection` error message |
| `projectsPending` | `useProjects().pending` | `ProjectsList` skeleton |
| empty projects | `projects.length === 0` | `ProjectsList` empty state |
