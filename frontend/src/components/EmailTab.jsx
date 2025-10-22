
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
    await API.post('/api/emails', formE); setFormE({address:'', node:'', ip:'', note:''}); load()
  }
  const addPayPal = async () => {
    if(!formP.address) return alert('Nhập PayPal (email)')
    await API.post('/api/paypals', formP); setFormP({address:'', note:''}); load()
  }
  const addLink = async () => {
    if(!link.email_id || !link.paypal_id) return alert('Chọn Email và PayPal')
    await API.post('/api/email-paypal', { email_id: Number(link.email_id), paypal_id: Number(link.paypal_id) }); load()
  }
  const delLink = async (id) => { await API.del('/api/email-paypal/'+id); load() }
  const delEmail = async (id) => { if(confirm('Xoá Email?')){ await API.del('/api/emails/'+id); load() } }
  const delPaypal = async (id) => { if(confirm('Xoá PayPal?')){ await API.del('/api/paypals/'+id); load() } }

  return (
    <div>
      <div className="card">
        <h3>Thêm Email</h3>
        <div className="row">
          <input placeholder="email@example.com" value={formE.address} onChange={e=>setFormE({...formE, address:e.target.value})}/>
          <input placeholder="Node" value={formE.node} onChange={e=>setFormE({...formE, node:e.target.value})}/>
          <input placeholder="IP" value={formE.ip} onChange={e=>setFormE({...formE, ip:e.target.value})}/>
          <input placeholder="Ghi chú" value={formE.note} onChange={e=>setFormE({...formE, note:e.target.value})}/>
          <button onClick={addEmail}>Lưu</button>
        </div>
      </div>

      <div className="card">
        <h3>Thêm PayPal</h3>
        <div className="row">
          <input placeholder="paypal@example.com" value={formP.address} onChange={e=>setFormP({...formP, address:e.target.value})}/>
          <input placeholder="Ghi chú" value={formP.note} onChange={e=>setFormP({...formP, note:e.target.value})}/>
          <button onClick={addPayPal}>Lưu</button>
        </div>
      </div>

      <div className="card">
        <h3>Gán PayPal cho Email</h3>
        <div className="row">
          <select value={link.email_id} onChange={e=>setLink({...link, email_id:e.target.value})}>
            <option value="">-- Email --</option>
            {emails.map(e => <option key={e.id} value={e.id}>{e.address}</option>)}
          </select>
          <select value={link.paypal_id} onChange={e=>setLink({...link, paypal_id:e.target.value})}>
            <option value="">-- PayPal --</option>
            {paypals.map(p => <option key={p.id} value={p.id}>{p.address}</option>)}
          </select>
          <button onClick={addLink}>Gán</button>
        </div>
      </div>

      <div className="card">
        <h3>Danh sách Email</h3>
        <table>
          <thead><tr><th>Email</th><th>Node</th><th>IP</th><th>PayPals</th><th></th></tr></thead>
          <tbody>
            {emails.map(e => (
              <tr key={e.id}>
                <td>{e.address}</td>
                <td>{e.node || '-'}</td>
                <td>{e.ip || '-'}</td>
                <td>{e.paypal_addresses || '-'}</td>
                <td><button onClick={()=>delEmail(e.id)}>Xoá</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card">
        <h3>Liên kết Email ↔ PayPal</h3>
        <table>
          <thead><tr><th>ID</th><th>Email</th><th>PayPal</th><th>Ngày tạo</th><th></th></tr></thead>
          <tbody>
            {links.map(l => (
              <tr key={l.id}>
                <td>{l.id}</td>
                <td>{l.email}</td>
                <td>{l.paypal}</td>
                <td className="muted">{l.created_at}</td>
                <td><button onClick={()=>delLink(l.id)}>Bỏ gán</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
