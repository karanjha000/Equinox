import React, { useState } from 'react'

const PIE_COLORS = ['#f5a623','#06b6d4','#10b981','#8b5cf6','#f43f5e','#fb923c','#84cc16','#ec4899']
const fmt = v => `₹${new Intl.NumberFormat('en-IN').format(Math.round(v || 0))}`

export default function RecentTransactions({ transactions, isMobile }) {
  const [showAll, setShowAll] = useState(false)

  if (!transactions?.length) return null

  const displayLimit = 8
  const hasMore = transactions.length > displayLimit
  const displayedTransactions = showAll ? transactions : transactions.slice(0, displayLimit)

  return (
    <div className="card animate-in fade-in duration-700 overflow-hidden">
      <div className="p-5 border-b border-[#1c2b42] flex items-center justify-between">
        <h3 className="text-xs font-bold text-[#94a3b8] uppercase tracking-[0.15em]">Recent Transactions</h3>
        <span className="text-[10px] text-[#475569] font-mono">{transactions.length} entries</span>
      </div>

      {isMobile ? (
        /* Mobile List View */
        <div className="divide-y divide-[#1c2b42]">
          {displayedTransactions.map(tx => (
            <div key={tx.id} className="p-4 flex items-center justify-between active:bg-white/5 transition-colors">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-[#f1f5f9]">{tx.category}</span>
                  <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-tighter ${
                    tx.type === 'INCOME' ? 'bg-green-500/10 text-green-500' : 'bg-rose-500/10 text-rose-500'
                  }`}>
                    {tx.type}
                  </span>
                </div>
                <div className="text-[11px] text-[#475569] truncate max-w-[160px]">{tx.notes || 'No notes'}</div>
                <div className="text-[10px] font-mono text-[#334155]">{tx.date}</div>
              </div>
              <div className={`text-right font-mono font-bold ${tx.type === 'INCOME' ? 'text-green-500' : 'text-rose-500'}`}>
                {tx.type === 'INCOME' ? '+' : '-'}{fmt(tx.amount)}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Desktop Table View */
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Date</th><th>Type</th><th>Category</th><th>Notes</th><th className="text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {displayedTransactions.map(tx => (
                <tr key={tx.id}>
                  <td className="text-[#475569] font-mono text-xs">{tx.date}</td>
                  <td>
                    <span className={`badge ${tx.type === 'INCOME' ? 'b-income' : 'b-expense'}`}>
                      {tx.type}
                    </span>
                  </td>
                  <td className="font-semibold text-[#f1f5f9]">{tx.category}</td>
                  <td className="max-w-[200px] truncate text-[#94a3b8]">{tx.notes || '—'}</td>
                  <td className={`text-right font-mono font-bold ${tx.type === 'INCOME' ? 'text-green-500' : 'text-rose-500'}`}>
                    {tx.type === 'INCOME' ? '+' : '-'}{fmt(tx.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {hasMore && (
        <div className="p-4 border-t border-[#1c2b42] flex justify-center bg-[#0d131f]/50">
          <button 
            onClick={() => setShowAll(!showAll)}
            className="text-xs font-semibold text-[#06b6d4] hover:text-[#22d3ee] transition-colors py-1 px-4 rounded-full bg-[#06b6d4]/10 hover:bg-[#06b6d4]/20"
          >
            {showAll ? 'Show Less' : `Show All (${transactions.length - displayLimit} more)`}
          </button>
        </div>
      )}
    </div>
  )
}

