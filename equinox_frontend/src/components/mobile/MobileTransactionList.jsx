import React from 'react'
import { Edit2, Trash2, Calendar, User } from 'lucide-react'

const fmt = v => `₹${new Intl.NumberFormat('en-IN').format(Math.round(v || 0))}`

export default function MobileTransactionList({ txs, isAnalyst, isAdmin, onEdit, onDelete }) {
  if (!txs?.length) return null

  return (
    <div className="space-y-4">
      {txs.map(tx => (
        <div key={tx.id} className="card p-5 animate-in fade-in duration-500">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-black text-[#f1f5f9]">{tx.category}</span>
                <span className={`text-[9px] px-2 py-0.5 rounded-md font-black uppercase tracking-tighter ${
                  tx.type === 'INCOME' ? 'bg-green-500/10 text-green-500' : 'bg-rose-500/10 text-rose-500'
                }`}>
                  {tx.type}
                </span>
              </div>
              <div className="flex items-center gap-3 text-[10px] text-[#475569] font-mono">
                <div className="flex items-center gap-1"><Calendar size={10}/>{tx.date}</div>
                <div className="flex items-center gap-1"><User size={10}/>{tx.createdBy}</div>
              </div>
            </div>
            <div className={`text-lg font-mono font-black ${tx.type === 'INCOME' ? 'text-green-500' : 'text-rose-500'}`}>
              {tx.type === 'INCOME' ? '+' : '-'}{fmt(tx.amount)}
            </div>
          </div>

          <div className="text-xs text-[#94a3b8] bg-[#0d1424] p-3 rounded-xl border border-[#1c2b42] mb-4 italic">
            {tx.notes || 'No notes provided for this transaction.'}
          </div>

          {isAnalyst && (
            <div className="flex gap-2">
              <button 
                className="flex-1 btn btn-ghost py-3 flex items-center justify-center gap-2 text-xs font-bold"
                onClick={() => onEdit(tx)}
              >
                <Edit2 size={14}/> Edit
              </button>
              {isAdmin && (
                <button 
                  className="flex-1 btn btn-red py-3 flex items-center justify-center gap-2 text-xs font-bold"
                  onClick={() => onDelete(tx)}
                >
                  <Trash2 size={14}/> Delete
                </button>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
