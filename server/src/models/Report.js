const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  title: String,
  description: String,
  status: {
    type: String,
    default: "pending"
  }
});

module.exports = mongoose.model("Report", reportSchema);
