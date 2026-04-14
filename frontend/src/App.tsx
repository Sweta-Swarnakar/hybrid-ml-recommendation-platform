import { useEffect, useMemo, useState } from 'react'
import { Navigate, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom'
import './App.css'
import { useAppDispatch, useAppSelector } from './app/hooks'
import { Navbar } from './components/Navbar'
import { AuthModal } from './components/AuthModal'
import { BookGrid } from './components/BookGrid'
import { AdminPage } from './pages/AdminPage'
import { AuthPage } from './pages/AuthPage'
import { BookDetailsPage } from './pages/BookDetailsPage'
import { ReaderPage } from './pages/ReaderPage'
import { logout } from './features/auth/authSlice'
import { fetchBooks, setPage, setSelectedSort } from './features/books/booksSlice'
import { toggleTheme } from './features/theme/themeSlice'
import { resolveMediaUrl } from './utils/media'

function RouterBookPage({ token }: { token: string }) {
  const navigate = useNavigate()
  const { id = '' } = useParams()
  const isAdmin = useAppSelector((state) => state.auth.user?.role === 'admin')
  const dispatch = useAppDispatch()

  async function handleDeleted() {
    await dispatch(fetchBooks({ sort: 'latest', page: 1 }))
  }

  return (
    <BookDetailsPage
      bookId={id}
      token={token}
      isAdmin={Boolean(isAdmin)}
      onNavigate={navigate}
      onDeleted={handleDeleted}
    />
  )
}

export default function App() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const { token, user } = useAppSelector((state) => state.auth)
  const {
    items: books,
    selectedSort,
    page,
    totalPages,
    total,
    hasNextPage,
    hasPrevPage,
    loading: booksLoading,
    error: booksError,
  } = useAppSelector(
    (state) => state.books,
  )
  const themeMode = useAppSelector((state) => state.theme.mode)
  const isLoggedIn = Boolean(token && user)
  const isAdmin = user?.role === 'admin'
  const heroBook = useMemo(() => books[0] ?? null, [books])

  useEffect(() => {
    void dispatch(fetchBooks({ sort: selectedSort, page }))
  }, [dispatch, selectedSort, page])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', themeMode)
  }, [themeMode])

  useEffect(() => {
    if (!isLoggedIn && location.pathname.startsWith('/books/')) {
      setAuthModalOpen(true)
    }
  }, [isLoggedIn, location.pathname])

  async function refreshBooks() {
    await dispatch(fetchBooks({ sort: selectedSort, page }))
  }

  function handleLogout() {
    dispatch(logout())
    if (location.pathname.startsWith('/books/') || location.pathname === '/admin') {
      navigate('/')
    }
  }

  const routeName =
    location.pathname === '/login'
      ? 'login'
      : location.pathname === '/signup'
        ? 'signup'
        : location.pathname === '/admin'
          ? 'admin'
          : location.pathname.startsWith('/books/')
            ? 'book'
            : 'home'

  return (
    <div className="app-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <Navbar
        isLoggedIn={isLoggedIn}
        isAdmin={isAdmin}
        user={user}
        themeMode={themeMode}
        routeName={routeName}
        onNavigate={navigate}
        onLogout={handleLogout}
        onToggleTheme={() => dispatch(toggleTheme())}
      />

      <main className="page-frame">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <section className="hero-shell">
                  {isLoggedIn ? (
                    <div className="hero-copy">
                      <p className="eyebrow">Welcome back</p>
                      <h1>Dive into your personalized reading experience.</h1>
                      <p className="muted hero-text">
                        Explore curated books, unlock full descriptions, and enjoy seamless reading with smart recommendations tailored just for you.
                      </p>
                      <div className="hero-actions">
                        <div className="continue-animation">
                          <div className="book-icon">📖</div>
                          <div className="pulse-ring"></div>
                          <div className="pulse-ring pulse-ring-delay"></div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="hero-copy">
                      <p className="eyebrow">Hybrid ML Recommendation Platform</p>
                      <h1>Discover books with a cinematic, login-aware reading flow.</h1>
                      <p className="muted hero-text">
                        Browse the library without signing in, then unlock descriptions, read and
                        download actions, and animated recommendations after authentication.
                      </p>
                      <div className="hero-actions">
                        <button className="primary-btn" onClick={() => navigate('/signup')}>
                          Start Reading
                        </button>
                        <button className="ghost-btn" onClick={() => navigate('/login')}>
                          I already have an account
                        </button>
                      </div>
                    </div>
                  )}
                  <div className="hero-feature panel">
                    <div className="hero-orbit" />
                    <div className="featured-visual">
                      {heroBook?.imageUrl ? (
                        <img src={resolveMediaUrl(heroBook.imageUrl)} alt={heroBook.title} />
                      ) : (
                        <div className="book-placeholder">N</div>
                      )}
                    </div>
                    <p className="mini-label">Featured pick</p>
                    <h2>{heroBook?.title ?? 'Your next favorite story'}</h2>
                    <p className="muted">
                      {heroBook?.description ??
                        'Once your backend is running, books will appear here automatically.'}
                    </p>
                    <div className="feature-meta">
                      <span>{heroBook?.author ?? 'Library author'}</span>
                      <span>{heroBook?.genre ?? 'curated genre'}</span>
                      <span>{heroBook ? `${heroBook.rating}/5` : 'reader rating'}</span>
                    </div>
                  </div>
                </section>

                <section className="section-heading">
                  <div>
                    <p className="eyebrow">Books List</p>
                    <h2>See books now, open details after login.</h2>
                  </div>
                  <div className="sort-pills">
                    {['latest', 'rating', 'title'].map((sort) => (
                      <button
                        key={sort}
                        className={selectedSort === sort ? 'pill active' : 'pill'}
                        onClick={() => dispatch(setSelectedSort(sort))}
                      >
                        {sort}
                      </button>
                    ))}
                  </div>
                </section>

                <BookGrid
                  books={books}
                  loading={booksLoading}
                  error={booksError}
                  isLoggedIn={isLoggedIn}
                  page={page}
                  totalPages={totalPages}
                  total={total}
                  hasNextPage={hasNextPage}
                  hasPrevPage={hasPrevPage}
                  onPreviousPage={() => dispatch(setPage(Math.max(1, page - 1)))}
                  onNextPage={() => dispatch(setPage(Math.min(totalPages, page + 1)))}
                  onOpenBook={(id) => navigate(`/books/${id}`)}
                  onRequireAuth={() => setAuthModalOpen(true)}
                />
              </>
            }
          />

          <Route
            path="/login"
            element={
              <AuthPage
                mode="login"
                onNavigate={navigate}
                onAuthenticated={() => {
                  setAuthModalOpen(false)
                  navigate('/')
                }}
              />
            }
          />

          <Route
            path="/signup"
            element={
              <AuthPage
                mode="signup"
                onNavigate={navigate}
                onAuthenticated={() => {
                  setAuthModalOpen(false)
                  navigate('/')
                }}
              />
            }
          />

          <Route
            path="/books/:id"
            element={
              isLoggedIn ? <RouterBookPage token={token} /> : <Navigate to="/" replace />
            }
          />

          <Route
            path="/reader"
            element={
              isLoggedIn ? <ReaderPage /> : <Navigate to="/" replace />
            }
          />

          <Route
            path="/admin"
            element={
              isAdmin ? <AdminPage token={token} onUpdated={refreshBooks} /> : <Navigate to="/" replace />
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} onNavigate={navigate} />
    </div>
  )
}
