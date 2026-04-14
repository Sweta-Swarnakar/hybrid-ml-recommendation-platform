import type { AuthState } from '../types'

const AUTH_KEY = 'hybrid-ml-auth'

export function loadStoredAuth(): AuthState | null {
  try {
    const value = window.localStorage.getItem(AUTH_KEY)
    return value ? (JSON.parse(value) as AuthState) : null
  } catch {
    return null
  }
}

export function storeAuth(auth: AuthState) {
  window.localStorage.setItem(AUTH_KEY, JSON.stringify(auth))
}

export function clearStoredAuth() {
  window.localStorage.removeItem(AUTH_KEY)
}
