import React from 'react'
import { Menu, TrendingUp, Bell } from 'lucide-react'

export default function MobileNavbar({ onMenuClick }) {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-[#101828] border-b border-[#1c2b42] flex items-center justify-between px-4 z-50">
      <div className="flex items-center gap-3">
        <button 
          onClick={onMenuClick}
          className="p-2 -ml-2 text-[#94a3b8] hover:text-[#f5a623] transition-colors"
        >
          <Menu size={24} />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#f5a623] rounded-lg flex items-center justify-center">
            <TrendingUp size={18} className="text-[#080d1a]" strokeWidth={2.5}/>
          </div>
          <span className="font-serif text-lg text-[#f1f5f9]">Equinox</span>
        </div>
      </div>
      
      <button className="p-2 text-[#94a3b8] hover:text-[#f5a623] transition-colors">
        <Bell size={20} />
      </button>
    </header>
  )
}
