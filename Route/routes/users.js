const express = require("express");
const router = express.Router();
const db = require("../db");

// Validate data
function validateUser(req, res, next) {
  const { name, email, age } = req.body;
  if (!name || !email || age === undefined) {
    return res.status(400).json({ error: "name, email, and age are required." });
  }
  next();
}

// POST /users
router.post("/", validateUser, async (req, res, next) => {
  try {
    const { name, email, age } = req.body;
    const [result] = await db.execute(
      "INSERT INTO users (name, email, age) VALUES (?, ?, ?)",
      [name, email, age]
    );
    res.status(201).json({ id: result.insertId, name, email, age });
  } catch (err) {
    next(err);
  }
});

// GET /users (filter + sort + pagination)
router.get("/", async (req, res, next) => {
  try {
    const { name, email, age, page = 1, limit = 10, sort = "id", order = "asc" } = req.query;
    const where = [];
    const values = [];

    if (name) { where.push("name = ?"); values.push(name); }
    if (email) { where.push("email = ?"); values.push(email); }
    if (age) { where.push("age = ?"); values.push(age); }

    const offset = (page - 1) * limit;
    const whereClause = where.length ? `WHERE ${where.join(" AND ")}` : "";
    const [users] = await db.execute(
      `SELECT * FROM users ${whereClause} ORDER BY ${sort} ${order} LIMIT ? OFFSET ?`,
      [...values, +limit, +offset]
    );

    res.json(users);
  } catch (err) {
    next(err);
  }
});

// GET /users/:id
router.get("/:id", async (req, res, next) => {
  try {
    const [user] = await db.execute("SELECT * FROM users WHERE id = ?", [req.params.id]);
    if (user.length === 0) return res.status(404).json({ error: "User not found" });
    res.json(user[0]);
  } catch (err) {
    next(err);
  }
});

// PUT /users/:id
router.put("/:id", validateUser, async (req, res, next) => {
  try {
    const { name, email, age } = req.body;
    const [result] = await db.execute(
      "UPDATE users SET name=?, email=?, age=? WHERE id=?",
      [name, email, age, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: "User not found" });
    res.json({ id: req.params.id, name, email, age });
  } catch (err) {
    next(err);
  }
});

// DELETE /users/:id
router.delete("/:id", async (req, res, next) => {
  try {
    const [result] = await db.execute("DELETE FROM users WHERE id = ?", [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: "User not found" });
    res.json({ message: "User deleted" });
  } catch (err) {
    next(err);
  }
});

// POST /bulk-users
router.post("/bulk-users", async (req, res, next) => {
  try {
    const users = req.body;
    if (!Array.isArray(users) || users.length === 0) {
      return res.status(400).json({ error: "Must provide an array of users" });
    }

    const values = users.map(u => [u.name, u.email, u.age]);
    await db.query("INSERT INTO users (name, email, age) VALUES ?", [values]);
    res.status(201).json({ message: `${users.length} users created.` });
  } catch (err) {
    next(err);
  }
});

module.exports = router;