const express = require("express");

const verifyToken = require("../middlewares/verifyToken");

const bookingController = require("../controllers/bookingController")
const router = express.Router();
router.get("/", verifyToken, bookingController.getAllBookings)
router.delete("/:id", verifyToken, bookingController.deleteBooking)
router.put("/:id", verifyToken, bookingController.updateBookingStatus)
module.exports = router