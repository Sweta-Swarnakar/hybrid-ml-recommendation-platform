import type { User } from '../types'

type NavbarProps = {
  isLoggedIn: boolean
  isAdmin: boolean
  user: User | null
  themeMode: 'dark' | 'light'
  routeName: string
  onNavigate: (path: string) => void
  onLogout: () => void
  onToggleTheme: () => void
}

export function Navbar({
  isLoggedIn,
  isAdmin,
  user,
  themeMode,
  routeName,
  onNavigate,
  onLogout,
  onToggleTheme,
}: NavbarProps) {
  return (
    <header className="navbar">
      <button className="brand" onClick={() => onNavigate('/')}>
        <span className="brand-mark" />
        <span>
          <strong>InkForge</strong>
          <small>hybrid recommendations</small>
        </span>
      </button>

      <nav className="nav-links">
        <button className={routeName === 'home' ? 'nav-link active' : 'nav-link'} onClick={() => onNavigate('/')}>Home</button>
        {!isLoggedIn && <button className={routeName === 'login' ? 'nav-link active' : 'nav-link'} onClick={() => onNavigate('/login')}>Login</button>}
        {!isLoggedIn && <button className={routeName === 'signup' ? 'nav-link active' : 'nav-link'} onClick={() => onNavigate('/signup')}>Signup</button>}
        {isAdmin && <button className={routeName === 'admin' ? 'nav-link active' : 'nav-link'} onClick={() => onNavigate('/admin')}>Admin</button>}
      </nav>

      <div className="nav-user">
        <button className="ghost-btn small theme-toggle" onClick={onToggleTheme}>
          {themeMode === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </button>
        {user ? (
          <>
            <div className="user-chip">
              <span>{user.firstName} {user.lastName}</span>
              <small>{user.role}</small>
            </div>
            <button className="ghost-btn small" onClick={onLogout}>Logout</button>
          </>
        ) : (
          <button className="primary-btn small" onClick={() => onNavigate('/login')}>Enter Library</button>
        )}
      </div>
    </header>
  )
}
