const Booking = require("../models/bookings.model");
const validateBookingForm = require("./helper").validateBookingForm;

const bookEvent = async (req, res) => {
  try {
    let response;
    let bookingPayload = req.body;
    let errors = validateBookingForm(bookingPayload);
    if (errors.length > 0) {
      return res.send({
        status: false,
        message:
          "Please fill up all required fields ,ensure all email addresses are valid  ...",
      });
    }
    bookingPayload.createdAt = new Date();
    let booking = await Booking.create(bookingPayload);
    if (booking?._id) {
      response = {
        status: true,
        data: booking,
        message: "Booking was succesfull",
      };
    } else {
      response = {
        status: false,
        message: "Booking was unsuccessfull",
      };
    }
    res.send(response);
  } catch (error) {
    console.log(error);
    res.send({
      status: false,
      message: `Something went wrong while booking: ${error}`,
    });
  }
};

module.exports = {
  bookEvent,
};
