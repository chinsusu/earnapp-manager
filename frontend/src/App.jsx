import React, { useState, useEffect } from 'react'
import Login from './components/Login'
import Sidebar from './layout/Sidebar'
import Topbar from './layout/Topbar'
import EmailTab from './components/EmailTab'
import IncomeTab from './components/IncomeTab'
import ReportsTab from './components/ReportsTab'

export default function App() {
  const [user, setUser] = useState(null)
  const [tab, setTab] = useState('email')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (e) {
        localStorage.removeItem('user')
      }
    }
  }, [])

  const handleLoginSuccess = (userData) => {
    setUser(userData)
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    setUser(null)
    setTab('email')
  }

  // Show login if not authenticated
  if (!user) {
    return <Login onLoginSuccess={handleLoginSuccess} />
  }

  // Show main app if authenticated
  return (
    <div className="vuexy-layout">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeTab={tab}
        onTabChange={setTab}
      />
      <Topbar 
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        user={user}
        onLogout={handleLogout}
      />
      <div className="vuexy-content">
        {tab === 'email' && <EmailTab />}
        {tab === 'income' && <IncomeTab />}
        {tab === 'reports' && <ReportsTab />}
      </div>
    </div>
  )
}
