import React, { useEffect, useState } from 'react'
import API from './Api'

export default function EmailTab(){
  const [emails, setEmails] = useState([])
  const [paypals, setPaypals] = useState([])
  const [formE, setFormE] = useState({address:'', node:'', ip:'', note:''})
  const [formP, setFormP] = useState({address:'', note:''})
  const [link, setLink] = useState({email_id:'', paypal_id:''})
  const [links, setLinks] = useState([])

  const load = async () => {
    const e = await API.get('/api/emails')
    const p = await API.get('/api/paypals')
    const l = await API.get('/api/email-paypal')
    setEmails(e.items || []); setPaypals(p.items || []); setLinks(l.items || [])
  }
  useEffect(()=>{ load() }, [])

  const addEmail = async () => {
    if(!formE.address) return alert('Nhập email')
    await API.post('/api/emails', formE)
    setFormE({address:'', node:'', ip:'', note:''}); load()
  }
  const addPayPal = async () => {
    if(!formP.address) return alert('Nhập PayPal (email)')
    await API.post('/api/paypals', formP)
    setFormP({address:'', note:''}); load()
  }
  const addLink = async () => {
    if(!link.email_id || !link.paypal_id) return alert('Chọn Email và PayPal')
    await API.post('/api/email-paypal', { email_id: Number(link.email_id), paypal_id: Number(link.paypal_id) })
    load()
  }
  const delLink = async (id) => { if(confirm('Bỏ gán?')){ await API.del('/api/email-paypal/'+id); load() } }
  const delEmail = async (id) => { if(confirm('Xoá Email?')){ await API.del('/api/emails/'+id); load() } }
  const delPaypal = async (id) => { if(confirm('Xoá PayPal?')){ await API.del('/api/paypals/'+id); load() } }

  return (
    <div className="d-grid gap-3">

      <div className="vuexy-card">
        <div>
          <h3 className="h5">Thêm Email</h3>
          <div className="row g-3 align-items-end">
            <div className="col-12 col-md-4">
              <label className="form-label">Email</label>
              <input className="form-control" placeholder="email@example.com" value={formE.address} onChange={e=>setFormE({...formE, address:e.target.value})}/>
            </div>
            <div className="col-6 col-md-2">
              <label className="form-label">Node</label>
              <input className="form-control" placeholder="node" value={formE.node} onChange={e=>setFormE({...formE, node:e.target.value})}/>
            </div>
            <div className="col-6 col-md-2">
              <label className="form-label">IP</label>
              <input className="form-control" placeholder="IP" value={formE.ip} onChange={e=>setFormE({...formE, ip:e.target.value})}/>
            </div>
            <div className="col-12 col-md-3">
              <label className="form-label">Ghi chú</label>
              <input className="form-control form-note" placeholder="..." value={formE.note} onChange={e=>setFormE({...formE, note:e.target.value})}/>
            </div>
            <div className="col-12 col-md-1 d-grid">
              <button className="btn btn-primary" onClick={addEmail}>Lưu</button>
            </div>
          </div>
        </div>
      </div>

      <div className="vuexy-card">
        <div>
          <h3 className="h5">Thêm PayPal</h3>
          <div className="row g-3 align-items-end">
            <div className="col-12 col-md-5">
              <label className="form-label">PayPal (email)</label>
              <input className="form-control" placeholder="paypal@example.com" value={formP.address} onChange={e=>setFormP({...formP, address:e.target.value})}/>
            </div>
            <div className="col-12 col-md-5">
              <label className="form-label">Ghi chú</label>
              <input className="form-control" placeholder="..." value={formP.note} onChange={e=>setFormP({...formP, note:e.target.value})}/>
            </div>
            <div className="col-12 col-md-2 d-grid">
              <button className="btn btn-primary" onClick={addPayPal}>Lưu</button>
            </div>
          </div>
        </div>
      </div>

      <div className="vuexy-card">
        <div>
          <h3 className="h5">Gán PayPal cho Email</h3>
          <div className="row g-3 align-items-end">
            <div className="col-12 col-md-5">
              <label className="form-label">Email</label>
              <select className="form-select" value={link.email_id} onChange={e=>setLink({...link, email_id:e.target.value})}>
                <option value="">-- Chọn Email --</option>
                {emails.map(e => <option key={e.id} value={e.id}>{e.address}</option>)}
              </select>
            </div>
            <div className="col-12 col-md-5">
              <label className="form-label">PayPal</label>
              <select className="form-select" value={link.paypal_id} onChange={e=>setLink({...link, paypal_id:e.target.value})}>
                <option value="">-- Chọn PayPal --</option>
                {paypals.map(p => <option key={p.id} value={p.id}>{p.address}</option>)}
              </select>
            </div>
            <div className="col-12 col-md-2 d-grid">
              <button className="btn btn-success" onClick={addLink}>Gán</button>
            </div>
          </div>
        </div>
      </div>

      <div className="vuexy-card">
        <div>
          <h3 className="h5">Danh sách Email</h3>
          <div className="table-responsive">
            <table className="table table-sm table-hover align-middle">
              <thead>
                <tr>
                  <th>Email</th><th>Node</th><th>IP</th><th>PayPals</th><th className="text-end">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {emails.map(e => (
                  <tr key={e.id}>
                    <td className="fw-medium">{e.address}</td>
                    <td>{e.node || '-'}</td>
                    <td><code>{e.ip || '-'}</code></td>
                    <td>{e.paypal_addresses || '-'}</td>
                    <td className="text-end">
                      <button className="btn btn-sm btn-outline-danger" onClick={()=>delEmail(e.id)}>Xoá</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
      <div className="vuexy-card">
        <div>
          <h3 className="h5">Danh sách PayPal</h3>
          <div className="table-responsive">
            <table className="table table-sm table-hover align-middle">
              <thead>
                <tr>
                  <th>PayPal (email)</th><th>Ghi chú</th><th>Ngày tạo</th><th className="text-end">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {paypals.map(p => (
                  <tr key={p.id}>
                    <td className="fw-medium">{p.address}</td>
                    <td>{p.note || '-'}</td>
                    <td className="text-secondary">{p.created_at}</td>
                    <td className="text-end">
                      <button className="btn btn-sm btn-outline-danger" onClick={()=>delPaypal(p.id)}>Xoá</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="vuexy-card">
        <div>
          <h3 className="h5">Liên kết Email ↔ PayPal</h3>
          <div className="table-responsive">
            <table className="table table-sm table-striped align-middle">
              <thead><tr><th>ID</th><th>Email</th><th>PayPal</th><th>Ngày tạo</th><th className="text-end">Thao tác</th></tr></thead>
              <tbody>
                {links.map(l => (
                  <tr key={l.id}>
                    <td>{l.id}</td>
                    <td>{l.email}</td>
                    <td>{l.paypal}</td>
                    <td className="text-secondary">{l.created_at}</td>
                    <td className="text-end">
                      <button className="btn btn-sm btn-outline-warning" onClick={()=>delLink(l.id)}>Bỏ gán</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  )
}
