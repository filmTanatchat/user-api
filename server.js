const express = require("express");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/users");

const app = express();
app.use(bodyParser.json());
app.use("/users", userRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});