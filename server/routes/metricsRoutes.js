const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Dashboard stats
router.get("/metrics", async (req, res) => {
  try {
    const range = req.query.range;
    let dateFilter = "";

    // apply time filter if provided
    if (range === "24h") {
      dateFilter = "WHERE created_at >= NOW() - INTERVAL 1 DAY";
    } else if (range === "7d") {
      dateFilter = "WHERE created_at >= NOW() - INTERVAL 7 DAY";
    } else if (range === "30d") {
      dateFilter = "WHERE created_at >= NOW() - INTERVAL 30 DAY";
    }

    // total incidents
    const [incidentResult] = await db.execute(
      `SELECT COUNT(*) AS total FROM incidents ${dateFilter}`
    );

    // total resources available
    const [resourceResult] = await db.execute(
      "SELECT COUNT(*) AS total FROM resources"
    );

    // currently active incidents
    const [activeResult] = await db.execute(
      "SELECT COUNT(*) AS total FROM incidents WHERE status='active'"
    );

    res.json({
      incidents: incidentResult[0].total,
      resources: resourceResult[0].total,
      activeIncidents: activeResult[0].total
    });

  } catch (error) {
    console.log("Metrics fetch error:", error);
    res.status(500).json({ message: "Server error while fetching metrics" });
  }
});

module.exports = router;