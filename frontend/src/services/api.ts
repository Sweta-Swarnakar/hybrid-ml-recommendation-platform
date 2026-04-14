import type {
  AuthApiResponse,
  Book,
  BooksResponse,
  LoginPayload,
  SignupPayload,
} from '../types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000/api'

type RequestOptions = {
  method?: string
  body?: BodyInit | null
  token?: string
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers = new Headers()

  if (!(options.body instanceof FormData)) headers.set('Content-Type', 'application/json')
  if (options.token) headers.set('Authorization', `Bearer ${options.token}`)

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method ?? 'GET',
    headers,
    body: options.body ?? null,
  })

  const payload = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(payload.message ?? 'Request failed')
  return payload as T
}

export async function signup(payload: SignupPayload) {
  return request<AuthApiResponse>('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function login(payload: LoginPayload) {
  return request<AuthApiResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function getBooks(sort = 'latest', page = 1) {
  return request<BooksResponse>(
    `/books?sort=${encodeURIComponent(sort)}&limit=12&page=${encodeURIComponent(String(page))}`,
  )
}

export async function getBook(bookId: string, token: string) {
  return request<{ data: Book }>(`/books/${bookId}`, { token })
}

export async function getRecommendations(bookId: string, token: string) {
  return request<{ success: boolean; data: Book[] }>(`/books/${bookId}/recommendations`, {
    token,
  })
}

export async function addBook(formData: FormData, token: string) {
  return request<{ success: boolean; message: string; data: Book }>('/books', {
    method: 'POST',
    body: formData,
    token,
  })
}

export async function deleteBook(bookId: string, token: string) {
  return request<{ success: boolean; message: string }>(`/books/${bookId}`, {
    method: 'DELETE',
    token,
  })
}
