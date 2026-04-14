type AuthModalProps = {
  isOpen: boolean
  onClose: () => void
  onNavigate: (path: string) => void
}

export function AuthModal({ isOpen, onClose, onNavigate }: AuthModalProps) {
  if (!isOpen) return null

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card panel" onClick={(event) => event.stopPropagation()}>
        <p className="eyebrow">Access Required</p>
        <h2>Login or Signup</h2>
        <p className="muted">You can browse the catalog freely. To unlock book details, reading links, downloads, and recommendations, sign in first.</p>
        <div className="modal-actions">
          <button className="primary-btn" onClick={() => { onClose(); onNavigate('/login') }}>Login</button>
          <button className="ghost-btn" onClick={() => { onClose(); onNavigate('/signup') }}>Signup</button>
        </div>
      </div>
    </div>
  )
}
