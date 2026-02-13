import React, { useEffect, useState } from 'react';
import API from '../api';
import DrugForm from './DrugForm';

export default function Drugs() {
  const [drugs, setDrugs] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await API.get('/drugs');
      setDrugs(res.data || []);
    } catch (err) {
      console.error('Failed to load drugs', err);
      setDrugs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="p-4">
      <h2>Drugs</h2>

      <DrugForm onSaved={load} />

      {loading && <p>Loading drugs...</p>}

      {!loading && drugs.length === 0 && (
        <p>No drugs found.</p>
      )}

      {!loading && drugs.length > 0 && (
        <ul>
          {drugs.map(d => (
            <li key={d._id}>
              {d.name} — {d.stock} units — ${d.price}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
