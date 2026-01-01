const mysql = require("mysql2");

// Create connection pool
const db = mysql.createPool({
  host: "localhost",       // XAMPP runs MySQL locally
  user: "root",            // default XAMPP user
  password: "",            // default XAMPP password is empty
  database: "car_rental" // your database name
});

// Test connection
db.getConnection((err, connection) => {
  if (err) {
    console.error("❌ Database connection failed:", err.message);
  } else {
    console.log("✅ MySQL connected");
    connection.release();
  }
});

module.exports = db;
