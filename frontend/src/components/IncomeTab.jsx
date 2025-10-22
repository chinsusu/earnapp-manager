
import React, { useEffect, useMemo, useState } from 'react'
import API from './Api'

export default function IncomeTab(){
  const [emails, setEmails] = useState([])
  const [paypals, setPaypals] = useState([])
  const [items, setItems] = useState([])
  const [q, setQ] = useState({from:'', to:'', email_id:'', paypal_id:''})
  const [form, setForm] = useState({date: new Date().toISOString().slice(0,10), email_id:'', paypal_id:'', gross:'', fee:'0', note:''})

  const loadOptions = async () => {
    const opt = await API.get('/api/options'); 
    setEmails(opt.emails || []); 
    setPaypals(opt.paypals || []);
  }
  const search = async () => {
    const params = new URLSearchParams();
    if(q.from) params.append('from', q.from);
    if(q.to) params.append('to', q.to);
    if(q.email_id) params.append('email_id', q.email_id);
    if(q.paypal_id) params.append('paypal_id', q.paypal_id);
    const resp = await API.get('/api/income?'+params.toString());
    setItems(resp.items||[]);
  }
  useEffect(()=>{ loadOptions(); search() }, [])

  const createItem = async () => {
    if(!form.email_id || !form.date || !form.gross) return alert('Chọn Email, ngày và số tiền')
    const payload = {...form, email_id: Number(form.email_id), paypal_id: form.paypal_id? Number(form.paypal_id): null, gross: Number(form.gross), fee: Number(form.fee||0)}
    await API.post('/api/income', payload);
    setForm({date:new Date().toISOString().slice(0,10), email_id:'', paypal_id:'', gross:'', fee:'0', note:''});
    search();
  }
  const removeItem = async (id) => { if(confirm('Xoá dòng thu nhập?')){ await API.del('/api/income/'+id); search(); } }

  const net = useMemo(()=> (Number(form.gross||0) - Number(form.fee||0)).toFixed(2), [form.gross, form.fee])

  const listPaypalsForEmail = useMemo(()=>{
    return paypals; // simple for now; could filter by link via backend later
  }, [paypals, form.email_id])

  // totals
  const totals = useMemo(()=>{
    const g = items.reduce((s,x)=>s+Number(x.gross),0);
    const f = items.reduce((s,x)=>s+Number(x.fee),0);
    const n = items.reduce((s,x)=>s+Number(x.net),0);
    return {g:g.toFixed(2), f:f.toFixed(2), n:n.toFixed(2)}
  }, [items])

  return (
    <div>
      <div className="card">
        <h3>Thêm dòng thu nhập</h3>
        <div className="row">
          <input type="date" value={form.date} onChange={e=>setForm({...form, date:e.target.value})}/>
          <select value={form.email_id} onChange={e=>setForm({...form, email_id:e.target.value})}>
            <option value="">-- Email --</option>
            {emails.map(e => <option key={e.id} value={e.id}>{e.address}</option>)}
          </select>
          <select value={form.paypal_id} onChange={e=>setForm({...form, paypal_id:e.target.value})}>
            <option value="">-- PayPal (tuỳ chọn) --</option>
            {listPaypalsForEmail.map(p => <option key={p.id} value={p.id}>{p.address}</option>)}
          </select>
          <input type="number" step="0.01" placeholder="Nhận (gross)" value={form.gross} onChange={e=>setForm({...form, gross:e.target.value})}/>
          <input type="number" step="0.01" placeholder="Phí (fee)" value={form.fee} onChange={e=>setForm({...form, fee:e.target.value})}/>
          <input disabled value={net} title="Tổng (net = nhận - phí)"/>
          <input placeholder="Ghi chú" value={form.note} onChange={e=>setForm({...form, note:e.target.value})}/>
          <button onClick={createItem}>Lưu</button>
        </div>
      </div>

      <div className="card">
        <h3>Lọc</h3>
        <div className="row">
          <input type="date" value={q.from} onChange={e=>setQ({...q, from:e.target.value})} />
          <input type="date" value={q.to} onChange={e=>setQ({...q, to:e.target.value})} />
          <select value={q.email_id} onChange={e=>setQ({...q, email_id:e.target.value})}>
            <option value="">-- Email --</option>
            {emails.map(e => <option key={e.id} value={e.id}>{e.address}</option>)}
          </select>
          <select value={q.paypal_id} onChange={e=>setQ({...q, paypal_id:e.target.value})}>
            <option value="">-- PayPal --</option>
            {paypals.map(p => <option key={p.id} value={p.id}>{p.address}</option>)}
          </select>
          <button onClick={search}>Tìm</button>
        </div>
      </div>

      <div className="card">
        <h3>Danh sách</h3>
        <table>
          <thead><tr><th>Ngày</th><th>Email</th><th>PayPal</th><th>Nhận</th><th>Phí</th><th>Tổng</th><th>Ghi chú</th><th></th></tr></thead>
          <tbody>
            {items.map(x => (
              <tr key={x.id}>
                <td>{x.date}</td>
                <td>{x.email}</td>
                <td>{x.paypal || '-'}</td>
                <td>{Number(x.gross).toFixed(2)}</td>
                <td>{Number(x.fee).toFixed(2)}</td>
                <td><span className='badge'>{Number(x.net).toFixed(2)}</span></td>
                <td className='muted'>{x.note || ''}</td>
                <td><button onClick={()=>removeItem(x.id)}>Xoá</button></td>
              </tr>
            ))}
            <tr>
              <td colSpan="3" style={{textAlign:'right', fontWeight:600}}>Tổng</td>
              <td>{totals.g}</td><td>{totals.f}</td><td>{totals.n}</td><td></td><td></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
