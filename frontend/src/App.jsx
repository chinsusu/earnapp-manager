
import React, { useEffect, useState } from 'react'
import EmailTab from './components/EmailTab'
import IncomeTab from './components/IncomeTab'
import ReportsTab from './components/ReportsTab'

export default function App(){
  const [tab, setTab] = useState('email')
  return (
    <div className="container">
      <h1 style={{marginBottom:10}}>📊 Email · PayPal · Thu nhập</h1>
      <div className="tabs">
        <button className={'tab ' + (tab==='email'?'active':'')} onClick={()=>setTab('email')}>Quản lý Email</button>
        <button className={'tab ' + (tab==='income'?'active':'')} onClick={()=>setTab('income')}>Quản lý Thu nhập</button>
        <button className={'tab ' + (tab==='reports'?'active':'')} onClick={()=>setTab('reports')}>Báo cáo</button>
      </div>
      {tab==='email' && <EmailTab />}
      {tab==='income' && <IncomeTab />}
      {tab==='reports' && <ReportsTab />}
      <div className="muted" style={{marginTop:12}}>Tip: một Email có thể liên kết nhiều PayPal và ngược lại.</div>
    </div>
  )
}
