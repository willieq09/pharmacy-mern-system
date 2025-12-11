const express = require('express');
const Drug = require('../models/Drug');
const auth = require('../middleware/auth');
const roles = require('../middleware/roles');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const drugs = await Drug.find().populate('supplier');
    return res.json(drugs);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', auth, roles(['admin', 'pharmacist']), async (req, res) => {
  const { name, price, stock, brand, category, description, supplier } = req.body;
  if (!name || typeof price !== 'number') return res.status(400).json({ message: 'Invalid input' });
  try {
    const d = new Drug({ name, price, stock: typeof stock === 'number' ? stock : 0, brand, category, description, supplier });
    const saved = await d.save();
    return res.status(201).json(saved);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', auth, roles(['admin', 'pharmacist']), async (req, res) => {
  try {
    const updated = await Drug.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ message: 'Drug not found' });
    return res.json(updated);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', auth, roles(['admin']), async (req, res) => {
  try {
    const removed = await Drug.findByIdAndDelete(req.params.id);
    if (!removed) return res.status(404).json({ message: 'Drug not found' });
    return res.json({ message: 'Deleted' });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
