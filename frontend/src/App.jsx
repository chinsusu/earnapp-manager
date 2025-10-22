import React, { useState } from 'react'
import Sidebar from './layout/Sidebar'
import Topbar from './layout/Topbar'
import EmailTab from './components/EmailTab'
import IncomeTab from './components/IncomeTab'
import ReportsTab from './components/ReportsTab'

export default function App() {
  const [tab, setTab] = useState('email')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="vuexy-layout">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeTab={tab}
        onTabChange={setTab}
      />
      <Topbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="vuexy-content">
        {tab === 'email' && <EmailTab />}
        {tab === 'income' && <IncomeTab />}
        {tab === 'reports' && <ReportsTab />}
      </div>
    </div>
  )
}
