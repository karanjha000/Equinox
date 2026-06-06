import React, { createContext, useContext, useState, useCallback } from 'react'
import { CheckCircle, XCircle, Info } from 'lucide-react'
const Ctx = createContext(null)
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const show = useCallback((msg, type = 'info') => {
    const id = Date.now() + Math.random()
    setToasts(p => [...p, { id, msg, type }])
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500)
  }, [])
  const icons = { success: CheckCircle, error: XCircle, info: Info }
  return (
    <Ctx.Provider value={{ show }}>
      {children}
      <div className="toasts">
        {toasts.map(t => {
          const Icon = icons[t.type] || Info
          return <div key={t.id} className={`toast t-${t.type}`}><Icon size={15}/>{t.msg}</div>
        })}
      </div>
    </Ctx.Provider>
  )
}
export const useToast = () => useContext(Ctx)
