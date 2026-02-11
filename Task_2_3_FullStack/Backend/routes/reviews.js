const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const { auth } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

// @route   POST /api/reviews
// @desc    Add a review
// @access  Private
router.post('/', auth, validate(['itemId', 'itemType', 'rating', 'comment']), async (req, res) => {
    const { itemId, itemType, rating, comment } = req.body;

    try {
        const newReview = new Review({
            user: req.user.id,
            itemId,
            itemType,
            rating,
            comment
        });

        const review = await newReview.save();
        res.status(201).json(review);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   GET /api/reviews/:itemId
// @desc    Get reviews for a specific item
// @access  Public
router.get('/:itemId', async (req, res) => {
    try {
        const reviews = await Review.find({ itemId: req.params.itemId })
            .populate('user', 'name')
            .sort({ createdAt: -1 });
        res.json(reviews);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
