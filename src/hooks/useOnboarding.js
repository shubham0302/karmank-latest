import { useAuth } from '@/contexts/AuthContext'

/**
 * Hook to check and manage onboarding status
 * @returns {Object} - { isOnboardingRequired, completeOnboarding, loading, error }
 */
export const useOnboarding = () => {
  const { user, userProfile, onboardingRequired, markOnboardingComplete } =
    useAuth()

  const completeOnboarding = async () => {
    if (!user?.id) {
      console.error('User not authenticated')
      return { success: false, error: 'User not authenticated' }
    }

    try {
      const result = await markOnboardingComplete(user.id)
      return result
    } catch (error) {
      console.error('Error completing onboarding:', error)
      return { success: false, error }
    }
  }

  return {
    isOnboardingRequired: onboardingRequired,
    userProfile,
    completeOnboarding,
    user
  }
}
