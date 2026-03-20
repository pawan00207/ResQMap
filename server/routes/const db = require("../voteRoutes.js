const express = require("express");
const router = express.Router();
const voteController = require("../controllers/voteController");

router.post("/vote", voteController.voteResource);

module.exports = router;
