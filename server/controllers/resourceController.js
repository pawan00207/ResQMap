// resourcesController.js

const pool = require("../config/db");

// Get all resources
const getAllResources = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM resources ORDER BY id DESC");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching resources:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Get resource by ID
const getResourceById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "SELECT * FROM resources WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Resource not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching resource:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Add new resource
const createResource = async (req, res) => {
  const { name, category, address, latitude, longitude } = req.body;

  if (!name || !category || !latitude || !longitude) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO resources (name, category, address, location)
       VALUES ($1, $2, $3, ST_SetSRID(ST_MakePoint($4, $5), 4326))
       RETURNING *`,
      [name, category, address, longitude, latitude]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating resource:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete resource
const deleteResource = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM resources WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Resource not found" });
    }

    res.json({ message: "Resource deleted successfully" });
  } catch (error) {
    console.error("Error deleting resource:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getAllResources,
  getResourceById,
  createResource,
  deleteResource,
};
