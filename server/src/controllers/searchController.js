const searchService = require("../services/searchService");

exports.searchResources = async (req, res) => {
  try {

    const { query, type, radius } = req.query;

    const results = await searchService.search(query, type, radius);

    res.json(results);

  } catch (error) {
    res.status(500).json({ message: "Search failed" });
  }
};


exports.autocomplete = async (req, res) => {

  const { q } = req.query;

  const suggestions = await searchService.getSuggestions(q);

  res.json({ suggestions });
};