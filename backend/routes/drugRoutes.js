const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Drug = require("../models/Drug");
const auth = require("../middleware/auth");

/* -------------------------------
   GET /api/drugs
   Fetch all drugs
--------------------------------- */
router.get("/", auth, async (req, res) => {
  try {
    const drugs = await Drug.find().sort({ name: 1 }); // sort alphabetically
    res.json(drugs);
  } catch (err) {
    console.error("FETCH DRUGS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* -------------------------------
   POST /api/drugs
   Add a new drug or increase stock if exists
--------------------------------- */
router.post("/", auth, async (req, res) => {
  try {
    const { name, price, stock } = req.body;
    if (!name || !price || !stock)
      return res.status(400).json({ message: "All fields are required" });

    // Check if drug exists
    const existingDrug = await Drug.findOne({ name: name.trim() });
    if (existingDrug) {
      // Increase stock and update price
      existingDrug.stock += Number(stock);
      existingDrug.price = Number(price);
      await existingDrug.save();
      return res.json({
        message: "Existing drug stock updated",
        drug: existingDrug,
      });
    }

    // Create new drug
    const drug = await Drug.create({
      name: name.trim(),
      price: Number(price),
      stock: Number(stock),
    });

    res.status(201).json({ message: "Drug added successfully", drug });
  } catch (err) {
    console.error("POST DRUG ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* -------------------------------
   PATCH /api/drugs
   Update stock and price for an existing drug
--------------------------------- */
router.patch("/", auth, async (req, res) => {
  try {
    const { drugId, price, stock } = req.body;
    if (!drugId || price === undefined || stock === undefined)
      return res.status(400).json({ message: "All fields required" });

    if (!mongoose.Types.ObjectId.isValid(drugId))
      return res.status(400).json({ message: "Invalid drug ID" });

    const drug = await Drug.findById(drugId);
    if (!drug) return res.status(404).json({ message: "Drug not found" });

    drug.price = Number(price);
    drug.stock += Number(stock);
    await drug.save();

    res.json({ message: "Drug stock and price updated", drug });
  } catch (err) {
    console.error("PATCH DRUG ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* -------------------------------
   DELETE /api/drugs/:id
   Delete a drug
--------------------------------- */
router.delete("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid drug ID" });

    const drug = await Drug.findByIdAndDelete(id);
    if (!drug) return res.status(404).json({ message: "Drug not found" });

    res.json({ message: `Drug "${drug.name}" deleted successfully` });
  } catch (err) {
    console.error("DELETE DRUG ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;