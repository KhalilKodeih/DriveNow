const db = require("../config/db");

// GET all cars
exports.getAllCars = (req, res) => {
  db.query("SELECT * FROM cars", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

// GET single car by ID
exports.getCarById = (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM cars WHERE id = ?", [id], (err, results) => {
    if (err) return res.status(500).json(err);
    if (results.length === 0) return res.status(404).json({ error: "Car not found" });
    res.json(results[0]);
  });
};

// CREATE car
exports.createCar = (req, res) => {
  const { brand, model, year, price_per_day } = req.body;
  db.query(
    "INSERT INTO cars (brand, model, year, price_per_day) VALUES (?, ?, ?, ?)",
    [brand, model, year, price_per_day],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.status(201).json({ message: "Car added", id: result.insertId });
    }
  );
};

// UPDATE car
exports.updateCar = (req, res) => {
  const { id } = req.params;
  const { brand, model, year, price_per_day, status } = req.body;

  db.query(
    "UPDATE cars SET brand=?, model=?, year=?, price_per_day=?, status=? WHERE id=?",
    [brand, model, year, price_per_day, status, id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      if (result.affectedRows === 0) return res.status(404).json({ error: "Car not found" });
      res.json({ message: "Car updated" });
    }
  );
};

// DELETE car
exports.deleteCar = (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM cars WHERE id=?", [id], (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.affectedRows === 0) return res.status(404).json({ error: "Car not found" });
    res.json({ message: "Car deleted" });
  });
};
