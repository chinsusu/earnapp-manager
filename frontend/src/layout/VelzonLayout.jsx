import React, { useState } from 'react'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

export default function VelzonLayout({active, onChangeTab, children}){
  const [open, setOpen] = useState(false)
  return (
    <div className="vz-wrapper">
      <div className={'vz-sidebar ' + (open ? 'show' : '')}>
        <div className="vz-brand">
          <div className="logo"></div>
          <div className="fw-semibold">Earnapp</div>
        </div>
        <Sidebar active={active} onChangeTab={(t)=>{ onChangeTab(t); setOpen(false) }} />
      </div>
      <div className={'vz-overlay ' + (open ? 'show' : '')} onClick={()=>setOpen(false)}></div>
      <div className="vz-content">
        <div className="vz-topbar">
          <div className="bar container-fluid">
            <button className="btn btn-outline-light d-lg-none" onClick={()=>setOpen(!open)}>
              <i className="bi bi-list"></i>
            </button>
            <div className="ms-auto d-flex align-items-center gap-3">
              <span className="text-muted small">Velzon-like UI</span>
            </div>
          </div>
        </div>
        <div className="vz-page">{children}</div>
      </div>
    </div>
  )
}
