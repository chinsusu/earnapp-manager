import React, { useState } from 'react'
import EmailTab from './components/EmailTab'
import IncomeTab from './components/IncomeTab'
import ReportsTab from './components/ReportsTab'

export default function App(){
  const [tab, setTab] = useState('email')

  return (
    <div className="container py-3">
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
        <h1 className="h3 m-0">📊 Earnapp Manager</h1>
        <div className="nav nav-pills nav-scroll">
          <button className={'nav-link ' + (tab==='email' ? 'active':'')}
            onClick={()=>setTab('email')}>Quản lý Email</button>
          <button className={'nav-link ' + (tab==='income' ? 'active':'')}
            onClick={()=>setTab('income')}>Quản lý Thu nhập</button>
          <button className={'nav-link ' + (tab==='reports' ? 'active':'')}
            onClick={()=>setTab('reports')}>Báo cáo</button>
        </div>
      </div>

      {tab==='email' && <EmailTab />}
      {tab==='income' && <IncomeTab />}
      {tab==='reports' && <ReportsTab />}

      <p className="text-secondary mt-3 small">Một Email có thể liên kết nhiều PayPal và ngược lại.</p>
    </div>
  )
}
