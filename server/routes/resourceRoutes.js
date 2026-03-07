const express = require("express");
const router = express.Router();
const db = require("../config/db");

// import cache helpers
const { getCache, setCache } = require("../utils/cache");

// GET nearby resources
router.get("/resources", async (req, res) => {
  try {
    const { type, lat, lng } = req.query;

    // round coordinates slightly so nearby queries use same cache
    const roundedLat = lat ? Math.round(lat * 100) / 100 : null;
    const roundedLng = lng ? Math.round(lng * 100) / 100 : null;

    // generate cache key
    const cacheKey = `${type || "all"}_${roundedLat}_${roundedLng}`;

    // check cache first
    const cachedData = getCache(cacheKey);

    if (cachedData) {
      console.log("Serving data from cache");
      return res.json(cachedData);
    }

    console.log("Fetching data from database");

    let query = "SELECT * FROM resources";
    const conditions = [];
    const values = [];

    // filter by resource type if provided
    if (type) {
      conditions.push("type = ?");
      values.push(type);
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    // run query
    const [rows] = await db.execute(query, values);

    // store result in cache
    setCache(cacheKey, rows);

    res.json(rows);

  } catch (error) {
    console.error("Error fetching resources:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;