import React from 'react'

export default function Topbar({ onToggleSidebar, user, onLogout }) {
  return (
    <div className="vuexy-topbar">
      <div className="topbar-left">
        <button className="btn-toggle" onClick={onToggleSidebar}>
          <i className="bi bi-list"></i>
        </button>
        <h5 className="mb-0 text-muted">Dashboard</h5>
      </div>
      
      {user && (
        <div className="ms-auto d-flex align-items-center gap-3">
          <span className="text-muted d-none d-md-inline">
            <i className="bi bi-person-circle me-2"></i>
            {user.username}
          </span>
          <button 
            className="btn btn-sm btn-outline-danger"
            onClick={onLogout}
            title="Logout"
          >
            <i className="bi bi-box-arrow-right me-1"></i>
            <span className="d-none d-md-inline">Logout</span>
          </button>
        </div>
      )}
    </div>
  )
}
