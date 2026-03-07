const express = require("express");
const router = express.Router();
const axios = require("axios");

// GET nearby emergency resources using Overpass API
router.get("/nearby-resources", async (req, res) => {
  try {
    const { lat, lng } = req.query;

    // basic validation
    if (!lat || !lng) {
      return res.status(400).json({
        message: "Latitude and longitude are required",
      });
    }

    // Overpass query to find nearby emergency services
    const overpassQuery = `
      [out:json];
      (
        node["amenity"="hospital"](around:3000,${lat},${lng});
        node["amenity"="police"](around:3000,${lat},${lng});
        node["amenity"="fire_station"](around:3000,${lat},${lng});
      );
      out;
    `;

    const url = "https://overpass-api.de/api/interpreter";

    const response = await axios.post(url, overpassQuery, {
      headers: {
        "Content-Type": "text/plain",
      },
    });

    const elements = response.data.elements;

    // convert response to simpler structure
    const resources = elements.map((item) => ({
      id: item.id,
      name: item.tags?.name || "Unknown",
      type: item.tags?.amenity,
      lat: item.lat,
      lng: item.lon,
    }));

    res.json({
      count: resources.length,
      resources,
    });

  } catch (error) {
    console.error("Error fetching nearby resources:", error.message);

    res.status(500).json({
      message: "Failed to fetch nearby resources",
    });
  }
});

module.exports = router;