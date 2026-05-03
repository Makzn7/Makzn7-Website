import type { Scope } from "~/types/scope";

export function useScopes() {
  const { get } = useApi();
  return useAsyncData<Scope[]>("scopes", () => get<Scope[]>("/scopes"));
}
