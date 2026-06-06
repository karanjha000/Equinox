import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import SwitchAdminModal from '../common/SwitchAdminModal'
import { useAuth } from '../../context/AuthContext'
import { LayoutDashboard, ArrowLeftRight, Users, LogOut, X, Shield, Target } from 'lucide-react'

export default function MobileDrawer({ isOpen, onClose }) {
  const { auth, logout, isAdmin } = useAuth()
  const nav = useNavigate()
  const [showAdminModal, setShowAdminModal] = useState(false)
  
  const handleLogout = () => {
    logout()
    onClose()
    nav('/login')
  }

  const links = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/transactions', icon: ArrowLeftRight, label: 'Transactions' },
    { to: '/budgets', icon: Target, label: 'Budgets' },
    ...(isAdmin ? [{ to: '/users', icon: Users, label: 'Users' }] : []),
  ]

  const roleClr = { ADMIN: 'var(--gold)', ANALYST: 'var(--cyan)', VIEWER: 'var(--violet)' }
  const clr = roleClr[auth?.role] || 'var(--text-2)'

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] lg:hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={onClose} 
      />
      
      {/* Drawer */}
      <aside className="absolute top-0 left-0 bottom-0 w-[280px] bg-[#101828] border-r border-[#1c2b42] flex flex-col animate-in slide-in-from-left duration-300">
        <div className="p-5 flex items-center justify-between border-b border-[#1c2b42]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#f5a623] rounded-lg flex items-center justify-center">
              <Shield size={18} className="text-[#080d1a]" />
            </div>
            <span className="font-serif text-xl text-[#f1f5f9]">Equinox</span>
          </div>
          <button onClick={onClose} className="p-2 text-[#475569] hover:text-[#f1f5f9]">
            <X size={20} />
          </button>
        </div>

        <div className="p-4">
          <div className="p-4 bg-[#0d1424] rounded-2xl border border-[#1c2b42]">
            <div className="text-[11px] text-[#475569] uppercase tracking-wider mb-1">Account</div>
            <div className="font-bold text-[#f1f5f9] mb-2">{auth?.username}</div>
            <div 
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter"
              style={{ backgroundColor: `${clr}22`, color: clr, border: `1px solid ${clr}33` }}
            >
              {auth?.role}
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-2 space-y-1">
          {links.map(({ to, icon: Icon, label }) => (
            <NavLink 
              key={to} 
              to={to} 
              onClick={onClose}
              className={({ isActive }) => 
                `flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all ${
                  isActive 
                  ? 'bg-[#f5a62315] text-[#f5a623] border border-[#f5a62325]' 
                  : 'text-[#94a3b8] hover:bg-white/5'
                }`
              }
            >
              <Icon size={20} />
              <span className="font-semibold">{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-[#1c2b42]">
          {!isAdmin && (
            <button 
              onClick={() => setShowAdminModal(true)}
              className="w-full flex items-center justify-center gap-3 py-3 mb-2 bg-[rgba(245,166,35,0.1)] hover:bg-[rgba(245,166,35,0.2)] text-[var(--gold)] rounded-2xl transition-all font-bold"
            >
              <Shield size={20} />
              Switch to Admin
            </button>
          )}
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 py-4 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-2xl transition-all font-bold"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      <SwitchAdminModal 
        isOpen={showAdminModal} 
        onClose={() => setShowAdminModal(false)} 
      />
    </div>
  )
}
