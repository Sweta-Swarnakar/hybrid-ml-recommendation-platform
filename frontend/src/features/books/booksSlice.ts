import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { getBooks } from '../../services/api'
import type { Book } from '../../types'

type BooksSliceState = {
  items: Book[]
  selectedSort: string
  page: number
  totalPages: number
  total: number
  hasNextPage: boolean
  hasPrevPage: boolean
  loading: boolean
  error: string
}

const initialState: BooksSliceState = {
  items: [],
  selectedSort: 'latest',
  page: 1,
  totalPages: 1,
  total: 0,
  hasNextPage: false,
  hasPrevPage: false,
  loading: true,
  error: '',
}

export const fetchBooks = createAsyncThunk(
  'books/fetchBooks',
  async ({ sort, page }: { sort: string; page: number }, { rejectWithValue }) => {
    try {
      return await getBooks(sort, page)
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Could not load books')
    }
  },
)

const booksSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    setSelectedSort(state, action: PayloadAction<string>) {
      state.selectedSort = action.payload
      state.page = 1
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (state) => {
        state.loading = true
        state.error = ''
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload.data
        state.page = action.payload.page
        state.totalPages = action.payload.totalPages
        state.total = action.payload.total
        state.hasNextPage = action.payload.hasNextPage
        state.hasPrevPage = action.payload.hasPrevPage
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.loading = false
        state.error = typeof action.payload === 'string' ? action.payload : 'Could not load books'
      })
  },
})

export const { setSelectedSort, setPage } = booksSlice.actions
export default booksSlice.reducer
