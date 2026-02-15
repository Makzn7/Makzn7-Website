import { projects } from "~/mocks/projects";
import { departments } from "~/mocks/departments";
import { scopes } from "~/mocks/scopes";
import { projectTypes } from "~/mocks/projectTypes";

export default defineEventHandler((event) => {
  const q = getQuery(event);

  const page = Math.max(parseInt(String(q.page ?? "1")), 1);
  const perPage = Math.min(
    Math.max(parseInt(String(q.perPage ?? "24")), 1),
    60,
  );

  const department = q.department ? String(q.department) : null;
  const type = q.type ? String(q.type) : null;
  const scope = q.scope ? String(q.scope) : null;

  let filtered = [...projects];

  if (department) {
    const dep = departments.find((d) => d.slug === department);
    if (dep) filtered = filtered.filter((p) => p.departmentId === dep.id);
  }

  if (type) {
    const t = projectTypes.find((t) => t.slug === type);
    if (t) filtered = filtered.filter((p) => p.typeId === t.id);
  }

  if (scope) {
    const s = scopes.find((s) => s.slug === scope);
    if (s) filtered = filtered.filter((p) => p.scopeIds.includes(s.id));
  }

  const total = filtered.length;
  const totalPages = Math.ceil(total / perPage);

  const start = (page - 1) * perPage;
  const data = filtered.slice(start, start + perPage);

  return {
    data,
    meta: { page, perPage, total, totalPages },
  };
});
