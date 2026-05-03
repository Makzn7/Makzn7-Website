type ApiWrapped<T> = { data: T };

export function useApi() {
  const config = useRuntimeConfig();

  const http = $fetch.create({
    baseURL: config.public.apiBase,
    onResponseError({ response }) {
      const status = response.status;
      const message =
        response._data?.message ||
        response._data?.statusMessage ||
        "Unexpected error";
      throw { status, message, raw: response._data };
    },
  });

  // For endpoints that return { data: T }
  async function get<T>(url: string, opts?: Parameters<typeof http>[1]): Promise<T> {
    const res = await (http<ApiWrapped<T>>(url, opts) as Promise<ApiWrapped<T>>);
    return res.data;
  }

  // For endpoints that return the full response as-is (e.g. paginated)
  async function raw<T>(url: string, opts?: Parameters<typeof http>[1]): Promise<T> {
    return http<T>(url, opts) as Promise<T>;
  }

  return { get, raw };
}
