import React from 'react'

export default function Sidebar({ isOpen, onClose, activeTab, onTabChange }) {
  const menuItems = [
    { id: 'email', label: 'Quản lý Email', icon: 'bi-envelope' },
    { id: 'income', label: 'Quản lý Thu nhập', icon: 'bi-cash-stack' },
    { id: 'reports', label: 'Báo cáo', icon: 'bi-graph-up' }
  ]

  return (
    <>
      <div className={`vuexy-sidebar ${isOpen ? 'show' : ''}`}>
        <div className="sidebar-brand">
          <h4><i className="bi bi-wallet2"></i> Earnapp</h4>
        </div>
        <ul className="sidebar-menu">
          {menuItems.map(item => (
            <li key={item.id} className="menu-item">
              <a
                href="#"
                className={`menu-link ${activeTab === item.id ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault()
                  onTabChange(item.id)
                  onClose()
                }}
              >
                <i className={`bi ${item.icon}`}></i>
                <span>{item.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
      {isOpen && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
          style={{ zIndex: 1025 }}
          onClick={onClose}
        />
      )}
    </>
  )
}
