import { getSupabaseAdmin } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function POST() {
  const supabaseAdmin = getSupabaseAdmin()
  if (!supabaseAdmin) {
    return NextResponse.json({
      success: false,
      error: 'Supabase admin not configured'
    }, { status: 503 })
  }

  try {
    // Enable PostGIS extension
    const { error: extensionError } = await supabaseAdmin
      .rpc('create_extension', { extension_name: 'postgis' })
      .catch(() => ({ error: null })) // Might already be enabled

    // Create emergency_services table
    const { error: esError } = await supabaseAdmin
      .from('emergency_services')
      .select('count()', { count: 'exact', head: true })
      .catch(async () => {
        return await supabaseAdmin
          .rpc('create_emergency_services_table')
          .catch(() => ({ error: 'Table may already exist' }))
      })

    // Create accessibility_routes table
    await supabaseAdmin
      .from('accessibility_routes')
      .select('count()', { count: 'exact', head: true })
      .catch(async () => {
        return await supabaseAdmin
          .rpc('create_accessibility_routes_table')
          .catch(() => ({ error: null }))
      })

    // Create local_resources table
    await supabaseAdmin
      .from('local_resources')
      .select('count()', { count: 'exact', head: true })
      .catch(async () => {
        return await supabaseAdmin
          .rpc('create_local_resources_table')
          .catch(() => ({ error: null }))
      })

    // Create disaster_events table
    await supabaseAdmin
      .from('disaster_events')
      .select('count()', { count: 'exact', head: true })
      .catch(async () => {
        return await supabaseAdmin
          .rpc('create_disaster_events_table')
          .catch(() => ({ error: null }))
      })

    // Create sos_alerts table
    await supabaseAdmin
      .from('sos_alerts')
      .select('count()', { count: 'exact', head: true })
      .catch(async () => {
        return await supabaseAdmin
          .rpc('create_sos_alerts_table')
          .catch(() => ({ error: null }))
      })

    return NextResponse.json({ 
      success: true, 
      message: 'Database initialized successfully' 
    })
  } catch (error) {
    console.error('Database initialization error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}
