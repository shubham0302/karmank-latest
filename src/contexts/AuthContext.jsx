import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import {
  getOrCreateUserProfile,
  getUserProfile,
  markOnboardingComplete as markOnboardingCompleteDB,
  checkOnboardingRequired as checkOnboardingRequiredDB
} from '../lib/database'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [onboardingRequired, setOnboardingRequired] = useState(false)

  // Load user profile when user changes
  useEffect(() => {
    const loadUserProfile = async () => {
      if (!user?.id) {
        setUserProfile(null)
        setOnboardingRequired(false)
        return
      }

      try {
        // Get or create user profile
        const { data: profile, error } = await getOrCreateUserProfile(
          user.id,
          user.email
        )

        if (error) {
          console.error('Error loading user profile:', error)
          setUserProfile(null)
          setOnboardingRequired(true)
        } else {
          setUserProfile(profile)
          setOnboardingRequired(!profile?.onboarding_completed)
        }
      } catch (err) {
        console.error('Unexpected error loading user profile:', err)
        setUserProfile(null)
        setOnboardingRequired(true)
      }
    }

    loadUserProfile()
  }, [user?.id, user?.email])

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for changes on auth state (sign in, sign out, etc.)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signInWithOtp = async (email) => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
      },
    })
    return { error }
  }

  const verifyOtp = async (email, token) => {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email',
    })
    return { data, error }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  const markOnboardingComplete = async (userId) => {
    try {
      const { data, error } = await markOnboardingCompleteDB(userId)

      if (error) {
        console.error('Error marking onboarding complete:', error)
        return { success: false, error }
      }

      // Update local state
      setUserProfile(data)
      setOnboardingRequired(false)
      return { success: true, data, error: null }
    } catch (err) {
      console.error('Unexpected error marking onboarding complete:', err)
      return { success: false, error: err }
    }
  }

  const value = {
    user,
    userProfile,
    loading,
    onboardingRequired,
    signInWithOtp,
    verifyOtp,
    signOut,
    markOnboardingComplete,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
