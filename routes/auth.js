const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const router = express.Router();

router.post("/signup", async (req, res, next) => {
  const { name, email, password, age, role = "user" } = req.body;
  if (!name || !email || !password || !age) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await req.db.execute(
      "INSERT INTO users (name, email, password, age, role) VALUES (?, ?, ?, ?, ?)",
      [name, email, hashedPassword, age, role]
    );
    res.status(201).json({ message: "User registered", userId: result.insertId });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ error: "Email already exists" });
    }
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const [rows] = await req.db.execute("SELECT * FROM users WHERE email = ?", [email]);
    if (rows.length === 0) return res.status(401).json({ error: "Invalid credentials" });

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.json({ token });
  } catch (err) {
    next(err);
  }
});

module.exports = router;