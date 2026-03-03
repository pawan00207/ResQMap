-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255),
  phone VARCHAR(20),
  profile_picture_url TEXT,
  accessibility_needs TEXT[],
  emergency_contacts JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Emergency Services table (Hospitals, Police, Fire Stations)
CREATE TABLE IF NOT EXISTS emergency_services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  service_type VARCHAR(50) NOT NULL,
  latitude FLOAT NOT NULL,
  longitude FLOAT NOT NULL,
  location GEOMETRY(Point, 4326),
  address VARCHAR(255),
  phone VARCHAR(20),
  email VARCHAR(255),
  website TEXT,
  opening_hours JSONB,
  is_24_hours BOOLEAN DEFAULT FALSE,
  capacity INTEGER,
  available_beds INTEGER,
  amenities TEXT[],
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_emergency_services_location ON emergency_services USING GIST (location);

-- Accessibility Routes table
CREATE TABLE IF NOT EXISTS accessibility_routes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  start_latitude FLOAT NOT NULL,
  start_longitude FLOAT NOT NULL,
  end_latitude FLOAT NOT NULL,
  end_longitude FLOAT NOT NULL,
  start_point GEOMETRY(Point, 4326),
  end_point GEOMETRY(Point, 4326),
  route_data JSONB,
  has_stairs BOOLEAN DEFAULT FALSE,
  has_curbs BOOLEAN DEFAULT FALSE,
  has_obstacles BOOLEAN DEFAULT FALSE,
  wheelchair_accessible BOOLEAN DEFAULT TRUE,
  surface_type VARCHAR(50),
  accessibility_score FLOAT,
  barrier_reports INTEGER DEFAULT 0,
  community_rating FLOAT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_accessibility_routes_start ON accessibility_routes USING GIST (start_point);
CREATE INDEX IF NOT EXISTS idx_accessibility_routes_end ON accessibility_routes USING GIST (end_point);

-- Local Resources table
CREATE TABLE IF NOT EXISTS local_resources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  latitude FLOAT NOT NULL,
  longitude FLOAT NOT NULL,
  location GEOMETRY(Point, 4326),
  address VARCHAR(255),
  phone VARCHAR(20),
  email VARCHAR(255),
  website TEXT,
  description TEXT,
  opening_hours JSONB,
  is_open_now BOOLEAN,
  rating FLOAT,
  review_count INTEGER DEFAULT 0,
  availability_status VARCHAR(50),
  inventory JSONB,
  verified BOOLEAN DEFAULT FALSE,
  verified_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_local_resources_location ON local_resources USING GIST (location);
CREATE INDEX IF NOT EXISTS idx_local_resources_category ON local_resources(category);

-- Safe Zones table
CREATE TABLE IF NOT EXISTS safe_zones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  zone_polygon GEOMETRY(Polygon, 4326),
  capacity INTEGER,
  current_occupancy INTEGER DEFAULT 0,
  has_medical BOOLEAN DEFAULT FALSE,
  has_food BOOLEAN DEFAULT FALSE,
  has_water BOOLEAN DEFAULT FALSE,
  has_shelter BOOLEAN DEFAULT FALSE,
  contact_phone VARCHAR(20),
  address VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_safe_zones_polygon ON safe_zones USING GIST (zone_polygon);

-- Disaster Events table
CREATE TABLE IF NOT EXISTS disaster_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  event_type VARCHAR(50) NOT NULL,
  severity VARCHAR(20),
  description TEXT,
  start_latitude FLOAT,
  start_longitude FLOAT,
  start_location GEOMETRY(Point, 4326),
  impact_zone GEOMETRY(Polygon, 4326),
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE,
  affected_resources INTEGER,
  affected_population_estimate INTEGER,
  alert_status VARCHAR(50),
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_disaster_events_impact_zone ON disaster_events USING GIST (impact_zone);
CREATE INDEX IF NOT EXISTS idx_disaster_events_is_active ON disaster_events(is_active);

-- User Locations table
CREATE TABLE IF NOT EXISTS user_locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  latitude FLOAT NOT NULL,
  longitude FLOAT NOT NULL,
  location GEOMETRY(Point, 4326),
  accuracy FLOAT,
  altitude FLOAT,
  heading FLOAT,
  speed FLOAT,
  is_sharing BOOLEAN DEFAULT FALSE,
  shared_with_contacts BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_user_locations_user_id ON user_locations(user_id);
CREATE INDEX IF NOT EXISTS idx_user_locations_location ON user_locations USING GIST (location);

-- Emergency Contacts table
CREATE TABLE IF NOT EXISTS emergency_contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  contact_name VARCHAR(255) NOT NULL,
  phone_number VARCHAR(20),
  email VARCHAR(255),
  relationship VARCHAR(100),
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_emergency_contacts_user_id ON emergency_contacts(user_id);

-- Incident Reports table
CREATE TABLE IF NOT EXISTS incident_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reporter_id UUID NOT NULL REFERENCES users(id),
  report_type VARCHAR(50) NOT NULL,
  latitude FLOAT NOT NULL,
  longitude FLOAT NOT NULL,
  location GEOMETRY(Point, 4326),
  description TEXT NOT NULL,
  attachments TEXT[],
  severity VARCHAR(20),
  status VARCHAR(50) DEFAULT 'open',
  verified BOOLEAN DEFAULT FALSE,
  votes INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_incident_reports_location ON incident_reports USING GIST (location);
CREATE INDEX IF NOT EXISTS idx_incident_reports_status ON incident_reports(status);

-- SOS Alerts table
CREATE TABLE IF NOT EXISTS sos_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  latitude FLOAT,
  longitude FLOAT,
  location GEOMETRY(Point, 4326),
  alert_message TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  contacted_emergency_services BOOLEAN DEFAULT FALSE,
  contacted_contacts BOOLEAN DEFAULT FALSE,
  responded_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  resolved_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_sos_alerts_user_id ON sos_alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_sos_alerts_is_active ON sos_alerts(is_active);
CREATE INDEX IF NOT EXISTS idx_sos_alerts_location ON sos_alerts USING GIST (location);
