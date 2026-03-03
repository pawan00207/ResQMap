import { getSupabaseAdmin } from '@/lib/supabase'

export async function initializeDatabase() {
  const supabaseAdmin = getSupabaseAdmin()
  if (!supabaseAdmin) {
    console.warn('Supabase admin not configured')
    return { success: false, error: 'Supabase not configured' }
  }

  try {
    // Create emergency_services table if not exists
    await supabaseAdmin.rpc('execute_sql', {
      query: `
        CREATE TABLE IF NOT EXISTS emergency_services (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name TEXT NOT NULL,
          service_type TEXT CHECK(service_type IN ('hospital', 'police', 'fire')),
          address TEXT,
          phone TEXT,
          is_24_hours BOOLEAN DEFAULT false,
          latitude DECIMAL(10, 8),
          longitude DECIMAL(11, 8),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `
    }).catch(() => null)

    // Create local_resources table
    await supabaseAdmin.rpc('execute_sql', {
      query: `
        CREATE TABLE IF NOT EXISTS local_resources (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name TEXT NOT NULL,
          category TEXT NOT NULL,
          address TEXT,
          phone TEXT,
          description TEXT,
          is_open_now BOOLEAN,
          rating DECIMAL(3, 1),
          latitude DECIMAL(10, 8),
          longitude DECIMAL(11, 8),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `
    }).catch(() => null)

    // Create accessibility_routes table
    await supabaseAdmin.rpc('execute_sql', {
      query: `
        CREATE TABLE IF NOT EXISTS accessibility_routes (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name TEXT NOT NULL,
          description TEXT,
          accessibility_features TEXT[],
          accessibility_type TEXT,
          difficulty_level TEXT,
          start_latitude DECIMAL(10, 8),
          start_longitude DECIMAL(11, 8),
          end_latitude DECIMAL(10, 8),
          end_longitude DECIMAL(11, 8),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `
    }).catch(() => null)

    // Create disaster_events table
    await supabaseAdmin.rpc('execute_sql', {
      query: `
        CREATE TABLE IF NOT EXISTS disaster_events (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          title TEXT NOT NULL,
          description TEXT,
          disaster_type TEXT,
          latitude DECIMAL(10, 8),
          longitude DECIMAL(11, 8),
          severity TEXT CHECK(severity IN ('low', 'medium', 'high')),
          affected_area_radius DECIMAL(10, 2),
          status TEXT DEFAULT 'active',
          resources_needed TEXT[],
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `
    }).catch(() => null)

    // Create sos_alerts table
    await supabaseAdmin.rpc('execute_sql', {
      query: `
        CREATE TABLE IF NOT EXISTS sos_alerts (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id TEXT NOT NULL,
          emergency_type TEXT,
          latitude DECIMAL(10, 8),
          longitude DECIMAL(11, 8),
          description TEXT,
          emergency_contacts TEXT[],
          severity TEXT CHECK(severity IN ('low', 'medium', 'high')),
          is_anonymous BOOLEAN DEFAULT false,
          status TEXT DEFAULT 'active',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `
    }).catch(() => null)

    console.log('Database initialization completed')
    return { success: true }
  } catch (error) {
    console.error('Database initialization failed:', error)
    return { success: false, error }
  }
}
