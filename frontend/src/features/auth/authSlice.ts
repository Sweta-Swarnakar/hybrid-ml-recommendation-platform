import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { login, signup } from '../../services/api'
import { clearStoredAuth, loadStoredAuth, storeAuth } from '../../utils/auth'
import type { LoginPayload, SignupPayload, User } from '../../types'

type AuthSliceState = {
  token: string
  user: User | null
  loading: boolean
  error: string
}

const persistedAuth = loadStoredAuth()

const initialState: AuthSliceState = {
  token: persistedAuth?.token ?? '',
  user: persistedAuth?.user ?? null,
  loading: false,
  error: '',
}

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (payload: LoginPayload, { rejectWithValue }) => {
    try {
      return await login(payload)
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Login failed')
    }
  },
)

export const signupUser = createAsyncThunk(
  'auth/signupUser',
  async (payload: SignupPayload, { rejectWithValue }) => {
    try {
      return await signup(payload)
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Signup failed')
    }
  },
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError(state) {
      state.error = ''
    },
    logout(state) {
      state.token = ''
      state.user = null
      state.loading = false
      state.error = ''
      clearStoredAuth()
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = ''
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.token = action.payload.token
        state.user = action.payload.data
        storeAuth({ token: state.token, user: state.user })
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = typeof action.payload === 'string' ? action.payload : 'Login failed'
      })
      .addCase(signupUser.pending, (state) => {
        state.loading = true
        state.error = ''
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false
        state.token = action.payload.token
        state.user = action.payload.data
        storeAuth({ token: state.token, user: state.user })
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false
        state.error = typeof action.payload === 'string' ? action.payload : 'Signup failed'
      })
  },
})

export const { clearAuthError, logout } = authSlice.actions
export default authSlice.reducer
