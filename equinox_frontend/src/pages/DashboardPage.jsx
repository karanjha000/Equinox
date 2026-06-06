import React, { useState, useEffect, useMemo } from 'react'
import { 
  TrendingUp, TrendingDown, Wallet, Activity, RefreshCw, BarChart2, LineChart as LineChartIcon, ChevronDown
} from 'lucide-react'
import { 
  AreaChart, Area, BarChart, Bar, LineChart, Line, ScatterChart, Scatter, ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts'
import { dashAPI } from '../services/api'
import { useToast } from '../context/ToastContext'
import useIsMobile from '../hooks/useIsMobile'
import StatCard from '../components/StatCard'
import RecentTransactions from '../components/common/RecentTransactions'

const PIE_COLORS = ['#f5a623', '#06b6d4', '#8b5cf6', '#ec4899', '#10b981', '#f43f5e']

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#101828] border border-[#1c2b42] p-3 rounded-xl shadow-2xl backdrop-blur-md">
        <p className="text-[10px] text-[#475569] uppercase font-black mb-1 tracking-widest">{label || payload[0].payload.name}</p>
        <p className="text-sm font-bold text-[#f1f5f9]">
          ₹{new Intl.NumberFormat('en-IN').format(payload[0].value)}
        </p>
      </div>
    )
  }
  return null
}

const ChartDropdown = ({ active, onChange }) => {
  const [open, setOpen] = useState(false)
  const options = [
    { id: 'area', label: 'Area Chart' },
    { id: 'bar', label: 'Bar Chart' },
    { id: 'line', label: 'Line Chart' },
    { id: 'step', label: 'Step Graph' },
    { id: 'scatter', label: 'Scatter Plot' },
    { id: 'combo', label: 'Combo Chart' }
  ]
  const activeOption = options.find(o => o.id === active)

  return (
    <div className="relative">
      <button 
        onClick={() => setOpen(!open)}
        onBlur={() => setTimeout(() => setOpen(false), 200)}
        className="flex items-center gap-2 bg-[#0d1424] border border-[#1c2b42] text-[#f1f5f9] text-xs px-3 py-2 rounded-lg hover:border-[#475569] transition-colors"
      >
        {activeOption?.label}
        <ChevronDown size={14} className="text-[#475569]" />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 w-40 bg-[#101828] border border-[#1c2b42] rounded-lg shadow-xl z-50 overflow-hidden">
          {options.map(opt => (
            <button
              key={opt.id}
              onMouseDown={() => { onChange(opt.id); setOpen(false) }}
              className={`w-full text-left px-3 py-2 text-xs transition-colors hover:bg-[#1c2b42] ${active === opt.id ? 'text-[#10b981] font-bold bg-[#1c2b42]/50' : 'text-[#f1f5f9]'}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default function DashboardPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [cashflowType, setCashflowType] = useState('area')
  const [netWorthType, setNetWorthType] = useState('area')
  const { show } = useToast()
  const isMobile = useIsMobile(1024)

  const load = async () => {
    setLoading(true)
    try {
      const res = await dashAPI.summary()
      setData(res.data)
    } catch (e) {
      show('Failed to sync dashboard metrics', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const monthlyData = useMemo(() => {
    if (!data?.monthlyTrends) return []
    return Object.entries(data.monthlyTrends).map(([k, v]) => ({
      name: k.split('-')[0].slice(0, 3),
      full: k,
      value: v
    }))
  }, [data])

  const netWorthData = useMemo(() => {
    if (!data?.netWorthTrends) return []
    return Object.entries(data.netWorthTrends).map(([k, v]) => ({
      name: k.split('-')[0].slice(0, 3),
      full: k,
      value: v
    }))
  }, [data])

  const categoryData = useMemo(() => {
    if (!data?.categoryWiseTotals) return []
    return Object.entries(data.categoryWiseTotals).map(([k, v]) => ({
      name: k,
      value: v
    }))
  }, [data])

  if (loading) return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-2 md:gap-4">
        {[1, 2, 3].map(i => <div key={i} className="card skeleton h-[110px]"/>)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card skeleton h-[400px]"/>
        <div className="card skeleton h-[400px]"/>
      </div>
    </div>
  )

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif text-[#f1f5f9]">Overview</h1>
          <p className="text-sm text-[#475569] mt-1">Strategic insight into your wealth</p>
        </div>
        <button onClick={load} className="btn btn-secondary text-xs py-2">
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''}/>
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2 md:gap-4">
        <StatCard label="Income" value={data?.totalIncome} icon={TrendingUp} color="#10b981" />
        <StatCard label="Expenses" value={data?.totalExpenses} icon={TrendingDown} color="#f43f5e" />
        <StatCard label="Balance" value={data?.netBalance} icon={Wallet} color="#f5a623" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 card p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <Activity size={16} className="text-[#f5a623]"/>
              <span className="text-[11px] font-black text-[#475569] uppercase tracking-widest">Cashflow Trends</span>
            </div>
            <ChartDropdown active={cashflowType} onChange={setCashflowType} />
          </div>
          <div className="h-[300px] w-full">
            {monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                {cashflowType === 'area' ? (
                  <AreaChart data={monthlyData}>
                    <defs>
                      <linearGradient id="clrGold" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f5a623" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#f5a623" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1c2b42" vertical={false} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 10}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 10}} tickFormatter={v => `₹${v/1000}k`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="value" stroke="#f5a623" strokeWidth={3} fillOpacity={1} fill="url(#clrGold)" animationDuration={1500} />
                  </AreaChart>
                ) : cashflowType === 'bar' ? (
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1c2b42" vertical={false} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 10}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 10}} tickFormatter={v => `₹${v/1000}k`} />
                    <Tooltip content={<CustomTooltip />} cursor={{fill: '#1c2b42', opacity: 0.4}} />
                    <Bar dataKey="value" fill="#f5a623" radius={[4, 4, 0, 0]} animationDuration={1500} />
                  </BarChart>
                ) : cashflowType === 'line' ? (
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1c2b42" vertical={false} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 10}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 10}} tickFormatter={v => `₹${v/1000}k`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="value" stroke="#f5a623" strokeWidth={3} dot={{r: 4, fill: '#0d1424', strokeWidth: 2}} animationDuration={1500} />
                  </LineChart>
                ) : cashflowType === 'step' ? (
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1c2b42" vertical={false} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 10}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 10}} tickFormatter={v => `₹${v/1000}k`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="stepAfter" dataKey="value" stroke="#f5a623" strokeWidth={3} dot={false} animationDuration={1500} />
                  </LineChart>
                ) : cashflowType === 'scatter' ? (
                  <ScatterChart>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1c2b42" vertical={false} />
                    <XAxis dataKey="name" type="category" allowDuplicatedCategory={false} axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 10}} dy={10} />
                    <YAxis dataKey="value" type="number" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 10}} tickFormatter={v => `₹${v/1000}k`} />
                    <Tooltip content={<CustomTooltip />} cursor={{strokeDasharray: '3 3'}} />
                    <Scatter data={monthlyData} fill="#f5a623" animationDuration={1500} />
                  </ScatterChart>
                ) : (
                  <ComposedChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1c2b42" vertical={false} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 10}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 10}} tickFormatter={v => `₹${v/1000}k`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="value" fill="#f5a623" fillOpacity={0.4} radius={[4, 4, 0, 0]} animationDuration={1500} />
                    <Line type="monotone" dataKey="value" stroke="#f5a623" strokeWidth={3} dot={{r: 4, fill: '#0d1424', strokeWidth: 2}} animationDuration={1500} />
                  </ComposedChart>
                )}
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-[#475569] gap-3">
                <div className="w-12 h-12 rounded-full border-2 border-dashed border-[#1c2b42] flex items-center justify-center">
                  <Activity size={20} className="opacity-20"/>
                </div>
                <span className="text-xs font-medium">No trend data available</span>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2 card p-6">
          <div className="flex items-center gap-2 mb-8">
            <Activity size={16} className="text-[#06b6d4]"/>
            <span className="text-[11px] font-black text-[#475569] uppercase tracking-widest">Distribution</span>
          </div>
          <div className="h-[300px] w-full">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie 
                    data={categoryData} 
                    cx="50%" cy="50%" 
                    innerRadius={isMobile ? 50 : 65} 
                    outerRadius={isMobile ? 80 : 100} 
                    paddingAngle={4} 
                    dataKey="value"
                    animationBegin={0}
                    animationDuration={1500}
                  >
                    {categoryData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} stroke="none" />)}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-[#475569] gap-3">
                <span className="text-xs font-medium">No data yet</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Net Worth Trend Chart */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Activity size={16} className="text-[#10b981]"/>
            <span className="text-[11px] font-black text-[#475569] uppercase tracking-widest">Net Worth Trend</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-[#475569] hidden sm:block">Lifetime cumulative wealth trajectory</span>
            <ChartDropdown active={netWorthType} onChange={setNetWorthType} />
          </div>
        </div>
        <div className="h-[320px] w-full">
          {netWorthData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              {netWorthType === 'area' ? (
                <AreaChart data={netWorthData}>
                  <defs>
                    <linearGradient id="clrEmerald" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1c2b42" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 10}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 10}} tickFormatter={v => `₹${v/1000}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#clrEmerald)" animationDuration={1500} />
                </AreaChart>
              ) : netWorthType === 'bar' ? (
                <BarChart data={netWorthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1c2b42" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 10}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 10}} tickFormatter={v => `₹${v/1000}k`} />
                  <Tooltip content={<CustomTooltip />} cursor={{fill: '#1c2b42', opacity: 0.4}} />
                  <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} animationDuration={1500} />
                </BarChart>
              ) : netWorthType === 'line' ? (
                <LineChart data={netWorthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1c2b42" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 10}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 10}} tickFormatter={v => `₹${v/1000}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} dot={{r: 4, fill: '#0d1424', strokeWidth: 2}} animationDuration={1500} />
                </LineChart>
              ) : netWorthType === 'step' ? (
                <LineChart data={netWorthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1c2b42" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 10}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 10}} tickFormatter={v => `₹${v/1000}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="stepAfter" dataKey="value" stroke="#10b981" strokeWidth={3} dot={false} animationDuration={1500} />
                </LineChart>
              ) : netWorthType === 'scatter' ? (
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1c2b42" vertical={false} />
                  <XAxis dataKey="name" type="category" allowDuplicatedCategory={false} axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 10}} dy={10} />
                  <YAxis dataKey="value" type="number" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 10}} tickFormatter={v => `₹${v/1000}k`} />
                  <Tooltip content={<CustomTooltip />} cursor={{strokeDasharray: '3 3'}} />
                  <Scatter data={netWorthData} fill="#10b981" animationDuration={1500} />
                </ScatterChart>
              ) : (
                <ComposedChart data={netWorthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1c2b42" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 10}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 10}} tickFormatter={v => `₹${v/1000}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" fill="#10b981" fillOpacity={0.4} radius={[4, 4, 0, 0]} animationDuration={1500} />
                  <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} dot={{r: 4, fill: '#0d1424', strokeWidth: 2}} animationDuration={1500} />
                </ComposedChart>
              )}
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-[#475569] gap-3">
              <div className="w-12 h-12 rounded-full border-2 border-dashed border-[#1c2b42] flex items-center justify-center">
                <Activity size={20} className="opacity-20"/>
              </div>
              <span className="text-xs font-medium">No net worth data available</span>
            </div>
          )}
        </div>
      </div>

      <RecentTransactions transactions={data?.recentTransactions || []} isMobile={isMobile} />
    </div>
  )
}
