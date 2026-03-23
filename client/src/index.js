// index.js

const express = require("express");
require("dotenv").config();

const app = express();

app.get("/", (req, res) => {
  res.send("ResQMap Server is Live");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running at port " + PORT);
});
