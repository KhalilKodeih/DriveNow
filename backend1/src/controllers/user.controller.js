const db = require("../config/db");

// REGISTER USER
exports.register = (req, res) => {
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
};

// LOGIN USER
exports.login = (req, res) => {
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
          email: users[0].email
        }
      });
    }
  );
};

// GET ALL USERS
exports.getAllUsers = (req, res) => {
  db.query(
    "SELECT id, name, email FROM users",
    (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results);
    }
  );
};
