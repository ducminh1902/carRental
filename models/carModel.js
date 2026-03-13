const mongoose = require("mongoose");

const carSchema = new mongoose.Schema({
  carNumber: String,
  capacity: Number,
  pricePerDay: Number
});

module.exports = mongoose.model("Car", carSchema);
