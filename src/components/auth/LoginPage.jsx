import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Card from "../Card";

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
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background:
          "radial-gradient(circle at 50% 50%, rgba(23,20,69,1) 0%, rgba(12,10,42,1) 100%)",
      }}
    >
      <div className="w-full max-w-md">
        {/* Logo/Title */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-200 mb-2">
            KarmAnk
          </h1>
          <p className="text-gray-300 text-sm">Unlock Your Cosmic Destiny</p>
        </div>

        {/* Login Card */}
        <Card className="p-8">
          <h2 className="text-2xl font-semibold text-yellow-400 mb-6 text-center">
            {step === "email" ? "Sign In" : "Enter Code"}
          </h2>

          {/* Step 1: Email Input */}
          {step === "email" && (
            <form onSubmit={handleEmailSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-yellow-400 mb-2"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  disabled={loading}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition disabled:opacity-50 disabled:cursor-not-allowed"
                  required
                  autoComplete="email"
                />
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/50 rounded-md p-3">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-indigo-900 font-bold py-3 px-4 rounded-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {loading ? "Sending Code..." : "Send Code"}
              </button>

              <div className="text-center">
                <p className="text-gray-400 text-sm">
                  We'll send you a 6-digit code to sign in
                </p>
              </div>
            </form>
          )}

          {/* Step 2: OTP Input */}
          {step === "otp" && (
            <form onSubmit={handleOtpSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-yellow-400 mb-2">
                  Verification Code
                </label>
                <p className="text-gray-400 text-sm mb-3">
                  Enter the 6-digit code sent to{" "}
                  <span className="text-white font-medium">{email}</span>
                </p>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  placeholder="123456"
                  disabled={loading}
                  maxLength={6}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm p-3 text-white text-center text-2xl tracking-widest placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition disabled:opacity-50 disabled:cursor-not-allowed"
                  required
                  autoComplete="one-time-code"
                  autoFocus
                />
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/50 rounded-md p-3">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              {message && (
                <div className="bg-green-500/10 border border-green-500/50 rounded-md p-3">
                  <p className="text-green-400 text-sm">{message}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-indigo-900 font-bold py-3 px-4 rounded-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {loading ? "Verifying..." : "Verify Code"}
              </button>

              <div className="text-center space-y-3">
                <button
                  type="button"
                  onClick={handleBackToEmail}
                  className="text-gray-400 hover:text-yellow-400 text-sm transition"
                >
                  ← Use a different email
                </button>
                <p className="text-gray-500 text-xs">
                  Didn't receive the code? Check your spam folder or try again.
                </p>
              </div>
            </form>
          )}
        </Card>

        {/* Footer */}
        <div className="text-center mt-6 text-gray-500 text-xs">
          <p>Powered by Vedic Numerology</p>
        </div>
      </div>
    </div>
  );
}
