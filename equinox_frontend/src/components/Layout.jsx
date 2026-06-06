import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import DesktopSidebar from './desktop/DesktopSidebar'
import MobileNavbar from './mobile/MobileNavbar'
import MobileDrawer from './mobile/MobileDrawer'
import useIsMobile from '../hooks/useIsMobile'

export default function Layout() {
  const isMobile = useIsMobile(1024)
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-[#080d1a]">
      {/* Platform-specific Navigation */}
      {isMobile ? (
        <>
          <MobileNavbar onMenuClick={() => setMobileOpen(true)} />
          <MobileDrawer isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
        </>
      ) : (
        <DesktopSidebar 
          collapsed={collapsed} 
          onToggle={() => setCollapsed(c => !c)} 
        />
      )}

      {/* Main Content Area */}
      <main 
        className={`flex-1 transition-all duration-300 min-h-screen ${
          isMobile ? 'pt-16 px-4 pb-8' : `${collapsed ? 'ml-[68px]' : 'ml-[240px]'} p-8`
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
