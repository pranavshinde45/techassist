const Booking = require("../model/bookingModel");
const TechShop = require("../model/techshopModel");
const { StatusCodes } = require("http-status-codes");
const { v4: uuidv4 } = require("uuid");

const createBooking = async (req, res) => {
  try {
    const { shopId, issue, serviceType, contact, sessionTime } = req.body;
    if (!shopId || !issue || !serviceType || !sessionTime) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "Missing required fields." });
    }

    const existingBooking = await Booking.findOne({
      shopId,
      sessionTime: new Date(sessionTime),
    });
    if (existingBooking) {
      return res.status(400).json({ msg: "This session time is already booked." });
    }
    const sessionId = uuidv4();
    const sessionLink = serviceType === "remote" ? `http://localhost:3000/session/${sessionId}` : null;

    const shop = await TechShop.findById(shopId);

    const newBooking = new Booking({
      customerId: req.user.id,
      shopId,
      issue,
      serviceType,
      sessionLink,
      sessionTime,
      contact,
      sessionId,
    });

    await newBooking.save();
    shop.booking.push(newBooking._id);
    await shop.save();

    res.status(StatusCodes.CREATED).json({ message: "Booking created successfully", booking: newBooking });
  } catch (err) {
    console.error(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });
  }
};

const getBooking = async (req, res) => {
  const { shopId } = req.params;
  try {
    const shop = await TechShop.findById(shopId).populate("booking");
    if (!shop) return res.status(StatusCodes.NOT_FOUND).json({ message: "Shop not found" });
    res.status(StatusCodes.OK).json({ message: shop });
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message });
  }
};

const deleteBooking = async (req, res) => {
  const { shopId, bookingId } = req.params;
  try {
    await Booking.findByIdAndDelete(bookingId);
    await TechShop.findByIdAndUpdate(shopId, { $pull: { booking: bookingId } });
    res.status(StatusCodes.OK).json({ message: "Booking deleted successfully" });
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message });
  }
};

const checkSlot = async (req, res) => {
  const { shopId } = req.params;
  const { sessionTime } = req.query;
  try {
    const existing = await Booking.findOne({ shopId, sessionTime: new Date(sessionTime) });
    return res.json({ available: !existing });
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message });
  }
};

const getUserBooking = async (req, res) => {
  let { shopId, userId } = req.params;
  try {
    const shop = await TechShop.findById(shopId);
    if (!shop) {
      return res.status(404).json({ error: "Shop not found" });
    }
    const booking=await Booking.find({shopId:shopId,customerId:userId})
    res.status(StatusCodes.OK).json({message:"user specific booking fetched",shopName:shop.name,booking})
  }catch(err){
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message:"something went wrong"})
  }
}

module.exports = { bookingController: { createBooking, getBooking, deleteBooking, checkSlot,getUserBooking } };
