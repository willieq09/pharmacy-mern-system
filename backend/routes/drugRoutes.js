// // const express = require("express");
// // const Drug = require("../models/Drug");
// // const auth = require("../middleware/auth");

// // const router = express.Router();

// // // GET ALL DRUGS
// // router.get("/", auth, async (req, res) => {
// //   try {
// //     const drugs = await Drug.find().sort({ name: 1 });
// //     res.json(drugs);
// //   } catch (error) {
// //     res.status(500).json({ message: "Failed to fetch drugs" });
// //   }
// // });

// //  module.exports = router;
// // // import express from "express";
// // // import Drug from "../models/Drug.js";

// // // const router = express.Router();

// // // // GET ALL DRUGS (PUBLIC)
// // // router.get("/", async (req, res) => {
// // //   try {
// // //     const drugs = await Drug.find().sort({ name: 1 });
// // //     res.json(drugs);
// // //   } catch (error) {
// // //     res.status(500).json({ message: "Failed to fetch drugs" });
// // //   }
// // // });

// // // export default router;
// const express = require("express");
// const Drug = require("../models/Drug");
// // const auth = require("../middleware/auth"); // temporarily disabled

// const router = express.Router();

// // GET ALL DRUGS (TEMPORARILY WITHOUT AUTH)
// router.get("/", async (req, res) => {
//   try {
//     const drugs = await Drug.find().sort({ name: 1 });
//     res.json(drugs);
//   } catch (error) {
//     res.status(500).json({ message: "Failed to fetch drugs" });
//   }
// });

// module.exports = router;
const express = require("express");
const router = express.Router();
const Drug = require("../models/Drug");
const auth = require("../middleware/auth");

/* GET all drugs */
router.get("/", auth, async (req, res) => {
  const drugs = await Drug.find().sort({ name: 1 });
  res.json(drugs);
});

/* ADD or UPDATE drug */
router.post("/", auth, async (req, res) => {
  try {
    const { name, stock, price } = req.body;

    if (!name || !price)
      return res.status(400).json({ message: "Name and price required" });

    let drug = await Drug.findOne({ name });

    // update stock if exists
    if (drug) {
      drug.stock += Number(stock || 0);
      drug.price = price;
      await drug.save();
      return res.json(drug);
    }

    // create new drug
    drug = await Drug.create({
      name,
      stock: Number(stock || 0),
      price,
    });

    res.status(201).json(drug);
  } catch (err) {
    res.status(500).json({ message: "Failed to save drug" });
  }
});

module.exports = router;