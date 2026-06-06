import React, { useState, useEffect } from 'react'
import { budgetAPI } from '../services/api'
import { useToast } from '../context/ToastContext'
import { Plus, Target, AlertTriangle, IndianRupee, Trash2, Edit2 } from 'lucide-react'
import ConfirmDialog from '../components/ConfirmDialog'

const EXPENSE_CATS = ['Food','Rent','Transport','Entertainment','Healthcare','Shopping','Utilities','Education','Other']

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ category: '', amountLimit: '' })
  const [deleteDialog, setDeleteDialog] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const { show } = useToast()

  const loadBudgets = async (showSpinner = true) => {
    try {
      if (showSpinner) setLoading(true)
      const { data } = await budgetAPI.getProgress()
      setBudgets(data)
    } catch (e) {
      show('Failed to load budgets', 'error')
    } finally {
      if (showSpinner) setLoading(false)
    }
  }

  useEffect(() => { loadBudgets(true) }, [])

  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.category || !form.amountLimit) return
    try {
      await budgetAPI.upsert({
        category: form.category,
        amountLimit: Number(form.amountLimit)
      })
      show('Budget saved successfully', 'success')
      setForm({ category: '', amountLimit: '' })
      loadBudgets(false)
    } catch (e) {
      console.error('Save Budget Error:', e.response?.data || e)
      show('Failed to save budget', 'error')
    }
  }

  const handleDelete = (id) => {
    setDeleteDialog(id)
  }

  const confirmDelete = async () => {
    if (!deleteDialog) return
    setDeleteLoading(true)
    try {
      await budgetAPI.remove(deleteDialog)
      show('Budget deleted', 'success')
      loadBudgets(false)
    } catch (e) {
      show('Failed to delete budget', 'error')
    } finally {
      setDeleteLoading(false)
      setDeleteDialog(null)
    }
  }

  const formatCurrency = (amt) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amt)

  const totalBudgets = budgets.length
  const totalLimit = budgets.reduce((acc, b) => acc + (b.limit || 0), 0)
  const totalSpent = budgets.reduce((acc, b) => acc + (b.spent || 0), 0)
  const exceededCount = budgets.filter(b => b.percentage >= 100).length
  const safeCount = budgets.filter(b => b.percentage < 80).length

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-[#f1f5f9] tracking-tight">Budgets</h1>
          <p className="text-[#475569] text-sm mt-1">Manage category limits and monitor your spending trajectory</p>
        </div>
        <button className="btn btn-ghost self-start sm:self-auto shadow-sm" onClick={() => loadBudgets(true)}>
          Refresh
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: 'Active Budgets', value: totalBudgets, color: 'var(--cyan)' },
          { label: 'Total Allocated', value: formatCurrency(totalLimit), color: 'var(--blue)' },
          { label: 'Total Spent', value: formatCurrency(totalSpent), color: 'var(--violet)' },
          { label: 'Safe Categories', value: safeCount, color: 'var(--green)' },
          { label: 'Exceeded', value: exceededCount, color: 'var(--rose)' },
        ].map(s => (
          <div key={s.label} className="card p-4 flex flex-col gap-1 border-l-2" style={{ borderLeftColor: s.color }}>
            <div className="font-mono text-xl font-bold text-[#f1f5f9]">{s.value}</div>
            <div className="text-[10px] text-[#475569] uppercase font-bold tracking-wider">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        
        {/* Form Panel */}
        <div className="xl:col-span-1">
          <div className="card p-5 sticky top-6">
            <h2 className="text-sm font-bold text-[#f1f5f9] mb-4 flex items-center gap-2 uppercase tracking-wider">
              <Plus size={16} className="text-[#f5a623]" />
              Set Limit
            </h2>
            
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-[#94a3b8] uppercase tracking-wider mb-1.5">Category</label>
                <select 
                  value={form.category} 
                  onChange={e => setForm({...form, category: e.target.value})}
                  className="input w-full py-2.5 text-sm font-semibold cursor-pointer"
                  required
                >
                  <option value="" disabled className="text-[#64748b]">Select Category</option>
                  {EXPENSE_CATS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#94a3b8] uppercase tracking-wider mb-1.5">Monthly Limit (₹)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#64748b]">
                    <IndianRupee size={14} />
                  </div>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={form.amountLimit}
                    onChange={e => setForm({...form, amountLimit: e.target.value})}
                    placeholder="e.g. 15000"
                    className="input w-full pl-8 pr-3 py-2.5 text-sm font-semibold"
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-gold w-full flex justify-center mt-2">
                Save Budget
              </button>
            </form>
          </div>
        </div>

        {/* Table Content */}
        <div className="xl:col-span-3 card overflow-hidden">
          {loading ? (
            <div className="p-10 space-y-4">
              {[1,2,3,4].map(i => <div key={i} className="skeleton h-12 w-full"/>)}
            </div>
          ) : budgets.length === 0 ? (
            <div className="p-20 text-center text-[#475569] font-bold">NO BUDGETS CONFIGURED</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Spent</th>
                    <th>Limit</th>
                    <th className="w-48">Progress</th>
                    <th>Status</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {budgets.map(b => {
                    const isOver = b.percentage >= 100
                    const isWarning = b.percentage >= 80 && !isOver
                    
                    const barColor = isOver ? 'var(--rose)' : isWarning ? 'var(--gold)' : 'var(--green)'
                    const statusText = isOver ? 'EXCEEDED' : isWarning ? 'WARNING' : 'SAFE'
                    const statusClass = isOver ? 'b-inactive' : isWarning ? 'badge' : 'b-active'

                    return (
                      <tr key={b.id}>
                        <td className="font-semibold text-[#f1f5f9]">{b.category}</td>
                        <td className="mono text-[13px] text-[#f1f5f9]">{formatCurrency(b.spent)}</td>
                        <td className="mono text-[13px] text-[#94a3b8]">{formatCurrency(b.limit)}</td>
                        <td>
                          <div className="flex items-center gap-3">
                            <div className="flex-1 h-1.5 bg-[#1c2b42] rounded-full overflow-hidden">
                              <div 
                                className="h-full rounded-full transition-all duration-700 ease-out"
                                style={{ width: `${Math.min(b.percentage, 100)}%`, backgroundColor: barColor }}
                              />
                            </div>
                            <span className="mono text-[11px] font-bold w-10 text-right" style={{ color: barColor }}>
                              {b.percentage.toFixed(0)}%
                            </span>
                          </div>
                        </td>
                        <td>
                          <span className={`badge ${statusClass}`} style={isWarning && !isOver ? { backgroundColor: 'rgba(245,166,35,0.15)', color: 'var(--gold)' } : {}}>
                            {statusText}
                          </span>
                        </td>
                        <td>
                          <div className="flex gap-2 justify-center">
                            <button 
                              className="btn btn-ghost p-2 text-[#94a3b8] hover:text-[#f1f5f9]"
                              onClick={() => setForm({ category: b.category, amountLimit: b.limit })}
                              title="Edit Limit"
                            >
                              <Edit2 size={13}/>
                            </button>
                            <button 
                              className="btn btn-red p-2"
                              onClick={() => handleDelete(b.id)}
                              title="Delete Budget"
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
          )}
        </div>
      </div>
      
      {deleteDialog && (
        <ConfirmDialog
          title="Delete Budget Limit"
          message="Are you sure you want to delete this budget limit? This action cannot be undone."
          onConfirm={confirmDelete}
          onCancel={() => setDeleteDialog(null)}
          loading={deleteLoading}
        />
      )}
    </div>
  )
}
