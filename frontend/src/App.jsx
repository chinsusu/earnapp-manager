import React, { useState } from 'react'
import VelzonLayout from './layout/VelzonLayout'
import EmailTab from './components/EmailTab'
import IncomeTab from './components/IncomeTab'
import ReportsTab from './components/ReportsTab'

export default function App(){
  const [tab, setTab] = useState('email')
  return (
    <VelzonLayout active={tab} onChangeTab={setTab}>
      {tab==='email' && <EmailTab />}
      {tab==='income' && <IncomeTab />}
      {tab==='reports' && <ReportsTab />}
    </VelzonLayout>
  )
}
