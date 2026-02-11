const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Sale = require("../models/Sale");
const Drug = require("../models/Drug");
const auth = require("../middleware/auth");

/* ----------------------------------------
   POST /api/sales
   Create a new sale
----------------------------------------- */
router.post("/", auth, async (req, res) => {
  try {
    console.log("SALE BODY RECEIVED:", req.body);
    console.log("USER:", req.user?._id);

    const { drug, quantity, totalPrice } = req.body;

    // ✅ Strong validation
    if (!drug || !mongoose.Types.ObjectId.isValid(drug)) {
      return res.status(400).json({ message: "Invalid item" });
    }

    if (!quantity || quantity <= 0) {
      return res.status(400).json({ message: "Invalid quantity" });
    }

    if (!totalPrice || totalPrice <= 0) {
      return res.status(400).json({ message: "Invalid total price" });
    }

    // ✅ Check drug exists
    const foundDrug = await Drug.findById(drug);
    if (!foundDrug) {
      return res.status(400).json({ message: "Drug not found" });
    }

    // ✅ Check stock
    if (foundDrug.stock < quantity) {
      return res.status(400).json({ message: "Insufficient stock" });
    }

    // ✅ Reduce stock
    foundDrug.stock -= quantity;
    await foundDrug.save();

    // ✅ Create sale
    const sale = await Sale.create({
      drug,
      quantity,
      totalPrice,
      soldBy: req.user._id
    });

    const populatedSale = await Sale.findById(sale._id)
      .populate("drug", "name price")
      .populate("soldBy", "username");

    return res.status(201).json(populatedSale);
  } catch (err) {
    console.error("SALE ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

/* ----------------------------------------
   GET /api/sales
----------------------------------------- */
router.get("/", auth, async (req, res) => {
  try {
    const sales = await Sale.find()
      .populate("drug", "name price")
      .populate("soldBy", "username")
      .sort({ createdAt: -1 });

    res.json(sales);
  } catch (err) {
    console.error("FETCH SALES ERROR:", err);
    res.status(500).json({ message: "Failed to fetch sales" });
  }
});

module.exports = router;
