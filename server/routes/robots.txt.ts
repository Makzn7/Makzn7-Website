const PRIVATE_PATHS = [
  "/dashboard",
  "/admin",
  "/login",
  "/register",
  "/cart",
  "/checkout",
  "/account",
  "/profile",
  "/api",
];

export default defineEventHandler((event) => {
  const config = useRuntimeConfig(event);
  const siteUrl = String(config.public.siteUrl).replace(/\/+$/, "");
  const disallowRules = PRIVATE_PATHS.flatMap((path) => [
    `Disallow: ${path}`,
    `Disallow: /ar${path}`,
  ]);

  setHeader(event, "Content-Type", "text/plain; charset=UTF-8");

  return [
    "User-agent: *",
    "Allow: /",
    ...disallowRules,
    "",
    `Sitemap: ${siteUrl}/sitemap.xml`,
    "",
  ].join("\n");
});
