const express = require("express");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

router.post("/register", async (req, res) => {
  const { email, name, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists." });

    user = new User({ name, email, password });
    await user.save();

    const payload = { user: { id: user._id, role: user.role } };

    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "40h"}, (err, token) => {
      if (err) throw err;

      res.status(201).json({
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        }
      });
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email }); // <-- added await
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    const payload = { user: { id: user._id, role: user.role } };

    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "40h"}, (err, token) => {
      if (err) throw err;

      res.json({
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        }
      });
    });
  } catch (error) {
    res.status(500).send("Server Error");
  }
});

router.get("/profile", protect, async (req, res) => {
  res.json(req.user);
})

module.exports = router;
