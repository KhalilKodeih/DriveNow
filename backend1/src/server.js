const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

// ============================================
// DATABASE CONNECTION
// ============================================
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "car_rental",
});

db.getConnection((err, connection) => {
  if (err) {
    console.error("❌ Database connection failed:", err.message);
  } else {
    console.log("✅ MySQL connected");
    connection.release();
  }
});

// ============================================
// TEST ROUTE
// ============================================
app.get("/", (req, res) => {
  res.json({
    message: "DriveNow API is running!",
    endpoints: ["/api/cars", "/api/users", "/api/orders"],
  });
});

app.get("/api/test", (req, res) => {
  res.json({ message: "Backend works" });
});

// ============================================
// USER ROUTES
// ============================================

// Register user
app.post("/api/users/register", (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "All fields required" });
  }

  db.query(
    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
    [name, email, password],
    (err) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(400).json({ error: "Email already exists" });
        }
        return res.status(500).json(err);
      }
      res.json({ message: "User registered successfully" });
    }
  );
});

// Login user
app.post("/api/users/login", (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE email = ? AND password = ?",
    [email, password],
    (err, users) => {
      if (err) return res.status(500).json(err);

      if (users.length === 0) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      res.json({
        message: "Login successful",
        user: {
          id: users[0].id,
          name: users[0].name,
          email: users[0].email,
        },
      });
    }
  );
});

// Get all users
app.get("/api/users", (req, res) => {
  db.query("SELECT id, name, email FROM users", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// ============================================
// CAR ROUTES
// ============================================

// Get all cars
app.get("/api/cars", (req, res) => {
  db.query("SELECT * FROM cars", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// Get single car by ID
app.get("/api/cars/:id", (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM cars WHERE id = ?", [id], (err, results) => {
    if (err) return res.status(500).json(err);
    if (results.length === 0)
      return res.status(404).json({ error: "Car not found" });
    res.json(results[0]);
  });
});

// Create car
app.post("/api/cars", (req, res) => {
  const { brand, model, year, price_per_day } = req.body;
  db.query(
    "INSERT INTO cars (brand, model, year, price_per_day) VALUES (?, ?, ?, ?)",
    [brand, model, year, price_per_day],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.status(201).json({ message: "Car added", id: result.insertId });
    }
  );
});

// Update car
app.put("/api/cars/:id", (req, res) => {
  const { id } = req.params;
  const { brand, model, year, price_per_day, status } = req.body;

  db.query(
    "UPDATE cars SET brand=?, model=?, year=?, price_per_day=?, status=? WHERE id=?",
    [brand, model, year, price_per_day, status, id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      if (result.affectedRows === 0)
        return res.status(404).json({ error: "Car not found" });
      res.json({ message: "Car updated" });
    }
  );
});

// Delete car
app.delete("/api/cars/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM cars WHERE id=?", [id], (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Car not found" });
    res.json({ message: "Car deleted" });
  });
});

// ============================================
// ORDER ROUTES
// ============================================

// Get all orders
app.get("/api/orders", (req, res) => {
  const sql = `
    SELECT o.id, o.start_date, o.end_date, o.total_price, o.status,
           c.brand, c.model, c.price_per_day,
           u.name AS user_name, u.email AS user_email
    FROM orders o
    JOIN cars c ON o.car_id = c.id
    JOIN users u ON o.user_id = u.id
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// Create new order (rent a car)
app.post("/api/orders", (req, res) => {
  const { car_id, user_id, start_date, end_date } = req.body;

  if (!car_id || !user_id || !start_date || !end_date) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const days =
    (new Date(end_date) - new Date(start_date)) / (1000 * 60 * 60 * 24);
  if (days <= 0) return res.status(400).json({ error: "Invalid rental dates" });

  db.query(
    "SELECT price_per_day, status FROM cars WHERE id = ?",
    [car_id],
    (err, cars) => {
      if (err) return res.status(500).json(err);
      if (cars.length === 0)
        return res.status(404).json({ error: "Car not found" });

      if (cars[0].status !== "available") {
        return res.status(400).json({ error: "Car is already rented" });
      }

      const total_price = days * cars[0].price_per_day;

      db.query(
        "INSERT INTO orders (car_id, user_id, start_date, end_date, total_price) VALUES (?, ?, ?, ?, ?)",
        [car_id, user_id, start_date, end_date, total_price],
        (err, result) => {
          if (err) return res.status(500).json(err);

          db.query("UPDATE cars SET status='rented' WHERE id=?", [car_id]);
          res.status(201).json({
            message: "Car rented successfully",
            order_id: result.insertId,
          });
        }
      );
    }
  );
});

// Update order status
app.put("/api/orders/:id/status", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["active", "completed", "cancelled"].includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  db.query(
    "UPDATE orders SET status=? WHERE id=?",
    [status, id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      if (result.affectedRows === 0)
        return res.status(404).json({ error: "Order not found" });
      res.json({ message: "Order status updated" });
    }
  );
});

// ============================================
// START SERVER
// ============================================
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
