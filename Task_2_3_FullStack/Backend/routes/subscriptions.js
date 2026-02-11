const express = require('express');
const router = express.Router();
const Subscription = require('../models/Subscription');
const { auth, admin } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

// @route   POST /api/subscriptions
// @desc    Subscribe to newsletter
// @access  Public
router.post('/', validate(['email']), async (req, res) => {
    const { email } = req.body;

    try {
        let subscription = await Subscription.findOne({ email });
        if (subscription) {
            return res.status(400).json({ message: 'Email already subscribed' });
        }

        subscription = new Subscription({ email });
        await subscription.save();

        res.status(201).json({ message: 'Subscribed successfully', subscription });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   GET /api/subscriptions
// @desc    Get all subscriptions (Admin only)
// @access  Private/Admin
router.get('/', auth, admin, async (req, res) => {
    try {
        const subscriptions = await Subscription.find().sort({ createdAt: -1 });
        res.json(subscriptions);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
