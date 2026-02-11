const express = require("express");
const Prescription = require("../models/Prescription");
const auth = require("../middleware/auth");
const allow = require("../middleware/roles");

const router = express.Router();

/**
 * Create prescription (pharmacist only)
 */
router.post(
  "/",
  auth,
  allow("pharmacist"),
  async (req, res) => {
    try {
      const prescription = new Prescription({
        ...req.body,
        prescribedBy: req.user.id
      });

      await prescription.save();
      res.status(201).json(prescription);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;
