const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Booking = require('../models/Booking');
const User = require('../models/User');

dotenv.config();

const viewBookings = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const bookings = await Booking.find().populate('user', 'email');

        console.log('Total Bookings:', bookings.length);
        bookings.forEach(b => {
            console.log(`Booking ID: ${b._id}`);
            console.log(`  User: ${b.user ? b.user.email : 'No User'}`);
            console.log(`  Item Type: ${b.itemType}`);
            console.log(`  Status: ${b.status}`);
            console.log(`  Date: ${b.createdAt}`);
        });

        console.log('---');
        const reviews = await require('../models/Review').find().populate('user', 'email');
        console.log('Total Reviews:', reviews.length);
        reviews.forEach(r => {
            console.log(`Review ID: ${r._id}`);
            console.log(`  User: ${r.user ? r.user.email : 'No User'}`);
            console.log(`  Rating: ${r.rating}`);
        });

        mongoose.disconnect();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

viewBookings();
