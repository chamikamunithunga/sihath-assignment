const express = require('express');
const router = express.Router();
const Workshop = require('../models/Workshop');
const { auth, admin } = require('../middleware/auth');

// GET all workshops
router.get('/', async (req, res) => {
    try {
        const workshops = await Workshop.find();
        res.json(workshops);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET one workshop
router.get('/:id', async (req, res) => {
    try {
        const workshop = await Workshop.findById(req.params.id);
        if (workshop == null) {
            return res.status(404).json({ message: 'Workshop not found' });
        }
        res.json(workshop);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST new workshop (Admin only)
router.post('/', auth, admin, async (req, res) => {
    const workshop = new Workshop(req.body);
    try {
        const newWorkshop = await workshop.save();
        res.status(201).json(newWorkshop);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT update workshop (Admin only)
router.put('/:id', auth, admin, async (req, res) => {
    try {
        const updatedWorkshop = await Workshop.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedWorkshop);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE workshop (Admin only)
router.delete('/:id', auth, admin, async (req, res) => {
    try {
        await Workshop.findByIdAndDelete(req.params.id);
        res.json({ message: 'Workshop deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
