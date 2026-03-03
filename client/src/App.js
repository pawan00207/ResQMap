import React, { useState, useEffect } from 'react';
import ResQMap from './components/Map/ResQMap';
import './App.css';

function App() {
  const [userLocation, setUserLocation] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get user location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
          setLoading(false);
        },
        (err) => {
          console.log('Geolocation error:', err);
          setError('Could not get location. Using default location.');
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
      setLoading(false);
    }
  }, []);

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  if (loading) {
    return (
      <div className="app-container loading">
        <div className="loading-spinner">
          <h2>Loading ResQMap...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>🚨 ResQMap - Emergency Resource Mapping</h1>
        <nav className="filter-nav">
          <button 
            className={activeFilter === 'all' ? 'active' : ''} 
            onClick={() => handleFilterChange('all')}
          >
            All Resources
          </button>
          <button 
            className={activeFilter === 'hospital' ? 'active' : ''} 
            onClick={() => handleFilterChange('hospital')}
          >
            🏥 Hospitals
          </button>
          <button 
            className={activeFilter === 'fire' ? 'active' : ''} 
            onClick={() => handleFilterChange('fire')}
          >
            🔥 Fire Stations
          </button>
          <button 
            className={activeFilter === 'police' ? 'active' : ''} 
            onClick={() => handleFilterChange('police')}
          >
            👮 Police
          </button>
        </nav>
        {error && <div className="error-message">{error}</div>}
      </header>
      
      <main className="map-container">
        <ResQMap 
          activeFilter={activeFilter} 
          userLocation={userLocation} 
        />
      </main>
      
      <footer className="app-footer">
        <p>ResQMap - Helping emergency responders find resources quickly</p>
      </footer>
    </div>
  );
}

export default App;

