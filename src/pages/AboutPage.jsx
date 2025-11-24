import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Star, Zap, Users, BookOpen, Shield, ChevronRight } from "lucide-react";
import CosmicBackground from "../components/CosmicBackground";

// Scroll Reveal Component
const ScrollReveal = ({ children, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

export default function AboutPage() {
  const year = new Date().getFullYear();
  const navigate = useNavigate();

  const handleBackToLogin = () => {
    navigate('/login');
  };

  return (
    <CosmicBackground density={140} useVideo={true}>
      <div className="min-h-screen relative px-4 md:px-6 py-6">
        <div className="max-w-5xl mx-auto relative z-10">
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

          {/* Hero Section */}
          <ScrollReveal>
            <div className="relative w-full mb-12 overflow-hidden rounded-xl border border-cyan-500/20 bg-gradient-to-b from-cyan-950/40 via-gray-950 to-black p-12">
              <div className="absolute inset-0" style={{
                backgroundImage: `
                  linear-gradient(to right, rgba(34, 211, 238, 0.1) 1px, transparent 1px),
                  linear-gradient(to bottom, rgba(34, 211, 238, 0.1) 1px, transparent 1px)
                `,
                backgroundSize: '40px 40px',
                transform: 'perspective(500px) rotateX(60deg)',
                transformOrigin: 'center bottom'
              }} />

              <div className="relative z-10 text-center">
                <h1 className="text-5xl lg:text-7xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-500 mb-4">
                  About KarmAnk™
                </h1>
                <div className="h-1.5 w-48 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-full mx-auto mb-6 blur-[1px]"></div>
                <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed">
                  The modern expression of <strong className="text-cyan-300">Vedic Ank Shashtra</strong> — an elegant blend of ancient numerological wisdom and cosmic technology
                </p>
              </div>
            </div>
          </ScrollReveal>

          {/* What is KarmAnk */}
          <ScrollReveal delay={200}>
            <article className="group relative rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-2xl overflow-hidden transition-all duration-500 hover:border-cyan-400/50 hover:shadow-[0_0_50px_-12px_rgba(34,211,238,0.3)] mb-8">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/10 text-cyan-300 shadow-inner">
                    <Star size={28} className="animate-pulse" style={{ animationDuration: '3s' }} />
                  </div>
                  <h2 className="text-3xl font-semibold text-white">What is KarmAnk?</h2>
                </div>
                <p className="text-white/90 leading-relaxed text-lg">
                  KarmAnk stands for <em className="text-cyan-300 not-italic font-serif text-xl">Karma × Ank (Numbers)</em> — your energetic blueprint captured through numbers. We provide numerology reports, life-path analyses, compatibility assessments, and karmic cycle forecasts — each generated using <span className="text-cyan-300">Vedic Ank Shashtra</span> principles and refined by modern algorithmic tools.
                </p>
              </div>
            </article>
          </ScrollReveal>

          {/* How KarmAnk Works */}
          <ScrollReveal delay={400}>
            <article className="group relative rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-2xl overflow-hidden transition-all duration-500 hover:border-cyan-400/50 hover:shadow-[0_0_50px_-12px_rgba(34,211,238,0.3)] mb-8">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/10 text-cyan-300 shadow-inner">
                    <Zap size={28} className="animate-pulse" style={{ animationDuration: '3s' }} />
                  </div>
                  <h2 className="text-3xl font-semibold text-white">How KarmAnk Works</h2>
                </div>

                {/* Timeline */}
                <ol className="relative border-l-2 border-cyan-500/30 ml-4 space-y-12">
                  {[
                    { title: "Collect", desc: "You provide basic inputs like name and date of birth (and optional time/place)." },
                    { title: "Compute", desc: "Our engine applies Vedic Ank Shashtra algorithms to convert inputs into numerological patterns." },
                    { title: "Interpret", desc: "AI-assisted interpretation translates numerical maps into clear, personalised narratives." },
                    { title: "Deliver", desc: "Instant, beautifully formatted digital reports you can save, share, or revisit anytime." }
                  ].map((step, idx) => (
                    <li key={idx} className="ml-8 relative group/step">
                      <span className="absolute flex items-center justify-center w-10 h-10 bg-black border-2 border-cyan-500 rounded-full -left-[3.25rem] top-0 ring-4 ring-black shadow-[0_0_15px_rgba(34,211,238,0.5)] transition-transform group-hover/step:scale-110">
                        <span className="text-cyan-300 text-sm font-bold">{idx + 1}</span>
                      </span>
                      <h3 className="font-semibold text-cyan-100 text-xl mb-2 flex items-center gap-2">
                        {step.title}
                        <ChevronRight size={16} className="opacity-0 group-hover/step:opacity-100 transition-opacity text-cyan-500" />
                      </h3>
                      <p className="text-lg text-gray-300">{step.desc}</p>
                    </li>
                  ))}
                </ol>
              </div>
            </article>
          </ScrollReveal>

          {/* Why KarmAnk is Different */}
          <ScrollReveal delay={600}>
            <article className="group relative rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-2xl overflow-hidden transition-all duration-500 hover:border-cyan-400/50 hover:shadow-[0_0_50px_-12px_rgba(34,211,238,0.3)] mb-8">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/10 text-cyan-300 shadow-inner">
                    <Users size={28} className="animate-pulse" style={{ animationDuration: '3s' }} />
                  </div>
                  <h2 className="text-3xl font-semibold text-white">Why KarmAnk is Different</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-x-12 gap-y-10 text-white/90">
                  {[
                    { title: "Authentic Foundations", desc: "Built on the authentic teachings of Vedic Ank Shashtra — not random numerology." },
                    { title: "Modern Accuracy", desc: "Advanced algorithms ensure precision and remove the errors of manual calculation." },
                    { title: "AI-Assisted Insights", desc: "AI helps convert numbers into readable, practical guidance while preserving spiritual context." },
                    { title: "Comprehensive Compatibility", desc: "Analysis extends across relationship types — romantic, familial, professional, and more." }
                  ].map((item, idx) => (
                    <div key={idx} className="space-y-3">
                      <h3 className="font-medium text-cyan-100 text-lg flex items-center gap-3">
                        <div className="w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_10px_#22D3EE]"/>
                        {item.title}
                      </h3>
                      <p className="text-gray-300 leading-relaxed pl-5 border-l border-white/10">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          </ScrollReveal>

          {/* Core Features */}
          <ScrollReveal delay={800}>
            <article className="group relative rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-2xl overflow-hidden transition-all duration-500 hover:border-cyan-400/50 hover:shadow-[0_0_50px_-12px_rgba(34,211,238,0.3)] mb-8">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/10 text-cyan-300 shadow-inner">
                    <BookOpen size={28} className="animate-pulse" style={{ animationDuration: '3s' }} />
                  </div>
                  <h2 className="text-3xl font-semibold text-white">Core Features</h2>
                </div>

                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white/90">
                  {[
                    "Life Path & Destiny Reports",
                    "Personality & Behavioural Profiles",
                    "Multi-dimensional Compatibility",
                    "Daily/Monthly Forecasts",
                    "Karmic Cycle Tracking",
                    "Secure Account Management"
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-gray-300 text-lg p-3 rounded-xl hover:bg-white/5 transition-colors">
                      <span className="text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">✦</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          </ScrollReveal>

          {/* Privacy & Ethics */}
          <ScrollReveal delay={1000}>
            <article className="group relative rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-2xl overflow-hidden transition-all duration-500 hover:border-cyan-400/50 hover:shadow-[0_0_50px_-12px_rgba(34,211,238,0.3)] mb-8">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/10 text-cyan-300 shadow-inner">
                    <Shield size={28} className="animate-pulse" style={{ animationDuration: '3s' }} />
                  </div>
                  <h2 className="text-3xl font-semibold text-white">Privacy & Ethics</h2>
                </div>
                <p className="text-white/90 leading-relaxed text-lg">
                  KarmAnk treats your data with utmost care. Inputs are used only to generate your readings and for product improvement. We follow industry-standard security practices and a privacy-first design philosophy — see our <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-cyan-300 hover:text-cyan-200 underline font-semibold">Privacy Policy</a> for details.
                </p>
              </div>
            </article>
          </ScrollReveal>

          {/* Action Buttons */}
          <ScrollReveal delay={1200}>
            <div className="flex flex-col sm:flex-row items-center gap-6 mt-12 pt-12 border-t border-white/10">
              <button
                onClick={handleBackToLogin}
                className="w-full sm:w-auto group relative bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold py-4 px-10 rounded-full shadow-[0_0_30px_-5px_rgba(34,211,238,0.5)] hover:shadow-[0_0_50px_-5px_rgba(34,211,238,0.6)] hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 overflow-hidden"
              >
                <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></span>
                <ArrowLeft size={20} className="relative z-10" />
                <span className="relative z-10">Return to Dashboard</span>
              </button>

              <button
                onClick={() => navigate('/terms')}
                className="w-full sm:w-auto group relative border border-cyan-500/30 bg-black/40 text-cyan-100 hover:bg-cyan-500/10 py-4 px-10 rounded-full font-medium transition-all duration-300 hover:border-cyan-400 backdrop-blur-md overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
                <span className="relative z-10">View Terms & Policies</span>
              </button>
            </div>
          </ScrollReveal>

          {/* Footer */}
          <p className="mt-24 text-sm text-white/40 text-center">
            © {year} KarmAnk™ — Where ancient wisdom meets cosmic technology
          </p>
        </div>
      </div>
    </CosmicBackground>
  );
}
