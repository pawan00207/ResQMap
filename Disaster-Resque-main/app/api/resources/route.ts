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
  const radius = parseFloat(searchParams.get('radius') || '5000')
  const category = searchParams.get('category') || null

  try {
    let query = supabase
      .from('local_resources')
      .select('*')

    if (category) {
      query = query.eq('category', category)
    }

    const { data, error } = await query

    if (error) throw error

    // Filter by distance
    const filtered = data?.filter((resource: any) => {
      const distance = getDistance(latitude, longitude, resource.latitude, resource.longitude)
      return distance <= radius / 1000
    }) || []

    return NextResponse.json(filtered)
  } catch (error) {
    console.error('Error fetching resources:', error)
    return NextResponse.json(
      { error: 'Failed to fetch resources' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  const supabase = getSupabase()
  if (!supabase) {
    return NextResponse.json(
      { error: 'Database not configured' },
      { status: 503 }
    )
  }

  try {
    const body = await request.json()
    const { name, category, address, phone, description, latitude, longitude, is_open_now, rating } = body

    const { data, error } = await supabase
      .from('local_resources')
      .insert([{
        name,
        category,
        address,
        phone,
        description,
        latitude,
        longitude,
        is_open_now,
        rating,
        created_at: new Date().toISOString(),
      }])
      .select()

    if (error) throw error

    return NextResponse.json(data[0], { status: 201 })
  } catch (error) {
    console.error('Error creating resource:', error)
    return NextResponse.json(
      { error: 'Failed to create resource' },
      { status: 500 }
    )
  }
}

function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}
