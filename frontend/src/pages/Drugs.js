import React, { useEffect, useState } from 'react';
import API from '../api';
import DrugForm from './DrugForm';

export default function Drugs() {
  const [drugs, setDrugs] = useState([]);

  const load = async () => {
    try {
      const res = await API.get('/drugs');
      setDrugs(res.data || []);
    } catch (err) {
      setDrugs([]);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="p-4">
      <h2>Drugs</h2>
      <DrugForm onSaved={load} />
      <ul>
        {drugs.map(d => (
          <li key={d._id}>{d.name} — {d.stock} units — ${d.price}</li>
        ))}
      </ul>
    </div>
  );
}
