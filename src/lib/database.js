import { supabase } from './supabase'

/**
 * Get or create user profile
 * @param {string} userId - User ID from Supabase auth
 * @param {string} email - User email
 * @returns {Promise<{data: Object, error: Object}>}
 */
export const getOrCreateUserProfile = async (userId, email) => {
  try {
    // Try to get existing profile
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error && error.code === 'PGRST116') {
      // Profile doesn't exist, create it
      const { data: newProfile, error: createError } = await supabase
        .from('user_profiles')
        .insert({
          id: userId,
          email,
          onboarding_completed: false
        })
        .select()
        .single()

      if (createError) {
        console.error('Error creating user profile:', createError)
        return { data: null, error: createError }
      }

      return { data: newProfile, error: null }
    }

    if (error) {
      console.error('Error fetching user profile:', error)
      return { data: null, error }
    }

    return { data, error: null }
  } catch (err) {
    console.error('Unexpected error in getOrCreateUserProfile:', err)
    return { data: null, error: err }
  }
}

/**
 * Get user profile
 * @param {string} userId - User ID from Supabase auth
 * @returns {Promise<{data: Object, error: Object}>}
 */
export const getUserProfile = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Error fetching user profile:', error)
      return { data: null, error }
    }

    return { data, error: null }
  } catch (err) {
    console.error('Unexpected error in getUserProfile:', err)
    return { data: null, error: err }
  }
}

/**
 * Get all family members for a user
 * @param {string} userId - User ID from Supabase auth
 * @returns {Promise<{data: Array, error: Object}>}
 */
export const getFamilyMembers = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('family_members')
      .select('*')
      .eq('user_id', userId)
      .order('display_order', { ascending: true })

    if (error) {
      console.error('Error fetching family members:', error)
      return { data: [], error }
    }

    return { data: data || [], error: null }
  } catch (err) {
    console.error('Unexpected error in getFamilyMembers:', err)
    return { data: [], error: err }
  }
}

/**
 * Get count of family members for a user
 * @param {string} userId - User ID from Supabase auth
 * @returns {Promise<{count: number, error: Object}>}
 */
export const getFamilyMembersCount = async (userId) => {
  try {
    const { count, error } = await supabase
      .from('family_members')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)

    if (error) {
      console.error('Error counting family members:', error)
      return { count: 0, error }
    }

    return { count: count || 0, error: null }
  } catch (err) {
    console.error('Unexpected error in getFamilyMembersCount:', err)
    return { count: 0, error: err }
  }
}

/**
 * Add a family member
 * @param {string} userId - User ID from Supabase auth
 * @param {Object} memberData - Member data (name, gender, date_of_birth, birth_place, birth_time, relationship, display_order)
 * @returns {Promise<{data: Object, error: Object}>}
 */
export const addFamilyMember = async (userId, memberData) => {
  try {
    const { data, error } = await supabase
      .from('family_members')
      .insert({
        user_id: userId,
        name: memberData.name,
        gender: memberData.gender,
        date_of_birth: memberData.date_of_birth,
        birth_place: memberData.birth_place,
        birth_time: memberData.birth_time || null,
        relationship: memberData.relationship || 'other',
        display_order: memberData.display_order
      })
      .select()
      .single()

    if (error) {
      console.error('Error adding family member:', error)
      return { data: null, error }
    }

    return { data, error: null }
  } catch (err) {
    console.error('Unexpected error in addFamilyMember:', err)
    return { data: null, error: err }
  }
}

/**
 * Add multiple family members in a transaction-like operation
 * @param {string} userId - User ID from Supabase auth
 * @param {Array} membersData - Array of member data objects
 * @returns {Promise<{data: Array, error: Object}>}
 */
export const addFamilyMembers = async (userId, membersData) => {
  try {
    // Insert all members with their display_order
    const membersToInsert = membersData.map((member, index) => ({
      user_id: userId,
      name: member.name,
      gender: member.gender,
      date_of_birth: member.date_of_birth,
      birth_place: member.birth_place,
      birth_time: member.birth_time || null,
      relationship: member.relationship || 'other',
      display_order: index + 1
    }))

    const { data, error } = await supabase
      .from('family_members')
      .insert(membersToInsert)
      .select()

    if (error) {
      console.error('Error adding family members:', error)
      return { data: [], error }
    }

    return { data: data || [], error: null }
  } catch (err) {
    console.error('Unexpected error in addFamilyMembers:', err)
    return { data: [], error: err }
  }
}

/**
 * Update family member
 * @param {string} memberId - Family member ID
 * @param {string} userId - User ID from Supabase auth (for security)
 * @param {Object} updates - Fields to update
 * @returns {Promise<{data: Object, error: Object}>}
 */
export const updateFamilyMember = async (memberId, userId, updates) => {
  try {
    const { data, error } = await supabase
      .from('family_members')
      .update(updates)
      .eq('id', memberId)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) {
      console.error('Error updating family member:', error)
      return { data: null, error }
    }

    return { data, error: null }
  } catch (err) {
    console.error('Unexpected error in updateFamilyMember:', err)
    return { data: null, error: err }
  }
}

/**
 * Delete family member
 * @param {string} memberId - Family member ID
 * @param {string} userId - User ID from Supabase auth (for security)
 * @returns {Promise<{error: Object}>}
 */
export const deleteFamilyMember = async (memberId, userId) => {
  try {
    const { error } = await supabase
      .from('family_members')
      .delete()
      .eq('id', memberId)
      .eq('user_id', userId)

    if (error) {
      console.error('Error deleting family member:', error)
      return { error }
    }

    return { error: null }
  } catch (err) {
    console.error('Unexpected error in deleteFamilyMember:', err)
    return { error: err }
  }
}

/**
 * Mark onboarding as complete
 * @param {string} userId - User ID from Supabase auth
 * @returns {Promise<{data: Object, error: Object}>}
 */
export const markOnboardingComplete = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .update({ onboarding_completed: true })
      .eq('id', userId)
      .select()
      .single()

    if (error) {
      console.error('Error marking onboarding complete:', error)
      return { data: null, error }
    }

    return { data, error: null }
  } catch (err) {
    console.error('Unexpected error in markOnboardingComplete:', err)
    return { data: null, error: err }
  }
}

/**
 * Check if user needs onboarding
 * @param {string} userId - User ID from Supabase auth
 * @returns {Promise<{needsOnboarding: boolean, error: Object}>}
 */
export const checkOnboardingRequired = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('onboarding_completed')
      .eq('id', userId)
      .single()

    if (error) {
      // If profile doesn't exist, user needs onboarding
      if (error.code === 'PGRST116') {
        return { needsOnboarding: true, error: null }
      }
      console.error('Error checking onboarding status:', error)
      return { needsOnboarding: true, error }
    }

    return {
      needsOnboarding: !data?.onboarding_completed,
      error: null
    }
  } catch (err) {
    console.error('Unexpected error in checkOnboardingRequired:', err)
    return { needsOnboarding: true, error: err }
  }
}
