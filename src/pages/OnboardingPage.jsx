import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LogOut } from 'lucide-react'
import CosmicBackground from '../components/CosmicBackground'
import FamilyMembersForm from '../components/onboarding/FamilyMembersForm'
import OnboardingSuccess from '../components/onboarding/OnboardingSuccess'
import { useAuth } from '../contexts/AuthContext'

export default function OnboardingPage() {
  const navigate = useNavigate()
  const { user, markOnboardingComplete, signOut } = useAuth()
  const [isComplete, setIsComplete] = useState(false)

  const handleOnboardingComplete = async () => {
    if (!user?.id) {
      console.error('User not authenticated')
      return
    }

    try {
      const result = await markOnboardingComplete(user.id)

      if (result.success) {
        setIsComplete(true)
        // Auto-redirect happens in OnboardingSuccess component
      } else {
        console.error('Failed to complete onboarding:', result.error)
      }
    } catch (error) {
      console.error('Error completing onboarding:', error)
    }
  }

  const handleLogout = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <CosmicBackground density={140} useVideo={true}>
      <div className="min-h-screen relative px-4 md:px-6 py-6">
        {/* Header with Logout Button */}
        <div className="max-w-5xl mx-auto relative z-20 flex justify-end mb-6">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/50 px-4 py-2 rounded-md text-sm font-medium transition duration-200"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>

        <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="relative z-10 w-full max-w-2xl"
          >
            {isComplete ? (
              <OnboardingSuccess />
            ) : (
              <FamilyMembersForm onComplete={handleOnboardingComplete} />
            )}
          </motion.div>
        </div>
      </div>
    </CosmicBackground>
  )
}
