import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { TrendingUp, Eye, EyeOff } from 'lucide-react'
import { authAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

export default function LoginPage() {
  const [tab, setTab] = useState('login')
  const [step, setStep] = useState(1) // 1 = details, 2 = otp (for registration)
  const [form, setForm] = useState({ username: '', password: '', email: '', otp: '' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const { show } = useToast()
  const nav = useNavigate()
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleLogin = async () => {
    if (!form.username || !form.password) return show('Fill in all fields', 'error')
    setLoading(true)
    try {
      const { data } = await authAPI.login({ username: form.username, password: form.password })
      login(data.token, data.username, data.role)
      show(`Welcome back, ${data.username}!`, 'success')
      nav('/dashboard')
    } catch (e) {
      show(e.response?.data?.message || 'Invalid credentials', 'error')
    } finally { setLoading(false) }
  }

  const handleSendOtp = async () => {
    if (!form.username || !form.password || !form.email) return show('Fill in all fields', 'error')
    setLoading(true)
    try {
      await authAPI.sendOtp(form.email)
      show('OTP sent to your email! (Valid for 2 minutes)', 'success')
      setStep(2)
    } catch (e) {
      show(e.response?.data?.message || 'Failed to send OTP', 'error')
    } finally { setLoading(false) }
  }

  const handleRegister = async () => {
    if (!form.username || !form.password || !form.email || !form.otp) return show('Fill in all fields', 'error')
    setLoading(true)
    try {
      await authAPI.register({ username: form.username, password: form.password, email: form.email, otp: form.otp })
      show('Account created! Please login.', 'success')
      setTab('login')
      setStep(1)
      setForm({ username: '', password: '', email: '', otp: '' })
    } catch (e) {
      show(e.response?.data?.message || 'Registration failed. OTP may be invalid or expired.', 'error')
    } finally { setLoading(false) }
  }

  const switchTab = (t) => {
    setTab(t)
    setStep(1)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)', position: 'relative', overflow: 'hidden' }}>
      {/* BG decoration */}
      <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(245,166,35,0.06) 0%, transparent 70%)', pointerEvents: 'none' }}/>
      <div style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: '40vw', height: '40vw', background: 'radial-gradient(circle, rgba(6,182,212,0.05) 0%, transparent 70%)', pointerEvents: 'none' }}/>

      <div className="fade-up" style={{ width: '100%', maxWidth: 420, padding: '0 20px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ width: 52, height: 52, background: 'var(--gold)', borderRadius: 14, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
            <TrendingUp size={26} color="#080d1a" strokeWidth={2.5}/>
          </div>
          <h1 style={{ fontFamily: "'DM Serif Display',serif", fontSize: '2rem', color: 'var(--text-1)', lineHeight: 1.1 }}>Equinox OS</h1>
          <p style={{ color: 'var(--text-3)', fontSize: 13, marginTop: 6, letterSpacing: '0.05em' }}>FINANCIAL ASSET MANAGEMENT PLATFORM</p>
        </div>

        <div className="card" style={{ padding: '30px 28px' }}>
          {/* Tabs */}
          <div style={{ display: 'flex', background: 'var(--bg-secondary)', borderRadius: 10, padding: 4, marginBottom: 26 }}>
            {['login','register'].map(t => (
              <button key={t} onClick={() => switchTab(t)} style={{ flex: 1, padding: '8px', border: 'none', borderRadius: 8, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: 13, transition: 'all 0.18s', textTransform: 'capitalize', background: tab === t ? 'var(--bg-card)' : 'transparent', color: tab === t ? 'var(--text-1)' : 'var(--text-3)', boxShadow: tab === t ? '0 1px 4px rgba(0,0,0,0.3)' : 'none' }}>
                {t}
              </button>
            ))}
          </div>

          <div style={{ display: 'grid', gap: 14 }}>
            {tab === 'register' && step === 2 ? (
              <div>
                <label className="label">Enter 6-Digit OTP</label>
                <input className="input" placeholder="000000" maxLength={6} value={form.otp} onChange={e => set('otp', e.target.value)} onKeyDown={e => e.key === 'Enter' && handleRegister()}/>
                <p style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 8 }}>We sent a verification code to {form.email}.</p>
                <button onClick={() => setStep(1)} style={{ background: 'none', border: 'none', color: 'var(--gold)', fontSize: 12, cursor: 'pointer', marginTop: 4, padding: 0 }}>Edit details / Resend</button>
              </div>
            ) : (
              <>
                <div>
                  <label className="label">Username</label>
                  <input className="input" placeholder="your_username" value={form.username} onChange={e => set('username', e.target.value)} onKeyDown={e => e.key === 'Enter' && tab === 'login' && handleLogin()}/>
                </div>
                {tab === 'register' && (
                  <div>
                    <label className="label">Email</label>
                    <input className="input" type="email" placeholder="you@example.com" value={form.email} onChange={e => set('email', e.target.value)}/>
                  </div>
                )}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label className="label" style={{ marginBottom: 0 }}>Password</label>
                    {tab === 'login' && (
                      <Link to="/forgot-password" style={{ fontSize: 12, color: 'var(--gold)', textDecoration: 'none', marginBottom: 6 }}>Forgot Password?</Link>
                    )}
                  </div>
                  <div style={{ position: 'relative' }}>
                    <input className="input" type={showPw ? 'text' : 'password'} placeholder="••••••••" value={form.password} onChange={e => set('password', e.target.value)} onKeyDown={e => e.key === 'Enter' && tab === 'login' && handleLogin()} style={{ paddingRight: 44 }}/>
                    <button onClick={() => setShowPw(s => !s)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', display: 'flex' }}>
                      {showPw ? <EyeOff size={16}/> : <Eye size={16}/>}
                    </button>
                  </div>
                </div>
              </>
            )}
            
            <button className="btn btn-gold" style={{ width: '100%', justifyContent: 'center', marginTop: 4 }}
              onClick={tab === 'login' ? handleLogin : (step === 1 ? handleSendOtp : handleRegister)} disabled={loading}>
              {loading ? (
                <><span className="spinner"/>{tab === 'login' ? 'Signing in…' : (step === 1 ? 'Sending OTP…' : 'Creating account…')}</>
              ) : (
                tab === 'login' ? 'Sign In' : (step === 1 ? 'Verify Email' : 'Complete Registration')
              )}
            </button>
          </div>
        </div>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: 'var(--text-3)' }}>
          Secured with JWT authentication
        </p>
      </div>
    </div>
  )
}
