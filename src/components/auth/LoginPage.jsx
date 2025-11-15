import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import CosmicBackground from "../CosmicBackground";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { GlassCard } from "../ui/glass-card";
import { Sparkles, Crown, Mail, KeyRound } from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [step, setStep] = useState("email"); // 'email' or 'otp'
  const { user, signInWithOtp, verifyOtp } = useAuth();

  // Redirect to home if already authenticated
  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    // Basic email validation
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    const { error } = await signInWithOtp(email);

    if (error) {
      // Customize error messages for better UX
      if (error.message.toLowerCase().includes("rate limit")) {
        setError("Too many attempts. Please try again in a few minutes.");
      } else if (error.message.toLowerCase().includes("email")) {
        setError("Failed to send code. Please check your email address.");
      } else {
        setError(error.message);
      }
      setLoading(false);
    } else {
      setMessage("Check your email for the 6-digit code!");
      setStep("otp");
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    // Validate OTP
    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit code");
      setLoading(false);
      return;
    }

    const { error } = await verifyOtp(email, otp);

    if (error) {
      // Customize error messages for better UX
      if (
        error.message.toLowerCase().includes("token") ||
        error.message.toLowerCase().includes("expired") ||
        error.message.toLowerCase().includes("invalid")
      ) {
        setError("OTP is invalid or expired.");
      } else {
        setError(error.message);
      }
      setLoading(false);
    } else {
      setMessage("Successfully authenticated!");
      // User will be automatically redirected by the auth state change
    }
  };

  const handleBackToEmail = () => {
    setStep("email");
    setOtp("");
    setError(null);
    setMessage(null);
  };

  return (
    <CosmicBackground density={180}>
      <div className="min-h-screen relative flex items-center justify-center p-4">
        <div className="container mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
          {/* Branding */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="text-center lg:text-left space-y-8"
          >
            <div className="space-y-6">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                className="relative"
              >
                <h1
                  className="text-6xl lg:text-8xl font-serif font-bold leading-tight tracking-tight bg-clip-text text-transparent"
                  style={{
                    backgroundImage: 'linear-gradient(135deg, hsl(44, 91%, 69%), hsl(261, 100%, 75%))',
                  }}
                >
                  KarmAnk
                </h1>
                <div className="absolute -top-2 -right-2 lg:-top-4 lg:-right-4">
                  <Crown className="h-8 w-8 lg:h-12 lg:w-12 text-auric-gold animate-pulse" />
                </div>
              </motion.div>

              {/* Tagline */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="text-xl lg:text-2xl font-light italic text-gradient"
              >
                Cosmic Numerology, Reimagined.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="space-y-6"
            >
              {/* Paragraph */}
              <p className="text-lg lg:text-xl font-light leading-relaxed text-gradient">
                Unlock the mysteries of the universe through authentic Vedic numerology, sacred geometry, and cosmic wisdom.
              </p>

              {/* Feature List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm lg:text-base">
                {[
                  "Vedic Compatibility Analysis",
                  "Sacred Name Vibrations",
                  "Krishna Gita Wisdom",
                  "Cosmic Kundli Insights",
                ].map((feature, i) => (
                  <motion.div
                    key={feature}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 1.2 + i * 0.1 }}
                    className="flex items-center gap-3 group"
                  >
                    <Sparkles className="h-5 w-5 text-auric-gold group-hover:scale-110 transition-transform duration-200" />
                    <span className="text-gradient group-hover:opacity-90 transition-opacity">
                      {feature}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.8 }}
              className="text-xs text-white/40 font-light"
            >
              © {new Date().getFullYear()} KarmAnk - Sacred Technology
            </motion.div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.0, ease: "easeOut", delay: 0.4 }}
            className="flex justify-center lg:justify-end"
          >
            <GlassCard variant="elevated" size="lg" className="w-full max-w-md">
              <motion.div
                className="space-y-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <div className="text-center space-y-4">
                  <motion.div
                    className="flex justify-center"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="p-4 rounded-full bg-gradient-auric shadow-2xl shadow-auric-gold/50">
                      <Crown className="h-8 w-8 text-cosmic-blue" />
                    </div>
                  </motion.div>

                  <div>
                    <h2 className="text-3xl font-serif font-bold text-white mb-2">
                      {step === "email" ? "Welcome" : "Verify Code"}
                    </h2>
                    <p className="text-sm text-white/70">
                      {step === "email"
                        ? "Enter your email to receive a magic code"
                        : "Enter the 6-digit code sent to your email"
                      }
                    </p>
                  </div>
                </div>

                {/* Step 1: Email Input */}
                {step === "email" && (
                  <form onSubmit={handleEmailSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-white/90 font-semibold">
                        Email Address
                      </Label>
                      <div className="relative group">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-auric-gold/60 group-focus-within:text-auric-gold transition-colors" />
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="your.cosmic.email@domain.com"
                          className="bg-white/10 backdrop-blur-sm border-white/20 focus:border-auric-gold focus:ring-2 focus:ring-auric-gold/30 text-white placeholder:text-white/40 h-14 pl-11 text-base shadow-lg hover:bg-white/15 transition-all"
                          disabled={loading}
                          required
                          autoComplete="email"
                          aria-invalid={!!error}
                          aria-describedby={error ? "email-error" : undefined}
                        />
                      </div>
                      {error && <p id="email-error" className="text-sm text-red-400 mt-1" role="alert">{error}</p>}
                    </div>

                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        type="submit"
                        className="w-full h-14 hover:shadow-2xl hover:shadow-auric-gold/50 text-white font-bold text-lg relative overflow-hidden transition-all duration-300"
                        style={{
                          background: 'linear-gradient(135deg, hsl(44, 85%, 50%), hsl(261, 85%, 55%))',
                        }}
                        disabled={loading}
                      >
                        <motion.span
                          animate={loading ? { opacity: [1, 0.5, 1] } : {}}
                          transition={{ duration: 1, repeat: loading ? Infinity : 0 }}
                          className="flex items-center justify-center gap-2"
                        >
                          {loading ? (
                            <>
                              <Sparkles className="h-5 w-5 animate-spin" />
                              Sending Magic Code...
                            </>
                          ) : (
                            "Send Magic Code ✨"
                          )}
                        </motion.span>
                      </Button>
                    </motion.div>

                    <div className="text-center">
                      <p className="text-white/60 text-sm">
                        We'll send you a 6-digit code to sign in
                      </p>
                    </div>
                  </form>
                )}

                {/* Step 2: OTP Input */}
                {step === "otp" && (
                  <form onSubmit={handleOtpSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label className="text-white/90 font-semibold">
                        Verification Code
                      </Label>
                      <p className="text-white/70 text-sm mb-3">
                        Enter the 6-digit code sent to{" "}
                        <span className="text-auric-gold font-semibold">{email}</span>
                      </p>
                      <div className="relative group">
                        <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-auric-gold/60 group-focus-within:text-auric-gold transition-colors" />
                        <Input
                          type="text"
                          value={otp}
                          onChange={(e) =>
                            setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                          }
                          placeholder="● ● ● ● ● ●"
                          disabled={loading}
                          maxLength={6}
                          className="bg-white/10 backdrop-blur-sm border-white/20 focus:border-auric-gold focus:ring-2 focus:ring-auric-gold/30 text-white text-center text-3xl tracking-[1rem] placeholder:text-white/30 h-16 pl-14 font-bold shadow-lg hover:bg-white/15 transition-all"
                          required
                          autoComplete="one-time-code"
                          autoFocus
                          aria-invalid={!!error}
                          aria-describedby={error ? "otp-error" : message ? "otp-success" : undefined}
                        />
                      </div>
                      {error && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-red-500/20 border border-red-400/50 rounded-lg p-3 mt-2 backdrop-blur-sm"
                        >
                          <p id="otp-error" className="text-red-300 text-sm font-medium" role="alert">{error}</p>
                        </motion.div>
                      )}
                      {message && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-green-500/20 border border-green-400/50 rounded-lg p-3 mt-2 backdrop-blur-sm"
                        >
                          <p id="otp-success" className="text-green-300 text-sm font-medium flex items-center justify-center gap-2">
                            <Sparkles className="h-4 w-4" />
                            {message}
                          </p>
                        </motion.div>
                      )}
                    </div>

                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        type="submit"
                        disabled={loading || otp.length !== 6}
                        className="w-full h-14 hover:shadow-2xl hover:shadow-auric-gold/50 text-white font-bold text-lg relative overflow-hidden transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{
                          background: 'linear-gradient(135deg, hsl(44, 85%, 50%), hsl(261, 85%, 55%))',
                        }}
                      >
                        <motion.span
                          animate={loading ? { opacity: [1, 0.5, 1] } : {}}
                          transition={{ duration: 1, repeat: loading ? Infinity : 0 }}
                          className="flex items-center justify-center gap-2"
                        >
                          {loading ? (
                            <>
                              <Crown className="h-5 w-5 animate-pulse" />
                              Verifying...
                            </>
                          ) : (
                            <>
                              <Crown className="h-5 w-5" />
                              Enter the Cosmos
                            </>
                          )}
                        </motion.span>
                      </Button>
                    </motion.div>

                    <div className="text-center space-y-3">
                      <button
                        type="button"
                        onClick={handleBackToEmail}
                        className="text-white/60 hover:text-auric-gold text-sm transition-colors font-medium"
                      >
                        ← Use a different email
                      </button>
                      <p className="text-white/50 text-xs">
                        Didn't receive the code? Check your spam folder or try again.
                      </p>
                    </div>
                  </form>
                )}

                {/* Success message for email step */}
                {step === "email" && message && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-green-500/20 border border-green-400/50 rounded-lg p-4 backdrop-blur-sm"
                  >
                    <p className="text-green-300 text-sm text-center font-medium flex items-center justify-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      {message}
                    </p>
                  </motion.div>
                )}

                {/* Footer */}
                <div className="pt-2 text-center text-xs text-white/40">
                  <p className="flex items-center justify-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    Powered by Vedic Numerology
                  </p>
                </div>
              </motion.div>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </CosmicBackground>
  );
}
