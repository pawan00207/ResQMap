import { getSupabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const reportSchema = z.object({
  report_type: z.enum(['accident', 'flood', 'blockage', 'debris', 'other']),
  title: z.string().min(3),
  description: z.string().optional(),
  latitude: z.number(),
  longitude: z.number(),
  image_url: z.string().optional(),
})

export async function GET(request: Request) {
  const supabase = getSupabase()
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
  }

  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status') || 'approved'
  const latitude = parseFloat(searchParams.get('lat') || '0')
  const longitude = parseFloat(searchParams.get('lng') || '0')
  const radius = parseFloat(searchParams.get('radius') || '5000')

  try {
    let query = supabase
      .from('reports')
      .select('*, user_profiles!inner(full_name)')
      .eq('status', status)
      .order('created_at', { ascending: false })

    const { data, error } = await query

    if (error) throw error

    // Filter by distance
    const filtered = data?.filter((report: any) => {
      const distance = getDistance(latitude, longitude, report.latitude, report.longitude)
      return distance <= radius / 1000
    }) || []

    return NextResponse.json(filtered)
  } catch (error) {
    console.error('Error fetching reports:', error)
    return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const supabase = getSupabase()
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
  }

  try {
    const body = await request.json()
    const validated = reportSchema.parse(body)

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data, error } = await supabase
      .from('reports')
      .insert([
        {
          user_id: user.id,
          ...validated,
          created_at: new Date().toISOString(),
        },
      ])
      .select()

    if (error) throw error

    return NextResponse.json(data[0], { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }

    console.error('Error creating report:', error)
    return NextResponse.json({ error: 'Failed to create report' }, { status: 500 })
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
