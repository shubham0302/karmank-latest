import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { getFamilyMembers } from '@/lib/database'

/**
 * Hook to load the logged-in user's "self" family member
 * and convert it to the BirthDataFormValue format used by astrology pages.
 *
 * This bridges profile data → astrology module so users don't re-enter birth data.
 */

export interface ProfileBirthDataFormValue {
  name: string
  birthDate: Date
  birthTime: string
  birthLocation: string
  latitude: number
  longitude: number
  timezone: string
}

interface ProfileBirthDataResult {
  /** Raw family_members DB row */
  member: any | null
  /** Converted to astrology BirthDataFormValue format */
  birthDataFormValue: ProfileBirthDataFormValue | null
  /** True when lat/lng/tz + birth_time are all present (full astrology data) */
  isAstrologyReady: boolean
  /** True when name + DOB exist (enough for numerology/palmistry) */
  hasBasicData: boolean
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
}

export function useProfileBirthData(): ProfileBirthDataResult {
  const { user } = useAuth()
  const [member, setMember] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSelfMember = useCallback(async () => {
    if (!user?.id) {
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    try {
      const { data, error: fetchError } = await getFamilyMembers(user.id)
      if (fetchError) throw fetchError
      // Find the 'self' member by relationship, or fall back to first member
      const selfMember = data?.find((m: any) => m.relationship === 'self') || data?.[0] || null
      setMember(selfMember)
    } catch (e: any) {
      setError(e?.message || 'Failed to load profile data')
    } finally {
      setLoading(false)
    }
  }, [user?.id])

  useEffect(() => {
    fetchSelfMember()
  }, [fetchSelfMember])

  // Convert to BirthDataFormValue when all astrology-required fields are present
  const birthDataFormValue: ProfileBirthDataFormValue | null =
    member?.latitude && member?.longitude && member?.timezone && member?.birth_time
      ? {
          name: member.name,
          birthDate: new Date(member.date_of_birth + 'T00:00:00'),
          birthTime: member.birth_time,
          birthLocation: member.birth_place,
          latitude: member.latitude,
          longitude: member.longitude,
          timezone: member.timezone,
        }
      : null

  const isAstrologyReady = birthDataFormValue !== null
  const hasBasicData = !!(member?.name && member?.date_of_birth)

  return {
    member,
    birthDataFormValue,
    isAstrologyReady,
    hasBasicData,
    loading,
    error,
    refresh: fetchSelfMember,
  }
}
