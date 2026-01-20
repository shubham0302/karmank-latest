import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, MessageSquare, Send, Star, Sparkles, Heart, Lightbulb, AlertCircle, CheckCircle2, AlertTriangle, Upload, Image, X } from "lucide-react";
import CosmicBackground from "../components/CosmicBackground";
import { GradientText, gradientUtils } from "../components/GradientText";
import { useAuth } from "../contexts/AuthContext";
import { feedbackService } from "../services/feedbackService";

export default function FeedbackPage() {
  const year = new Date().getFullYear();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    category: "general",
    rating: 0,
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [attachmentUrl, setAttachmentUrl] = useState(null);

  const handleBackToLogin = () => {
    navigate('/login');
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type)) {
      setErrorMessage('Only image files (JPEG, PNG, GIF, WebP) are allowed');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('File size must be less than 5MB');
      return;
    }

    setSelectedFile(file);
    setErrorMessage(null);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setAttachmentUrl(null);
  };

  const handleUploadImage = async () => {
    if (!selectedFile) return;

    setUploadingImage(true);
    setErrorMessage(null);

    try {
      // Use a temporary ID for initial upload
      const tempId = `temp-${Date.now()}`;
      const result = await feedbackService.uploadImage(selectedFile, tempId);

      if (!result.success) {
        setErrorMessage(result.error);
        setUploadingImage(false);
        return;
      }

      setAttachmentUrl(result.url);
      setUploadingImage(false);
    } catch (error) {
      console.error('Error uploading image:', error);
      setErrorMessage(error.message || 'Failed to upload image');
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      // If there's a selected file but not uploaded yet, upload it first
      let finalAttachmentUrl = attachmentUrl;
      if (selectedFile && !attachmentUrl) {
        const tempId = `temp-${Date.now()}`;
        const uploadResult = await feedbackService.uploadImage(selectedFile, tempId);

        if (!uploadResult.success) {
          setErrorMessage(uploadResult.error);
          setLoading(false);
          return;
        }

        finalAttachmentUrl = uploadResult.url;
      }

      // Submit feedback with optional attachment
      const feedbackDataWithAttachment = {
        ...formData,
        attachmentUrl: finalAttachmentUrl
      };

      const result = await feedbackService.submitFeedback(feedbackDataWithAttachment, user?.id);

      if (!result.success) {
        setErrorMessage(result.error);
        setLoading(false);
        return;
      }

      // Show success message
      setSubmitted(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setErrorMessage(error.message || 'Failed to submit feedback. Please try again.');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const categories = [
    { value: "general", label: "General Feedback", icon: MessageSquare },
    { value: "feature", label: "Feature Request", icon: Lightbulb },
    { value: "bug", label: "Bug Report", icon: AlertCircle },
    { value: "appreciation", label: "Appreciation", icon: Heart }
  ];

  return (
    <CosmicBackground density={140} useVideo={true}>
      <div className="min-h-screen relative px-4 md:px-6 py-6">
        <div className="max-w-4xl mx-auto relative z-10">
          {/* Back Button */}
          <div className="flex justify-end items-center mb-6">
            <button
              onClick={handleBackToLogin}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/30 px-4 py-2 rounded-md text-sm font-medium transition duration-200"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Login
            </button>
          </div>

          {/* Futuristic Gate Header */}
          <div className="relative w-full h-40 mb-8 overflow-hidden rounded-xl border border-cyan-500/20">
            <div className="absolute inset-0 bg-gradient-to-b from-cyan-950/40 via-gray-950 to-black" />
            <div className="absolute inset-0" style={{
              backgroundImage: `
                linear-gradient(to right, rgba(34, 211, 238, 0.1) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(34, 211, 238, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px',
              transform: 'perspective(500px) rotateX(60deg)',
              transformOrigin: 'center bottom'
            }} />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center space-y-2 relative z-10">
                <div className="text-4xl font-bold">
                  <GradientText as="span" size="4xl" className="font-serif">
                    KarmAnk
                  </GradientText>
                  <sup className={`text-2xl -top-2 ${gradientUtils.text}`}>
                    ™
                  </sup>
                </div>
                <div className="text-sm text-cyan-400/60 tracking-widest">
                  FEEDBACK PORTAL
                </div>
                <div className="flex items-center justify-center gap-2 mt-3">
                  <div className="h-px w-16 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent"></div>
                  <div className="text-xs text-cyan-400/40">★</div>
                  <div className="h-px w-16 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent"></div>
                </div>
                <p className="text-xs text-cyan-400/40 mt-3">
                  Your Voice Shapes Our Cosmic Journey
                </p>
              </div>
            </div>
          </div>

          {/* Motivational Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-r from-purple-900/20 to-cyan-900/20 border border-purple-500/30 rounded-xl p-6 mb-8 backdrop-blur-md"
          >
            <div className="flex items-start gap-4">
              <Heart className="h-6 w-6 text-purple-400 flex-shrink-0 mt-1 animate-pulse" />
              <div>
                <h3 className="text-lg font-bold text-purple-300 mb-2">Help Us Grow</h3>
                <p className="text-purple-100/80 text-sm leading-relaxed">
                  Your insights help us improve KarmAnk™ and create a better cosmic experience for everyone.
                  Every piece of feedback contributes to our collective journey through the stars.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Feedback Form */}
          <div className="bg-gray-900/60 backdrop-blur-md rounded-xl border border-cyan-500/20 shadow-2xl p-8">
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 bg-red-500/20 border border-red-400/50 rounded-lg p-4 backdrop-blur-sm"
              >
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-red-300 text-sm font-medium">{errorMessage}</p>
                </div>
              </motion.div>
            )}
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center py-12"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="inline-block p-6 rounded-full bg-gradient-to-r from-green-500/20 to-cyan-500/20 border border-green-400/30 mb-6"
                >
                  <CheckCircle2 className="h-16 w-16 text-green-400" />
                </motion.div>
                <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-400 mb-4">
                  Feedback Received! ✨
                </h2>
                <p className="text-white/70 text-lg mb-2">
                  Thank you for sharing your cosmic insights
                </p>
                <p className="text-cyan-400/60 text-sm">
                  Redirecting you back to the portal...
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Name & Email Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <label className="block text-cyan-300 font-semibold mb-2 text-sm uppercase tracking-wide">
                      Your Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-white/5 border border-cyan-500/30 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 transition-all"
                      placeholder="Enter your name"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <label className="block text-cyan-300 font-semibold mb-2 text-sm uppercase tracking-wide">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-white/5 border border-cyan-500/30 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 transition-all"
                      placeholder="your@email.com"
                    />
                  </motion.div>
                </div>

                {/* Category Selection */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <label className="block text-cyan-300 font-semibold mb-3 text-sm uppercase tracking-wide">
                    Feedback Category
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {categories.map((category) => {
                      const Icon = category.icon;
                      return (
                        <button
                          key={category.value}
                          type="button"
                          onClick={() => setFormData({ ...formData, category: category.value })}
                          className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                            formData.category === category.value
                              ? 'bg-cyan-500/20 border-cyan-400 shadow-lg shadow-cyan-500/30'
                              : 'bg-white/5 border-white/20 hover:border-cyan-400/50 hover:bg-white/10'
                          }`}
                        >
                          <Icon className={`h-6 w-6 mx-auto mb-2 ${
                            formData.category === category.value ? 'text-cyan-300' : 'text-white/60'
                          }`} />
                          <span className={`text-xs font-medium ${
                            formData.category === category.value ? 'text-cyan-200' : 'text-white/70'
                          }`}>
                            {category.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>

                {/* Star Rating */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <label className="block text-cyan-300 font-semibold mb-3 text-sm uppercase tracking-wide">
                    Rate Your Experience
                  </label>
                  <div className="flex items-center gap-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFormData({ ...formData, rating: star })}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        className="transform transition-all duration-200 hover:scale-125"
                      >
                        <Star
                          className={`h-8 w-8 transition-all duration-200 ${
                            star <= (hoveredRating || formData.rating)
                              ? 'text-yellow-400 fill-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]'
                              : 'text-white/30'
                          }`}
                        />
                      </button>
                    ))}
                    {formData.rating > 0 && (
                      <span className="ml-3 text-cyan-300 font-medium">
                        {formData.rating === 5 ? 'Cosmic! ✨' :
                         formData.rating === 4 ? 'Great! 🌟' :
                         formData.rating === 3 ? 'Good 👍' :
                         formData.rating === 2 ? 'Okay 😐' : 'Needs Work 🔧'}
                      </span>
                    )}
                  </div>
                </motion.div>

                {/* Message */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <label className="block text-cyan-300 font-semibold mb-2 text-sm uppercase tracking-wide">
                    Your Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 bg-white/5 border border-cyan-500/30 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 transition-all resize-none"
                    placeholder="Share your thoughts, suggestions, or experiences with KarmAnk™..."
                  />
                  <p className="text-white/50 text-xs mt-2">
                    Minimum 10 characters • Be specific to help us improve
                  </p>
                </motion.div>

                {/* Image Attachment */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.35 }}
                >
                  <label className="block text-cyan-300 font-semibold mb-3 text-sm uppercase tracking-wide">
                    Attach Screenshot (Optional)
                  </label>

                  {previewUrl ? (
                    <div className="relative bg-white/5 border border-cyan-500/30 rounded-lg p-4 mb-3">
                      <div className="relative inline-block">
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="max-w-xs max-h-48 rounded-lg border border-cyan-400/50"
                        />
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="mt-3 text-xs text-white/70">
                        {selectedFile?.name} • {(selectedFile?.size / 1024).toFixed(2)} KB
                      </div>
                      {!attachmentUrl && (
                        <button
                          type="button"
                          onClick={handleUploadImage}
                          disabled={uploadingImage}
                          className="mt-3 w-full px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/50 text-cyan-300 rounded-lg text-sm font-medium transition-all disabled:opacity-50"
                        >
                          {uploadingImage ? (
                            <>
                              <Sparkles className="h-4 w-4 inline animate-spin mr-2" />
                              Uploading...
                            </>
                          ) : (
                            <>
                              <Upload className="h-4 w-4 inline mr-2" />
                              Upload Image
                            </>
                          )}
                        </button>
                      )}
                      {attachmentUrl && (
                        <div className="mt-3 p-2 bg-green-500/20 border border-green-400/50 rounded text-green-300 text-xs text-center">
                          ✓ Image uploaded successfully
                        </div>
                      )}
                    </div>
                  ) : (
                    <label className="flex items-center justify-center w-full px-4 py-8 border-2 border-dashed border-cyan-500/30 rounded-lg hover:border-cyan-400/50 bg-white/5 hover:bg-white/10 transition-all cursor-pointer group">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                      <div className="text-center">
                        <Image className="h-8 w-8 text-cyan-400/60 mx-auto mb-2 group-hover:text-cyan-300 transition-colors" />
                        <p className="text-white/70 text-sm font-medium">Drop image here or click to browse</p>
                        <p className="text-white/50 text-xs mt-1">JPEG, PNG, GIF, WebP • Max 5MB</p>
                      </div>
                    </label>
                  )}
                </motion.div>

                {/* Submit Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <button
                    type="submit"
                    disabled={formData.message.length < 10 || formData.rating === 0 || loading}
                    className="w-full py-4 px-6 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white font-bold text-lg rounded-lg shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none flex items-center justify-center gap-3 group"
                  >
                    {loading ? (
                      <>
                        <Sparkles className="h-5 w-5 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                        Send Feedback to the Cosmos
                        <Sparkles className="h-5 w-5 group-hover:rotate-180 transition-transform duration-500" />
                      </>
                    )}
                  </button>
                </motion.div>

                {/* Privacy Note */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="text-center text-white/50 text-xs"
                >
                  Your feedback is confidential and will be used to improve KarmAnk™
                </motion.div>
              </form>
            )}

            {/* Footer */}
            <div className="pt-6 mt-8 border-t border-white/10">
              <div className="flex justify-between items-center text-sm text-cyan-400/60 mb-3">
                <button onClick={handleBackToLogin} className="hover:text-cyan-300 transition-colors">
                  ← Back to Login
                </button>
                <a href="/about" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-300 transition-colors underline">
                  About Us
                </a>
              </div>
              <p className="text-center text-xs text-cyan-400/40">© {year} KarmAnk™ - All Rights Reserved</p>
            </div>
          </div>
        </div>
      </div>
    </CosmicBackground>
  );
}
