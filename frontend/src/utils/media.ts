const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000/api'

function getBackendOrigin() {
  return API_BASE_URL.replace(/\/api\/?$/, '')
}

export function resolveMediaUrl(path?: string) {
  if (!path) return ''
  if (/^https?:\/\//i.test(path)) return path
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${getBackendOrigin()}${normalizedPath}`
}
