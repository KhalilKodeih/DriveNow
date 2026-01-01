const express = require("express");
const app = express();

app.use(express.json());

app.get("/api/test", (req, res) => {
  res.json({ message: "Backend works" });
});

module.exports = app;


app.use("/api/users", require("./routes/user.routes"));

app.use("/api/cars", require("./routes/car.routes"));

app.use("/api/orders", require("./routes/order.routes"));
