import { useState, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import {
  getFamilyMembers,
  getFamilyMembersCount,
  addFamilyMember,
  addFamilyMembers,
  updateFamilyMember,
  deleteFamilyMember
} from '@/lib/database'
import { localCache } from './useLocalCache'

// Members list is cached for 1 hour — stale-while-revalidate pattern:
// serve cached data instantly, then refresh from Supabase in the background.
const MEMBERS_TTL = 60 * 60 * 1000; // 1 hour

/**
 * Hook to manage family members
 * @returns {Object} - { members, count, loading, error, getFamilyMembersData, addMember, addMultipleMembers, updateMember, deleteMember }
 */
export const useFamilyMembers = () => {
  const { user } = useAuth()
  const [members, setMembers] = useState([])
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  /**
   * Fetch family members — stale-while-revalidate:
   * 1. Return cached data immediately (no loading flash)
   * 2. Fetch from Supabase in the background to refresh
   */
  const getFamilyMembersData = useCallback(async () => {
    if (!user?.id) {
      setMembers([])
      setCount(0)
      return { members: [], count: 0, error: null }
    }

    const cacheKey = localCache.membersKey(user.id)

    // ── Step 1: Serve cache instantly ─────────────────────────────────────────
    const cached = localCache.get(cacheKey)
    if (cached) {
      setMembers(cached)
      setCount(cached.length)
      // Still revalidate in background (no await — fire-and-forget)
      ;(async () => {
        try {
          const { data } = await getFamilyMembers(user.id)
          if (data) {
            localCache.set(cacheKey, data, MEMBERS_TTL)
            setMembers(data)
            setCount(data.length)
          }
        } catch { /* silent background refresh failure */ }
      })()
      return { members: cached, count: cached.length, error: null }
    }

    // ── Step 2: No cache — fetch normally ─────────────────────────────────────
    setLoading(true)
    setError(null)

    try {
      const { data, error: fetchError } = await getFamilyMembers(user.id)

      if (fetchError) {
        setError(fetchError.message)
        return { members: [], count: 0, error: fetchError }
      }

      const result = data || []
      localCache.set(cacheKey, result, MEMBERS_TTL)
      setMembers(result)
      setCount(result.length)
      return { members: result, count: result.length, error: null }
    } catch (err) {
      console.error('Error fetching family members:', err)
      setError(err.message)
      return { members: [], count: 0, error: err }
    } finally {
      setLoading(false)
    }
  }, [user?.id])

  /**
   * Add a single family member
   * @param {Object} memberData - Member data (name, gender, date_of_birth, birth_place, birth_time, relationship, display_order)
   * @returns {Promise<{success: boolean, data: Object, error: Object}>}
   */
  const addMember = useCallback(
    async (memberData) => {
      if (!user?.id) {
        const error = { message: 'User not authenticated' }
        setError(error.message)
        return { success: false, data: null, error }
      }

      setLoading(true)
      setError(null)

      try {
        const { data, error: addError } = await addFamilyMember(user.id, {
          ...memberData,
          display_order: members.length + 1
        })

        if (addError) {
          setError(addError.message)
          return { success: false, data: null, error: addError }
        }

        const updated = [...members, data]
        localCache.set(localCache.membersKey(user.id), updated, MEMBERS_TTL)
        setMembers(updated)
        setCount(updated.length)
        return { success: true, data, error: null }
      } catch (err) {
        console.error('Error adding family member:', err)
        setError(err.message)
        return { success: false, data: null, error: err }
      } finally {
        setLoading(false)
      }
    },
    [user?.id, members.length]
  )

  /**
   * Add multiple family members at once
   * @param {Array} membersData - Array of member data objects
   * @returns {Promise<{success: boolean, data: Array, error: Object}>}
   */
  const addMultipleMembers = useCallback(
    async (membersData) => {
      if (!user?.id) {
        const error = { message: 'User not authenticated' }
        setError(error.message)
        return { success: false, data: [], error }
      }

      setLoading(true)
      setError(null)

      try {
        const { data, error: addError } = await addFamilyMembers(
          user.id,
          membersData
        )

        if (addError) {
          setError(addError.message)
          return { success: false, data: [], error: addError }
        }

        const result = data || []
        localCache.set(localCache.membersKey(user.id), result, MEMBERS_TTL)
        setMembers(result)
        setCount(result.length)
        return { success: true, data: result, error: null }
      } catch (err) {
        console.error('Error adding family members:', err)
        setError(err.message)
        return { success: false, data: [], error: err }
      } finally {
        setLoading(false)
      }
    },
    [user?.id]
  )

  /**
   * Update a family member
   * @param {string} memberId - Member ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<{success: boolean, data: Object, error: Object}>}
   */
  const updateMember = useCallback(
    async (memberId, updates) => {
      if (!user?.id) {
        const error = { message: 'User not authenticated' }
        setError(error.message)
        return { success: false, data: null, error }
      }

      setLoading(true)
      setError(null)

      try {
        const { data, error: updateError } = await updateFamilyMember(
          memberId,
          user.id,
          updates
        )

        if (updateError) {
          setError(updateError.message)
          return { success: false, data: null, error: updateError }
        }

        const updatedMembers = members.map((m) =>
          m.id === memberId ? data : m
        )
        localCache.set(localCache.membersKey(user.id), updatedMembers, MEMBERS_TTL)
        // Also invalidate any cached numerology report for this member
        // (name/dob/gender may have changed)
        localCache.clear('report:')
        setMembers(updatedMembers)
        return { success: true, data, error: null }
      } catch (err) {
        console.error('Error updating family member:', err)
        setError(err.message)
        return { success: false, data: null, error: err }
      } finally {
        setLoading(false)
      }
    },
    [user?.id, members]
  )

  /**
   * Delete a family member
   * @param {string} memberId - Member ID
   * @returns {Promise<{success: boolean, error: Object}>}
   */
  const deleteMember = useCallback(
    async (memberId) => {
      if (!user?.id) {
        const error = { message: 'User not authenticated' }
        setError(error.message)
        return { success: false, error }
      }

      setLoading(true)
      setError(null)

      try {
        const { error: deleteError } = await deleteFamilyMember(memberId, user.id)

        if (deleteError) {
          setError(deleteError.message)
          return { success: false, error: deleteError }
        }

        const filteredMembers = members.filter((m) => m.id !== memberId)
        localCache.set(localCache.membersKey(user.id), filteredMembers, MEMBERS_TTL)
        setMembers(filteredMembers)
        setCount(filteredMembers.length)
        return { success: true, error: null }
      } catch (err) {
        console.error('Error deleting family member:', err)
        setError(err.message)
        return { success: false, error: err }
      } finally {
        setLoading(false)
      }
    },
    [user?.id, members]
  )

  return {
    members,
    count,
    loading,
    error,
    getFamilyMembersData,
    addMember,
    addMultipleMembers,
    updateMember,
    deleteMember
  }
}
