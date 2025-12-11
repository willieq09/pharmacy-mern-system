const express = require('express');
const Customer = require('../models/Customer');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/', auth, async (req, res) => {
  const { name, phone, email, address } = req.body;
  if (!name) return res.status(400).json({ message: 'Name required' });
  try {
    const c = new Customer({ name, phone, email, address });
    await c.save();
    return res.status(201).json(c);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const list = await Customer.find();
    return res.json(list);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
