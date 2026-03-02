const router = require('express').Router();
const locationController = require('../controllers/locationController');

// Routes for locations
router.get('/', (req, res) => {
    res.json({ message: 'Locations endpoint' });
});

router.get('/nearby', (req, res) => {
    res.json({ message: 'Nearby locations endpoint' });
});

module.exports = router;
