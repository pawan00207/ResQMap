-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  favorites JSONB DEFAULT '[]',
  language TEXT DEFAULT 'en',
  dark_mode BOOLEAN DEFAULT false,
  emergency_contacts JSONB DEFAULT '[]',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create reports table
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  report_type TEXT NOT NULL CHECK(report_type IN ('accident', 'flood', 'blockage', 'debris', 'other')),
  title TEXT NOT NULL,
  description TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'approved', 'resolved', 'rejected')),
  image_url TEXT,
  verified_by_count INT DEFAULT 0,
  rejections_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create alerts table
CREATE TABLE IF NOT EXISTS alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  alert_type TEXT CHECK(alert_type IN ('weather', 'disaster', 'health', 'traffic')),
  severity TEXT CHECK(severity IN ('low', 'medium', 'high', 'critical')),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  radius_km INT DEFAULT 10,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create admin_roles table
CREATE TABLE IF NOT EXISTS admin_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK(role IN ('admin', 'moderator')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create chat_history table
CREATE TABLE IF NOT EXISTS chat_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  messages JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_reports_user_id ON reports(user_id);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
CREATE INDEX IF NOT EXISTS idx_alerts_expires_at ON alerts(expires_at);
CREATE INDEX IF NOT EXISTS idx_admin_roles_user_id ON admin_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_history_user_id ON chat_history(user_id);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can view their own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for reports
CREATE POLICY "Anyone can view approved reports"
  ON reports FOR SELECT
  USING (status = 'approved' OR auth.uid() = user_id);

CREATE POLICY "Users can create reports"
  ON reports FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own reports"
  ON reports FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all reports"
  ON reports FOR ALL
  USING (EXISTS(SELECT 1 FROM admin_roles WHERE admin_roles.user_id = auth.uid()));

-- RLS Policies for alerts
CREATE POLICY "Anyone can view alerts"
  ON alerts FOR SELECT
  USING (true);

-- RLS Policies for admin_roles
CREATE POLICY "Only admins can view admin roles"
  ON admin_roles FOR SELECT
  USING (EXISTS(SELECT 1 FROM admin_roles WHERE admin_roles.user_id = auth.uid()));

-- RLS Policies for chat_history
CREATE POLICY "Users can view their own chat history"
  ON chat_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create chat history"
  ON chat_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own chat history"
  ON chat_history FOR UPDATE
  USING (auth.uid() = user_id);
