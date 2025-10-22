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
    const g = daily.reduce((s,x)=>s+Number(x.gross),0)
    const f = daily.reduce((s,x)=>s+Number(x.fee),0)
    const n = daily.reduce((s,x)=>s+Number(x.net),0)
    return {g: g.toFixed(2), f: f.toFixed(2), n: n.toFixed(2)}
  }, [daily])

  const monthlyTotal = useMemo(()=>{
    const g = monthly.reduce((s,x)=>s+Number(x.gross),0)
    const f = monthly.reduce((s,x)=>s+Number(x.fee),0)
    const n = monthly.reduce((s,x)=>s+Number(x.net),0)
    return {g: g.toFixed(2), f: f.toFixed(2), n: n.toFixed(2)}
  }, [monthly])

  return (
    <div className="d-grid gap-3">
      <div className="card">
        <div className="card-body">
          <h3 className="h5">Thống kê theo ngày</h3>
          <div className="row g-3 align-items-end mb-3">
            <div className="col-6 col-md-3">
              <label className="form-label">Từ ngày</label>
              <input type="date" className="form-control" value={from} onChange={e=>setFrom(e.target.value)} />
            </div>
            <div className="col-6 col-md-3">
              <label className="form-label">Đến ngày</label>
              <input type="date" className="form-control" value={to} onChange={e=>setTo(e.target.value)} />
            </div>
            <div className="col-12 col-md-auto d-grid d-md-inline">
              <button className="btn btn-outline-light mt-2 mt-md-0" onClick={loadDaily}>Làm mới</button>
            </div>
          </div>
          <div className="table-responsive">
            <table className="table table-sm table-hover align-middle">
              <thead><tr><th>Ngày</th><th>Nhận</th><th>Phí</th><th>Tổng</th></tr></thead>
              <tbody>
                {daily.map(d => (
                  <tr key={d.date}>
                    <td className="text-nowrap">{d.date}</td>
                    <td>{Number(d.gross).toFixed(2)}</td>
                    <td>{Number(d.fee).toFixed(2)}</td>
                    <td className="fw-bold">{Number(d.net).toFixed(2)}</td>
                  </tr>
                ))}
                <tr className="table-secondary">
                  <td className="text-end fw-bold">Tổng</td>
                  <td className="fw-bold">{dailyTotal.g}</td>
                  <td className="fw-bold">{dailyTotal.f}</td>
                  <td className="fw-bold">{dailyTotal.n}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <h3 className="h5">Thống kê theo tháng</h3>
          <div className="row g-3 align-items-end mb-3">
            <div className="col-12 col-md-3">
              <label className="form-label">Năm</label>
              <input type="number" className="form-control" value={year} onChange={e=>setYear(e.target.value)} />
            </div>
            <div className="col-12 col-md-auto d-grid d-md-inline">
              <button className="btn btn-outline-light mt-2 mt-md-0" onClick={loadMonthly}>Làm mới</button>
            </div>
          </div>
          <div className="table-responsive">
            <table className="table table-sm table-striped align-middle">
              <thead><tr><th>Tháng</th><th>Nhận</th><th>Phí</th><th>Tổng</th></tr></thead>
              <tbody>
                {monthly.map(m => (
                  <tr key={m.month}>
                    <td className="text-nowrap">{m.month}</td>
                    <td>{Number(m.gross).toFixed(2)}</td>
                    <td>{Number(m.fee).toFixed(2)}</td>
                    <td className="fw-bold">{Number(m.net).toFixed(2)}</td>
                  </tr>
                ))}
                <tr className="table-secondary">
                  <td className="text-end fw-bold">Tổng</td>
                  <td className="fw-bold">{monthlyTotal.g}</td>
                  <td className="fw-bold">{monthlyTotal.f}</td>
                  <td className="fw-bold">{monthlyTotal.n}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
