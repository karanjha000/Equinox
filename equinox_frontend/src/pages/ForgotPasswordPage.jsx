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
    <div className="min-h-screen bg-[#0a0f16] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#0f172a] rounded-2xl p-8 border border-[#1c2b42] shadow-2xl relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-[#3b82f6] to-transparent opacity-50" />
        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[#f8fafc] tracking-tight mb-2">Reset Password</h1>
          <p className="text-[#94a3b8] text-sm">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        {status === 'success' ? (
          <div className="bg-[#1c2b42]/50 border border-[#22c55e]/20 rounded-xl p-6 text-center">
            <CheckCircle2 className="w-12 h-12 text-[#22c55e] mx-auto mb-4" />
            <h3 className="text-[#f8fafc] font-medium mb-2">Check your email</h3>
            <p className="text-[#94a3b8] text-sm mb-6">
              If an account exists for {email}, you will receive a password reset link shortly.
            </p>
            <Link to="/login" className="btn btn-primary w-full justify-center text-sm font-medium">
              Return to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#cbd5e1] ml-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-[#64748b]" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  disabled={status === 'loading'}
                  className="input input-bordered w-full pl-10 bg-[#0a0f16] border-[#1c2b42] text-[#f8fafc] focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]/50 transition-all placeholder:text-[#475569]"
                  placeholder="name@company.com"
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
              disabled={status === 'loading' || !email}
              className="btn btn-primary w-full justify-center text-sm font-medium relative overflow-hidden group"
            >
              {status === 'loading' ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <span className="relative z-10">Send Reset Link</span>
              )}
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <Link to="/login" className="inline-flex items-center gap-2 text-sm text-[#94a3b8] hover:text-[#f8fafc] transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to login
          </Link>
        </div>
      </div>
    </div>
  )
}
