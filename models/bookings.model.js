const mongoose = require('mongoose');

// Define a Mongoose schema for the message fields
const BookingSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    eventDate: {
        type: Date,
        required: true
    },
    eventCountry: {
        type: String,
        required: true
    },
    eventCity: {
        type: String,
        required: false
    },
    referralMedium: {
        type: String,
        required: false,
        enum: ["Facebook", "Twitter", "Instagram", "Youtube"]
    },
    preferredPackage:{
        type: String,
        required: false,
        enum: ["mercedes", "porche", "bently", "traditional"]
    },
    moreInfo: {
        type: String,
        required: false
    },
    isConfirmed: {
        type: Boolean,
        required: false,
        default: false
    },
    createdAt: {
        type: Date,
        required: true
    }
});

// Create a Mongoose model using the schema
const Booking = mongoose.model('Booking', BookingSchema);

module.exports = Booking;
