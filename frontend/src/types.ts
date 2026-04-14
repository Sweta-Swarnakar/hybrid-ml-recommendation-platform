export type Role = 'user' | 'admin' | 'researcher'

export type User = {
  _id: string
  firstName: string
  lastName: string
  email: string
  role: Role
}

export type AuthState = {
  token: string
  user: User | null
}

export type Book = {
  _id: string
  title: string
  author: string
  description: string
  genre: string
  rating: number
  fileUrl?: string
  imageUrl?: string
}

export type BooksResponse = {
  data: Book[]
  page: number
  limit: number
  total: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export type AuthApiResponse = {
  success: boolean
  token: string
  data: User
}

export type SignupPayload = {
  firstName: string
  lastName: string
  email: string
  password: string
}

export type LoginPayload = {
  email: string
  password: string
}
