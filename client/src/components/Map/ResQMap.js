import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in React-Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Component to handle map center updates
function MapCenterUpdater({ center }) {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.setView(center, map.getZoom());
        }
    }, [center, map]);
    return null;
}

const ResQMap = ({ activeFilter, userLocation }) => {
    const [markers, setMarkers] = useState([
        { id: 1, name: 'Emergency Hospital', lat: 51.505, lng: -0.09, type: 'hospital' },
        { id: 2, name: 'Fire Station', lat: 51.51, lng: -0.1, type: 'fire' },
        { id: 3, name: 'Police Station', lat: 51.515, lng: -0.09, type: 'police' }
    ]);

    // Logic to update markers based on filter or map bounds
    useEffect(() => {
        if (activeFilter) {
            // Filter markers based on active filter
            const filteredMarkers = markers.filter(m => 
                m.type === activeFilter || activeFilter === 'all'
            );
            console.log('Filtered markers:', filteredMarkers);
        }
    }, [activeFilter, markers]);

    const defaultCenter = userLocation || [51.505, -0.09];
    const defaultZoom = 13;

    return (
        <MapContainer
            center={defaultCenter}
            zoom={defaultZoom}
            style={{ height: '100vh', width: '100%' }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="httpstile.openstreetmap://{s}..org/{z}/{x}/{y}.png"
            />
            
            <MapCenterUpdater center={userLocation} />
            
            {/* Map markers/layers implementation */}
            {markers.map(marker => (
                <Marker 
                    key={marker.id} 
                    position={[marker.lat, marker.lng]}
                    eventHandlers={{
                        click: () => {
                            console.log('Marker clicked:', marker);
                        },
                    }}
                >
                    <Popup>
                        <div style={{ minWidth: '150px' }}>
                            <h4 style={{ margin: '0 0 5px 0' }}>{marker.name}</h4>
                            <p style={{ margin: 0, color: '#666' }}>Type: {marker.type}</p>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};

export default ResQMap;

