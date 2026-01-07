const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

// ✅ ADD THIS
app.get("/", (req, res) => {
  res.send("Backend is running ✅");
});

app.get("/api/test", (req, res) => {
  res.json({ message: "Backend works" });
});

app.use("/api/users", require("./routes/user.routes"));
app.use("/api/cars", require("./routes/car.routes"));
app.use("/api/orders", require("./routes/order.routes"));

module.exports = app;
