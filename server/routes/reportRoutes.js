const express = require("express");
const router = express.Router();
const Report = require("../models/Report");

// Get all reports
router.get("/", async (req, res) => {
  const reports = await Report.find();
  res.json(reports);
});

// Approve
router.put("/:id/approve", async (req, res) => {
  await Report.findByIdAndUpdate(req.params.id, { status: "approved" });
  res.json({ message: "Approved" });
});

// Reject
router.put("/:id/reject", async (req, res) => {
  await Report.findByIdAndUpdate(req.params.id, { status: "rejected" });
  res.json({ message: "Rejected" });
});

module.exports = router;
