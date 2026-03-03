import { getSupabaseAdmin } from '@/lib/supabase'

export async function seedDatabase() {
  const supabaseAdmin = getSupabaseAdmin()
  if (!supabaseAdmin) {
    console.warn('Supabase admin not configured')
    return { success: false, error: 'Supabase not configured' }
  }

  try {
    // Seed emergency services (NYC as example)
    const emergencyServices = [
      {
        name: 'NYC Medical Center',
        service_type: 'hospital',
        address: '123 Health Ave, Manhattan, NY',
        phone: '212-555-0001',
        is_24_hours: true,
        latitude: 40.7489,
        longitude: -73.9680,
      },
      {
        name: 'Metropolitan Hospital',
        service_type: 'hospital',
        address: '456 Medical Blvd, Manhattan, NY',
        phone: '212-555-0002',
        is_24_hours: true,
        latitude: 40.7128,
        longitude: -74.0060,
      },
      {
        name: 'Central Police Station',
        service_type: 'police',
        address: '789 Law St, Manhattan, NY',
        phone: '911',
        is_24_hours: true,
        latitude: 40.7589,
        longitude: -73.9851,
      },
      {
        name: 'Downtown Fire Department',
        service_type: 'fire',
        address: '321 Safety Blvd, Manhattan, NY',
        phone: '911',
        is_24_hours: true,
        latitude: 40.7282,
        longitude: -74.0076,
      },
    ]

    await supabaseAdmin
      .from('emergency_services')
      .insert(emergencyServices)
      .catch(() => console.log('Services may already exist'))

    // Seed local resources
    const resources = [
      {
        name: '24/7 Pharmacy Plus',
        category: 'Pharmacy',
        address: '111 Drug St, Manhattan, NY',
        phone: '212-555-0100',
        description: 'Open 24/7 pharmacy with emergency medications',
        is_open_now: true,
        rating: 4.5,
        latitude: 40.7505,
        longitude: -73.9972,
      },
      {
        name: 'Community Shelter',
        category: 'Shelter',
        address: '222 Safe Way, Manhattan, NY',
        phone: '212-555-0200',
        description: 'Emergency shelter with 500 bed capacity',
        is_open_now: true,
        rating: 4.0,
        latitude: 40.7614,
        longitude: -73.9776,
      },
      {
        name: 'Food Bank Central',
        category: 'Food',
        address: '333 Nourish Ave, Manhattan, NY',
        phone: '212-555-0300',
        description: 'Food distribution center',
        is_open_now: true,
        rating: 4.2,
        latitude: 40.7549,
        longitude: -73.9840,
      },
    ]

    await supabaseAdmin
      .from('local_resources')
      .insert(resources)
      .catch(() => console.log('Resources may already exist'))

    // Seed accessibility routes
    const routes = [
      {
        name: 'Main Street Accessible Route',
        description: 'Fully wheelchair accessible main street route',
        accessibility_features: ['Wheelchair accessible', 'Ramps', 'Level ground', 'Parking'],
        accessibility_type: 'Wheelchair Accessible',
        difficulty_level: 'Easy',
        start_latitude: 40.7480,
        start_longitude: -73.9862,
        end_latitude: 40.7589,
        end_longitude: -73.9851,
      },
    ]

    await supabaseAdmin
      .from('accessibility_routes')
      .insert(routes)
      .catch(() => console.log('Routes may already exist'))

    console.log('Database seeded successfully')
    return { success: true }
  } catch (error) {
    console.error('Seeding failed:', error)
    return { success: false, error }
  }
}
