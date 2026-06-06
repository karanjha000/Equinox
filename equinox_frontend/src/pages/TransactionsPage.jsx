import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { Plus, ChevronLeft, ChevronRight, Inbox, Download } from 'lucide-react'
import { txAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import useIsMobile from '../hooks/useIsMobile'
import TransactionModal from '../components/TransactionModal'
import ConfirmDialog from '../components/ConfirmDialog'
import TransactionFilters from '../components/common/TransactionFilters'
import DesktopTransactionTable from '../components/desktop/DesktopTransactionTable'
import MobileTransactionList from '../components/mobile/MobileTransactionList'

export default function TransactionsPage() {
  const isMobile = useIsMobile(1024)
  const { isAnalyst, isAdmin } = useAuth()
  const { show } = useToast()
  
  const [txs, setTxs] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [totalElements, setTotalElements] = useState(0)
  const [modalTx, setModalTx] = useState(undefined)
  const [delTx, setDelTx] = useState(null)
  const [delLoading, setDelLoading] = useState(false)
  const [exportLoading, setExportLoading] = useState(false)
  const [filters, setFilters] = useState({ type: '', category: '', startDate: '', endDate: '' })

  const isFiltered = useMemo(() => (
    filters.type || filters.category || filters.startDate || filters.endDate
  ), [filters])

  // Merge partial filter updates (supports multiple simultaneous filters)
  const handleFilterChange = (patch) => {
    setFilters(f => ({ ...f, ...patch }))
    setPage(0)
  }

  const handleClear = () => {
    setFilters({ type: '', category: '', startDate: '', endDate: '' })
    setPage(0)
  }

  const PAGE_SIZE = 10

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await txAPI.getAll(page, PAGE_SIZE, filters)
      const data = res.data
      setTxs(Array.isArray(data) ? data : (data.content || []))
      setTotalPages(Array.isArray(data) ? 1 : (data.totalPages || 1))
      setTotalElements(Array.isArray(data) ? data.length : (data.totalElements || 0))
    } catch (e) {
      show('Failed to synchronize transaction vault', 'error')
    } finally {
      setLoading(false)
    }
  }, [page, filters, show])

  useEffect(() => { load() }, [load])

  const handleDelete = async () => {
    if (!delTx) return
    setDelLoading(true)
    try {
      await txAPI.remove(delTx.id)
      show('Record archived successfully', 'success')
      setDelTx(null)
      load()
    } catch (e) {
      show('Deactivation sequence failed', 'error')
    } finally {
      setDelLoading(false)
    }
  }

  const handleExport = async () => {
    setExportLoading(true)
    try {
      const res = await txAPI.exportCSV(filters)
      const blob = new Blob([res.data], { type: 'text/csv;charset=utf-8;' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      let filename = 'statement'
      if (filters.startDate && filters.endDate) {
        filename += `_${filters.startDate}_to_${filters.endDate}`
      }
      filename += '.csv'
      link.setAttribute('download', filename)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      show('CSV statement exported successfully', 'success')
    } catch (e) {
      show('Failed to compile CSV statement', 'error')
    } finally {
      setExportLoading(false)
    }
  }

  const fmt = (v) => `₹${new Intl.NumberFormat('en-IN').format(Math.round(v || 0))}`

  return (
    <div className="space-y-5 pb-20 animate-in fade-in duration-700">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif text-[#f1f5f9]">Transactions</h1>
          <p className="text-sm text-[#475569] mt-1">Full audit trail of your financial operations</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto shrink-0">
          <button
            disabled={exportLoading}
            onClick={handleExport}
            className="group relative flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-[#1c2b42] bg-[#0d1424]/60 hover:bg-[#0d1424] hover:border-[#475569] text-[#f1f5f9] text-sm font-semibold transition-all duration-300 active:scale-[0.97] disabled:opacity-50 w-full sm:w-auto shrink-0"
          >
            <Download size={16} className={exportLoading ? 'animate-spin' : ''} />
            <span>{exportLoading ? 'Exporting...' : 'Export CSV'}</span>
          </button>

          {isAnalyst && (
            <button
              className="group relative flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#f5a623] to-[#fbbf24] hover:from-[#fbbf24] hover:to-[#f5a623] text-[#080d1a] text-sm font-bold shadow-[0_4px_20px_rgba(245,166,35,0.2)] hover:shadow-[0_4px_25px_rgba(245,166,35,0.35)] transition-all duration-300 active:scale-[0.97] shrink-0 w-full sm:w-auto overflow-hidden"
              onClick={() => setModalTx(null)}
            >
              <div className="absolute inset-0 w-full h-full bg-white/20 transform -skew-x-12 -translate-x-full group-hover:animate-[shimmer_0.8s_ease-out]"/>
              <Plus size={16} className="transition-transform duration-300 group-hover:rotate-90" />
              <span className="relative z-10">New Transaction</span>
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <TransactionFilters
        filters={filters}
        isFiltered={!!isFiltered}
        onFilterChange={handleFilterChange}
        onClear={handleClear}
      />

      {/* Results count when filtered */}
      {isFiltered && !loading && (
        <p className="text-xs text-[#475569]">
          Showing <span className="text-[#f1f5f9] font-semibold">{totalElements}</span> result{totalElements !== 1 ? 's' : ''}
        </p>
      )}

      {/* Table / List */}
      <div className={`${isMobile ? '' : 'card'} overflow-hidden`}>
        {loading ? (
          <div className="p-6 space-y-4">
            {[1, 2, 3, 4].map(i => <div key={i} className="skeleton h-14 w-full rounded-xl"/>)}
          </div>
        ) : txs.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-[#475569]">
            <Inbox size={48} className="opacity-10 mb-4"/>
            <p className="font-medium">No records matching your parameters</p>
          </div>
        ) : (
          isMobile ? (
            <MobileTransactionList txs={txs} isAnalyst={isAnalyst} isAdmin={isAdmin} onEdit={setModalTx} onDelete={setDelTx} />
          ) : (
            <DesktopTransactionTable txs={txs} isAnalyst={isAnalyst} isAdmin={isAdmin} onEdit={setModalTx} onDelete={setDelTx} />
          )
        )}

        {totalPages > 1 && !loading && (
          <div className="flex items-center justify-between px-6 py-4 bg-[#0d1424] border-t border-[#1c2b42]">
            <button className="btn btn-ghost px-4 py-2 text-xs" disabled={page === 0} onClick={() => setPage(p => p - 1)}>
              <ChevronLeft size={14}/> Prev
            </button>
            <span className="text-[10px] font-black text-[#475569] uppercase tracking-[0.2em]">Page {page + 1} of {totalPages}</span>
            <button className="btn btn-ghost px-4 py-2 text-xs" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>
              Next <ChevronRight size={14}/>
            </button>
          </div>
        )}
      </div>

      {modalTx !== undefined && (
        <TransactionModal tx={modalTx} onClose={() => setModalTx(undefined)} onSaved={() => { setModalTx(undefined); load() }}/>
      )}
      
      {delTx && (
        <ConfirmDialog
          title="Archive Record"
          message={`Are you sure you want to archive this ${delTx.type} of ${fmt(delTx.amount)}?`}
          onConfirm={handleDelete}
          onCancel={() => setDelTx(null)}
          loading={delLoading}
        />
      )}
    </div>
  )
}