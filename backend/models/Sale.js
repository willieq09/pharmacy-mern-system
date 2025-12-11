const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
  items: [{ drug: { type: mongoose.Schema.Types.ObjectId, ref: 'Drug', required: true }, qty: { type: Number, required: true, min: 1 }, price: { type: Number, required: true, min: 0 } }],
  total: { type: Number, required: true, min: 0 },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
  soldBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.models.Sale || mongoose.model('Sale', saleSchema);
