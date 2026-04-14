export type ReaderFileType = 'pdf' | 'epub' | 'unknown'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000/api'

export function detectReaderFileType(url: string): ReaderFileType {
  const normalized = url.toLowerCase()

  if (normalized.includes('.epub')) return 'epub'
  if (normalized.includes('.pdf')) return 'pdf'

  return 'unknown'
}

export function getReaderSourceUrl(url: string) {
  if (!url) return ''
  if (/^https?:\/\//i.test(url)) {
    return `${API_BASE_URL}/reader/file?url=${encodeURIComponent(url)}`
  }

  return url
}
