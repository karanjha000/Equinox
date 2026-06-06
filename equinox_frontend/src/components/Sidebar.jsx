import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LayoutDashboard, ArrowLeftRight, Users, LogOut, TrendingUp, ChevronRight, Shield } from 'lucide-react'

export default function Sidebar({ collapsed, onToggle }) {
  const { auth, logout, isAdmin } = useAuth()
  const nav = useNavigate()
  const handleLogout = () => { logout(); nav('/login') }
  const links = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/transactions', icon: ArrowLeftRight, label: 'Transactions' },
    ...(isAdmin ? [{ to: '/users', icon: Users, label: 'Users' }] : []),
  ]
  const roleClr = { ADMIN: 'var(--gold)', ANALYST: 'var(--cyan)', VIEWER: 'var(--violet)' }
  const clr = roleClr[auth?.role] || 'var(--text-2)'
  return (
    <aside style={{
      width: collapsed ? 68 : 236, background: 'var(--bg-card)',
      borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column',
      transition: 'width 0.28s ease', position: 'fixed', top: 0, left: 0,
      height: '100vh', zIndex: 40, overflow: 'hidden',
    }}>
      {/* Logo */}
      <div style={{ padding: '18px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 11, minHeight: 68 }}>
        <div style={{ width: 34, height: 34, background: 'var(--gold)', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <TrendingUp size={18} color="#080d1a" strokeWidth={2.5}/>
        </div>
        {!collapsed && (
          <div>
            <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1rem', color: 'var(--text-1)', lineHeight: 1.1 }}>FinanceOS</div>
            <div style={{ fontSize: '0.62rem', color: 'var(--text-3)', letterSpacing: '0.1em', marginTop: 2 }}>DASHBOARD</div>
          </div>
        )}
      </div>

      {/* User info */}
      {!collapsed && (
        <div style={{ margin: '14px 12px 4px', padding: '11px 13px', background: 'var(--bg-secondary)', borderRadius: 12, border: '1px solid var(--border)' }}>
          <div style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 3 }}>Signed in as</div>
          <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-1)' }}>{auth?.username}</div>
          <div style={{ marginTop: 6, display: 'inline-flex', alignItems: 'center', gap: 4, background: `${clr}18`, color: clr, border: `1px solid ${clr}28`, borderRadius: 6, padding: '2px 7px', fontSize: 10, fontWeight: 600, letterSpacing: '0.07em' }}>
            <Shield size={9}/>{auth?.role}
          </div>
        </div>
      )}

      {/* Nav */}
      <nav style={{ flex: 1, padding: '10px 8px' }}>
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
            style={{ justifyContent: collapsed ? 'center' : 'flex-start', marginBottom: 3 }}>
            <Icon size={17} strokeWidth={2} style={{ flexShrink: 0 }}/>
            {!collapsed && label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div style={{ borderTop: '1px solid var(--border)', padding: 10 }}>
        <button onClick={onToggle} className="btn btn-ghost" style={{ width: '100%', justifyContent: collapsed ? 'center' : 'flex-end', marginBottom: 6, border: 'none', background: 'transparent' }}>
          <ChevronRight size={15} style={{ transform: collapsed ? 'none' : 'rotate(180deg)', transition: 'transform 0.28s' }}/>
        </button>
        <button onClick={handleLogout} className="btn btn-red" style={{ width: '100%', justifyContent: collapsed ? 'center' : 'flex-start' }}>
          <LogOut size={15}/>{!collapsed && 'Logout'}
        </button>
      </div>
    </aside>
  )
}
