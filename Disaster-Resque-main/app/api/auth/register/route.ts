import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getSupabase } from '@/lib/supabase'

const registerSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
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
    const { email, password, full_name } = registerSchema.parse(body)

    // Register user with Supabase Auth
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name,
        },
      },
    })

    if (signUpError) throw signUpError

    // Create user profile
    const { error: profileError } = await supabase
      .from('user_profiles')
      .insert([
        {
          user_id: authData.user!.id,
          full_name,
          email,
          favorites: [],
          language: 'en',
          dark_mode: false,
          created_at: new Date().toISOString(),
        },
      ])

    if (profileError) throw profileError

    return NextResponse.json(
      {
        success: true,
        user: authData.user,
        message: 'Registration successful. Please check your email to confirm.',
      },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error('Registration error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Registration failed' },
      { status: 400 }
    )
  }
}
