import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const ResQMap = ({ activeFilter, userLocation }) => {
    const [markers, setMarkers] = useState([]);

    // Logic to update markers based on filter or map bounds
    useEffect(() => {
        if (activeFilter) {
            // Fetch resources from backend /api/resources?type=activeFilter
            // TODO: Implement data fetching logic based on activeFilter
        }
    }, [activeFilter]);

    return (
        <MapContainer
            center={userLocation || [51.505, -0.09]}
            zoom={13}
            style={{ height: '100vh', width: '100%' }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {/* Map markers/layers implementation */}
            {markers.map(marker => (
                <Marker key={marker.id} position={[marker.lat, marker.lng]}>
                    <Popup>{marker.name || 'Emergency Resource'}</Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};

export default ResQMap;