require('dotenv').config();

// Ensure JWT_SECRET is set
if (!process.env.JWT_SECRET) {
  console.error("FATAL: JWT_SECRET not set in .env");
  process.exit(1);
}

console.log("JWT_SECRET loaded:", process.env.JWT_SECRET);

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// ------------------ ROUTES ------------------

// Auth routes
app.use('/api/auth', require('./routes/authRoutes'));

// Drugs routes (GET, POST, PATCH)
app.use('/api/drugs', require('./routes/drugRoutes'));

// Sales routes
app.use('/api/sales', require('./routes/saleRoutes'));

// Other routes
app.use('/api/prescriptions', require('./routes/prescriptionRoutes'));
app.use('/api/customers', require('./routes/customerRoutes'));
app.use('/api/suppliers', require('./routes/supplierRoutes'));

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Eunam Pharmacy API running" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err);
  res.status(500).json({ message: 'Server error' });
});

// Start server
const port = Number(process.env.PORT) || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));