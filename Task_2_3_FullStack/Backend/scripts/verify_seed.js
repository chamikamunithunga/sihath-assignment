const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Booking = require('../models/Booking');
const Review = require('../models/Review');
const Subscription = require('../models/Subscription');

dotenv.config();

const verifyData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');

        const userCount = await User.countDocuments();
        const bookingCount = await Booking.countDocuments();
        const reviewCount = await Review.countDocuments();
        const subCount = await Subscription.countDocuments();

        console.log(`Users: ${userCount}`);
        console.log(`Bookings: ${bookingCount}`);
        console.log(`Reviews: ${reviewCount}`);
        console.log(`Subscriptions: ${subCount}`);

        mongoose.disconnect();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

verifyData();
