const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');

// Get all locations
router.get('/', (req, res) => {
    // TODO: Implement database query for locations
    res.json({ 
        message: 'Locations endpoint',
        locations: [],
        status: 'working'
    });
});

// Get nearby locations
router.get('/nearby', (req, res) => {
    const { lat, lng, radius } = req.query;
    res.json({ 
        message: 'Nearby locations endpoint',
        lat: lat || '51.505',
        lng: lng || '-0.09',
        radius: radius || '5000',
        status: 'working'
    });
});

// Get location by ID
router.get('/:id', (req, res) => {
    res.json({ 
        message: 'Get location by ID',
        id: req.params.id 
    });
});

// Create new location
router.post('/', (req, res) => {
    res.json({ 
        message: 'Create location',
        data: req.body 
    });
});

// Update location
router.put('/:id', (req, res) => {
    res.json({ 
        message: 'Update location',
        id: req.params.id,
        data: req.body 
    });
});

// Delete location
router.delete('/:id', (req, res) => {
    res.json({ 
        message: 'Delete location',
        id: req.params.id 
    });
});

module.exports = router;

