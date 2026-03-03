import { getSupabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const supabase = getSupabase()
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
  }

  try {
    // Check if user is admin
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: adminRole } = await supabase
      .from('admin_roles')
      .select('*')
      .eq('user_id', user.id)
      .single()
      .catch(() => ({ data: null }))

    if (!adminRole) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    // Get analytics data
    const { data: totalReports } = await supabase
      .from('reports')
      .select('*', { count: 'exact', head: true })

    const { data: pendingReports } = await supabase
      .from('reports')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending')

    const { data: resolvedReports } = await supabase
      .from('reports')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'resolved')

    const { data: totalUsers } = await supabase
      .from('user_profiles')
      .select('*', { count: 'exact', head: true })

    return NextResponse.json({
      analytics: {
        total_reports: totalReports?.length || 0,
        pending_reports: pendingReports?.length || 0,
        resolved_reports: resolvedReports?.length || 0,
        total_users: totalUsers?.length || 0,
      },
    })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const supabase = getSupabase()
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
  }

  try {
    // Check if user is admin
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: adminRole } = await supabase
      .from('admin_roles')
      .select('*')
      .eq('user_id', user.id)
      .single()
      .catch(() => ({ data: null }))

    if (!adminRole) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const body = await request.json()
    const { action, report_id, status, new_role, target_user_id } = body

    if (action === 'update_report_status') {
      const { error } = await supabase
        .from('reports')
        .update({ status })
        .eq('id', report_id)

      if (error) throw error

      return NextResponse.json({ success: true, message: 'Report status updated' })
    }

    if (action === 'assign_admin_role') {
      const { error } = await supabase
        .from('admin_roles')
        .insert([{ user_id: target_user_id, role: new_role }])

      if (error) throw error

      return NextResponse.json({ success: true, message: 'Admin role assigned' })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Error processing admin action:', error)
    return NextResponse.json({ error: 'Failed to process action' }, { status: 500 })
  }
}
