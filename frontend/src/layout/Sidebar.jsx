import React from 'react'
export default function Sidebar({active, onChangeTab}){
  const items = [
    {key:'email',  icon:'bi-envelope', label:'Quản lý Email'},
    {key:'income', icon:'bi-cash-stack', label:'Quản lý Thu nhập'},
    {key:'reports',icon:'bi-graph-up', label:'Báo cáo'},
  ]
  return (
    <nav className="vz-nav">
      {items.map(it => (
        <a key={it.key} href="#" className={'vz-link ' + (active===it.key?'active':'')}
           onClick={(e)=>{e.preventDefault(); onChangeTab(it.key)}}>
          <i className={'bi '+it.icon}></i><span>{it.label}</span>
        </a>
      ))}
    </nav>
  )
}
