import React from 'react'

export default function Topbar({ onToggleSidebar }) {
  return (
    <div className="vuexy-topbar">
      <div className="topbar-left">
        <button className="btn-toggle" onClick={onToggleSidebar}>
          <i className="bi bi-list"></i>
        </button>
        <h5 className="mb-0 text-muted">Dashboard</h5>
      </div>
    </div>
  )
}
