const axios = require("axios");

const OVERPASS_URL = "https://overpass-api.de/api/interpreter";

async function fetchNearbyResources(lat, lon, type) {

    let query = "";

    if (type === "hospital") {
        query = `
        [out:json];
        node["amenity"="hospital"](around:3000,${lat},${lon});
        out;
        `;
    }

    if (type === "police") {
        query = `
        [out:json];
        node["amenity"="police"](around:3000,${lat},${lon});
        out;
        `;
    }

    if (type === "fire") {
        query = `
        [out:json];
        node["amenity"="fire_station"](around:3000,${lat},${lon});
        out;
        `;
    }

    if (type === "accessible") {
        query = `
        [out:json];
        (
            node["wheelchair"="yes"](around:3000,${lat},${lon});
            node["ramp"="yes"](around:3000,${lat},${lon});
        );
        out;
        `;
    }

    const response = await axios.post(OVERPASS_URL, query);

    return response.data.elements;
}

module.exports = {
    fetchNearbyResources
};