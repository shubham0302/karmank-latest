import { useState, useEffect } from 'react'
import { Users, AlertCircle } from 'lucide-react'
import { useFamilyMembers } from '@/hooks/useFamilyMembers'

/**
 * FamilyMemberSelector Component
 * Reusable dropdown to select family members and populate their details
 *
 * @param {Object} props
 * @param {string} props.selectedMemberId - ID of currently selected family member
 * @param {Function} props.onMemberSelect - Callback when member is selected
 * @param {Function} props.onDetailsChange - Callback when member details are populated
 * @param {string} props.label - Label for the dropdown (default: "Select Family Member")
 * @param {boolean} props.allowMultiple - Allow selecting multiple family members (for compatibility)
 * @param {string} props.excludeMemberId - ID of member to exclude from dropdown
 * @param {Array} props.selectedMembers - Array of already selected member IDs (for multi-select)
 */
export default function FamilyMemberSelector({
  selectedMemberId,
  onMemberSelect,
  onDetailsChange,
  label = 'Select Family Member',
  allowMultiple = false,
  excludeMemberId = null,
  selectedMembers = []
}) {
  const { members, loading, error, getFamilyMembersData } = useFamilyMembers()
  const [isOpen, setIsOpen] = useState(false)

  // Fetch family members on mount
  useEffect(() => {
    getFamilyMembersData()
  }, [])

  // Extract member details when a member is selected
  // Note: onDetailsChange intentionally excluded from deps to prevent infinite re-render loop
  useEffect(() => {
    if (selectedMemberId && members.length > 0) {
      const selectedMember = members.find(m => m.id === selectedMemberId)
      if (selectedMember) {
        onDetailsChange({
          name: selectedMember.name,
          gender: selectedMember.gender,
          dob: selectedMember.date_of_birth,
          birthPlace: selectedMember.birth_place,
          birthTime: selectedMember.birth_time,
          relationship: selectedMember.relationship,
          memberId: selectedMember.id,
          latitude: selectedMember.latitude || null,
          longitude: selectedMember.longitude || null,
          timezone: selectedMember.timezone || null,
        })
      }
    }
  }, [selectedMemberId, members])

  const availableMembers = members.filter(m =>
    !excludeMemberId || m.id !== excludeMemberId
  )

  if (loading) {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg border border-white/20 text-white/50 text-sm">
        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-cyan-400"></div>
        Loading family members...
      </div>
    )
  }

  if (availableMembers.length === 0) {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg border border-white/20 text-white/50 text-sm">
        <Users className="h-4 w-4" />
        No family members available
      </div>
    )
  }

  return (
    <div className="relative inline-block w-full md:w-auto">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full md:w-auto flex items-center justify-between gap-2 px-3 py-2 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 hover:from-cyan-500/20 hover:to-blue-500/20 border border-cyan-400/30 rounded-lg text-white/80 transition duration-200"
      >
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-cyan-400" />
          <span className="text-sm">
            {selectedMemberId && members.find(m => m.id === selectedMemberId)
              ? members.find(m => m.id === selectedMemberId).name
              : label}
          </span>
        </div>
        <svg
          className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900/95 border border-cyan-400/30 rounded-lg shadow-lg z-50 backdrop-blur">
          {error && (
            <div className="px-3 py-2 text-red-400 text-xs border-b border-white/10">
              Error loading members
            </div>
          )}
          <div className="max-h-48 overflow-y-auto">
            {availableMembers.map((member) => {
              const isSelected = allowMultiple
                ? selectedMembers.includes(member.id)
                : selectedMemberId === member.id

              return (
                <button
                  key={member.id}
                  onClick={() => {
                    onMemberSelect(member.id)
                    setIsOpen(false)
                  }}
                  className={`w-full text-left px-4 py-3 border-b border-white/5 hover:bg-cyan-400/10 transition duration-150 ${
                    isSelected ? 'bg-cyan-400/20 border-l-2 border-l-cyan-400' : ''
                  }`}
                >
                  <div className="font-semibold text-white">{member.name}</div>
                  <div className="text-xs text-white/60">
                    {member.gender} • DOB: {new Date(member.date_of_birth).toLocaleDateString()}
                  </div>
                  {member.relationship && (
                    <div className="text-xs text-cyan-400 mt-1">
                      Relationship: {member.relationship}
                    </div>
                  )}
                </button>
              )
            })}
          </div>

          {availableMembers.length === 0 && (
            <div className="px-4 py-6 text-center text-white/50 text-sm">
              No family members to select
            </div>
          )}
        </div>
      )}
    </div>
  )
}
