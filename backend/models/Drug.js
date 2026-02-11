import mongoose from "mongoose";

const drugSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    stock: { type: Number, default: 0 },
    price: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Drug", drugSchema);
