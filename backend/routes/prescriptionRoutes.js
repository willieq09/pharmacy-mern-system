const express = require('express');
const Prescription = require('../models/Prescription');
const auth = require('../middleware/auth');
const roles = require('../middleware/roles');
const router = express.Router();

router.post('/', auth, roles(['admin','pharmacist']), async (req, res) => {
  const { items } = req.body;
  if (!Array.isArray(items) || items.length === 0) return res.status(400).json({ message: 'No items' });
  try {
    const p = new Prescription(req.body);
    await p.save();
    return res.status(201).json(p);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const list = await Prescription.find().populate('items.drug');
    return res.json(list);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', auth, roles(['admin','pharmacist']), async (req, res) => {
  try {
    const updated = await Prescription.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ message: 'Prescription not found' });
    return res.json(updated);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
