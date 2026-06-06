import React from 'react'
import { Edit2, Trash2 } from 'lucide-react'

const fmt = v => `₹${new Intl.NumberFormat('en-IN').format(Math.round(v || 0))}`

export default function DesktopTransactionTable({ txs, isAnalyst, isAdmin, onEdit, onDelete }) {
  if (!txs?.length) return null

  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            <th className="w-16">ID</th>
            <th>Date</th>
            <th>Type</th>
            <th>Category</th>
            <th>Notes</th>
            <th>Created By</th>
            <th className="text-right">Amount</th>
            {isAnalyst && <th className="text-center">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {txs.map(tx => (
            <tr key={tx.id}>
              <td className="mono text-[11px] text-[#475569]">#{tx.id}</td>
              <td className="mono text-xs text-[#475569]">{tx.date}</td>
              <td>
                <span className={`badge ${tx.type === 'INCOME' ? 'b-income' : 'b-expense'}`}>
                  {tx.type}
                </span>
              </td>
              <td className="font-semibold text-[#f1f5f9]">{tx.category}</td>
              <td className="max-w-[180px] truncate text-[#94a3b8]">{tx.notes || '—'}</td>
              <td className="text-[13px] text-[#475569]">{tx.createdBy}</td>
              <td className={`text-right font-mono font-bold ${tx.type === 'INCOME' ? 'text-green-500' : 'text-rose-500'}`}>
                {tx.type === 'INCOME' ? '+' : '-'}{fmt(tx.amount)}
              </td>
              {isAnalyst && (
                <td>
                  <div className="flex gap-2 justify-center">
                    <button className="btn btn-ghost p-2" onClick={() => onEdit(tx)}><Edit2 size={13}/></button>
                    {isAdmin && <button className="btn btn-red p-2" onClick={() => onDelete(tx)}><Trash2 size={13}/></button>}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
