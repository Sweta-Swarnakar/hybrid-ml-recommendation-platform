import { useState, type FormEvent } from 'react'
import { addBook } from '../services/api'

type AdminPageProps = {
  token: string
  onUpdated: () => Promise<void>
}

const initialForm = {
  title: '',
  author: '',
  description: '',
  genre: 'fiction',
  rating: '4',
  imageUrl: '',
  fileUrl: '',
}

export function AdminPage({ token, onUpdated }: AdminPageProps) {
  const [form, setForm] = useState(initialForm)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [bookFile, setBookFile] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitting(true)
    setMessage('')
    try {
      const formData = new FormData()
      formData.append('title', form.title)
      formData.append('author', form.author)
      formData.append('description', form.description)
      formData.append('genre', form.genre)
      formData.append('rating', form.rating)
      if (bookFile) formData.append('file', bookFile)
      else formData.append('fileUrl', form.fileUrl)
      if (imageFile) formData.append('image', imageFile)
      else formData.append('imageUrl', form.imageUrl)

      const response = await addBook(formData, token)
      setMessage(response.message)
      setForm(initialForm)
      setBookFile(null)
      setImageFile(null)
      await onUpdated()
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not add book')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="admin-layout">
      <div className="section-heading compact">
        <div>
          <p className="eyebrow">Admin Console</p>
          <h1>Add books with protected controls.</h1>
        </div>
      </div>

      <form className="panel admin-form" onSubmit={handleSubmit}>
        <div className="form-row two-col">
          <label>
            <span>Title</span>
            <input value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} required />
          </label>
          <label>
            <span>Author</span>
            <input value={form.author} onChange={(event) => setForm((current) => ({ ...current, author: event.target.value }))} required />
          </label>
        </div>

        <div className="form-row">
          <label>
            <span>Description</span>
            <textarea value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} rows={5} required />
          </label>
        </div>

        <div className="form-row two-col">
          <label>
            <span>Genre</span>
            <select value={form.genre} onChange={(event) => setForm((current) => ({ ...current, genre: event.target.value }))}>
              <option value="fiction">fiction</option>
              <option value="non-fiction">non-fiction</option>
              <option value="sci-fi">sci-fi</option>
              <option value="fantasy">fantasy</option>
              <option value="self-help">self-help</option>
            </select>
          </label>
          <label>
            <span>Rating</span>
            <input type="number" min="1" max="5" value={form.rating} onChange={(event) => setForm((current) => ({ ...current, rating: event.target.value }))} />
          </label>
        </div>

        <div className="form-row two-col">
          <label>
            <span>Image upload</span>
            <input type="file" accept="image/*" onChange={(event) => setImageFile(event.target.files?.[0] ?? null)} />
          </label>
          <label>
            <span>Book upload</span>
            <input type="file" onChange={(event) => setBookFile(event.target.files?.[0] ?? null)} />
          </label>
        </div>

        <div className="form-row two-col">
          <label>
            <span>Fallback image URL</span>
            <input value={form.imageUrl} onChange={(event) => setForm((current) => ({ ...current, imageUrl: event.target.value }))} placeholder="Used if no image file is selected" />
          </label>
          <label>
            <span>Fallback file URL</span>
            <input value={form.fileUrl} onChange={(event) => setForm((current) => ({ ...current, fileUrl: event.target.value }))} placeholder="Used if no book file is selected" />
          </label>
        </div>

        {message ? <p className="status-text">{message}</p> : null}
        <button className="primary-btn full" disabled={submitting}>{submitting ? 'Processing...' : 'Add Book'}</button>
      </form>
    </section>
  )
}
