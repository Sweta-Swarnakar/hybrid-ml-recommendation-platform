import type { Book } from '../types'
import { resolveMediaUrl } from '../utils/media'

type BookGridProps = {
  books: Book[]
  loading: boolean
  error: string
  isLoggedIn: boolean
  page: number
  totalPages: number
  total: number
  hasNextPage: boolean
  hasPrevPage: boolean
  onPreviousPage: () => void
  onNextPage: () => void
  onOpenBook: (id: string) => void
  onRequireAuth: () => void
}

export function BookGrid({
  books,
  loading,
  error,
  isLoggedIn,
  page,
  totalPages,
  total,
  hasNextPage,
  hasPrevPage,
  onPreviousPage,
  onNextPage,
  onOpenBook,
  onRequireAuth,
}: BookGridProps) {
  if (loading) {
    return (
      <section className="book-grid">
        {Array.from({ length: 6 }).map((_, index) => <article key={index} className="book-card skeleton-card panel" />)}
      </section>
    )
  }

  if (error) {
    return <section className="panel empty-state"><h2>Could not load books</h2><p className="muted">{error}</p></section>
  }

  if (!books.length) {
    return <section className="panel empty-state"><h2>No books yet</h2><p className="muted">Add books from the admin area once the backend is ready.</p></section>
  }

  return (
    <>
      <section className="book-grid">
        {books.map((book, index) => (
          <article key={book._id} className="book-card panel" style={{ animationDelay: `${index * 90}ms` }}>
            <div className="book-art">
              {book.imageUrl ? <img src={resolveMediaUrl(book.imageUrl)} alt={book.title} /> : <div className="book-placeholder">{(book.title?.trim()?.charAt(0) || 'B').toUpperCase()}</div>}
            </div>
            <div className="book-copy">
              <div className="book-tags">
                <span>{book.genre}</span>
                <span>{book.rating}/5</span>
              </div>
              <h3>{book.title}</h3>
              <p className="book-author">{book.author}</p>
              <p className="muted clamp-text">{book.description}</p>
            </div>
            <button className="primary-btn full" onClick={() => (isLoggedIn ? onOpenBook(book._id) : onRequireAuth())}>
              {isLoggedIn ? 'Open Details' : 'Unlock Details'}
            </button>
          </article>
        ))}
      </section>

      <div className="pagination-bar panel">
        <div className="pagination-copy">
          <strong>Page {page} of {totalPages}</strong>
          <span className="muted">{total} books in the library</span>
        </div>
        <div className="pagination-actions">
          {hasPrevPage ? (
            <button className="ghost-btn" onClick={onPreviousPage}>
              Previous
            </button>
          ) : null}
          {hasNextPage ? (
            <button className="ghost-btn" onClick={onNextPage}>
              Next
            </button>
          ) : null}
        </div>
      </div>
    </>
  )
}
