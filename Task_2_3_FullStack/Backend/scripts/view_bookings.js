const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Booking = require('../models/Booking');
const User = require('../models/User'); // Import User for population

dotenv.config();

const viewBookings = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const bookings = await Booking.find().populate('user', 'name email');
        const users = await User.find({}, 'name email role');

        console.log('--- USERS ---');
        console.log(JSON.stringify(users, null, 2));

        console.log('\n--- BOOKINGS ---');
        console.log(JSON.stringify(bookings, null, 2));

        mongoose.disconnect();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

viewBookings();
