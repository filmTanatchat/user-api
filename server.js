const express = require("express");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/users");
const connectDB = require("./db");

const app = express();
app.use(bodyParser.json());

connectDB()
  .then((db) => {
    app.use((req, res, next) => {
      req.db = db;
      next();
    });

    app.use("/users", userRoutes);

    app.use((req, res, next) => {
      res.status(404).json({ error: "Route not found" });
    });

    app.use((err, req, res, next) => {
      console.error("Error:", err.message);
      res.status(err.status || 500).json({ error: err.message || "Internal Server Error" });
    });

    app.listen(3000, () => {
      console.log("Server running on http://localhost:3000");
    });
  })
  .catch((err) => {
    console.error("Could not start server due to DB error:", err.message);
    process.exit(1);
  });