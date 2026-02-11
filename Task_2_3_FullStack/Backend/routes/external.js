const express = require('express');
const router = express.Router();
const axios = require('axios');

// @route   GET /api/external/weather
// @desc    Get weather data for a city
// @access  Public
router.get('/weather', async (req, res) => {
    const { city } = req.query;
    const apiKey = process.env.WEATHER_API_KEY;

    if (!city) {
        return res.status(400).json({ message: 'City is required' });
    }

    if (!apiKey) {
        // Return mock data if no API key is provided for demonstration
        return res.json({
            city,
            weather: 'Sunny',
            temp: 25,
            message: 'Running in demo mode: Please add WEATHER_API_KEY to .env for real data'
        });
    }

    try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
        res.json(response.data);
    } catch (err) {
        console.error('Weather API Error:', err.message);

        // Handle specific error cases
        if (err.response?.status === 401) {
            return res.status(503).json({
                message: 'Weather API key is not activated yet',
                error: 'New API keys can take 10 minutes to 2 hours to activate. Please wait and try again later.',
                fallback: {
                    city,
                    weather: 'Sunny',
                    temp: 25,
                    demo: true
                }
            });
        }

        if (err.response?.status === 404) {
            return res.status(404).json({
                message: 'City not found',
                error: 'Please check the city name and try again'
            });
        }

        res.status(500).json({
            message: 'Error fetching weather data',
            error: err.message
        });
    }
});

// @route   GET /api/external/map-config
// @desc    Get public configuration for maps (e.g. Center coordinates)
// @access  Public
router.get('/map-config', (req, res) => {
    res.json({
        center: { lat: 6.9271, lng: 79.8612 }, // Default: Colombo, Sri Lanka
        zoom: 12,
        mapType: 'roadmap'
    });
});

module.exports = router;
