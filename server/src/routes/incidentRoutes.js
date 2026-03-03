const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');

// Get all incidents
router.get('/', (req, res) => {
    // TODO: Implement database query for incidents
    res.json({ 
        message: 'Incidents endpoint',
        incidents: [],
        status: 'working'
    });
});

// Get incident by ID
router.get('/:id', (req, res) => {
    res.json({ 
        message: 'Get incident by ID',
        id: req.params.id 
    });
});

// Create new incident
router.post('/', (req, res) => {
    res.json({ 
        message: 'Create incident',
        data: req.body 
    });
});

// Update incident
router.put('/:id', (req, res) => {
    res.json({ 
        message: 'Update incident',
        id: req.params.id,
        data: req.body 
    });
});

// Delete incident
router.delete('/:id', (req, res) => {
    res.json({ 
        message: 'Delete incident',
        id: req.params.id 
    });
});

module.exports = router;

