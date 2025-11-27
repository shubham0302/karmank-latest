import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function OnboardingSuccess() {
  const navigate = useNavigate()

  useEffect(() => {
    // Auto-redirect after 2 seconds
    const timer = setTimeout(() => {
      navigate('/', { replace: true })
    }, 2000)

    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl mx-auto text-center py-12"
    >
      {/* Success Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5, type: 'spring' }}
        className="mb-6"
      >
        <CheckCircle2 className="h-24 w-24 text-green-400 mx-auto" />
      </motion.div>

      {/* Success Title */}
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="text-3xl md:text-4xl font-serif font-bold mb-3"
      >
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-cyan-400 to-blue-400">
          Welcome to KarmAnk!
        </span>
      </motion.h2>

      {/* Success Message */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        className="text-white/70 text-lg mb-8"
      >
        Your family members have been saved. You're all set to explore your cosmic destiny!
      </motion.p>

      {/* Redirect Info */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className="flex items-center justify-center gap-2 text-white/60 text-sm"
      >
        <span>Redirecting to home</span>
        <motion.div
          animate={{ x: [0, 5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ArrowRight className="h-4 w-4" />
        </motion.div>
      </motion.div>

      {/* Loading Dots */}
      <motion.div className="flex justify-center gap-2 mt-4">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="h-2 w-2 bg-cyan-400 rounded-full"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.5, delay: i * 0.2, repeat: Infinity }}
          />
        ))}
      </motion.div>
    </motion.div>
  )
}
