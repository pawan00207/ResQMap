-- ResQMap database schema

-- Users table
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Incidents reported by users
CREATE TABLE incidents (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200),
  description TEXT,
  severity VARCHAR(50),
  latitude DECIMAL(10,6) NOT NULL,
  longitude DECIMAL(10,6) NOT NULL,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Emergency services (hospital, police, fire station etc.)
CREATE TABLE emergency_services (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  type VARCHAR(50),
  address TEXT,
  phone VARCHAR(20),
  latitude DECIMAL(10,6),
  longitude DECIMAL(10,6),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Other local resources like pharmacy, shelter, food vendors
CREATE TABLE resources (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  category VARCHAR(100),
  address TEXT,
  latitude DECIMAL(10,6),
  longitude DECIMAL(10,6),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Accessibility related points (ramps, stairs, barriers)
CREATE TABLE accessibility_points (
  id INT AUTO_INCREMENT PRIMARY KEY,
  description TEXT,
  type VARCHAR(100),
  latitude DECIMAL(10,6),
  longitude DECIMAL(10,6),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for faster location based search
CREATE INDEX idx_incidents_location
ON incidents(latitude, longitude);

CREATE INDEX idx_resources_location
ON resources(latitude, longitude);

CREATE INDEX idx_emergency_services_location
ON emergency_services(latitude, longitude);