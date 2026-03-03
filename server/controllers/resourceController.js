const axios = require('axios');

exports.getEmergencyServices = async (req, res) => {
    const { south, west, north, east, type } = req.query;
    
    // Overpass QL query for OSM amenities
    const query = `
        [out:json][timeout:25];
        (
          node["amenity"="${type}"](${south},${west},${north},${east});
          way["amenity"="${type}"](${south},${west},${north},${east});
        );
        out body;
        >;
        out skel qt;
    `;

    try {
        const response = await axios.post('https://overpass-api.de/api/interpreter', query);
        res.status(200).json(response.data.elements);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch OSM data' });
    }
};