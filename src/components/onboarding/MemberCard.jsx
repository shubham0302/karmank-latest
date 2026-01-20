import { motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'
import { GlassCard } from '../ui/glass-card'

export default function MemberCard({ member, index }) {
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
          <div className="flex-1">
            <h4 className="text-lg font-semibold text-white">
              {member.name}
            </h4>
            <div className="grid grid-cols-2 gap-2 mt-2 text-sm text-white/70">
              <div>
                <span className="text-white/50">Gender:</span>{' '}
                {member.gender?.charAt(0).toUpperCase() + member.gender?.slice(1)}
              </div>
              <div>
                <span className="text-white/50">DOB:</span>{' '}
                {new Date(member.date_of_birth).toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </div>
              <div className="col-span-2">
                <span className="text-white/50">Birth Place:</span>{' '}
                {member.birth_place}
              </div>
              {member.birth_time && (
                <div className="col-span-2">
                  <span className="text-white/50">Birth Time:</span>{' '}
                  {member.birth_time}
                </div>
              )}
            </div>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  )
}
