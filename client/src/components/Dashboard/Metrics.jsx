import React, { useEffect, useState } from "react";

function Metrics() {

  const [metrics, setMetrics] = useState({
    incidents: 0,
    resources: 0,
    activeIncidents: 0
  });

  const [range, setRange] = useState("24h");

  // fetch metrics from backend
  async function loadMetrics() {
    try {
      const response = await fetch(`/api/metrics?range=${range}`);
      const result = await response.json();

      setMetrics(result);
    } catch (error) {
      console.log("Error while loading metrics:", error);
    }
  }

  useEffect(() => {

    // initial fetch
    loadMetrics();

    // refresh metrics every 5 seconds
    const timer = setInterval(() => {
      loadMetrics();
    }, 5000);

    return () => {
      clearInterval(timer);
    };

  }, [range]);

  return (
    <div className="metrics-container">

      <h2>System Metrics</h2>

      <div className="range-selector">
        <button onClick={() => setRange("24h")}>Last 24h</button>
        <button onClick={() => setRange("7d")}>Last 7 days</button>
        <button onClick={() => setRange("30d")}>Last 30 days</button>
      </div>

      <div className="metrics-grid">

        <div className="metric-card">
          <h3>Total Incidents</h3>
          <p>{metrics.incidents}</p>
        </div>

        <div className="metric-card">
          <h3>Resources Available</h3>
          <p>{metrics.resources}</p>
        </div>

        <div className="metric-card">
          <h3>Active Incidents</h3>
          <p>{metrics.activeIncidents}</p>
        </div>

      </div>

    </div>
  );
}

export default Metrics;