
import React, { useEffect, useMemo, useState } from 'react'
import API from './Api'

export default function ReportsTab(){
  const today = new Date().toISOString().slice(0,10)
  const [from, setFrom] = useState(today.slice(0,7)+'-01')
  const [to, setTo] = useState(today)
  const [daily, setDaily] = useState([])
  const [year, setYear] = useState(new Date().getFullYear())
  const [monthly, setMonthly] = useState([])

  const loadDaily = async () => {
    const params = new URLSearchParams({from, to})
    const resp = await API.get('/api/reports/daily?'+params.toString())
    setDaily(resp.items || [])
  }
  const loadMonthly = async () => {
    const resp = await API.get('/api/reports/monthly?year='+year)
    setMonthly(resp.items || [])
  }
  useEffect(()=>{ loadDaily() }, [from,to])
  useEffect(()=>{ loadMonthly() }, [year])

  const dailyTotal = useMemo(()=>{
    const g = daily.reduce((s,x)=>s+Number(x.gross),0);
    const f = daily.reduce((s,x)=>s+Number(x.fee),0);
    const n = daily.reduce((s,x)=>s+Number(x.net),0);
    return {g: g.toFixed(2), f: f.toFixed(2), n: n.toFixed(2)}
  }, [daily])

  const monthlyTotal = useMemo(()=>{
    const g = monthly.reduce((s,x)=>s+Number(x.gross),0);
    const f = monthly.reduce((s,x)=>s+Number(x.fee),0);
    const n = monthly.reduce((s,x)=>s+Number(x.net),0);
    return {g: g.toFixed(2), f: f.toFixed(2), n: n.toFixed(2)}
  }, [monthly])

  return (
    <div>
      <div className="card">
        <h3>Thống kê theo ngày</h3>
        <div className="row">
          <input type="date" value={from} onChange={e=>setFrom(e.target.value)} />
          <input type="date" value={to} onChange={e=>setTo(e.target.value)} />
          <button onClick={loadDaily}>Làm mới</button>
        </div>
        <table>
          <thead><tr><th>Ngày</th><th>Nhận</th><th>Phí</th><th>Tổng</th></tr></thead>
          <tbody>
            {daily.map(d => (
              <tr key={d.date}>
                <td>{d.date}</td>
                <td>{Number(d.gross).toFixed(2)}</td>
                <td>{Number(d.fee).toFixed(2)}</td>
                <td>{Number(d.net).toFixed(2)}</td>
              </tr>
            ))}
            <tr>
              <td style={{textAlign:'right', fontWeight:600}}>Tổng</td>
              <td>{dailyTotal.g}</td><td>{dailyTotal.f}</td><td>{dailyTotal.n}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="card">
        <h3>Thống kê theo tháng</h3>
        <div className="row">
          <input type="number" value={year} onChange={e=>setYear(e.target.value)} />
          <button onClick={loadMonthly}>Làm mới</button>
        </div>
        <table>
          <thead><tr><th>Tháng</th><th>Nhận</th><th>Phí</th><th>Tổng</th></tr></thead>
          <tbody>
            {monthly.map(m => (
              <tr key={m.month}>
                <td>{m.month}</td>
                <td>{Number(m.gross).toFixed(2)}</td>
                <td>{Number(m.fee).toFixed(2)}</td>
                <td>{Number(m.net).toFixed(2)}</td>
              </tr>
            ))}
            <tr>
              <td style={{textAlign:'right', fontWeight:600}}>Tổng</td>
              <td>{monthlyTotal.g}</td><td>{monthlyTotal.f}</td><td>{monthlyTotal.n}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
