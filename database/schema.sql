-- ResQMap Database Schema
-- Stores users, incidents, emergency services and local resources

-- Users table (for authentication if needed)
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Incidents reported by users on the map
CREATE TABLE incidents (
    id SERIAL PRIMARY KEY,
  title VARCHAR(200),
  description TEXT,
  severity VARCHAR(50),
  latitude DECIMAL(10,6) NOT NULL,
  longitude DECIMAL(10,6) NOT NULL,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Emergency services such as hospitals, police stations or fire stations
CREATE TABLE emergency_services (
    id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  type VARCHAR(50), -- hospital, police, fire
  address TEXT,
  phone VARCHAR(20),
  latitude DECIMAL(10,6),
  longitude DECIMAL(10,6),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Other local resources like pharmacies, shelters or food vendors
CREATE TABLE resources (
    id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  category VARCHAR(100),
  address TEXT,
  latitude DECIMAL(10,6),
  longitude DECIMAL(10,6),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Accessibility related points (ramps, stairs, barriers etc.)
CREATE TABLE accessibility_points (
    id SERIAL PRIMARY KEY,
  name VARCHAR(150),
  description TEXT,
  type VARCHAR(100),
  latitude DECIMAL(10,6),
  longitude DECIMAL(10,6),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes to improve performance for location based queries
CREATE INDEX idx_incidents_location
ON incidents (latitude, longitude);

CREATE INDEX idx_resources_location
ON resources (latitude, longitude);

CREATE INDEX idx_emergency_services_location
ON emergency_services (latitude, longitude);