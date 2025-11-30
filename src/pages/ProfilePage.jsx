import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Plus, Users, Mail, LogOut } from "lucide-react";
import CosmicBackground from "../components/CosmicBackground";
import { useFamilyMembers } from "@/hooks/useFamilyMembers";
import { useAuth } from "@/contexts/AuthContext";
import FamilyMemberForm from "@/components/onboarding/FamilyMemberForm";
import MemberCard from "@/components/onboarding/MemberCard";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import GradientText from "../components/GradientText";

const MAX_MEMBERS = 3;
const TABS = {
  PROFILE: "profile",
  FAMILY: "family",
};

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const {
    members,
    loading,
    error: hookError,
    getFamilyMembersData,
    addMember,
  } = useFamilyMembers();

  const [activeTab, setActiveTab] = useState(TABS.PROFILE);
  const [showAddForm, setShowAddForm] = useState(false);
  const [addError, setAddError] = useState(null);
  const [addLoading, setAddLoading] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    getFamilyMembersData();
  }, []);

  const handleAddMember = async (formData) => {
    setAddLoading(true);
    setAddError(null);

    try {
      const { success, error } = await addMember(formData);

      if (!success) {
        setAddError(error?.message || "Failed to add family member");
        setAddLoading(false);
        return;
      }

      await getFamilyMembersData();
      setShowAddForm(false);
      setAddLoading(false);
    } catch (err) {
      console.error("Error adding member:", err);
      setAddError(err.message);
      setAddLoading(false);
    }
  };

  const handleSignOut = async () => {
    setSigningOut(true);
    await signOut();
  };

  const canAddMore = members.length < MAX_MEMBERS;
  const remainingSlots = MAX_MEMBERS - members.length;

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
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors mb-4"
            >
              <ArrowLeft className="h-5 w-5" />
              Back to Home
            </button>

            <GradientText as="h3" size="4xl" className="mb-3">
              My Profile
            </GradientText>

            {/* Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="flex gap-4 border-b border-white/10"
            >
              <button
                onClick={() => setActiveTab(TABS.PROFILE)}
                className={`px-4 py-3 font-semibold transition duration-200 border-b-2 flex items-center gap-2 ${
                  activeTab === TABS.PROFILE
                    ? "text-cyan-400 border-cyan-400"
                    : "text-white/60 hover:text-white/80 border-transparent"
                }`}
              >
                <Mail className="h-5 w-5" />
                Profile
              </button>
              <button
                onClick={() => setActiveTab(TABS.FAMILY)}
                className={`px-4 py-3 font-semibold transition duration-200 border-b-2 flex items-center gap-2 ${
                  activeTab === TABS.FAMILY
                    ? "text-cyan-400 border-cyan-400"
                    : "text-white/60 hover:text-white/80 border-transparent"
                }`}
              >
                <Users className="h-5 w-5" />
                Family Members
              </button>
            </motion.div>
          </motion.div>

          {/* Profile Tab */}
          {activeTab === TABS.PROFILE && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Profile Details Card */}
              <GlassCard className="bg-gradient-to-br from-cyan-500/10 to-blue-500/5 border-cyan-400/20">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {user?.email?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-white/70 text-sm">Email Address</p>
                      <p className="text-white font-semibold break-all">
                        {user?.email}
                      </p>
                    </div>
                  </div>

                  <motion.button
                    onClick={handleSignOut}
                    disabled={signingOut}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-500/20 to-red-500/10 hover:from-red-500/30 hover:to-red-500/20 text-red-300 border border-red-500/30 rounded-lg font-semibold transition duration-200 disabled:opacity-50"
                  >
                    <LogOut className="h-5 w-5" />
                    {signingOut ? "Logging Out..." : "Log Out"}
                  </motion.button>
                </div>
              </GlassCard>

              {/* Info Box */}
              <GlassCard className="bg-gradient-to-br from-purple-500/10 to-blue-500/5 border-purple-500/20 p-5">
                <h3 className="text-white font-semibold mb-3 text-sm">
                  💡 Profile Information
                </h3>
                <ul className="space-y-2 text-white/70 text-xs">
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 mt-0.5">✓</span>
                    <span>
                      Your profile contains your email and family member
                      information
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 mt-0.5">✓</span>
                    <span>All data is securely stored and encrypted</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 mt-0.5">✓</span>
                    <span>
                      You can add up to {MAX_MEMBERS} family members total
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 mt-0.5">✓</span>
                    <span>Sign out to log out from this device</span>
                  </li>
                </ul>
              </GlassCard>
            </motion.div>
          )}

          {/* Family Members Tab */}
          {activeTab === TABS.FAMILY && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Family Members Count */}
              {members.length > 0 && (
                <div className="flex items-center justify-between">
                  <p className="text-white/70">Family Members</p>
                  <span className="text-cyan-400 font-semibold">
                    {members.length}/{MAX_MEMBERS}
                  </span>
                </div>
              )}

              {/* Error Message */}
              {hookError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-300 text-sm"
                >
                  <p>Error loading family members: {hookError}</p>
                </motion.div>
              )}

              {/* Loading State */}
              {loading && (
                <div className="flex justify-center items-center py-12">
                  <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-cyan-400 mb-3"></div>
                    <p className="text-white/70 text-sm">
                      Loading family members...
                    </p>
                  </div>
                </div>
              )}

              {/* Saved Members List */}
              {!loading && members.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-3"
                >
                  {members.map((member, index) => (
                    <MemberCard key={member.id} member={member} index={index} />
                  ))}
                </motion.div>
              )}

              {/* Empty State */}
              {!loading && members.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-8 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 border border-cyan-400/20 rounded-xl text-center"
                >
                  <div className="text-4xl mb-3">👨‍👩‍👧</div>
                  <p className="text-white/70 mb-2">No family members yet</p>
                  <p className="text-white/50 text-sm">
                    Add your first family member to get started
                  </p>
                </motion.div>
              )}

              {/* Add More Members Section */}
              {canAddMore && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div>
                    <p className="text-white/70 text-sm text-center mb-3">
                      {remainingSlots === 1
                        ? `You can add 1 more member`
                        : `You can add ${remainingSlots} more members`}
                    </p>
                    {!showAddForm && (
                      <Button
                        onClick={() => setShowAddForm(true)}
                        className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold py-2 rounded-lg flex items-center justify-center gap-2"
                      >
                        <Plus className="h-5 w-5" />
                        Add Family Member
                      </Button>
                    )}
                  </div>

                  {/* Add Form */}
                  {showAddForm && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="p-5 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 border border-cyan-400/20 rounded-xl"
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

                      <div className="flex gap-3 justify-between mt-4">
                        <Button
                          onClick={() => {
                            setShowAddForm(false);
                            setAddError(null);
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

              {/* Max Members Message */}
              {!canAddMore && members.length === MAX_MEMBERS && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-300 text-center text-sm"
                >
                  <p className="font-semibold">
                    Maximum family members reached
                  </p>
                  <p className="text-amber-200 text-xs mt-1">
                    You have added the maximum of {MAX_MEMBERS} members
                  </p>
                </motion.div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </CosmicBackground>
  );
}
