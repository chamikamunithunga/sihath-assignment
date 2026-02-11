const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    itemId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    itemType: {
        type: String,
        required: true,
        enum: ['Event', 'Workshop', 'Product']
    },
    bookingDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        default: 'confirmed',
        enum: ['confirmed', 'cancelled']
    }
}, { timestamps: true });

module.exports = mongoose.model('Booking', BookingSchema);
