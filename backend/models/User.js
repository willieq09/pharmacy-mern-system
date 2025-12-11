const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'pharmacist', 'customer'], default: 'pharmacist' }
}, { timestamps: true });

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
