import { createClient } from '@supabase/supabase-js'

let supabaseInstance: any = null
let supabaseAdminInstance: any = null

export const getSupabase = () => {
  if (!supabaseInstance) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.warn('Supabase environment variables not configured')
      return null
    }

    supabaseInstance = createClient(supabaseUrl, supabaseKey)
  }
  return supabaseInstance
}

export const getSupabaseAdmin = () => {
  if (!supabaseAdminInstance) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !serviceRoleKey) {
      console.warn('Supabase admin environment variables not configured')
      return null
    }

    supabaseAdminInstance = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  }
  return supabaseAdminInstance
}

// Backwards compatibility
export const supabase = {
  from: (table: string) => {
    const client = getSupabase()
    if (!client) throw new Error('Supabase client not initialized')
    return client.from(table)
  },
}
