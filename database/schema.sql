-- schema.sql

-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- Users table (optional login system ke liye)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(150) UNIQUE,
    password VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Emergency Services table
CREATE TABLE emergency_services (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    type VARCHAR(50),  -- hospital, police, fire
    address TEXT,
    phone VARCHAR(20),
    location GEOGRAPHY(Point, 4326),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Accessibility Points table
CREATE TABLE accessibility_points (
    id SERIAL PRIMARY KEY,
    description TEXT,
    type VARCHAR(100), -- ramp, stairs, barrier
    location GEOGRAPHY(Point, 4326),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Local Resources table
CREATE TABLE resources (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(100), -- pharmacy, shelter, vendor
    address TEXT,
    location GEOGRAPHY(Point, 4326),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Disaster Incidents table
CREATE TABLE incidents (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200),
    description TEXT,
    severity VARCHAR(50),
    location GEOGRAPHY(Point, 4326),
    reported_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster geospatial queries
CREATE INDEX emergency_location_idx 
ON emergency_services 
USING GIST (location);

CREATE INDEX resources_location_idx 
ON resources 
USING GIST (location);

CREATE INDEX incidents_location_idx 
ON incidents 
USING GIST (location);
