import React from 'react'
import { Trash2, Shield, Mail } from 'lucide-react'

export default function MobileUserList({ users, updatingId, onRoleChange, onToggle, onDelete, isActive }) {
  if (!users?.length) return null

  return (
    <div className="space-y-4">
      {users.map(u => {
        const active = isActive(u)
        const busy = updatingId === u.id
        return (
          <div key={u.id} className="card p-5 animate-in fade-in duration-500">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-[#0d1424] border border-[#1c2b42] flex items-center justify-center text-lg font-black text-[#f5a623]">
                {u.username?.[0]?.toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-black text-[#f1f5f9]">{u.username}</span>
                  <span className={`text-[9px] px-2 py-0.5 rounded-md font-black tracking-tighter ${
                    active ? 'bg-green-500/10 text-green-500' : 'bg-slate-500/10 text-slate-500'
                  }`}>
                    {active ? 'ACTIVE' : 'INACTIVE'}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-[#475569] mt-0.5">
                  <Mail size={10}/> {u.email || 'no-email@equinox.com'}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-[#0d1424] p-3 rounded-xl border border-[#1c2b42]">
                <label className="text-[9px] font-bold text-[#475569] uppercase block mb-2">Access Level</label>
                <select
                  className="input py-1.5 px-2 text-[11px] font-bold"
                  value={u.role}
                  onChange={e => onRoleChange(u.id, e.target.value)}
                  disabled={busy}
                >
                  <option value="VIEWER">VIEWER</option>
                  <option value="ANALYST">ANALYST</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>
              <div className="bg-[#0d1424] p-3 rounded-xl border border-[#1c2b42]">
                <label className="text-[9px] font-bold text-[#475569] uppercase block mb-2">Protocol</label>
                <button 
                  className={`w-full py-1.5 rounded-lg text-[10px] font-black transition-all ${
                    active ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'
                  }`}
                  onClick={() => onToggle(u.id)}
                  disabled={busy}
                >
                  {busy ? 'SYNCING...' : (active ? 'SUSPEND' : 'RESTORE')}
                </button>
              </div>
            </div>

            <button 
              className="w-full btn btn-red py-3 flex items-center justify-center gap-2 text-xs font-bold"
              onClick={() => onDelete(u)}
              disabled={busy}
            >
              <Trash2 size={14}/> Terminate Account
            </button>
          </div>
        )
      })}
    </div>
  )
}
