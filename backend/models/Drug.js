const mongoose = require("mongoose");

const drugSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    stock: {
      type: Number,
      default: 0,
    },

    price: {
      type: Number,
      required: true,
    },

    // ✅ Barcode field
    barcode: {
      type: String,
      unique: true,
      sparse: true, // allows old drugs without barcode
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Drug", drugSchema);