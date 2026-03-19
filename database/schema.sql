-- Enable PostGIS extension (required for geospatial queries)
CREATE EXTENSION IF NOT EXISTS postgis;

-- Users table (optional authentication system)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(150) UNIQUE,
    password VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Emergency Services table (hospitals, police stations, fire stations)
CREATE TABLE emergency_services (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    type VARCHAR(50),  -- hospital, police, fire
    address TEXT,
    phone VARCHAR(20),
    location GEOGRAPHY(Point, 4326),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



-- Accessibility Points (ramps, stairs, barriers)
CREATE TABLE accessibility_points (
    id SERIAL PRIMARY KEY,
    description TEXT,
    type VARCHAR(100), -- ramp, stairs, barrier
    location GEOGRAPHY(Point, 4326),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Local Resources table (pharmacies, shelters, vendors)
CREATE TABLE resources (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(100), -- pharmacy, shelter, vendor
    address TEXT,
    location GEOGRAPHY(Point, 4326),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Disaster Incidents table (floods, fires, accidents)
CREATE TABLE incidents (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200),
    description TEXT,
    severity VARCHAR(50),
    location GEOGRAPHY(Point, 4326),
    reported_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--User activity tracking (for analytics)
CREATE TABLE user_activity (
    id SERIAL PRIMARY KEY,
    action VARCHAR(100),
    resource_type VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--Map Usage tracking (stores searched coordinates)
CREATE TABLE map_usage (
    id SERIAL PRIMARY KEY,
    latitude FLOAT,
    longitude FLOAT,
    searched_resource VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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

-- Contribution Voting System
CREATE TABLE votes (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    resource_id INT NOT NULL,
    vote_type INT CHECK (vote_type IN (1, -1)),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, resource_id)
);
