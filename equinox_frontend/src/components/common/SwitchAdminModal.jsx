import React, { useState } from 'react'
import { X, Shield } from 'lucide-react'
import { authAPI } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'

export default function SwitchAdminModal({ isOpen, onClose }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const { show } = useToast()

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!username || !password) return show('Fill in all fields', 'error')
    
    setLoading(true)
    try {
      const { data } = await authAPI.login({ username, password })
      if (data.role !== 'ADMIN') {
        show('Provided account is not an Admin', 'error')
      } else {
        login(data.token, data.username, data.role)
        show('Successfully switched to Admin', 'success')
        onClose()
      }
    } catch (err) {
      show(err.response?.data?.message || 'Invalid credentials', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
      <div className="card animate-in zoom-in-95 duration-200" style={{ width: '100%', maxWidth: 360, padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-secondary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Shield size={18} color="var(--gold)" />
            <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-1)' }}>Switch to Admin</h3>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-3)', cursor: 'pointer', display: 'flex' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: 20, display: 'grid', gap: 14 }}>
          <div>
            <label className="label">Admin Username</label>
            <input
              className="input"
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="admin_username"
              required
            />
          </div>
          <div>
            <label className="label">Admin Password</label>
            <input
              className="input"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-gold"
            disabled={loading}
            style={{ width: '100%', justifyContent: 'center', marginTop: 4 }}
          >
            {loading ? <><span className="spinner"/>Verifying...</> : 'Switch to Admin'}
          </button>
        </form>
      </div>
    </div>
  )
}
