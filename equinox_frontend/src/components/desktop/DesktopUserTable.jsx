import React from 'react'
import { Trash2 } from 'lucide-react'

export default function DesktopUserTable({ users, updatingId, onRoleChange, onToggle, onDelete, isActive }) {
  if (!users?.length) return null

  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            <th className="w-16">ID</th>
            <th>Identity</th>
            <th>Email</th>
            <th>Privileges</th>
            <th>Connectivity</th>
            <th className="text-center">Protocol Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => {
            const active = isActive(u)
            const busy = updatingId === u.id
            return (
              <tr key={u.id}>
                <td className="mono text-[11px] text-[#475569]">#{u.id}</td>
                <td className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#0d1424] border border-[#1c2b42] flex items-center justify-center text-[11px] font-bold text-[#f5a623]">
                    {u.username?.[0]?.toUpperCase()}
                  </div>
                  <span className="font-semibold text-[#f1f5f9]">{u.username}</span>
                </td>
                <td className="text-xs text-[#94a3b8]">{u.email || '—'}</td>
                <td>
                  <select
                    className="input max-w-[120px] py-1 px-2 text-[11px] font-bold"
                    value={u.role}
                    onChange={e => onRoleChange(u.id, e.target.value)}
                    disabled={busy}
                  >
                    <option value="VIEWER">VIEWER</option>
                    <option value="ANALYST">ANALYST</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </td>
                <td>
                  <span className={`badge ${active ? 'b-active' : 'b-inactive'}`}>
                    {active ? 'ACTIVE' : 'OFFLINE'}
                  </span>
                </td>
                <td>
                  <div className="flex gap-2 justify-center">
                    <button 
                      className="btn btn-ghost py-1 px-3 text-[10px] font-bold"
                      onClick={() => onToggle(u.id)}
                      disabled={busy}
                    >
                      {busy ? <span className="spinner h-3 w-3"/> : (active ? 'SUSPEND' : 'RESTORE')}
                    </button>
                    <button 
                      className="btn btn-red p-2"
                      onClick={() => onDelete(u)}
                      disabled={busy}
                    >
                      <Trash2 size={13}/>
                    </button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
