import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Plus, Users } from 'lucide-react'
import CosmicBackground from '../components/CosmicBackground'
import { useFamilyMembers } from '@/hooks/useFamilyMembers'
import { useAuth } from '@/contexts/AuthContext'
import FamilyMemberForm from '@/components/onboarding/FamilyMemberForm'
import MemberCard from '@/components/onboarding/MemberCard'
import { Button } from '@/components/ui/button'
import { GlassCard } from '@/components/ui/glass-card'

const MAX_MEMBERS = 3

export default function FamilyMembersPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { members, loading, error: hookError, getFamilyMembersData, addMember } = useFamilyMembers()

  const [showAddForm, setShowAddForm] = useState(false)
  const [addError, setAddError] = useState(null)
  const [addLoading, setAddLoading] = useState(false)

  // Load family members on page mount
  useEffect(() => {
    getFamilyMembersData()
  }, [])

  const handleAddMember = async (formData) => {
    setAddLoading(true)
    setAddError(null)

    try {
      const { success, error } = await addMember(formData)

      if (!success) {
        setAddError(error?.message || 'Failed to add family member')
        setAddLoading(false)
        return
      }

      // Success - refresh list and hide form
      await getFamilyMembersData()
      setShowAddForm(false)
      setAddLoading(false)
    } catch (err) {
      console.error('Error adding member:', err)
      setAddError(err.message)
      setAddLoading(false)
    }
  }

  const canAddMore = members.length < MAX_MEMBERS
  const remainingSlots = MAX_MEMBERS - members.length

  return (
    <CosmicBackground density={140} useVideo={true}>
      <div className="min-h-screen relative px-4 md:px-6 py-8 overflow-hidden">
        <div className="relative z-10 max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-8"
          >
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors mb-4"
            >
              <ArrowLeft className="h-5 w-5" />
              Back to Home
            </button>

            <div className="flex items-center gap-3 mb-2">
              <Users className="h-8 w-8 text-cyan-400" />
              <h1 className="text-2xl sm:text-3xl md:text-5xl font-serif font-bold">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-purple-400 to-pink-400">
                  Family Members
                </span>
              </h1>
            </div>
            <p className="text-white/70 text-lg">
              Manage up to {MAX_MEMBERS} family members
              {members.length > 0 && (
                <span className="text-cyan-400 font-semibold ml-2">
                  ({members.length}/{MAX_MEMBERS})
                </span>
              )}
            </p>
          </motion.div>

          {/* Error Message */}
          {hookError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-300 text-sm"
            >
              <p>Error loading family members: {hookError}</p>
            </motion.div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400 mb-4"></div>
                <p className="text-white/70">Loading family members...</p>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && members.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-8"
            >
              <GlassCard className="text-center py-12 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 border-cyan-400/20">
                <div className="text-6xl mb-4">👨‍👩‍👧</div>
                <h2 className="text-2xl font-semibold text-white mb-2">No Family Members Yet</h2>
                <p className="text-white/70 mb-6">Start by adding your first family member</p>
                <Button
                  onClick={() => setShowAddForm(true)}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold py-2 px-6 rounded-lg inline-flex items-center gap-2"
                >
                  <Plus className="h-5 w-5" />
                  Add First Member
                </Button>
              </GlassCard>
            </motion.div>
          )}

          {/* Saved Members List */}
          {!loading && members.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="mb-8"
            >
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"></span>
                Saved Members ({members.length})
              </h2>
              <div className="space-y-4">
                {members.map((member, index) => (
                  <MemberCard key={member.id} member={member} index={index} />
                ))}
              </div>
            </motion.div>
          )}

          {/* Add More Members Section */}
          {canAddMore && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="mb-8"
            >
              <div className="mb-6">
                <p className="text-white/70 mb-4 text-center">
                  {remainingSlots === 1
                    ? `You can add 1 more member`
                    : `You can add ${remainingSlots} more members`}
                </p>
                {!showAddForm && (
                  <Button
                    onClick={() => setShowAddForm(true)}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2"
                  >
                    <Plus className="h-5 w-5" />
                    Add New Member
                  </Button>
                )}
              </div>

              {/* Add Form */}
              {showAddForm && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="p-6 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 border border-cyan-400/20 rounded-xl"
                >
                  <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                    <Plus className="h-5 w-5 text-cyan-400" />
                    Add New Member
                  </h3>

                  {addError && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-300 text-sm"
                    >
                      {addError}
                    </motion.div>
                  )}

                  <FamilyMemberForm
                    onSubmit={handleAddMember}
                    loading={addLoading}
                    currentMemberCount={members.length}
                  />

                  <div className="flex gap-3 justify-between mt-6">
                    <Button
                      onClick={() => {
                        setShowAddForm(false)
                        setAddError(null)
                      }}
                      disabled={addLoading}
                      className="flex-1 bg-white/10 hover:bg-white/20 text-white border border-white/30 rounded-lg py-2 transition duration-200 disabled:opacity-50"
                    >
                      Cancel
                    </Button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Max Members Reached Message */}
          {!canAddMore && members.length === MAX_MEMBERS && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-300 text-center"
            >
              <p className="font-semibold">Maximum family members reached</p>
              <p className="text-sm text-amber-200">You have added the maximum of {MAX_MEMBERS} members</p>
            </motion.div>
          )}

          {/* Info Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="mt-12 p-6 bg-gradient-to-br from-purple-500/10 to-blue-500/5 border border-purple-500/20 rounded-xl"
          >
            <h3 className="text-white font-semibold mb-3 text-lg">💡 About Family Members</h3>
            <ul className="space-y-2 text-white/70 text-sm">
              <li className="flex items-start gap-3">
                <span className="text-cyan-400 mt-1">✓</span>
                <span>Family members' data is used for compatibility analysis and family reports</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-cyan-400 mt-1">✓</span>
                <span>Birth time is optional but recommended for more accurate readings</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-cyan-400 mt-1">✓</span>
                <span>You can add up to {MAX_MEMBERS} family members total</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-cyan-400 mt-1">✓</span>
                <span>All data is securely stored and only visible to you</span>
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
    </CosmicBackground>
  )
}
