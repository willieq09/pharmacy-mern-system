import React, { useState } from 'react';
import API from '../api';

export default function DrugForm({ onSaved }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');

  const submit = async e => {
    e.preventDefault();
    const p = Number(price);
    const s = Number(stock);
    if (!name || Number.isNaN(p) || Number.isNaN(s)) return;
    try {
      await API.post('/drugs', { name, price: p, stock: s });
      setName(''); setPrice(''); setStock('');
      if (onSaved) onSaved();
    } catch (err) {}
  };

  return (
    <form onSubmit={submit} className="mb-4">
      <input value={name} onChange={e=>setName(e.target.value)} placeholder="Name" />
      <input type="number" value={price} onChange={e=>setPrice(e.target.value)} placeholder="Price" />
      <input type="number" value={stock} onChange={e=>setStock(e.target.value)} placeholder="Stock" />
      <button type="submit">Add Drug</button>
    </form>
  );
}
