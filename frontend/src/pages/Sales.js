import React, { useEffect, useState } from 'react';
import API from '../api';

export default function Sales() {
  const [sales, setSales] = useState([]);
  useEffect(()=>{
    API.get('/sales').then(res=>setSales(res.data || [])).catch(()=>setSales([]));
  },[]);
  return (
    <div className="p-4">
      <h2>Sales</h2>
      <ul>
        {sales.map(s=> (
          <li key={s._id}>Sale ${s.total} — {new Date(s.createdAt).toLocaleString()}</li>
        ))}
      </ul>
    </div>
  );
}
