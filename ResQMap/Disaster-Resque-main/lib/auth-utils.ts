import { getSupabase } from './supabase'

export async function getCurrentUser() {
  const supabase = getSupabase()
  if (!supabase) return null

  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return user
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

export async function signOut() {
  const supabase = getSupabase()
  if (!supabase) return { error: 'Supabase not configured' }

  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    return { success: true }
  } catch (error) {
    console.error('Error signing out:', error)
    return { error: error instanceof Error ? error.message : 'Sign out failed' }
  }
}

export async function getUserProfile(userId: string) {
  const supabase = getSupabase()
  if (!supabase) return null

  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return null
  }
}

export async function updateUserProfile(userId: string, profile: any) {
  const supabase = getSupabase()
  if (!supabase) return { error: 'Supabase not configured' }

  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .update(profile)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error updating user profile:', error)
    return { error: error instanceof Error ? error.message : 'Update failed' }
  }
}

export async function addFavoriteLocation(userId: string, location: any) {
  const supabase = getSupabase()
  if (!supabase) return { error: 'Supabase not configured' }

  try {
    const { data: profile, error: fetchError } = await supabase
      .from('user_profiles')
      .select('favorites')
      .eq('user_id', userId)
      .single()

    if (fetchError) throw fetchError

    const favorites = profile?.favorites || []
    const updatedFavorites = [...favorites, { ...location, id: Date.now() }]

    const { data, error: updateError } = await supabase
      .from('user_profiles')
      .update({ favorites: updatedFavorites })
      .eq('user_id', userId)
      .select()
      .single()

    if (updateError) throw updateError
    return data
  } catch (error) {
    console.error('Error adding favorite:', error)
    return { error: error instanceof Error ? error.message : 'Add favorite failed' }
  }
}

export async function removeFavoriteLocation(userId: string, locationId: number) {
  const supabase = getSupabase()
  if (!supabase) return { error: 'Supabase not configured' }

  try {
    const { data: profile, error: fetchError } = await supabase
      .from('user_profiles')
      .select('favorites')
      .eq('user_id', userId)
      .single()

    if (fetchError) throw fetchError

    const favorites = profile?.favorites || []
    const updatedFavorites = favorites.filter((fav: any) => fav.id !== locationId)

    const { data, error: updateError } = await supabase
      .from('user_profiles')
      .update({ favorites: updatedFavorites })
      .eq('user_id', userId)
      .select()
      .single()

    if (updateError) throw updateError
    return data
  } catch (error) {
    console.error('Error removing favorite:', error)
    return { error: error instanceof Error ? error.message : 'Remove favorite failed' }
  }
}
