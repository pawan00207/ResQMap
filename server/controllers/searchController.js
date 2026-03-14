const searchService = require("../services/searchService");

// Search resources
const searchResources = async (req, res) => {
  try {
    const query = req.query.query;
    const type = req.query.type;
    const radius = req.query.radius;

    const results = await searchService.search(query, type, radius);

    return res.status(200).json({
      success: true,
      count: results ? results.length : 0,
      data: results
    });

  } catch (err) {
    console.error("Error while searching resources:", err);
    return res.status(500).json({
      success: false,
      message: "Unable to perform search"
    });
  }
};


// Autocomplete suggestions for search
const autocomplete = async (req, res) => {
  try {
    const q = req.query.q;

    if (!q) {
      return res.json({
        success: true,
        suggestions: []
      });
    }

    const suggestions = await searchService.getSuggestions(q);

    return res.json({
      success: true,
      suggestions: suggestions || []
    });

  } catch (err) {
    console.error("Autocomplete error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch suggestions"
    });
  }
};

module.exports = {
  searchResources,
  autocomplete
};