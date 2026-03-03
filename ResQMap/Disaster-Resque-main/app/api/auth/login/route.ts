import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getSupabase } from '@/lib/supabase'

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Invalid credentials'),
})

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
    const { email, password } = loginSchema.parse(body)

    // Sign in with Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', data.user.id)
      .single()

    if (profileError) throw profileError

    return NextResponse.json(
      {
        success: true,
        user: data.user,
        profile,
        session: data.session,
      },
      { status: 200 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error('Login error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Login failed' },
      { status: 401 }
    )
  }
}
