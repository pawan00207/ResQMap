const authMiddleware = require("../authMiddleware");
const express = require("express");
const router = express.Router();

router.get("/analytics/metrics", authMiddleware, async (req, res) => {
// return dashboard statistics
// router.get("/analytics/metrics", async (req, res) => {
  try {
    const [incidents] = await db.query(
      "SELECT COUNT(*) AS total FROM incidents"
    );

    const [resources] = await db.query(
      "SELECT COUNT(*) AS total FROM resources"
    );

    const [activity] = await db.query(
      "SELECT COUNT(*) AS total FROM user_activity"
    );

    res.json({
      incidents: incidents.rows[0].total,
      resources: resources.rows[0].total,
      activity: activity.rows[0].total
    });

  } catch (err) {
    console.error("Analytics error:", err);
    res.status(500).json({ message: "Failed to fetch analytics metrics" });
  }
});

router.get("/analytics/export", authMiddleware, async (req, res) => {
// router.get("/analytics/export", async (req, res) => {
  try {

    const result = await db.query(
      "SELECT * FROM incidents ORDER BY reported_at DESC"
    );

    res.json({
      exportedAt: new Date(),
      totalRecords: result.rows.length,
      data: result.rows
    });

  } catch (err) {
    console.error("Export error:", err);
    res.status(500).json({ message: "Export failed" });
  }
});

module.exports = router;
