const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true
  },
  carNumber: {
    type: String,
    required: true
  },
  startDate: Date,
  endDate: Date,
  totalAmount: Number
});

module.exports = mongoose.model("Booking", bookingSchema);
