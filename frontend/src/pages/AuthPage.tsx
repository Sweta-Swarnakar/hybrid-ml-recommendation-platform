import { useState, type FormEvent } from 'react'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { clearAuthError, loginUser, signupUser } from '../features/auth/authSlice'
import type { LoginPayload, SignupPayload } from '../types'

type AuthPageProps = {
  mode: 'login' | 'signup'
  onNavigate: (path: string) => void
  onAuthenticated: () => void
}

const signupDefaults: SignupPayload = { firstName: '', lastName: '', email: '', password: '' }
const loginDefaults: LoginPayload = { email: '', password: '' }

export function AuthPage({ mode, onNavigate, onAuthenticated }: AuthPageProps) {
  const dispatch = useAppDispatch()
  const { loading, error } = useAppSelector((state) => state.auth)
  const [signupForm, setSignupForm] = useState<SignupPayload>(signupDefaults)
  const [loginForm, setLoginForm] = useState<LoginPayload>(loginDefaults)
  const isLogin = mode === 'login'

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    dispatch(clearAuthError())
    try {
      if (isLogin) await dispatch(loginUser(loginForm)).unwrap()
      else await dispatch(signupUser(signupForm)).unwrap()
      onAuthenticated()
    } catch {
      return
    }
  }

  return (
    <section className="auth-layout">
      <div className="auth-copy">
        <p className="eyebrow">{isLogin ? 'Welcome Back' : 'Join The Library'}</p>
        <h1>{isLogin ? 'Login to open protected details.' : 'Create your reader account.'}</h1>
        <p className="muted">JWT is stored locally and attached to protected requests automatically inside the app.</p>
      </div>

      <form className="panel auth-form" onSubmit={handleSubmit}>
        {!isLogin && (
          <div className="form-row two-col">
            <label>
              <span>First name</span>
              <input value={signupForm.firstName} onChange={(event) => setSignupForm((current) => ({ ...current, firstName: event.target.value }))} required />
            </label>
            <label>
              <span>Last name</span>
              <input value={signupForm.lastName} onChange={(event) => setSignupForm((current) => ({ ...current, lastName: event.target.value }))} required />
            </label>
          </div>
        )}

        <div className="form-row">
          <label>
            <span>Email</span>
            <input
              type="email"
              value={isLogin ? loginForm.email : signupForm.email}
              onChange={(event) =>
                isLogin
                  ? setLoginForm((current) => ({ ...current, email: event.target.value }))
                  : setSignupForm((current) => ({ ...current, email: event.target.value }))
              }
              required
            />
          </label>
        </div>

        <div className="form-row">
          <label>
            <span>Password</span>
            <input
              type="password"
              minLength={6}
              value={isLogin ? loginForm.password : signupForm.password}
              onChange={(event) =>
                isLogin
                  ? setLoginForm((current) => ({ ...current, password: event.target.value }))
                  : setSignupForm((current) => ({ ...current, password: event.target.value }))
              }
              required
            />
          </label>
        </div>

        {error ? <p className="error-text">{error}</p> : null}

        <button className="primary-btn full" disabled={loading}>
          {loading ? 'Please wait...' : isLogin ? 'Login' : 'Signup'}
        </button>

        <button type="button" className="text-link" onClick={() => onNavigate(isLogin ? '/signup' : '/login')}>
          {isLogin ? 'Need an account? Sign up' : 'Already have an account? Login'}
        </button>
      </form>
    </section>
  )
}
