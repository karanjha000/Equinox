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
      <div className="min-h-screen bg-[#0a0f16] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#0f172a] rounded-2xl p-8 border border-[#1c2b42] shadow-2xl text-center">
          <AlertCircle className="w-12 h-12 text-[#ef4444] mx-auto mb-4" />
          <h1 className="text-xl font-bold text-[#f8fafc] mb-2">Invalid Reset Link</h1>
          <p className="text-[#94a3b8] text-sm mb-6">The password reset link is invalid or missing the token.</p>
          <Link to="/forgot-password" className="btn btn-primary w-full justify-center">Request New Link</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0f16] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#0f172a] rounded-2xl p-8 border border-[#1c2b42] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-[#3b82f6] to-transparent opacity-50" />
        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[#f8fafc] tracking-tight mb-2">Set New Password</h1>
          <p className="text-[#94a3b8] text-sm">Please enter your new password below.</p>
        </div>

        {status === 'success' ? (
          <div className="bg-[#1c2b42]/50 border border-[#22c55e]/20 rounded-xl p-6 text-center">
            <CheckCircle2 className="w-12 h-12 text-[#22c55e] mx-auto mb-4" />
            <h3 className="text-[#f8fafc] font-medium mb-2">Password Updated!</h3>
            <p className="text-[#94a3b8] text-sm mb-6">
              Your password has been changed successfully. Redirecting to login...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#cbd5e1] ml-1">New Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-[#64748b]" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  disabled={status === 'loading'}
                  className="input input-bordered w-full pl-10 bg-[#0a0f16] border-[#1c2b42] text-[#f8fafc]"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-[#cbd5e1] ml-1">Confirm New Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-[#64748b]" />
                </div>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  disabled={status === 'loading'}
                  className="input input-bordered w-full pl-10 bg-[#0a0f16] border-[#1c2b42] text-[#f8fafc]"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {status === 'error' && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-[#ef4444]/10 border border-[#ef4444]/20 text-[#ef4444] text-sm">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button 
              type="submit" 
              disabled={status === 'loading' || !password || !confirmPassword}
              className="btn btn-primary w-full justify-center mt-2"
            >
              {status === 'loading' ? <Loader2 className="w-5 h-5 animate-spin" /> : "Reset Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
