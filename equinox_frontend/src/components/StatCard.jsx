import React from 'react'

export default function StatCard({ label, value, icon: Icon, color, sub, delay = '' }) {
  const fmt = v => {
    if (v === null || v === undefined) return '—'
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(v)
  }
  return (
    <div className={`card fade-up ${delay} relative overflow-hidden p-4 sm:p-5 md:p-6`}>
      <div className="absolute top-0 right-0 w-20 h-20 md:w-24 md:h-24 rounded-bl-full" style={{ background: `${color}09` }}/>
      <div className="flex flex-col xl:flex-row xl:items-start justify-between mb-3 gap-2">
        <span className="text-[10px] sm:text-xs md:text-sm text-[#475569] font-semibold uppercase tracking-widest leading-tight">{label}</span>
        <div className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-lg" style={{ background: `${color}18` }}>
          <Icon className="w-4 h-4 md:w-5 md:h-5" color={color}/>
        </div>
      </div>
      <div className="mono text-xl sm:text-2xl md:text-[32px] font-bold text-[#f1f5f9] tracking-tight leading-none truncate">{fmt(value)}</div>
      {sub && <div className="text-xs md:text-sm text-[#475569] mt-2 truncate">{sub}</div>}
    </div>
  )
}
