

// app.js

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Basic test route
app.get("/", (req, res) => {
  res.send("ResQMap backend is running...");
});

// Example route for emergency services
app.get("/api/emergency", (req, res) => {
  res.json({
    message: "Emergency services endpoint working",
  });
});

// Example route for resources
app.get("/api/resources", (req, res) => {
  res.json({
    message: "Resources endpoint working",
  });
});

// Example route for disaster reporting
app.post("/api/report", (req, res) => {
  const reportData = req.body;

  if (!reportData) {
    return res.status(400).json({ message: "No data received" });
  }

  res.status(201).json({
    message: "Incident reported successfully",
    data: reportData,
  });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
