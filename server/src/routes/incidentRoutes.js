const router = require('express').Router();

// Routes for incidents
router.get('/', (req, res) => {
    res.json({ message: 'Incidents endpoint' });
});

module.exports = router;
