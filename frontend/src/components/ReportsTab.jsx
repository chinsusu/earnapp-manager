import React, { useEffect, useMemo, useState } from 'react'
import API from './Api'
import Chart from 'react-apexcharts'

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

  const dailyOpts = {
    chart: { toolbar: { show: false }, background: 'transparent' },
    dataLabels: { enabled: false },
    stroke: { width: 2, curve: 'smooth' },
    xaxis: { categories: daily.map(d=>d.date) },
    yaxis: { labels: { formatter: (v)=>Number(v).toFixed(0) } },
    grid: { borderColor: '#1b2347' },
  }
  const dailySeries = [
    { name: 'Nhận (gross)', data: daily.map(d=>Number(d.gross)) },
    { name: 'Phí (fee)', data: daily.map(d=>Number(d.fee)) },
    { name: 'Tổng (net)', data: daily.map(d=>Number(d.net)) },
  ]

  const monthlyOpts = {
    chart: { toolbar: { show: false }, background: 'transparent' },
    dataLabels: { enabled: false },
    stroke: { width: 2, curve: 'smooth' },
    xaxis: { categories: monthly.map(m=>m.month) },
    yaxis: { labels: { formatter: (v)=>Number(v).toFixed(0) } },
    grid: { borderColor: '#1b2347' },
  }
  const monthlySeries = [
    { name: 'Nhận (gross)', data: monthly.map(m=>Number(m.gross)) },
    { name: 'Phí (fee)', data: monthly.map(m=>Number(m.fee)) },
    { name: 'Tổng (net)', data: monthly.map(m=>Number(m.net)) },
  ]

  return (
    <div className="d-grid gap-3">

      <div className="vz-stats">
        <div className="row g-3">
          <div className="col-12 col-md-4">
            <div className="card p-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="text-muted small">Tổng (ngày chọn)</div>
                  <div className="h4 m-0">{dailyTotal.n}</div>
                </div>
                <i className="bi bi-cash-stack fs-3"></i>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div className="card p-3">
              <div className="text-muted small">Tổng tháng {year}</div>
              <div className="h4 m-0">{monthlyTotal.n}</div>
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div className="card p-3">
              <div className="text-muted small">Gross - Fee (tháng)</div>
              <div className="h4 m-0">{(Number(monthlyTotal.g)-Number(monthlyTotal.f)).toFixed(2)}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="d-flex flex-wrap justify-content-between align-items-end mb-3 gap-2">
            <h3 className="h5 m-0">Thống kê theo ngày</h3>
            <div className="row g-2">
              <div className="col-auto">
                <input type="date" className="form-control" value={from} onChange={e=>setFrom(e.target.value)} />
              </div>
              <div className="col-auto">
                <input type="date" className="form-control" value={to} onChange={e=>setTo(e.target.value)} />
              </div>
              <div className="col-auto">
                <button className="btn btn-outline-light" onClick={loadDaily}>Làm mới</button>
              </div>
            </div>
          </div>
          <div className="table-responsive">
            <table className="table table-sm align-middle">
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
          <div className="mt-3">
            <Chart type="area" height={300} options={dailyOpts} series={dailySeries} />
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="d-flex flex-wrap justify-content-between align-items-end mb-3 gap-2">
            <h3 className="h5 m-0">Thống kê theo tháng</h3>
            <div className="row g-2">
              <div className="col-auto">
                <input type="number" className="form-control" value={year} onChange={e=>setYear(e.target.value)} />
              </div>
              <div className="col-auto">
                <button className="btn btn-outline-light" onClick={loadMonthly}>Làm mới</button>
              </div>
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
          <div className="mt-3">
            <Chart type="bar" height={300} options={monthlyOpts} series={monthlySeries} />
          </div>
        </div>
      </div>

    </div>
  )
}
