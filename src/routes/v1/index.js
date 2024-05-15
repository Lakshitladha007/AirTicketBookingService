const express= require("express");

const { BookingController } = require("../../controllers/booking-controller");
// const { createChannel }= require('../../utils/messgaeQueue');

// const channel = await createChannel();
const bookingController = new BookingController();
const router = express.Router();


router.post('/bookings', bookingController.create);
router.post('/publish', bookingController.sendMessageToQueue);

module.exports= router;