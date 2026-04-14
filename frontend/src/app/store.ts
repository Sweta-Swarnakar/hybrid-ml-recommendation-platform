import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import booksReducer from '../features/books/booksSlice'
import themeReducer from '../features/theme/themeSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    books: booksReducer,
    theme: themeReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
