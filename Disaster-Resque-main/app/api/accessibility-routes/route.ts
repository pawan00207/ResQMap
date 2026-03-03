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
  const accessibility_type = searchParams.get('type') || null

  try {
    let query = supabase
      .from('accessibility_routes')
      .select('*')

    if (accessibility_type) {
      query = query.eq('accessibility_type', accessibility_type)
    }

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json(data || [])
  } catch (error) {
    console.error('Error fetching accessibility routes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch accessibility routes' },
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
      name, 
      description, 
      start_latitude, 
      start_longitude, 
      end_latitude, 
      end_longitude,
      accessibility_features,
      accessibility_type,
      difficulty_level
    } = body

    const { data, error } = await supabase
      .from('accessibility_routes')
      .insert([{
        name,
        description,
        start_latitude,
        start_longitude,
        end_latitude,
        end_longitude,
        accessibility_features,
        accessibility_type,
        difficulty_level,
        created_at: new Date().toISOString(),
      }])
      .select()

    if (error) throw error

    return NextResponse.json(data[0], { status: 201 })
  } catch (error) {
    console.error('Error creating accessibility route:', error)
    return NextResponse.json(
      { error: 'Failed to create route' },
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
      .from('accessibility_routes')
      .update(updates)
      .eq('id', id)
      .select()

    if (error) throw error

    return NextResponse.json(data[0])
  } catch (error) {
    console.error('Error updating accessibility route:', error)
    return NextResponse.json(
      { error: 'Failed to update route' },
      { status: 500 }
    )
  }
}
