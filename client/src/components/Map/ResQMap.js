import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./ResQMap.css";

/* icons for different resource types */
const hospitalIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/1484/1484913.png",
  iconSize: [35, 35]
});

const shelterIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/619/619153.png",
  iconSize: [35, 35]
});

const foodIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/1046/1046784.png",
  iconSize: [35, 35]
});

const defaultIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [30, 30]
});

const ResQMap = ({ activeFilter, userLocation }) => {

  const [markers, setMarkers] = useState([]);
  const [loading, setLoading] = useState(false);

  // search related states
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  // analytics metrics
  const [metrics, setMetrics] = useState({
    totalIncidents: 0,
    totalResources: 0,
    totalSearches: 0
  });

  // return correct icon based on resource type
  const getIcon = (type) => {
    switch (type) {
      case "hospital":
        return hospitalIcon;
      case "shelter":
        return shelterIcon;
      case "food":
        return foodIcon;
      default:
        return defaultIcon;
    }
  };

  // handle search typing
  const handleSearch = async (value) => {
    setQuery(value);

    if (!value) {
      setSuggestions([]);
      return;
    }

    try {
      const res = await fetch(`/api/autocomplete?q=${value}`);
      const data = await res.json();

      if (data?.suggestions) {
        setSuggestions(data.suggestions);
      }

    } catch (error) {
      console.error("Autocomplete request failed:", error);
    }
  };


  // load resources when filter or query changes
  useEffect(() => {

    const loadResources = async () => {

      setLoading(true);

      try {

        let url = "/api/resources";

        if (activeFilter) {
          url = `/api/resources?type=${activeFilter}`;
        }

        if (query) {
          url = `/api/search?query=${query}`;
        }

        const res = await fetch(url);
        const data = await res.json();

        setMarkers(data || []);

      } catch (error) {
        console.error("Failed to fetch resources:", error);
      }

      setLoading(false);
    };

    loadResources();

  }, [activeFilter, query]);


  // load analytics metrics once
  useEffect(() => {

    const fetchMetrics = async () => {
      try {

        const res = await fetch("/api/analytics/metrics");
        const data = await res.json();

        if (data) {
          setMetrics(data);
        }

      } catch (error) {
        console.log("Analytics fetch error:", error);
      }
    };

    fetchMetrics();

  }, []);


  const mapHeight = window.innerWidth < 768 ? "60vh" : "100vh";

  return (
    <div style={{ position: "relative" }}>

      {/* search input */}
      <div className="search-box">

        <input
          type="text"
          placeholder="Search resources..."
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
        />

        {suggestions.length > 0 && (
          <ul className="suggestion-list">

            {suggestions.map((item, index) => (
              <li
                key={index}
                onClick={() => {
                  setQuery(item);
                  setSuggestions([]);
                }}
              >
                {item}
              </li>
            ))}

          </ul>
        )}

      </div>


      {/* analytics panel */}
      <div
        style={{
          position: "absolute",
          top: "60px",
          right: "10px",
          background: "#fff",
          padding: "10px",
          borderRadius: "6px",
          zIndex: 1000,
          boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
          fontSize: "14px"
        }}
      >

        <strong>System Metrics</strong>

        <div>Incidents: {metrics.totalIncidents}</div>
        <div>Resources: {metrics.totalResources}</div>
        <div>Searches: {metrics.totalSearches}</div>

      </div>


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
            boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
            zIndex: 1000
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