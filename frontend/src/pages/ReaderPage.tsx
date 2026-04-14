import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { GlobalWorkerOptions, getDocument, type PDFDocumentProxy } from 'pdfjs-dist'
import { ReactReader } from 'react-reader'
import { detectReaderFileType, getReaderSourceUrl } from '../utils/reader'

GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString()

export function ReaderPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const source = searchParams.get('src') ?? ''
  const title = searchParams.get('title') ?? 'Book Reader'
  const fileType = useMemo(() => detectReaderFileType(source), [source])
  const readerSource = useMemo(() => getReaderSourceUrl(source), [source])

  return (
    <section className="reader-shell">
      <div className="reader-topbar panel">
        <div>
          <p className="eyebrow">Reader</p>
          <h1>{title}</h1>
        </div>
        <div className="hero-actions">
          <button className="ghost-btn" onClick={() => navigate(-1)}>
            Back
          </button>
          {source ? (
            <a className="primary-btn link-btn" href={readerSource || source} download>
              Download
            </a>
          ) : null}
        </div>
      </div>

      {!source ? (
        <section className="panel empty-state">
          <h2>No file selected</h2>
          <p className="muted">Choose a book first, then open the reader again.</p>
        </section>
      ) : fileType === 'pdf' ? (
        <PdfReader source={readerSource} />
      ) : fileType === 'epub' ? (
        <EpubReader source={readerSource} title={title} />
      ) : (
        <section className="panel empty-state">
          <h2>Unsupported format</h2>
          <p className="muted">This reader currently supports PDF and EPUB files.</p>
          <a className="primary-btn link-btn" href={readerSource || source} download>
            Download Instead
          </a>
        </section>
      )}
    </section>
  )
}

function PdfReader({ source }: { source: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [documentProxy, setDocumentProxy] = useState<PDFDocumentProxy | null>(null)
  const [pageNumber, setPageNumber] = useState(1)
  const [pageCount, setPageCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    async function loadPdf() {
      setLoading(true)
      setError('')

      try {
        const response = await fetch(source)
        if (!response.ok) {
          throw new Error(`Could not fetch PDF file (${response.status})`)
        }

        const data = new Uint8Array(await response.arrayBuffer())
        const pdf = await getDocument({ data }).promise
        if (!active) return
        setDocumentProxy(pdf)
        setPageCount(pdf.numPages)
        setPageNumber(1)
      } catch (loadError) {
        if (!active) return
        setError(loadError instanceof Error ? loadError.message : 'Could not load PDF')
      } finally {
        if (active) setLoading(false)
      }
    }

    void loadPdf()

    return () => {
      active = false
    }
  }, [source])

  useEffect(() => {
    let cancelled = false

    async function renderPage() {
      if (!documentProxy || !canvasRef.current) return

      const page = await documentProxy.getPage(pageNumber)
      if (cancelled || !canvasRef.current) return

      const viewport = page.getViewport({ scale: 1.4 })
      const canvas = canvasRef.current
      const context = canvas.getContext('2d')

      if (!context) return

      canvas.width = viewport.width
      canvas.height = viewport.height

      await page.render({
        canvas,
        canvasContext: context,
        viewport,
      }).promise
    }

    void renderPage()

    return () => {
      cancelled = true
    }
  }, [documentProxy, pageNumber])

  if (loading) {
    return <section className="panel empty-state"><h2>Loading PDF...</h2></section>
  }

  if (error) {
    return <section className="panel empty-state"><h2>Could not open PDF</h2><p className="muted">{error}</p></section>
  }

  return (
    <section className="reader-panel panel">
      <div className="reader-toolbar">
        <button className="ghost-btn" onClick={() => setPageNumber((page) => Math.max(1, page - 1))} disabled={pageNumber <= 1}>
          Previous
        </button>
        <span className="reader-status">Page {pageNumber} of {pageCount}</span>
        <button className="ghost-btn" onClick={() => setPageNumber((page) => Math.min(pageCount, page + 1))} disabled={pageNumber >= pageCount}>
          Next
        </button>
      </div>
      <div className="pdf-canvas-wrap">
        <canvas ref={canvasRef} className="pdf-canvas" />
      </div>
    </section>
  )
}

function EpubReader({ source, title }: { source: string; title: string }) {
  const objectUrlRef = useRef<string | null>(null)
  const [readerUrl, setReaderUrl] = useState('')
  const [location, setLocation] = useState<string | number>(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    async function loadEpub() {
      setLoading(true)
      setError('')
      setReaderUrl('')

      try {
        const response = await fetch(source)
        if (!response.ok) {
          throw new Error(`Could not fetch EPUB file (${response.status})`)
        }

        const data = await response.arrayBuffer()
        const blob = new Blob([data], { type: 'application/epub+zip' })
        objectUrlRef.current = URL.createObjectURL(blob)

        if (active) {
          setReaderUrl(objectUrlRef.current)
          setLoading(false)
        }
      } catch (loadError) {
        if (!active) return
        setError(loadError instanceof Error ? loadError.message : 'Could not open EPUB')
        setLoading(false)
      }
    }

    void loadEpub()

    return () => {
      active = false
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current)
        objectUrlRef.current = null
      }
    }
  }, [source])

  if (loading) {
    return <section className="panel empty-state"><h2>Loading EPUB...</h2></section>
  }

  if (error || !readerUrl) {
    return <section className="panel empty-state"><h2>Could not open EPUB</h2><p className="muted">{error || 'Reader URL was not created.'}</p></section>
  }

  return (
    <section className="reader-panel panel">
      <div className="react-reader-wrap">
        <ReactReader
          title={title}
          url={readerUrl}
          location={location}
          locationChanged={(epubcfi: string) => setLocation(epubcfi)}
          showToc
          epubInitOptions={{ openAs: 'epub' }}
          epubOptions={{ flow: 'paginated', spread: 'none' }}
        />
      </div>
    </section>
  )
}
