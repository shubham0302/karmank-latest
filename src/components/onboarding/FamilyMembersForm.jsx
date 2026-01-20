import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import FamilyMemberForm from './FamilyMemberForm'
import MemberCard from './MemberCard'
import { Button } from '../ui/button'
import { useFamilyMembers } from '@/hooks/useFamilyMembers'
import { useAuth } from '@/contexts/AuthContext'

export default function FamilyMembersForm({ onComplete, isOnboarding = true }) {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { addMultipleMembers } = useFamilyMembers()

  const [currentStep, setCurrentStep] = useState(0) // 0 for first member during onboarding
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // During onboarding: require 1 member, allow up to 3 total
  // After onboarding: allow adding remaining members
  const maxMembers = 3
  const minRequiredMembers = isOnboarding ? 1 : 0
  const canAddMore = members.length < maxMembers

  const handleAddMember = async (formData) => {
    setLoading(true)
    setError(null)

    try {
      // Add to local state
      const newMember = {
        ...formData,
        display_order: members.length + 1
      }
      const updatedMembers = [...members, newMember]
      setMembers(updatedMembers)

      // During onboarding: After adding 1st member, user can complete setup
      // After onboarding: Allow adding more members
      if (isOnboarding && updatedMembers.length >= minRequiredMembers) {
        // First member added during onboarding - show complete option
        setCurrentStep(0)
      } else if (updatedMembers.length < maxMembers) {
        setCurrentStep(currentStep + 1)
      }

      setLoading(false)
    } catch (err) {
      console.error('Error adding member:', err)
      setError(err.message)
      setLoading(false)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      // Remove the last member from state
      const updatedMembers = members.slice(0, -1)
      setMembers(updatedMembers)
      setCurrentStep(currentStep - 1)
      setError(null)
    }
  }

  const handleNext = () => {
    if (currentStep < maxMembers - 1 && canAddMore) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleSubmit = async () => {
    // Validate minimum members requirement
    if (members.length < minRequiredMembers) {
      setError(isOnboarding
        ? 'Please add at least one family member to continue'
        : 'Please add at least one family member')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Save all members to database
      const { success, error: saveError } = await addMultipleMembers(members)

      if (!success) {
        setError(saveError?.message || 'Failed to save family members')
        setLoading(false)
        return
      }

      // Call the onComplete callback
      if (onComplete) {
        await onComplete()
      }

      setLoading(false)
    } catch (err) {
      console.error('Error submitting onboarding:', err)
      setError(err.message)
      setLoading(false)
    }
  }

  const handleSkipAdditional = async () => {
    // Allow completing onboarding with just 1 member
    if (members.length >= minRequiredMembers) {
      await handleSubmit()
    }
  }

  const totalSteps = Math.min(members.length + 1, maxMembers)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-2xl mx-auto"
    >
      {/* Header */}
      <div className="mb-8 text-center">
        <h2 className="text-3xl md:text-4xl font-serif font-bold mb-2">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-purple-400 to-pink-400">
            {isOnboarding ? 'Add Your Details' : 'Add Family Members'}
          </span>
        </h2>
        <p className="text-white/70 text-sm md:text-base">
          {isOnboarding
            ? members.length === 0
              ? 'Start by adding yourself (Required)'
              : `${members.length} member added • You can add ${maxMembers - members.length} more later`
            : `Member ${currentStep + 1} of ${totalSteps} (Maximum 3)`}
        </p>
      </div>

      {/* Stepper Progress */}
      <div className="mb-6 flex justify-center gap-2">
        {[...Array(Math.min(maxMembers, totalSteps + 1))].map((_, index) => (
          <motion.div
            key={index}
            className={`h-2 rounded-full transition-all duration-300 ${
              index < members.length
                ? 'bg-gradient-to-r from-green-400 to-emerald-500'
                : index === currentStep
                  ? 'bg-gradient-to-r from-cyan-400 to-blue-500'
                  : 'bg-white/20'
            }`}
            style={{ width: index < totalSteps ? '40px' : '30px' }}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
          />
        ))}
      </div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-300 text-sm flex items-start gap-3"
        >
          <span className="text-lg mt-0.5">⚠️</span>
          <span>{error}</span>
        </motion.div>
      )}

      {/* Previously Added Members */}
      {members.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h3 className="text-white/70 text-sm font-medium mb-3 flex items-center gap-2">
            <span className="text-green-400">✓</span>
            Added Members ({members.length})
          </h3>
          <div className="space-y-2">
            {members.map((member, index) => (
              <MemberCard key={index} member={member} index={index} />
            ))}
          </div>
        </motion.div>
      )}

      {/* Current Member Form */}
      {canAddMore && (
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="mb-6 p-6 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 border border-cyan-400/20 rounded-xl"
        >
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-cyan-400" />
            Member {currentStep + 1} Details
          </h3>
          <FamilyMemberForm
            onSubmit={handleAddMember}
            loading={loading}
            currentMemberCount={members.length}
          />
        </motion.div>
      )}

      {/* Navigation Buttons */}
      <div className="flex flex-col gap-3 mt-8">
        {/* Primary Actions */}
        <div className="flex gap-3 justify-between">
          <Button
            onClick={handlePrevious}
            disabled={currentStep === 0 || loading || members.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/30 rounded-lg transition duration-200 disabled:opacity-50"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          {/* During onboarding: Show complete button after 1st member */}
          {isOnboarding && members.length >= minRequiredMembers ? (
            <div className="flex gap-3 flex-1 justify-end">
              {/* Add More Button (optional) */}
              {canAddMore && members.length === 1 && (
                <Button
                  onClick={handleNext}
                  disabled={!canAddMore || loading}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/30 rounded-lg transition duration-200 disabled:opacity-50"
                >
                  Add Another
                  <ChevronRight className="h-4 w-4" />
                </Button>
              )}
              {/* Complete Setup Button */}
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold rounded-lg transition duration-200 disabled:opacity-50"
              >
                {loading ? 'Completing...' : 'Complete Setup'}
                <Sparkles className="h-4 w-4" />
              </Button>
            </div>
          ) : !canAddMore || currentStep === maxMembers - 1 ? (
            <Button
              onClick={handleSubmit}
              disabled={members.length < minRequiredMembers || loading}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold rounded-lg transition duration-200 disabled:opacity-50"
            >
              {loading ? 'Saving...' : isOnboarding ? 'Complete Setup' : 'Save Members'}
              <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={!canAddMore || loading}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold rounded-lg transition duration-200 disabled:opacity-50"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Info Text */}
      <p className="text-xs text-white/50 text-center mt-4">
        {isOnboarding
          ? members.length === 0
            ? 'Add yourself to get started • You can add family members later'
            : members.length === 1
              ? 'Great! You can complete setup now or add up to 2 more members'
              : `${maxMembers - members.length} more member${maxMembers - members.length > 1 ? 's' : ''} can be added`
          : members.length === 0
            ? 'Start by adding your details'
            : members.length < 3
              ? `You can add up to ${maxMembers - members.length} more member${maxMembers - members.length > 1 ? 's' : ''}`
              : 'Maximum family members reached'}
      </p>
    </motion.div>
  )
}
