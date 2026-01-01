const db = require("../config/db");

// Get all orders
exports.getAllOrders = (req, res) => {
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
};

// Create new order (rent a car)
exports.createOrder = (req, res) => {
  const { car_id, user_id, start_date, end_date } = req.body;

  if (!car_id || !user_id || !start_date || !end_date)
    return res.status(400).json({ error: "All fields are required" });

  // Calculate days
  const days = (new Date(end_date) - new Date(start_date)) / (1000 * 60 * 60 * 24);
  if (days <= 0) return res.status(400).json({ error: "Invalid rental dates" });

  // Check if car is available
  db.query("SELECT price_per_day, status FROM cars WHERE id = ?", [car_id], (err, cars) => {
    if (err) return res.status(500).json(err);
    if (cars.length === 0) return res.status(404).json({ error: "Car not found" });

    if (cars[0].status !== "available") {
      return res.status(400).json({ error: "Car is already rented" });
    }

    const total_price = days * cars[0].price_per_day;

    // Create order
    db.query(
      "INSERT INTO orders (car_id, user_id, start_date, end_date, total_price) VALUES (?, ?, ?, ?, ?)",
      [car_id, user_id, start_date, end_date, total_price],
      (err, result) => {
        if (err) return res.status(500).json(err);

        // Update car status
        db.query("UPDATE cars SET status='rented' WHERE id=?", [car_id]);

        res.status(201).json({ message: "Car rented successfully", order_id: result.insertId });
      }
    );
  });
};

// Update order status (complete or cancel)
exports.updateOrderStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['active','completed','cancelled'].includes(status)) 
    return res.status(400).json({ error: "Invalid status" });

  // Update order
  db.query("UPDATE orders SET status=? WHERE id=?", [status, id], (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.affectedRows === 0) return res.status(404).json({ error: "Order not found" });
    res.json({ message: "Order status updated" });
  });
};
