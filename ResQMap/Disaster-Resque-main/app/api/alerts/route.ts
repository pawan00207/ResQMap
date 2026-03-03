import { getSupabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const supabase = getSupabase()
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
  }

  const { searchParams } = new URL(request.url)
  const latitude = parseFloat(searchParams.get('lat') || '0')
  const longitude = parseFloat(searchParams.get('lng') || '0')

  try {
    // Get active alerts (not expired)
    const { data, error } = await supabase
      .from('alerts')
      .select('*')
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })

    if (error) throw error

    // Filter alerts by distance from user
    const nearbyAlerts = data?.filter((alert: any) => {
      if (!alert.latitude || !alert.longitude) return true // Global alerts
      const distance = getDistance(latitude, longitude, alert.latitude, alert.longitude)
      return distance <= (alert.radius_km || 10)
    }) || []

    return NextResponse.json(nearbyAlerts)
  } catch (error) {
    console.error('Error fetching alerts:', error)
    return NextResponse.json({ error: 'Failed to fetch alerts' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const supabase = getSupabase()
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
  }

  try {
    const body = await request.json()
    const { title, description, alert_type, severity, latitude, longitude, radius_km, expires_at } = body

    // Check if user is admin
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: adminRole, error: roleError } = await supabase
      .from('admin_roles')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (!adminRole && !roleError?.message.includes('not found')) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const { data, error } = await supabase
      .from('alerts')
      .insert([
        {
          title,
          description,
          alert_type,
          severity,
          latitude,
          longitude,
          radius_km: radius_km || 10,
          expires_at: expires_at || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          created_at: new Date().toISOString(),
        },
      ])
      .select()

    if (error) throw error

    return NextResponse.json(data[0], { status: 201 })
  } catch (error) {
    console.error('Error creating alert:', error)
    return NextResponse.json({ error: 'Failed to create alert' }, { status: 500 })
  }
}

function getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371
  const dLat = (lat2 - lat1) * (Math.PI / 180)
  const dLon = (lon2 - lon1) * (Math.PI / 180)
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}
