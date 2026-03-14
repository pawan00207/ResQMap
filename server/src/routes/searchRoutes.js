const express = require("express");
const router = express.Router();
const searchController = require("../controllers/searchController");

router.get("/search", searchController.searchResources);
router.get("/autocomplete", searchController.autocomplete);

module.exports = router;