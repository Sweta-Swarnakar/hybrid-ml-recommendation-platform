import { useEffect, useState } from 'react'
import { deleteBook, getBook, getRecommendations } from '../services/api'
import type { Book } from '../types'
import { resolveMediaUrl } from '../utils/media'
import { detectReaderFileType } from '../utils/reader'

type BookDetailsPageProps = {
  bookId: string
  token: string
  isAdmin: boolean
  onNavigate: (path: string) => void
  onDeleted: () => Promise<void>
}

export function BookDetailsPage({ bookId, token, isAdmin, onNavigate, onDeleted }: BookDetailsPageProps) {
  const [book, setBook] = useState<Book | null>(null)
  const [recommendations, setRecommendations] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function loadDetails() {
      setLoading(true)
      setError('')
      try {
        const [bookResponse, recommendationResponse] = await Promise.all([
          getBook(bookId, token),
          getRecommendations(bookId, token),
        ])
        if (!cancelled) {
          setBook(bookResponse.data)
          setRecommendations(recommendationResponse.data)
        }
      } catch (loadError) {
        if (!cancelled) setError(loadError instanceof Error ? loadError.message : 'Could not load book')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void loadDetails()
    return () => {
      cancelled = true
    }
  }, [bookId, token])

  if (loading) return <section className="panel empty-state"><h2>Loading book details...</h2></section>
  if (error || !book) {
    return (
      <section className="panel empty-state">
        <h2>Could not open this book</h2>
        <p className="muted">{error || 'The book was not found.'}</p>
        <button className="ghost-btn" onClick={() => onNavigate('/')}>Back Home</button>
      </section>
    )
  }

  async function handleDelete() {
    if (!book || !window.confirm(`Delete "${book.title}"?`)) return

    setDeleting(true)
    try {
      await deleteBook(book._id, token)
      await onDeleted()
      onNavigate('/')
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Could not delete book')
    } finally {
      setDeleting(false)
    }
  }

  const coverImage = resolveMediaUrl(book.imageUrl)
  const fileUrl = resolveMediaUrl(book.fileUrl)
  const bookInitial = (book.title?.trim()?.charAt(0) || 'B').toUpperCase()
  const readerType = detectReaderFileType(fileUrl)

  return (
    <section className="details-layout">
      <article className="panel details-card">
        <div className="details-cover">
          {coverImage ? <img src={coverImage} alt={book.title} /> : <div className="book-placeholder large">{bookInitial}</div>}
        </div>
        <div className="details-copy">
          <p className="eyebrow">{book.genre}</p>
          <h1>{book.title}</h1>
          <p className="book-author">{book.author}</p>
          <p className="muted">{book.description}</p>
          <div className="feature-meta">
            <span>Rating {book.rating}/5</span>
            <span>Full details unlocked</span>
            <span>Reader unlocked</span>
          </div>
          <div className="hero-actions">
            <button
              className="primary-btn"
              onClick={() =>
                fileUrl &&
                onNavigate(
                  `/reader?src=${encodeURIComponent(fileUrl)}&title=${encodeURIComponent(book.title)}`,
                )
              }
              disabled={!fileUrl || readerType === 'unknown'}
            >
              Read in App
            </button>
            <a className="ghost-btn link-btn" href={fileUrl || '#'} download>Download</a>
            {isAdmin ? (
              <button className="danger-btn" onClick={handleDelete} disabled={deleting}>
                {deleting ? 'Deleting...' : 'Delete Book'}
              </button>
            ) : null}
          </div>
          {readerType === 'unknown' ? (
            <p className="muted">The built-in reader currently supports PDF and EPUB files.</p>
          ) : null}
        </div>
      </article>

      <article className="panel recommendations-panel">
        <div className="section-heading compact">
          <div>
            <p className="eyebrow">Recommendations</p>
            <h2>Books that you might like</h2>
          </div>
        </div>

        {recommendations.length ? (
          <div className="recommendation-strip">
            <div className="recommendation-track">
              {[...recommendations, ...recommendations].map((item, index) => (
                <button
                  key={`${item._id ?? item.title ?? 'recommendation'}-${index}`}
                  className="recommendation-card"
                  onClick={() => item._id && onNavigate(`/books/${item._id}`)}
                  disabled={!item._id}
                >
                  <div className="recommendation-thumb">
                    {item.imageUrl ? (
                      <img src={resolveMediaUrl(item.imageUrl)} alt={item.title ?? 'Recommended book'} />
                    ) : (
                      <div className="book-placeholder">{(item.title?.trim()?.charAt(0) || 'B').toUpperCase()}</div>
                    )}
                  </div>
                  <strong>{item.title || 'Recommended book'}</strong>
                  <span>{item.author || 'Unknown author'}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <p className="muted">No recommendations yet for this title.</p>
        )}
      </article>
    </section>
  )
}
