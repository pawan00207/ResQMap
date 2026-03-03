import { getSupabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

// Sample data with proper structure
const SAMPLE_DATA = {
  emergency_services: [
    {
      name: 'Central Hospital',
      service_type: 'hospital',
      address: '123 Health Ave, City Center',
      phone: '555-0001',
      is_24_hours: true,
      latitude: 40.7128,
      longitude: -74.0060,
    },
    {
      name: 'Main Police Station',
      service_type: 'police',
      address: '456 Law St, Downtown',
      phone: '911',
      is_24_hours: true,
      latitude: 40.7282,
      longitude: -74.0076,
    },
    {
      name: 'Fire Station 1',
      service_type: 'fire',
      address: '789 Safety Blvd, Midtown',
      phone: '911',
      is_24_hours: true,
      latitude: 40.7505,
      longitude: -73.9972,
    },
  ],
  local_resources: [
    {
      name: '24/7 Pharmacy',
      category: 'Pharmacy',
      address: '111 Drug St, Downtown',
      phone: '555-0100',
      description: 'Open 24/7 emergency pharmacy',
      is_open_now: true,
      rating: 4.5,
      latitude: 40.7489,
      longitude: -73.9680,
    },
    {
      name: 'Emergency Shelter',
      category: 'Shelter',
      address: '222 Safe Way, Uptown',
      phone: '555-0200',
      description: 'Emergency shelter with 500 capacity',
      is_open_now: true,
      rating: 4.0,
      latitude: 40.7614,
      longitude: -73.9776,
    },
  ],
}

export async function POST() {
  const supabase = getSupabase()
  if (!supabase) {
    return NextResponse.json(
      { error: 'Database not configured' },
      { status: 503 }
    )
  }

  try {
    // Insert emergency services
    const { error: servicesError } = await supabase
      .from('emergency_services')
      .insert(SAMPLE_DATA.emergency_services)
      .select()

    if (servicesError && !servicesError.message.includes('duplicate')) {
      throw servicesError
    }

    // Insert local resources
    const { error: resourcesError } = await supabase
      .from('local_resources')
      .insert(SAMPLE_DATA.local_resources)
      .select()

    if (resourcesError && !resourcesError.message.includes('duplicate')) {
      throw resourcesError
    }

    return NextResponse.json({
      success: true,
      message: 'Database initialized with sample data',
    })
  } catch (error) {
    console.error('Error initializing data:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  const supabase = getSupabase()
  if (!supabase) {
    return NextResponse.json(
      { initialized: false, error: 'Database not configured' },
      { status: 503 }
    )
  }

  try {
    // Check if data exists
    const { count: servicesCount } = await supabase
      .from('emergency_services')
      .select('*', { count: 'exact', head: true })

    const { count: resourcesCount } = await supabase
      .from('local_resources')
      .select('*', { count: 'exact', head: true })

    return NextResponse.json({
      initialized: (servicesCount || 0) > 0 || (resourcesCount || 0) > 0,
      emergency_services: servicesCount || 0,
      local_resources: resourcesCount || 0,
    })
  } catch (error) {
    console.error('Error checking database:', error)
    return NextResponse.json(
      { initialized: false, error: 'Failed to check database status' },
      { status: 503 }
    )
  }
}
