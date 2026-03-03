// @desc    Get nearby services using spatial query
// @route   GET /api/v1/locations/nearby
exports.getNearbyServices = async (req, res, next) => {
    try {
        // TODO: Implement ST_DWithin logic using PostGIS
        // 1. Extract lat, lng, and radius from req.query
        // 2. Execute SQL query against 'locations' table
        res.status(200).json({ success: true, data: [] });
    } catch (err) {
        next(err);
    }
};