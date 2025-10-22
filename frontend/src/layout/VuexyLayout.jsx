import React, { useState } from 'react'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

export default function VuexyLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <div className="vuexy-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Topbar onToggleSidebar={toggleSidebar} />
      <div className="vuexy-content">
        {children}
      </div>
    </div>
  )
}
