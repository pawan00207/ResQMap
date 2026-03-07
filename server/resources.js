const express = require("express");
const axios = require("axios");

const router = express.Router();

router.get("/nearby", async (req, res) => {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ error: "Latitude and Longitude required" });
  }

  try {
    const query = `
      [out:json];
      (
        node["amenity"="hospital"](around:5000,${lat},${lon});
        node["amenity"="police"](around:5000,${lat},${lon});
        node["amenity"="fire_station"](around:5000,${lat},${lon});
      );
      out;
    `;

    const response = await axios.post(
      "https://overpass-api.de/api/interpreter",
      query,
      { headers: { "Content-Type": "text/plain" } }
    );

    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch resources" });
  }
});

module.exports = router;
