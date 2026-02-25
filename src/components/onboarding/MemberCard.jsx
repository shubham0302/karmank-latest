import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, Pencil, Trash2, AlertTriangle } from 'lucide-react'
import { GlassCard } from '../ui/glass-card'

export default function MemberCard({ member, index, onEdit, onDelete }) {
  const [confirmDelete, setConfirmDelete] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="mb-4"
    >
      <GlassCard className="bg-gradient-to-br from-emerald-500/10 to-green-500/5 border-emerald-500/30 hover:border-emerald-500/50 transition-colors duration-300">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="h-5 w-5 text-emerald-400 mt-1 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-1">
              <h4 className="text-lg font-semibold text-white">{member.name}</h4>
              <div className="flex items-center gap-1 shrink-0">
                {onEdit && (
                  <button
                    onClick={() => onEdit(member)}
                    className="p-1.5 rounded-lg text-white/40 hover:text-cyan-300 hover:bg-cyan-500/10 transition"
                    title="Edit member"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => setConfirmDelete(true)}
                    className="p-1.5 rounded-lg text-white/40 hover:text-red-300 hover:bg-red-500/10 transition"
                    title="Remove member"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-2 text-sm text-white/70">
              <div>
                <span className="text-white/50">Gender:</span>{' '}
                {member.gender?.charAt(0).toUpperCase() + member.gender?.slice(1)}
              </div>
              <div>
                <span className="text-white/50">DOB:</span>{' '}
                {new Date(member.date_of_birth).toLocaleDateString('en-IN', {
                  year: 'numeric', month: 'short', day: 'numeric'
                })}
              </div>
              <div className="col-span-2">
                <span className="text-white/50">Birth Place:</span> {member.birth_place}
              </div>
              {member.birth_time && (
                <div className="col-span-2">
                  <span className="text-white/50">Birth Time:</span> {member.birth_time}
                </div>
              )}
              {member.relationship && (
                <div className="col-span-2">
                  <span className="text-white/50">Relation:</span>{' '}
                  {member.relationship.charAt(0).toUpperCase() + member.relationship.slice(1)}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Inline delete confirmation */}
        <AnimatePresence>
          {confirmDelete && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-4 pt-4 border-t border-red-500/20">
                <div className="flex items-start gap-2 mb-3">
                  <AlertTriangle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-white/70">
                    Remove <span className="text-white font-semibold">{member.name}</span>? This cannot be undone.
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setConfirmDelete(false)}
                    className="flex-1 py-2 rounded-lg bg-white/10 hover:bg-white/15 border border-white/20 text-white/70 text-sm transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => { setConfirmDelete(false); onDelete(member.id); }}
                    className="flex-1 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-300 text-sm font-semibold transition"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </GlassCard>
    </motion.div>
  )
}
