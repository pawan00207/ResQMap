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
  const user_id = searchParams.get('user_id')
  const status = searchParams.get('status') || 'active'

  try {
    let query = supabase
      .from('sos_alerts')
      .select('*')
      .order('created_at', { ascending: false })

    if (user_id) {
      query = query.eq('user_id', user_id)
    }

    if (status) {
      query = query.eq('status', status)
    }

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json(data || [])
  } catch (error) {
    console.error('Error fetching SOS alerts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch SOS alerts' },
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
    const { 
      user_id,
      emergency_type, 
      latitude, 
      longitude,
      description,
      emergency_contacts,
      severity,
      is_anonymous
    } = body

    // Validate required fields
    if (!user_id || !latitude || !longitude) {
      return NextResponse.json(
        { error: 'Missing required fields: user_id, latitude, longitude' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('sos_alerts')
      .insert([{
        user_id,
        emergency_type: emergency_type || 'general',
        latitude,
        longitude,
        description,
        emergency_contacts,
        severity: severity || 'medium',
        is_anonymous: is_anonymous || false,
        status: 'active',
        created_at: new Date().toISOString(),
      }])
      .select()

    if (error) throw error

    // Notify nearby users (this would use real-time subscriptions in production)
    await notifyNearbyUsers(latitude, longitude, data[0].id, supabase)

    return NextResponse.json(data[0], { status: 201 })
  } catch (error) {
    console.error('Error creating SOS alert:', error)
    return NextResponse.json(
      { error: 'Failed to create SOS alert' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  const supabase = getSupabase()
  if (!supabase) {
    return NextResponse.json(
      { error: 'Database not configured' },
      { status: 503 }
    )
  }

  try {
    const body = await request.json()
    const { id, ...updates } = body

    const { data, error } = await supabase
      .from('sos_alerts')
      .update(updates)
      .eq('id', id)
      .select()

    if (error) throw error

    return NextResponse.json(data[0])
  } catch (error) {
    console.error('Error updating SOS alert:', error)
    return NextResponse.json(
      { error: 'Failed to update SOS alert' },
      { status: 500 }
    )
  }
}

async function notifyNearbyUsers(latitude: number, longitude: number, alertId: string, supabase: any) {
  try {
    // Get users within 5km
    const { data: users, error } = await supabase
      .from('profiles')
      .select('id, notification_preferences')
      .eq('receive_sos_notifications', true)

    if (error) console.error('Error fetching nearby users:', error)
    
    // In production, send notifications via push notifications, emails, SMS, etc.
  } catch (error) {
    console.error('Error notifying users:', error)
  }
}
