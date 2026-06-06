import React from 'react'
import { AlertTriangle } from 'lucide-react'
export default function ConfirmDialog({ title, message, onConfirm, onCancel, loading }) {
  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && onCancel()}>
      <div className="modal" style={{ maxWidth: 380 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, textAlign: 'center' }}>
          <div style={{ width: 52, height: 52, background: 'rgba(244,63,94,0.12)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AlertTriangle size={24} color="var(--rose)"/>
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-1)', marginBottom: 6 }}>{title}</h3>
            <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.5 }}>{message}</p>
          </div>
          <div style={{ display: 'flex', gap: 10, width: '100%' }}>
            <button className="btn btn-outline" style={{ flex: 1 }} onClick={onCancel}>Cancel</button>
            <button className="btn btn-red" style={{ flex: 1 }} onClick={onConfirm} disabled={loading}>
              {loading ? <><span className="spinner"/> Deleting…</> : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
