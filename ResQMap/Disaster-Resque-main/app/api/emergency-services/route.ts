import { getSupabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const supabase = getSupabase()
  if (!supabase) {
    return NextResponse.json(
      { error: 'Database not configured' },
      { status: 503 }
    )
  }

  const { searchParams } = new URL(request.url)
  const latitude = parseFloat(searchParams.get('lat') || '0')
  const longitude = parseFloat(searchParams.get('lng') || '0')
  const radius = parseFloat(searchParams.get('radius') || '5000') // in meters
  const type = searchParams.get('type') || null

  try {
    let query = supabase
      .from('emergency_services')
      .select('*')

    if (type) {
      query = query.eq('service_type', type)
    }

    if (latitude !== 0 && longitude !== 0) {
      // Get nearby services using distance calculation
      // Note: This requires PostGIS support
      const { data, error } = await query
      
      if (error) throw error

      // Filter by distance in JavaScript if PostGIS not available
      const filtered = data?.filter((service: any) => {
        const distance = getDistance(latitude, longitude, service.latitude, service.longitude)
        return distance <= radius / 1000 // Convert radius to km
      }) || []

      return NextResponse.json(filtered)
    }

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json(data || [])
  } catch (error) {
    console.error('Error fetching emergency services:', error)
    return NextResponse.json(
      { error: 'Failed to fetch emergency services' },
      { status: 500 }
    )
  }
}

function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371 // Radius of Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}
