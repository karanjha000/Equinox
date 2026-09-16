import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { authAPI } from '../services/api'
import { Lock, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react'

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const navigate = useNavigate()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [status, setStatus] = useState('idle')
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    if (!token) {
      setStatus('invalid_token')
    }
  }, [token])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setStatus('error')
      setErrorMsg("Passwords do not match")
      return
    }
    
    setStatus('loading')
    try {
      await authAPI.resetPassword(token, password)
      setStatus('success')
      setTimeout(() => navigate('/login'), 3000)
    } catch (err) {
      console.error(err)
      setStatus('error')
      setErrorMsg(err.response?.data?.message || 'Failed to reset password. Token may be expired.')
    }
  }

  if (status === 'invalid_token') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)', position: 'relative', overflow: 'hidden' }}>
        <div className="fade-up card" style={{ width: '100%', maxWidth: 420, padding: '30px 28px', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
            <AlertCircle size={48} color="#ef4444" />
          </div>
          <h1 style={{ fontFamily: "'DM Serif Display',serif", fontSize: '1.5rem', color: 'var(--text-1)', marginBottom: 8 }}>Invalid Reset Link</h1>
          <p style={{ color: 'var(--text-3)', fontSize: 13, marginBottom: 24 }}>The password reset link is invalid or missing the token.</p>
          <Link to="/forgot-password" className="btn btn-gold" style={{ display: 'block', width: '100%', textAlign: 'center', boxSizing: 'border-box' }}>Request New Link</Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)', position: 'relative', overflow: 'hidden' }}>
      {/* BG decoration */}
      <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(245,166,35,0.06) 0%, transparent 70%)', pointerEvents: 'none' }}/>
      
      <div className="fade-up" style={{ width: '100%', maxWidth: 420, padding: '0 20px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <h1 style={{ fontFamily: "'DM Serif Display',serif", fontSize: '2rem', color: 'var(--text-1)', lineHeight: 1.1 }}>Set New Password</h1>
          <p style={{ color: 'var(--text-3)', fontSize: 13, marginTop: 6, letterSpacing: '0.05em' }}>Please enter your new password below.</p>
        </div>

        <div className="card" style={{ padding: '30px 28px' }}>
          {status === 'success' ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
                <CheckCircle2 size={48} color="#22c55e" />
              </div>
              <h3 style={{ color: 'var(--text-1)', marginBottom: 8 }}>Password Updated!</h3>
              <p style={{ color: 'var(--text-3)', fontSize: 13 }}>
                Your password has been changed successfully. Redirecting to login...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 14 }}>
              <div>
                <label className="label">New Password</label>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', display: 'flex', pointerEvents: 'none' }}>
                    <Lock size={16} color="var(--text-3)" />
                  </div>
                  <input
                    className="input"
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    disabled={status === 'loading'}
                    placeholder="••••••••"
                    style={{ paddingLeft: 38, width: '100%', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div>
                <label className="label">Confirm New Password</label>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', display: 'flex', pointerEvents: 'none' }}>
                    <Lock size={16} color="var(--text-3)" />
                  </div>
                  <input
                    className="input"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    disabled={status === 'loading'}
                    placeholder="••••••••"
                    style={{ paddingLeft: 38, width: '100%', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              {status === 'error' && (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: 12, borderRadius: 8, background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444', fontSize: 13 }}>
                  <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 2 }} />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button 
                type="submit" 
                disabled={status === 'loading' || !password || !confirmPassword}
                className="btn btn-gold" 
                style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}
              >
                {status === 'loading' ? <><span className="spinner"/> Processing...</> : "Reset Password"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
