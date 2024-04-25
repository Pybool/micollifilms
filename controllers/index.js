const Booking = require("../models/bookings.model");
const validateBookingForm = require("./helper").validateBookingForm;
const sendMail = require("../services/mailservice");
const ejs = require("ejs");
const juice = require("juice");
const logo = require("./logo");

function toTitleCase(str) {
  return str.replace(/\w\S*/g, function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}


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
      const email = bookingPayload?.email;
      const name = bookingPayload?.name;
      const phone = bookingPayload?.phone;
      const message = bookingPayload?.moreInfo;
      const country = bookingPayload?.eventCountry;
      const package = toTitleCase(bookingPayload?.preferredPackage) + " Package";
      const serverUrl = "https://micollifilms.com"
      const date = new Date(bookingPayload?.eventDate);

      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      const formattedDate = date.toLocaleDateString('en-US', options);
      const eventDate = formattedDate;
      const template = await ejs.renderFile(
        "views/pages/emailtemplates/booking.ejs",
        {
          email,
          name,
          message,
          country,
          package,
          eventDate,
          phone,
          serverUrl,
          logo
        }
      );

      const mailOptions = {
        from: `info@micollifilms.com`,
        to: "info@micollifilms.com",
        subject: "New Booking",
        text: `New Booking alert!`,
        html: juice(template),
      };
      sendMail(mailOptions)
        .then((response) => {
          console.log("Email sent successfully:", response);
        })
        .catch((error) => {
          console.error("Failed to send email:", error);
        });
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
