import React, { useEffect, useMemo, useState } from 'react'
import API from './Api'

export default function IncomeTab(){
  const [emails, setEmails] = useState([])
  const [paypals, setPaypals] = useState([])
  const [items, setItems] = useState([])
  const [q, setQ] = useState({from:'', to:'', email_id:'', paypal_id:''})
  const [form, setForm] = useState({date: new Date().toISOString().slice(0,10), email_id:'', paypal_id:'', gross:'', fee:'0', note:''})

  const loadOptions = async () => {
    const opt = await API.get('/api/options')
    setEmails(opt.emails || []); setPaypals(opt.paypals || [])
  }
  const search = async () => {
    const params = new URLSearchParams()
    if(q.from) params.append('from', q.from)
    if(q.to) params.append('to', q.to)
    if(q.email_id) params.append('email_id', q.email_id)
    if(q.paypal_id) params.append('paypal_id', q.paypal_id)
    const resp = await API.get('/api/income?'+params.toString())
    setItems(resp.items||[])
  }
  useEffect(()=>{ loadOptions(); search() }, [])

  const createItem = async () => {
    if(!form.email_id || !form.date || !form.gross) return alert('Chọn Email, ngày và số tiền')
    const payload = {...form, email_id: Number(form.email_id), paypal_id: form.paypal_id? Number(form.paypal_id): null, gross: Number(form.gross), fee: Number(form.fee||0)}
    await API.post('/api/income', payload)
    setForm({date:new Date().toISOString().slice(0,10), email_id:'', paypal_id:'', gross:'', fee:'0', note:''})
    search()
  }
  const removeItem = async (id) => { if(confirm('Xoá dòng thu nhập?')){ await API.del('/api/income/'+id); search(); } }

  const net = useMemo(()=> (Number(form.gross||0) - Number(form.fee||0)).toFixed(2), [form.gross, form.fee])
  const totals = useMemo(()=>{
    const g = items.reduce((s,x)=>s+Number(x.gross),0)
    const f = items.reduce((s,x)=>s+Number(x.fee),0)
    const n = items.reduce((s,x)=>s+Number(x.net),0)
    return {g:g.toFixed(2), f:f.toFixed(2), n:n.toFixed(2)}
  }, [items])

  return (
    <div className="d-grid gap-3">
      <div className="card">
        <div className="card-body">
          <h3 className="h5">Thêm dòng thu nhập</h3>
          <div className="row g-3 align-items-end">
            <div className="col-12 col-sm-6 col-lg-2">
              <label className="form-label">Ngày</label>
              <input type="date" className="form-control" value={form.date} onChange={e=>setForm({...form, date:e.target.value})}/>
            </div>
            <div className="col-12 col-sm-6 col-lg-3">
              <label className="form-label">Email</label>
              <select className="form-select" value={form.email_id} onChange={e=>setForm({...form, email_id:e.target.value})}>
                <option value="">-- Email --</option>
                {emails.map(e => <option key={e.id} value={e.id}>{e.address}</option>)}
              </select>
            </div>
            <div className="col-12 col-sm-6 col-lg-3">
              <label className="form-label">PayPal (tuỳ chọn)</label>
              <select className="form-select" value={form.paypal_id} onChange={e=>setForm({...form, paypal_id:e.target.value})}>
                <option value="">-- PayPal --</option>
                {paypals.map(p => <option key={p.id} value={p.id}>{p.address}</option>)}
              </select>
            </div>
            <div className="col-6 col-sm-4 col-lg-2">
              <label className="form-label">Nhận (gross)</label>
              <input type="number" step="0.01" className="form-control" placeholder="0.00" value={form.gross} onChange={e=>setForm({...form, gross:e.target.value})}/>
            </div>
            <div className="col-6 col-sm-4 col-lg-2">
              <label className="form-label">Phí (fee)</label>
              <input type="number" step="0.01" className="form-control" placeholder="0.00" value={form.fee} onChange={e=>setForm({...form, fee:e.target.value})}/>
            </div>
            <div className="col-6 col-sm-4 col-lg-2">
              <label className="form-label">Tổng (net)</label>
              <input className="form-control" disabled value={net} />
            </div>
            <div className="col-12 col-lg-4">
              <label className="form-label">Ghi chú</label>
              <input className="form-control" placeholder="..." value={form.note} onChange={e=>setForm({...form, note:e.target.value})}/>
            </div>
            <div className="col-12 col-lg-2 d-grid">
              <button className="btn btn-primary" onClick={createItem}>Lưu</button>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <h3 className="h5">Lọc</h3>
          <div className="row g-3 align-items-end">
            <div className="col-6 col-md-3">
              <label className="form-label">Từ ngày</label>
              <input type="date" className="form-control" value={q.from} onChange={e=>setQ({...q, from:e.target.value})} />
            </div>
            <div className="col-6 col-md-3">
              <label className="form-label">Đến ngày</label>
              <input type="date" className="form-control" value={q.to} onChange={e=>setQ({...q, to:e.target.value})} />
            </div>
            <div className="col-12 col-md-3">
              <label className="form-label">Email</label>
              <select className="form-select" value={q.email_id} onChange={e=>setQ({...q, email_id:e.target.value})}>
                <option value="">-- Email --</option>
                {emails.map(e => <option key={e.id} value={e.id}>{e.address}</option>)}
              </select>
            </div>
            <div className="col-12 col-md-3">
              <label className="form-label">PayPal</label>
              <select className="form-select" value={q.paypal_id} onChange={e=>setQ({...q, paypal_id:e.target.value})}>
                <option value="">-- PayPal --</option>
                {paypals.map(p => <option key={p.id} value={p.id}>{p.address}</option>)}
              </select>
            </div>
            <div className="col-12 d-grid d-md-inline">
              <button className="btn btn-outline-light me-2" onClick={search}>Tìm</button>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <h3 className="h5">Danh sách</h3>
          <div className="table-responsive">
            <table className="table table-hover table-sm align-middle">
              <thead>
                <tr><th>Ngày</th><th>Email</th><th>PayPal</th><th>Nhận</th><th>Phí</th><th>Tổng</th><th>Ghi chú</th><th className="text-end">Thao tác</th></tr>
              </thead>
              <tbody>
                {items.map(x => (
                  <tr key={x.id}>
                    <td className="text-nowrap">{x.date}</td>
                    <td>{x.email}</td>
                    <td>{x.paypal || '-'}</td>
                    <td>{Number(x.gross).toFixed(2)}</td>
                    <td>{Number(x.fee).toFixed(2)}</td>
                    <td><span className='badge bg-info text-dark badge-net'>{Number(x.net).toFixed(2)}</span></td>
                    <td className='text-secondary'>{x.note || ''}</td>
                    <td className="text-end">
                      <button className="btn btn-sm btn-outline-danger" onClick={()=>removeItem(x.id)}>Xoá</button>
                    </td>
                  </tr>
                ))}
                <tr className="table-secondary">
                  <td colSpan="3" className="text-end fw-bold">Tổng</td>
                  <td className="fw-bold">{totals.g}</td>
                  <td className="fw-bold">{totals.f}</td>
                  <td className="fw-bold">{totals.n}</td>
                  <td colSpan="2"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
