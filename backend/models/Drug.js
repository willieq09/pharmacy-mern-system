const mongoose = require("mongoose");

const drugSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    stock: { type: Number, default: 0 },
    price: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Drug", drugSchema);