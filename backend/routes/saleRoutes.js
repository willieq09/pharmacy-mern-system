const express = require('express');
const Sale = require('../models/Sale');
const Drug = require('../models/Drug');
const auth = require('../middleware/auth');
const roles = require('../middleware/roles');
const router = express.Router();

router.post('/', auth, roles(['admin','pharmacist']), async (req, res) => {
  const { items, customer } = req.body;
  if (!Array.isArray(items) || items.length === 0) return res.status(400).json({ message: 'Items required' });
  try {
    let total = 0;
    const processed = [];
    for (const it of items) {
      if (!it || !it.drug || typeof it.qty !== 'number' || it.qty <= 0) return res.status(400).json({ message: 'Invalid item' });
      const drug = await Drug.findById(it.drug);
      if (!drug) return res.status(404).json({ message: 'Drug not found' });
      if (drug.stock < it.qty) return res.status(400).json({ message: `Insufficient stock for ${drug.name}` });
      drug.stock -= it.qty;
      await drug.save();
      const price = drug.price;
      total += price * it.qty;
      processed.push({ drug: drug._id, qty: it.qty, price });
    }
    const sale = new Sale({ items: processed, total, customer, soldBy: req.user._id });
    await sale.save();
    return res.status(201).json(sale);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

router.get('/', auth, roles(['admin','pharmacist']), async (req, res) => {
  try {
    const sales = await Sale.find().populate('items.drug').populate('customer').populate('soldBy');
    return res.json(sales);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
