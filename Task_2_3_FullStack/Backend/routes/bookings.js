const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Event = require('../models/Event');
const Workshop = require('../models/Workshop');
const { auth, admin } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

// @route   POST /api/bookings
// @desc    Create a new booking
// @access  Private
router.post('/', auth, validate(['itemId', 'itemType']), async (req, res) => {
    const { itemId, itemType } = req.body;

    try {
        // Verify item exists
        let item;
        if (itemType === 'Event') {
            item = await Event.findById(itemId);
        } else if (itemType === 'Workshop') {
            item = await Workshop.findById(itemId);
        }

        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        // Check if user already booked this item (optional but recommended)
        const existingBooking = await Booking.findOne({
            user: req.user.id,
            itemId: itemId
        });

        if (existingBooking) {
            return res.status(400).json({ message: 'You have already booked this item' });
        }

        const newBooking = new Booking({
            user: req.user.id,
            itemId,
            itemType
        });

        const booking = await newBooking.save();

        // If it's an event, update enrollment count
        if (itemType === 'Event') {
            item.enrolled += 1;
            await item.save();
        }

        res.status(201).json(booking);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   GET /api/bookings/my-bookings
// @desc    Get current user's bookings
// @access  Private
router.get('/my-bookings', auth, async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(bookings);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   GET /api/bookings
// @desc    Get all bookings (Admin only)
// @access  Private/Admin
router.get('/', auth, admin, async (req, res) => {
    try {
        const bookings = await Booking.find().populate('user', 'name email').sort({ createdAt: -1 });
        res.json(bookings);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
