import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import FamilyMemberForm from './FamilyMemberForm'
import MemberCard from './MemberCard'
import { Button } from '../ui/button'
import { useFamilyMembers } from '@/hooks/useFamilyMembers'
import { useAuth } from '@/contexts/AuthContext'

export default function FamilyMembersForm({ onComplete }) {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { addMultipleMembers } = useFamilyMembers()

  const [currentStep, setCurrentStep] = useState(0) // 0, 1, 2 for max 3 members
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const maxMembers = 3
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

      // Move to next step or show success
      if (updatedMembers.length < maxMembers) {
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
    if (members.length === 0) {
      setError('Please add at least one family member')
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
            Add Family Members
          </span>
        </h2>
        <p className="text-white/70 text-sm md:text-base">
          Member {currentStep + 1} of {totalSteps} (Maximum 3)
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
      <div className="flex gap-3 justify-between mt-8">
        <Button
          onClick={handlePrevious}
          disabled={currentStep === 0 || loading}
          className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/30 rounded-lg transition duration-200 disabled:opacity-50"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>

        {!canAddMore || currentStep === maxMembers - 1 ? (
          <Button
            onClick={handleSubmit}
            disabled={members.length === 0 || loading}
            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold rounded-lg transition duration-200 disabled:opacity-50"
          >
            {loading ? 'Completing...' : 'Complete Setup'}
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

      {/* Info Text */}
      <p className="text-xs text-white/50 text-center mt-4">
        {members.length === 0
          ? 'Start by adding your details'
          : members.length < 3
            ? `You can add up to ${maxMembers - members.length} more member${maxMembers - members.length > 1 ? 's' : ''}`
            : 'Maximum family members reached'}
      </p>
    </motion.div>
  )
}
