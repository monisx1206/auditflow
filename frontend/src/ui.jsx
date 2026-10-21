import { useEffect, useState } from 'react';

export const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
export const daysFrom = (d) => Math.round((new Date(d) - Date.now()) / 864e5);
export const label = (s) => (s || '').replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase());

const TONE = {
  open: 'amber', in_progress: 'teal', pending_verification: 'violet', closed: 'moss', overdue: 'red',
  planned: 'grey', completed: 'moss', ok: 'moss', exceedance: 'red',
  minor: 'grey', major: 'amber', critical: 'red',
  draft: 'grey', in_review: 'amber', submitted: 'teal', acknowledged: 'moss',
};
export const Badge = ({ v }) => <span className={`badge ${TONE[v] || 'grey'}`}>{label(v)}</span>;

export function Modal({ title, onClose, children, wide }) {
  useEffect(() => {
    const h = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);
  return (
    <div className="scrim" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`modal ${wide ? 'wide' : ''}`} role="dialog" aria-modal="true" aria-label={title}>
        <header><h2>{title}</h2><button className="ghost" onClick={onClose} aria-label="Close">✕</button></header>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}

export const Field = ({ label: l, children }) => <label className="field"><span>{l}</span>{children}</label>;

export const Empty = ({ children }) => <div className="empty">{children}</div>;

// tiny global toast
export const toast = (msg, kind = 'ok') => window.dispatchEvent(new CustomEvent('gc-toast', { detail: { msg, kind } }));
export function Toaster() {
  const [t, setT] = useState(null);
  useEffect(() => {
    const h = (e) => { setT(e.detail); clearTimeout(h.t); h.t = setTimeout(() => setT(null), 3800); };
    window.addEventListener('gc-toast', h);
    return () => window.removeEventListener('gc-toast', h);
  }, []);
  return t ? <div className={`toast ${t.kind}`} role="status">{t.msg}</div> : null;
}
