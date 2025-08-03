const express = require("express");
const { bookingController } = require("../controller/bookingController");
const { authMiddleware, checkRole, isOwner } = require("../middleware");
const bookingRouter = express.Router();
const {validateBooking}=require("../middleware")

bookingRouter.post("/:shopId/booking", authMiddleware,validateBooking, bookingController.createBooking);
bookingRouter.get("/:shopId/booking",authMiddleware,checkRole, bookingController.getBooking);
bookingRouter.delete("/:shopId/booking/:bookingId",authMiddleware,isOwner, bookingController.deleteBooking);
bookingRouter.get("/:shopId/checkSlot", bookingController.checkSlot);
bookingRouter.get("/:shopId/booking/user/:userId",bookingController.getUserBooking)
module.exports = bookingRouter;
