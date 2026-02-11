const mongoose = require('mongoose');

const WorkshopSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        default: 'workshops'
    },
    type: {
        type: String,
        default: 'workshop'
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    capacity: {
        type: Number,
        required: true
    },
    enrolled: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

module.exports = mongoose.model('Workshop', WorkshopSchema);
