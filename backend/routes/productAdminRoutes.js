const express = require("express");
const Product = require("../models/product");
const router = express.Router();
const { protect, admin } = require("../middleware/authMiddleware");

router.get("/", protect, admin, async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;