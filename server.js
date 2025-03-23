const express = require("express");
const bodyParser = require("body-parser");
const connectDB = require("./db");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");

const app = express();
app.use(bodyParser.json());

connectDB().then((db) => {
  app.use((req, res, next) => {
    req.db = db;
    next();
  });

  app.use("/users", userRoutes);
  app.use("/", authRoutes);

  app.use((req, res) => {
    res.status(404).json({ error: "Route not found" });
  });

  app.use((err, req, res, next) => {
    res.status(err.status || 500).json({ error: err.message || "Internal server error" });
  });

  app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
  });
});