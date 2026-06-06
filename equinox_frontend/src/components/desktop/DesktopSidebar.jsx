import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import SwitchAdminModal from '../common/SwitchAdminModal'
import { useAuth } from '../../context/AuthContext'
import { LayoutDashboard, ArrowLeftRight, Users, LogOut, TrendingUp, ChevronRight, Shield, Target } from 'lucide-react'

export default function DesktopSidebar({ collapsed, onToggle }) {
  const { auth, logout, isAdmin } = useAuth()
  const nav = useNavigate()
  const [showAdminModal, setShowAdminModal] = useState(false)

  const handleLogout = () => { logout(); nav('/login') }
  
  const links = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/transactions', icon: ArrowLeftRight, label: 'Transactions' },
    { to: '/budgets', icon: Target, label: 'Budgets' },
    ...(isAdmin ? [{ to: '/users', icon: Users, label: 'Users' }] : []),
  ]

  const roleClr = { ADMIN: 'var(--gold)', ANALYST: 'var(--cyan)', VIEWER: 'var(--violet)' }
  const clr = roleClr[auth?.role] || 'var(--text-2)'

  return (
    <aside 
      className="fixed top-0 left-0 h-screen bg-[#101828] border-r border-[#1c2b42] flex flex-col transition-all duration-300 z-40 overflow-hidden"
      style={{ width: collapsed ? 68 : 240 }}
    >
      {/* Logo */}
      <div className="p-4 border-b border-[#1c2b42] flex items-center gap-3 min-h-[68px]">
        <div className="w-8 h-8 bg-[#f5a623] rounded-lg flex items-center justify-center flex-shrink-0">
          <TrendingUp size={18} className="text-[#080d1a]" strokeWidth={2.5}/>
        </div>
        {!collapsed && (
          <div className="animate-in fade-in duration-300">
            <div className="font-serif text-base text-[#f1f5f9] leading-none">Equinox</div>
            <div className="text-[10px] text-[#475569] tracking-widest mt-1">DASHBOARD</div>
          </div>
        )}
      </div>

      {/* User info */}
      {!collapsed && (
        <div className="mx-3 mt-4 p-3 bg-[#0d1424] rounded-xl border border-[#1c2b42] animate-in fade-in duration-500">
          <div className="text-[10px] text-[#475569] mb-1">Signed in as</div>
          <div className="font-semibold text-sm text-[#f1f5f9] truncate">{auth?.username}</div>
          <div 
            className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider"
            style={{ backgroundColor: `${clr}18`, color: clr, border: `1px solid ${clr}28` }}
          >
            <Shield size={9}/>{auth?.role}
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-2 py-4">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink 
            key={to} 
            to={to} 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''} mb-1`}
            style={{ justifyContent: collapsed ? 'center' : 'flex-start' }}
          >
            <Icon size={18} strokeWidth={2} className="flex-shrink-0"/>
            {!collapsed && <span className="animate-in slide-in-from-left-2 duration-300">{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-[#1c2b42] p-3 space-y-2">
        <button 
          onClick={onToggle} 
          className="btn btn-ghost w-full flex items-center justify-center hover:bg-[#1c2b42]"
          title={collapsed ? "Expand" : "Collapse"}
        >
          <ChevronRight 
            size={16} 
            className={`transition-transform duration-300 ${collapsed ? '' : 'rotate-180'}`}
          />
        </button>
        {!isAdmin && (
          <button 
            onClick={() => setShowAdminModal(true)} 
            className="btn btn-ghost w-full flex items-center gap-2 mb-2"
            style={{ justifyContent: collapsed ? 'center' : 'flex-start', color: 'var(--gold)' }}
          >
            <Shield size={16}/>
            {!collapsed && <span>Switch to Admin</span>}
          </button>
        )}

        <button 
          onClick={handleLogout} 
          className="btn btn-red w-full flex items-center gap-2"
          style={{ justifyContent: collapsed ? 'center' : 'flex-start' }}
        >
          <LogOut size={16}/>
          {!collapsed && <span>Logout</span>}
        </button>
      </div>

      <SwitchAdminModal 
        isOpen={showAdminModal} 
        onClose={() => setShowAdminModal(false)} 
      />
    </aside>
  )
}
