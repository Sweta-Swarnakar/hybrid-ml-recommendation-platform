export type ThemeMode = 'dark' | 'light'

const THEME_KEY = 'hybrid-ml-theme'

export function loadStoredTheme(): ThemeMode {
  const stored = window.localStorage.getItem(THEME_KEY)
  return stored === 'light' ? 'light' : 'dark'
}

export function storeTheme(theme: ThemeMode) {
  window.localStorage.setItem(THEME_KEY, theme)
}
