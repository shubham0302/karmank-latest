import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import FamilyMemberForm from "./FamilyMemberForm";
import { useFamilyMembers } from "@/hooks/useFamilyMembers";
import { useAuth } from "@/contexts/AuthContext";

export default function FamilyMembersForm({ onComplete }) {
  const { addMember } = useFamilyMembers();
  const { userProfile } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // Profile is ready when userProfile object exists
  const profileReady = !!userProfile;

  // Handle saving the first member and completing onboarding in one step
  const handleAddMember = async (formData) => {
    // Ensure profile is ready before saving
    if (!profileReady) {
      setError("Please wait, setting up your profile...");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Save member directly to database
      const memberData = {
        ...formData,
        display_order: 1,
      };

      const { success, error: saveError } = await addMember(memberData);

      if (!success) {
        setError(saveError?.message || "Failed to save member details");
        setLoading(false);
        return;
      }

      // Member saved successfully - now complete onboarding and redirect
      if (onComplete) {
        await onComplete();
      }
      // Note: onComplete will redirect to home, so no need to setLoading(false)
    } catch (err) {
      console.error("Error adding member:", err);
      setError(err.message);
      setLoading(false);
    }
  };

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
            Add Your Details
          </span>
        </h2>
        <p className="text-white/70 text-sm md:text-base">
          Enter your details to get started
        </p>
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

      {/* Member Form */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className="mb-6 p-6 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 border border-cyan-400/20 rounded-xl"
      >
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-cyan-400" />
          Your Details
        </h3>
        {!profileReady ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-8 h-8 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin mb-3" />
            <p className="text-white/70 text-sm">Setting up your profile...</p>
          </div>
        ) : (
          <FamilyMemberForm
            onSubmit={handleAddMember}
            loading={loading}
            currentMemberCount={0}
            submitButtonText="Save & Access Platform"
          />
        )}
      </motion.div>
    </motion.div>
  );
}
