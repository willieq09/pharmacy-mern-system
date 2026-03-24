const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Sale = require("../models/Sale");
const Drug = require("../models/Drug");
const auth = require("../middleware/auth");
const roles = require("../middleware/roles"); // <-- role middleware

/* =========================================
   POST /api/sales
   Normal sale by drug ID
   Allowed roles: admin, pharmacist, staff
========================================= */
router.post("/", auth, roles("admin", "pharmacist", "staff"), async (req, res) => {
  try {
    const { drug, quantity, totalPrice } = req.body;

    if (!drug || !mongoose.Types.ObjectId.isValid(drug))
      return res.status(400).json({ message: "Invalid item" });

    if (!quantity || quantity <= 0)
      return res.status(400).json({ message: "Invalid quantity" });

    if (!totalPrice || totalPrice <= 0)
      return res.status(400).json({ message: "Invalid total price" });

    const foundDrug = await Drug.findById(drug);
    if (!foundDrug)
      return res.status(404).json({ message: "Drug not found" });

    if (foundDrug.stock < quantity)
      return res.status(400).json({ message: "Insufficient stock" });

    // Reduce stock
    foundDrug.stock -= quantity;
    await foundDrug.save();

    const sale = await Sale.create({
      drug,
      quantity,
      totalPrice,
      soldBy: req.user._id, // track which user made the sale
    });

    const populatedSale = await Sale.findById(sale._id)
      .populate("drug", "name price barcode")
      .populate("soldBy", "username");

    res.status(201).json(populatedSale);
  } catch (err) {
    console.error("SALE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* =========================================
   POST /api/sales/barcode
   Sell drug using barcode
   Allowed roles: admin, pharmacist, staff
========================================= */
router.post("/barcode", auth, roles("admin", "pharmacist", "staff"), async (req, res) => {
  try {
    const { barcode, quantity } = req.body;

    if (!barcode)
      return res.status(400).json({ message: "Barcode required" });

    if (!quantity || quantity <= 0)
      return res.status(400).json({ message: "Invalid quantity" });

    const drug = await Drug.findOne({ barcode });
    if (!drug)
      return res.status(404).json({ message: "Drug not found" });

    if (drug.stock < quantity)
      return res.status(400).json({ message: "Insufficient stock" });

    const totalPrice = drug.price * quantity;

    // Reduce stock
    drug.stock -= quantity;
    await drug.save();

    const sale = await Sale.create({
      drug: drug._id,
      quantity,
      totalPrice,
      soldBy: req.user._id, // track user
    });

    const populatedSale = await Sale.findById(sale._id)
      .populate("drug", "name price barcode")
      .populate("soldBy", "username");

    res.status(201).json(populatedSale);
  } catch (err) {
    console.error("BARCODE SALE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* =========================================
   GET /api/sales
   Allowed roles: admin, manager
   Pharmacists or staff only see their own sales (optional)
========================================= */
router.get("/", auth, async (req, res) => {
  try {
    let sales;

    // Admin and manager see all sales
    if (["admin", "manager"].includes(req.user.role)) {
      sales = await Sale.find()
        .populate("drug", "name price barcode")
        .populate("soldBy", "username")
        .sort({ createdAt: -1 });
    } else {
      // Pharmacist/staff see only their own sales
      sales = await Sale.find({ soldBy: req.user._id })
        .populate("drug", "name price barcode")
        .populate("soldBy", "username")
        .sort({ createdAt: -1 });
    }

    res.json(sales);
  } catch (err) {
    console.error("FETCH SALES ERROR:", err);
    res.status(500).json({ message: "Failed to fetch sales" });
  }
});

module.exports = router;