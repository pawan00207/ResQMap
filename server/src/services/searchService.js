const overpassService = require("./overpassService");

// Search resources using Overpass service
const search = async (query, type, radius) => {
  try {
    const filters = {};

    if (type) {
      filters.type = type;
    }

    if (radius) {
      filters.radius = radius;
    }

    const resources = await overpassService.fetchNearbyResources(query, filters);

    return resources || [];

  } catch (err) {
    console.error("Error in search service:", err);
    throw err;
  }
};


// Get autocomplete suggestions
const getSuggestions = async (q) => {
  try {

    if (!q) {
      return [];
    }

    const keywords = [
      "hospital",
      "police",
      "ambulance",
      "fire station",
      "clinic",
      "pharmacy"
    ];

    const searchText = q.toLowerCase();

    const suggestions = keywords.filter((word) =>
      word.toLowerCase().includes(searchText)
    );

    return suggestions;

  } catch (err) {
    console.error("Error in autocomplete service:", err);
    return [];
  }
};


module.exports = {
  search,
  getSuggestions
};