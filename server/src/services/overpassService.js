const axios = require('axios');

exports.fetchNearby = async (type, lat, lng) => {

    const query = `
        [out:json];
        node["amenity"="${type}"](around:3000,${lat},${lng});
        out;
    `;

    const response = await axios.post(
        "https://overpass-api.de/api/interpreter",
        query,
        { headers: { "Content-Type": "text/plain" } }
    );

    const elements = response.data.elements;

    // Transform to frontend-friendly format
    return elements.map(el => ({
        id: el.id,
        lat: el.lat,
        lng: el.lon,
        name: el.tags?.name || type
    }));
};