import React, { useEffect, useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { usersAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import useIsMobile from '../hooks/useIsMobile'
import ConfirmDialog from '../components/ConfirmDialog'
import DesktopUserTable from '../components/desktop/DesktopUserTable'
import MobileUserList from '../components/mobile/MobileUserList'

export default function UsersPage() {
  const isMobile = useIsMobile(1024)
  const { isAdmin } = useAuth()
  const { show } = useToast()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [delUser, setDelUser] = useState(null)
  const [delLoading, setDelLoading] = useState(false)
  const [updatingId, setUpdatingId] = useState(null)

  const load = async () => {
    setLoading(true)
    try {
      const { data } = await usersAPI.getAll()
      setUsers(Array.isArray(data) ? data : data.users || [])
    } catch { show('Failed to load users', 'error') }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const handleRoleChange = async (id, role) => {
    setUpdatingId(id)
    try {
      await usersAPI.updateRole(id, role)
      show('Role updated', 'success')
      setUsers(u => u.map(x => x.id === id ? { ...x, role } : x))
    } catch { show('Failed to update role', 'error') }
    finally { setUpdatingId(null) }
  }

  const handleToggle = async (id) => {
    setUpdatingId(id)
    try {
      await usersAPI.toggle(id)
      show('Status updated', 'success')
      setUsers(u => u.map(x => x.id === id ? { ...x, enabled: !x.enabled, active: !x.active } : x))
    } catch { show('Failed to toggle status', 'error') }
    finally { setUpdatingId(null) }
  }

  const handleDelete = async () => {
    setDelLoading(true)
    try {
      await usersAPI.remove(delUser.id)
      show('User deleted', 'success')
      setDelUser(null)
      load()
    } catch { show('Failed to delete user', 'error') }
    finally { setDelLoading(false) }
  }

  const isActive = u => u.enabled !== false && u.active !== false

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-[#f1f5f9] tracking-tight">Users</h1>
          <p className="text-[#475569] text-sm mt-1">Manage platform access and security protocols</p>
        </div>
        <button className="btn btn-ghost self-start sm:self-auto shadow-sm" onClick={load}>
          <RefreshCw size={14}/>Refresh
        </button>
      </div>

      {/* Security Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {[
          { label: 'Total Node Access', value: users.length, color: 'var(--cyan)' },
          { label: 'Active Sessions', value: users.filter(isActive).length, color: 'var(--green)' },
          { label: 'Admin Tiers', value: users.filter(u => u.role === 'ADMIN').length, color: 'var(--gold)' },
          { label: 'Analysts', value: users.filter(u => u.role === 'ANALYST').length, color: 'var(--cyan)' },
          { label: 'Viewers', value: users.filter(u => u.role === 'VIEWER').length, color: 'var(--violet)' },
        ].map(s => (
          <div key={s.label} className="card p-4 flex flex-col gap-1 border-l-2" style={{ borderLeftColor: s.color }}>
            <div className="font-mono text-xl font-bold text-[#f1f5f9]">{s.value}</div>
            <div className="text-[10px] text-[#475569] uppercase font-bold tracking-wider">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Modular Content List */}
      <div className={`${isMobile ? '' : 'card'} overflow-hidden`}>
        {loading ? (
          <div className="p-10 space-y-4">
            {[1,2,3].map(i => <div key={i} className="skeleton h-14 w-full"/>)}
          </div>
        ) : users.length === 0 ? (
          <div className="p-20 text-center text-[#475569] font-bold">ZERO USERS IDENTIFIED</div>
        ) : (
          isMobile ? (
            <MobileUserList 
              users={users} 
              updatingId={updatingId} 
              onRoleChange={handleRoleChange} 
              onToggle={handleToggle} 
              onDelete={setDelUser} 
              isActive={isActive}
            />
          ) : (
            <DesktopUserTable 
              users={users} 
              updatingId={updatingId} 
              onRoleChange={handleRoleChange} 
              onToggle={handleToggle} 
              onDelete={setDelUser} 
              isActive={isActive}
            />
          )
        )}
      </div>

      {delUser && (
        <ConfirmDialog
          title="Terminate User Access"
          message={`Permanently remove "${delUser.username}" from the Equinox network? This action is logged and irreversible.`}
          onConfirm={handleDelete}
          onCancel={() => setDelUser(null)}
          loading={delLoading}
        />
      )}
    </div>
  )
}
