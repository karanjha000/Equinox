import React from 'react'
import { X, ChevronDown, SlidersHorizontal, CalendarDays } from 'lucide-react'

const CATS = ['Salary','Food','Rent','Transport','Entertainment','Healthcare','Shopping','Utilities','Education','Investment','Other']

export default function TransactionFilters({ filters, onFilterChange, onClear, isFiltered }) {
  
  const handleRangeChange = (e) => {
    const val = e.target.value
    const today = new Date()
    
    if (val === 'all') {
      onFilterChange({ startDate: '', endDate: '' })
    } else if (val === 'today') {
      const dateStr = today.toISOString().split('T')[0]
      onFilterChange({ startDate: dateStr, endDate: dateStr })
    } else if (val === 'month') {
      const y = today.getFullYear()
      const m = today.getMonth()
      const first = new Date(y, m, 1).toISOString().split('T')[0]
      const last = new Date(y, m + 1, 0).toISOString().split('T')[0]
      onFilterChange({ startDate: first, endDate: last })
    } else if (val === '30days') {
      const start = new Date()
      start.setDate(today.getDate() - 30)
      const startStr = start.toISOString().split('T')[0]
      const endStr = today.toISOString().split('T')[0]
      onFilterChange({ startDate: startStr, endDate: endStr })
    }
  }

  const getSelectedRange = () => {
    if (!filters.startDate && !filters.endDate) return 'all'
    const today = new Date().toISOString().split('T')[0]
    if (filters.startDate === today && filters.endDate === today) return 'today'
    
    const d = new Date()
    const first = new Date(d.getFullYear(), d.getMonth(), 1).toISOString().split('T')[0]
    const last = new Date(d.getFullYear(), d.getMonth() + 1, 0).toISOString().split('T')[0]
    if (filters.startDate === first && filters.endDate === last) return 'month'

    const start30 = new Date()
    start30.setDate(new Date().getDate() - 30)
    const start30Str = start30.toISOString().split('T')[0]
    if (filters.startDate === start30Str && filters.endDate === today) return '30days'

    return 'custom'
  }

  const selectedRange = getSelectedRange()

  return (
    <div className="w-full bg-[#0b1221]/70 backdrop-blur-xl p-2.5 sm:p-3 rounded-2xl border border-[#1c2b42]/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] space-y-2">
      
      {/* Main Filter Row */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        
        {/* Filter Icon (desktop only) */}
        <div className="hidden sm:flex items-center justify-center w-8 h-8 rounded-full bg-[#f5a623]/10 text-[#f5a623]">
          <SlidersHorizontal size={14} />
        </div>

        {/* Type Segment Control */}
        <div className="flex w-full sm:w-auto bg-[#050811] border border-[#162236] p-1 rounded-xl shadow-inner relative">
          {[
            { value: '', label: 'All' },
            { value: 'INCOME', label: 'Income' },
            { value: 'EXPENSE', label: 'Expense' }
          ].map(opt => {
            const isActive = filters.type === opt.value
            return (
              <button
                key={opt.value}
                onClick={() => onFilterChange({ type: opt.value })}
                className={`relative flex-1 sm:flex-initial px-4 py-1.5 rounded-lg text-[11px] font-bold tracking-wide transition-all duration-300 z-10 ${
                  isActive ? 'text-white' : 'text-[#475569] hover:text-[#94a3b8]'
                }`}
              >
                {isActive && (
                  <div className={`absolute inset-0 rounded-lg -z-10 shadow-sm ${
                    opt.value === 'INCOME' ? 'bg-gradient-to-r from-emerald-500/80 to-emerald-400' :
                    opt.value === 'EXPENSE' ? 'bg-gradient-to-r from-rose-500/80 to-rose-400' :
                    'bg-[#1e293b]'
                  }`} />
                )}
                {opt.label}
              </button>
            )
          })}
        </div>

        <div className="h-6 w-px bg-[#1c2b42]/60 hidden sm:block" />

        {/* Category Dropdown */}
        <div className="relative flex-1 min-w-0 group">
          <select
            value={filters.category}
            onChange={e => onFilterChange({ category: e.target.value })}
            className="w-full bg-[#050811] sm:bg-transparent hover:bg-[#ffffff05] border border-[#1c2b42] sm:border-transparent sm:hover:border-[#1c2b42] text-[#e2e8f0] focus:bg-[#080d1a] rounded-xl pl-3 pr-8 py-2 text-[11px] font-semibold appearance-none outline-none cursor-pointer transition-all duration-200"
          >
            <option value="" className="bg-[#0b1221] text-[#94a3b8]">All Categories</option>
            {CATS.map(c => (
              <option key={c} value={c} className="bg-[#0b1221]">{c}</option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-2.5 flex items-center pointer-events-none text-[#64748b] group-hover:text-[#f1f5f9] transition-colors">
            <ChevronDown size={14} />
          </div>
        </div>

        <div className="h-6 w-px bg-[#1c2b42]/60 hidden sm:block" />

        {/* Date Preset Dropdown */}
        <div className="relative flex-1 min-w-0 group">
          <select
            value={selectedRange}
            onChange={handleRangeChange}
            className="w-full bg-[#050811] sm:bg-transparent hover:bg-[#ffffff05] border border-[#1c2b42] sm:border-transparent sm:hover:border-[#1c2b42] text-[#e2e8f0] focus:bg-[#080d1a] rounded-xl pl-8 pr-8 py-2 text-[11px] font-semibold appearance-none outline-none cursor-pointer transition-all duration-200"
          >
            <option value="all" className="bg-[#0b1221]">All Time</option>
            <option value="today" className="bg-[#0b1221]">Today</option>
            <option value="month" className="bg-[#0b1221]">This Month</option>
            <option value="30days" className="bg-[#0b1221]">Last 30 Days</option>
            <option value="custom" className="bg-[#0b1221]">Custom Range</option>
          </select>
          <div className="absolute inset-y-0 left-2.5 flex items-center pointer-events-none text-[#475569]">
            <CalendarDays size={13} />
          </div>
          <div className="absolute inset-y-0 right-2.5 flex items-center pointer-events-none text-[#64748b] group-hover:text-[#f1f5f9] transition-colors">
            <ChevronDown size={14} />
          </div>
        </div>

        {/* Clear Filters Button */}
        {isFiltered && (
          <button
            onClick={onClear}
            className="group flex items-center justify-center w-8 h-8 bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white rounded-full transition-all duration-300"
            title="Reset Filters"
          >
            <X size={14} className="group-hover:rotate-90 transition-transform duration-300" />
          </button>
        )}
      </div>

      {/* Custom Date Range Row (appears below on all screens) */}
      {selectedRange === 'custom' && (
        <div className="flex flex-wrap items-center gap-2 p-2 bg-[#050811]/60 rounded-xl border border-[#1c2b42]/50 animate-in fade-in slide-in-from-top-1 duration-200">
          <span className="text-[10px] text-[#475569] font-bold uppercase tracking-wider">From</span>
          <input
            type="date"
            value={filters.startDate || ''}
            onChange={e => onFilterChange({ startDate: e.target.value })}
            className="flex-1 min-w-[120px] bg-[#080d1a] border border-[#1c2b42] text-[#e2e8f0] text-[11px] font-medium rounded-lg px-2.5 py-1.5 outline-none focus:border-[#f5a623]/50 focus:ring-1 focus:ring-[#f5a623]/20 cursor-pointer transition-all"
          />
          <span className="text-[10px] text-[#475569] font-bold uppercase tracking-wider">To</span>
          <input
            type="date"
            value={filters.endDate || ''}
            onChange={e => onFilterChange({ endDate: e.target.value })}
            className="flex-1 min-w-[120px] bg-[#080d1a] border border-[#1c2b42] text-[#e2e8f0] text-[11px] font-medium rounded-lg px-2.5 py-1.5 outline-none focus:border-[#f5a623]/50 focus:ring-1 focus:ring-[#f5a623]/20 cursor-pointer transition-all"
          />
        </div>
      )}
    </div>
  )
}
