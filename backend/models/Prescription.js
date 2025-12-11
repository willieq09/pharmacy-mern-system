const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
  patientName: { type: String, required: true },
  patientPhone: { type: String },
  doctor: { type: String },
  items: [{ drug: { type: mongoose.Schema.Types.ObjectId, ref: 'Drug' }, qty: { type: Number, min: 1 } }],
  status: { type: String, enum: ['pending', 'dispensed', 'cancelled'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.models.Prescription || mongoose.model('Prescription', prescriptionSchema);
