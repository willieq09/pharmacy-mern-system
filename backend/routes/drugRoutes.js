// const express = require("express");
// const Drug = require("../models/Drug");
// const auth = require("../middleware/auth");

// const router = express.Router();

// // GET ALL DRUGS
// router.get("/", auth, async (req, res) => {
//   try {
//     const drugs = await Drug.find().sort({ name: 1 });
//     res.json(drugs);
//   } catch (error) {
//     res.status(500).json({ message: "Failed to fetch drugs" });
//   }
// });

//  module.exports = router;
// // import express from "express";
// // import Drug from "../models/Drug.js";

// // const router = express.Router();

// // // GET ALL DRUGS (PUBLIC)
// // router.get("/", async (req, res) => {
// //   try {
// //     const drugs = await Drug.find().sort({ name: 1 });
// //     res.json(drugs);
// //   } catch (error) {
// //     res.status(500).json({ message: "Failed to fetch drugs" });
// //   }
// // });

// // export default router;
const express = require("express");
const Drug = require("../models/Drug");
// const auth = require("../middleware/auth"); // temporarily disabled

const router = express.Router();

// GET ALL DRUGS (TEMPORARILY WITHOUT AUTH)
router.get("/", async (req, res) => {
  try {
    const drugs = await Drug.find().sort({ name: 1 });
    res.json(drugs);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch drugs" });
  }
});

module.exports = router;
