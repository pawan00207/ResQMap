import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// custom icons for different resources
const hospitalIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/1484/1484913.png",
  iconSize: [35, 35],
});

const shelterIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/619/619153.png",
  iconSize: [35, 35],
});

const foodIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/1046/1046784.png",
  iconSize: [35, 35],
});

const defaultIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [30, 30],
});

const ResQMap = ({ activeFilter, userLocation }) => {
  const [markers, setMarkers] = useState([]);
  const [loading, setLoading] = useState(false);

  // choose icon depending on resource type
  const getIcon = (type) => {
    if (type === "hospital") return hospitalIcon;
    if (type === "shelter") return shelterIcon;
    if (type === "food") return foodIcon;
    return defaultIcon;
  };

  // fetch resources from backend
  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true);

        let url = "/api/resources";
        if (activeFilter) {
          url = `/api/resources?type=${activeFilter}`;
        }

        const res = await fetch(url);
        const data = await res.json();

        setMarkers(data);
      } catch (err) {
        console.error("Error fetching resources:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, [activeFilter]);

  const mapHeight =
    window.innerWidth < 768 ? "60vh" : "100vh"; // better mobile view

  return (
    <div style={{ position: "relative" }}>
      {loading && (
        <div
          style={{
            position: "absolute",
            top: "10px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "#fff",
            padding: "6px 12px",
            borderRadius: "6px",
            fontSize: "14px",
            zIndex: 1000,
            boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
          }}
        >
          Loading resources...
        </div>
      )}

      <MapContainer
        center={userLocation || [51.505, -0.09]}
        zoom={13}
        style={{ height: mapHeight, width: "100%" }}
      >
        <TileLayer
          attribution="© OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={[marker.lat, marker.lng]}
            icon={getIcon(marker.type)}
          >
            <Popup>
              <strong>{marker.name}</strong>
              <br />
              {marker.type}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default ResQMap;