CREATE TABLE user_notifications (
  id UUID PRIMARY KEY,
  user_id UUID,
  type VARCHAR(50),
  title VARCHAR(255),
  body TEXT,
  data JSONB,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES auth.users(id)
);

CREATE TABLE notification_preferences (
  id UUID PRIMARY KEY,
  user_id UUID,
  critical_alerts BOOLEAN DEFAULT TRUE,
  service_updates BOOLEAN DEFAULT TRUE,
  resource_updates BOOLEAN DEFAULT TRUE,
  disaster_alerts BOOLEAN DEFAULT TRUE,
  community_updates BOOLEAN DEFAULT FALSE,
  do_not_disturb_start TIME,
  do_not_disturb_end TIME,
  FOREIGN KEY (user_id) REFERENCES auth.users(id)
);

CREATE TABLE push_subscriptions (
  id UUID PRIMARY KEY,
  user_id UUID,
  subscription_json TEXT,
  device_type VARCHAR(20),
  created_at TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
