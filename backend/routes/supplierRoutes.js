const express = require('express');
const Supplier = require('../models/Supplier');
const auth = require('../middleware/auth');
const roles = require('../middleware/roles');
const router = express.Router();

router.post('/', auth, roles(['admin']), async (req, res) => {
  const { name, phone, email, address } = req.body;
  if (!name) return res.status(400).json({ message: 'Name required' });
  try {
    const s = new Supplier({ name, phone, email, address });
    await s.save();
    return res.status(201).json(s);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const list = await Supplier.find();
    return res.json(list);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
