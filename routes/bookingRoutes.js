const express = require("express");
const router = express.Router();
const auth = require('../middleware/authMiddleware');

const bookingController = require("../controllers/bookingController");

// public list and overdue view
router.get("/", bookingController.getBookings);
router.get("/overdue-open", bookingController.getOverdueOpenBookings);

// authenticated operations
router.get("/new", auth, bookingController.showCreateForm);
router.post("/create", auth, bookingController.createBooking);
router.get("/:id/edit", auth, bookingController.showEditForm);
router.post("/:id/update", auth, bookingController.updateBooking);
router.post("/:id/delete", auth, bookingController.deleteBooking);

module.exports = router;