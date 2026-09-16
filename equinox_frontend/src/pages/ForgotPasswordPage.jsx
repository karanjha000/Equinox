import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { authAPI } from '../services/api'
import { Mail, ArrowLeft, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle, loading, success, error
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) return
    setStatus('loading')
    try {
      await authAPI.forgotPassword(email)
      setStatus('success')
    } catch (err) {
      console.error(err)
      setStatus('error')
      setErrorMsg(err.response?.data?.message || 'Failed to send reset link.')
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)', position: 'relative', overflow: 'hidden' }}>
      {/* BG decoration */}
      <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(245,166,35,0.06) 0%, transparent 70%)', pointerEvents: 'none' }}/>
      
      <div className="fade-up" style={{ width: '100%', maxWidth: 420, padding: '0 20px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <h1 style={{ fontFamily: "'DM Serif Display',serif", fontSize: '2rem', color: 'var(--text-1)', lineHeight: 1.1 }}>Reset Password</h1>
          <p style={{ color: 'var(--text-3)', fontSize: 13, marginTop: 6, letterSpacing: '0.05em' }}>
            Enter your email address to receive a reset link.
          </p>
        </div>

        <div className="card" style={{ padding: '30px 28px' }}>
          {status === 'success' ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
                <CheckCircle2 size={48} color="#22c55e" />
              </div>
              <h3 style={{ color: 'var(--text-1)', marginBottom: 8 }}>Check your email</h3>
              <p style={{ color: 'var(--text-3)', fontSize: 13, marginBottom: 24 }}>
                If an account exists for {email}, you will receive a password reset link shortly.
              </p>
              <Link to="/login" className="btn btn-gold" style={{ display: 'block', width: '100%', textAlign: 'center', boxSizing: 'border-box' }}>
                Return to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 14 }}>
              <div>
                <label className="label">Email Address</label>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', display: 'flex', pointerEvents: 'none' }}>
                    <Mail size={16} color="var(--text-3)" />
                  </div>
                  <input
                    className="input"
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    disabled={status === 'loading'}
                    placeholder="name@company.com"
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
                disabled={status === 'loading' || !email}
                className="btn btn-gold" 
                style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}
              >
                {status === 'loading' ? <><span className="spinner"/> Sending...</> : 'Send Reset Link'}
              </button>
            </form>
          )}
        </div>

        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-3)', textDecoration: 'none', transition: 'color 0.2s' }}>
            <ArrowLeft size={16} />
            Back to login
          </Link>
        </div>
      </div>
    </div>
  )
}
