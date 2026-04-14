import { createSlice } from '@reduxjs/toolkit'
import { loadStoredTheme, storeTheme, type ThemeMode } from '../../utils/theme'

type ThemeState = {
  mode: ThemeMode
}

const initialState: ThemeState = {
  mode: loadStoredTheme(),
}

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme(state) {
      state.mode = state.mode === 'dark' ? 'light' : 'dark'
      storeTheme(state.mode)
    },
    setTheme(state, action: { payload: ThemeMode }) {
      state.mode = action.payload
      storeTheme(state.mode)
    },
  },
})

export const { toggleTheme, setTheme } = themeSlice.actions
export default themeSlice.reducer
