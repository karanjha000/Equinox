import React, { useState } from 'react'
import { X } from 'lucide-react'
import { txAPI } from '../services/api'
import { useToast } from '../context/ToastContext'

const CATS = ['Salary','Food','Rent','Transport','Entertainment','Healthcare','Shopping','Utilities','Education','Investment','Other']
const empty = { amount: '', type: 'INCOME', category: 'Salary', date: new Date().toISOString().split('T')[0], notes: '' }

export default function TransactionModal({ tx, onClose, onSaved }) {
  const [form, setForm] = useState(tx ? { amount: tx.amount, type: tx.type, category: tx.category, date: tx.date, notes: tx.notes || '' } : empty)
  const [loading, setLoading] = useState(false)
  const { show } = useToast()
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const submit = async () => {
    if (!form.amount || isNaN(form.amount)) return show('Enter a valid amount', 'error')
    if (!form.date) return show('Select a date', 'error')
    setLoading(true)
    try {
      if (tx) await txAPI.update(tx.id, { ...form, amount: parseFloat(form.amount) })
      else await txAPI.create({ ...form, amount: parseFloat(form.amount) })
      show(tx ? 'Transaction updated!' : 'Transaction created!', 'success')
      onSaved()
    } catch (e) {
      show(e.response?.data?.message || 'Failed to save', 'error')
    } finally { setLoading(false) }
  }

  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal p-6 md:p-10">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-serif text-2xl text-[#f1f5f9] tracking-tight">{tx ? 'Edit Transaction' : 'New Transaction'}</h2>
          <button onClick={onClose} className="btn btn-ghost p-2"><X size={20}/></button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="label">Amount (₹)</label>
            <input 
              className="input text-lg font-mono py-4" 
              type="number" 
              placeholder="0.00" 
              value={form.amount} 
              onChange={e => set('amount', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Type</label>
              <select className="input" value={form.type} onChange={e => set('type', e.target.value)}>
                <option value="INCOME">INCOME</option>
                <option value="EXPENSE">EXPENSE</option>
              </select>
            </div>
            <div>
              <label className="label">Category</label>
              <select className="input" value={form.category} onChange={e => set('category', e.target.value)}>
                {CATS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="label">Date of Record</label>
            <input className="input" type="date" value={form.date} onChange={e => set('date', e.target.value)}/>
          </div>

          <div>
            <label className="label">Audit Notes</label>
            <textarea 
              className="input resize-none" 
              rows={3} 
              placeholder="Describe the nature of this transaction..." 
              value={form.notes} 
              onChange={e => set('notes', e.target.value)}
            />
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end pt-4">
            <button className="btn btn-outline py-3" onClick={onClose}>Cancel</button>
            <button 
              className="btn btn-gold py-3 px-8 shadow-lg shadow-amber-500/10" 
              onClick={submit} 
              disabled={loading}
            >
              {loading ? <><span className="spinner mr-2"/> Processing…</> : (tx ? 'Save Changes' : 'Execute')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
