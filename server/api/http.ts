export const useHttp = () => {
  const config = useRuntimeConfig()
  return $fetch.create({
    baseURL: config.public.apiBase,
    onResponseError({ response }) {
      const status = response.status
      const message =
        (response._data && (response._data.message || response._data.statusMessage)) ||
        'Unexpected error'
      throw { status, message, raw: response._data }
    },
  })
}