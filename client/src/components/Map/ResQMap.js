import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./ResQMap.css";

// Icons
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

function ResQMap({ activeFilter, userLocation }) {
  // States
  const [markers, setMarkers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchText, setSearchText] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const [metrics, setMetrics] = useState({
    totalIncidents: 0,
    totalResources: 0,
    totalSearches: 0,
  });

  // Get icon based on type
  function getIcon(type) {
    if (type === "hospital") return hospitalIcon;
    if (type === "shelter") return shelterIcon;
    if (type === "food") return foodIcon;
    return defaultIcon;
  }

  // Handle search
  async function handleSearch(value) {
    setSearchText(value);

    if (!value) {
      setSuggestions([]);
      return;
    }

    try {
      const res = await fetch(`/api/autocomplete?q=${value}`);
      const data = await res.json();

      if (data && data.suggestions) {
        setSuggestions(data.suggestions);
      }
    } catch (error) {
      console.log("Search error:", error);
    }
  }

  // Load markers
  useEffect(() => {
    async function loadData() {
      setLoading(true);

      try {
        let url = "/api/resources";

        if (activeFilter) {
          url = `/api/resources?type=${activeFilter}`;
        }

        if (searchText) {
          url = `/api/search?query=${searchText}`;
        }

        const res = await fetch(url);
        const data = await res.json();

        setMarkers(data || []);
      } catch (error) {
        console.log("Fetch error:", error);
      }

      setLoading(false);
    }

    loadData();
  }, [activeFilter, searchText]);

  // Load metrics
  useEffect(() => {
    async function loadMetrics() {
      try {
        const res = await fetch("/api/analytics/metrics");
        const data = await res.json();

        if (data) {
          setMetrics(data);
        }
      } catch (error) {
        console.log("Metrics error:", error);
      }
    }

    loadMetrics();
  }, []);

  // Responsive height
  const mapHeight = window.innerWidth < 768 ? "60vh" : "100vh";

  return (
    <div style={{ position: "relative" }}>
      
      {/* Search Box */}
      <div className="search-box">
        <input
          type="text"
          placeholder="Search resources..."
          value={searchText}
          onChange={(e) => handleSearch(e.target.value)}
        />

        {suggestions.length > 0 && (
          <ul className="suggestion-list">
            {suggestions.map((item, index) => (
              <li
                key={index}
                onClick={() => {
                  setSearchText(item);
                  setSuggestions([]);
                }}
              >
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Metrics Panel */}
      <div className="metrics-box">
        <strong>System Metrics</strong>
        <div>Incidents: {metrics.totalIncidents}</div>
        <div>Resources: {metrics.totalResources}</div>
        <div>Searches: {metrics.totalSearches}</div>
      </div>

      {/* Loading */}
      {loading && <div className="loading">Loading resources...</div>}

      {/* Map */}
      <MapContainer
        center={userLocation || [51.505, -0.09]}
        zoom={13}
        style={{ height: mapHeight, width: "100%" }}
      >
        <TileLayer
          attribution="© OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {markers.map((item) => (
          <Marker
            key={item.id}
            position={[item.lat, item.lng]}
            icon={getIcon(item.type)}
          >
            <Popup>
              <strong>{item.name}</strong>
              <br />
              {item.type}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default ResQMap;