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
   * Fetch family members for current user
   */
  const getFamilyMembersData = useCallback(async () => {
    if (!user?.id) {
      setMembers([])
      setCount(0)
      return { members: [], count: 0, error: null }
    }

    setLoading(true)
    setError(null)

    try {
      const { data, error: fetchError } = await getFamilyMembers(user.id)

      if (fetchError) {
        setError(fetchError.message)
        return { members: [], count: 0, error: fetchError }
      }

      setMembers(data || [])
      setCount(data?.length || 0)
      return { members: data || [], count: data?.length || 0, error: null }
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

        setMembers([...members, data])
        setCount(members.length + 1)
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

        setMembers(data || [])
        setCount(data?.length || 0)
        return { success: true, data: data || [], error: null }
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
