import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Scale, FileText } from "lucide-react";
import CosmicBackground from "../components/CosmicBackground";

export default function TermsPage() {
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
                <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-500">
                  KarmAnk™
                </div>
                <div className="text-sm text-cyan-400/60 tracking-widest">
                  TERMS & CONDITIONS
                </div>
                <div className="flex items-center justify-center gap-2 mt-3">
                  <div className="h-px w-16 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent"></div>
                  <div className="text-xs text-cyan-400/40">★</div>
                  <div className="h-px w-16 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent"></div>
                </div>
                <p className="text-xs text-cyan-400/40 mt-3">
                  Last updated: {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Important Disclaimer */}
          <div className="bg-gradient-to-r from-amber-900/20 to-orange-900/20 border border-amber-500/30 rounded-xl p-6 mb-8 backdrop-blur-md">
            <div className="flex items-start gap-4">
              <Scale className="h-6 w-6 text-amber-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-bold text-amber-300 mb-2">Legal Agreement</h3>
                <p className="text-amber-100/80 text-sm leading-relaxed">
                  By accessing or using KarmAnk™, you acknowledge that you have read, understood, and agree to be legally bound by these Terms & Conditions. KarmAnk™ provides interpretative numerological insights based on Vedic Ank Shashtra. These are not scientifically validated predictions. Please read carefully before proceeding.
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="bg-gray-900/60 backdrop-blur-md rounded-xl border border-cyan-500/20 shadow-2xl p-8">

        {/* Table of Contents */}
        <div className="mb-8 rounded-xl border border-cyan-500/20 bg-cyan-900/10 p-5 backdrop-blur-xl">
          <p className="mb-2 text-sm uppercase tracking-wider text-cyan-400/60">On this page</p>
          <nav className="grid gap-2 text-sm text-cyan-100/70">
            <a href="#acceptance" className="hover:text-cyan-300 transition-colors">Acceptance of Terms</a>
            <a href="#definitions" className="hover:text-cyan-300 transition-colors">Definitions</a>
            <a href="#eligibility" className="hover:text-cyan-300 transition-colors">Eligibility</a>
            <a href="#accounts" className="hover:text-cyan-300 transition-colors">Accounts & Security</a>
            <a href="#use" className="hover:text-cyan-300 transition-colors">Use of Service</a>
            <a href="#license" className="hover:text-cyan-300 transition-colors">License & Restrictions</a>
            <a href="#payments" className="hover:text-cyan-300 transition-colors">Payments & Subscriptions</a>
            <a href="#content" className="hover:text-cyan-300 transition-colors">Interpretative Content</a>
            <a href="#ip" className="hover:text-cyan-300 transition-colors">Intellectual Property</a>
            <a href="#thirdparty" className="hover:text-cyan-300 transition-colors">Third-Party Services</a>
            <a href="#disclaimer" className="hover:text-cyan-300 transition-colors">Disclaimers</a>
            <a href="#liability" className="hover:text-cyan-300 transition-colors">Limitation of Liability</a>
            <a href="#indemnity" className="hover:text-cyan-300 transition-colors">Indemnification</a>
            <a href="#termination" className="hover:text-cyan-300 transition-colors">Termination</a>
            <a href="#laws" className="hover:text-cyan-300 transition-colors">Governing Law</a>
            <a href="#changes" className="hover:text-cyan-300 transition-colors">Changes to Terms</a>
            <a href="#misc" className="hover:text-cyan-300 transition-colors">Miscellaneous</a>
          </nav>
        </div>

        {/* Full Policy */}
        <div className="space-y-10 leading-relaxed text-white/80">

          {/* Acceptance */}
          <section id="acceptance">
            <h2 className="text-xl font-semibold mb-3 text-cyan-300">Acceptance of Terms</h2>
            <p>
              By accessing or using KarmAnk ("we", "us", "our", "Platform"), you acknowledge that you
              have read, understood, and agree to be bound by these Terms & Conditions.
              If you do not agree, you must discontinue use immediately.
            </p>
          </section>

          {/* Definitions */}
          <section id="definitions">
            <h2 className="text-xl font-semibold mb-3 text-cyan-300">Definitions</h2>
            <p><strong>"KarmAnk"</strong> refers to the application and website providing numerology-based insights built on Vedic Ank Shashtra.</p>
            <p><strong>"Services"</strong> include numerology readings, vibration analyses, compatibility reports, forecasts, and all related digital outputs.</p>
            <p><strong>"User"</strong> refers to any individual accessing or using the Services.</p>
            <p><strong>"Content"</strong> includes interpretations, scores, insights, charts, visuals, and all generated material.</p>
          </section>

          {/* Eligibility */}
          <section id="eligibility">
            <h2 className="text-xl font-semibold mb-3 text-cyan-300">Eligibility</h2>
            <p>
              You must be at least 18 years old or have legal parental/guardian consent to use this platform.
              By using the service, you confirm you have the legal capacity to enter this agreement.
            </p>
          </section>

          {/* Accounts */}
          <section id="accounts">
            <h2 className="text-xl font-semibold mb-3 text-cyan-300">Accounts & Security</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>You are responsible for maintaining confidentiality of your login credentials.</li>
              <li>All activity conducted under your account is your responsibility.</li>
              <li>You must notify us of any unauthorized access immediately.</li>
              <li>We may suspend or terminate accounts suspected of misuse, fraud, or violation of these terms.</li>
            </ul>
          </section>

          {/* Use of Service */}
          <section id="use">
            <h2 className="text-xl font-semibold mb-3 text-cyan-300">Use of Service</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>You agree not to misuse the platform, reverse engineer, disrupt, or exploit the system.</li>
              <li>You must not use KarmAnk for harmful, illegal, defamatory, or fraudulent activities.</li>
              <li>You may not copy, reproduce, or redistribute any generated content for commercial use without permission.</li>
            </ul>
          </section>

          {/* License */}
          <section id="license">
            <h2 className="text-xl font-semibold mb-3 text-cyan-300">License & Restrictions</h2>
            <p>
              We grant you a limited, non-exclusive, non-transferable license to use KarmAnk for personal purposes.
              This license does not permit:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Reverse engineering or extracting algorithms.</li>
              <li>Reproduction or reselling of content.</li>
              <li>Automated scraping or unauthorized data collection.</li>
            </ul>
          </section>

          {/* Payments */}
          <section id="payments">
            <h2 className="text-xl font-semibold mb-3 text-cyan-300">Payments & Subscriptions</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Paid features, digital reports, and subscriptions are billed through secure third-party processors.</li>
              <li>All purchases of digital goods are final once delivered.</li>
              <li>Subscription renewals are automatic unless cancelled prior to the billing date.</li>
              <li>Failure to use the service does not entitle the user to a refund.</li>
            </ul>
          </section>

          {/* Interpretative Content */}
          <section id="content">
            <h2 className="text-xl font-semibold mb-3 text-cyan-300">Interpretative Nature of Content</h2>
            <p>
              KarmAnk provides insights rooted in <strong>Vedic Ank Shashtra</strong>.
              These readings are interpretative, symbolic, and spiritual in nature.
              They are not scientifically validated predictions or guarantees.
            </p>
            <p className="mt-2">
              The user is solely responsible for decisions made using the content and should seek
              professional advice for legal, medical, financial, or psychological matters.
            </p>
          </section>

          {/* Intellectual Property */}
          <section id="ip">
            <h2 className="text-xl font-semibold mb-3 text-cyan-300">Intellectual Property</h2>
            <p>
              All platform content — including algorithms, UI, text, graphics, and generated insights —
              is the exclusive property of KarmAnk.
              Unauthorized reproduction, distribution, modification, or resale is strictly prohibited.
            </p>
          </section>

          {/* Third-Party Services */}
          <section id="thirdparty">
            <h2 className="text-xl font-semibold mb-3 text-cyan-300">Third-Party Services</h2>
            <p>
              KarmAnk may contain links or integrations with third-party services.
              We are not responsible for their content, privacy policies, or practices.
              Use of third-party services is at your own risk.
            </p>
          </section>

          {/* Disclaimers */}
          <section id="disclaimer">
            <h2 className="text-xl font-semibold mb-3 text-cyan-300">Disclaimers</h2>
            <p>
              The service is provided on an <strong>"AS IS"</strong> and <strong>"AS AVAILABLE"</strong> basis.
              We do not guarantee accuracy, reliability, completeness, or uninterrupted access.
              No information provided constitutes professional advice of any kind.
            </p>
          </section>

          {/* Liability */}
          <section id="liability">
            <h2 className="text-xl font-semibold mb-3 text-cyan-300">Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by Indian law, KarmAnk shall not be liable for any direct,
              indirect, incidental, consequential, punitive, or special damages including loss of profits,
              emotional distress, data loss, business interruption, or personal outcomes.
            </p>
          </section>

          {/* Indemnity */}
          <section id="indemnity">
            <h2 className="text-xl font-semibold mb-3 text-cyan-300">Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless KarmAnk, its founders, employees, affiliates,
              and partners from any claims, damages, liabilities, losses, or expenses resulting from:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Your use or misuse of the platform</li>
              <li>Your violation of these Terms</li>
              <li>Your infringement of any rights of another person or entity</li>
            </ul>
          </section>

          {/* Termination */}
          <section id="termination">
            <h2 className="text-xl font-semibold mb-3 text-cyan-300">Termination</h2>
            <p>
              We may suspend, limit, or terminate access at any time for violations, abuse,
              fraudulent behaviour, or any activity deemed harmful to the platform.
            </p>
          </section>

          {/* Governing Law */}
          <section id="laws">
            <h2 className="text-xl font-semibold mb-3 text-cyan-300">Governing Law</h2>
            <p>
              These Terms are governed by the laws of India.
              All disputes fall under the exclusive jurisdiction of the courts of{" "}
              <strong>Gujarat, India</strong>.
            </p>
          </section>

          {/* Changes */}
          <section id="changes">
            <h2 className="text-xl font-semibold mb-3 text-cyan-300">Changes to These Terms</h2>
            <p>
              We may modify or update these Terms at any time.
              Continued use of KarmAnk after changes indicates acceptance of the revised terms.
            </p>
          </section>

          {/* Misc */}
          <section id="misc">
            <h2 className="text-xl font-semibold mb-3 text-cyan-300">Miscellaneous</h2>
            <p>
              If any provision of these Terms is found unenforceable, the remaining provisions remain in effect.
              These Terms, together with the Privacy Policy and Disclaimer, constitute the entire agreement
              between you and KarmAnk.
            </p>
          </section>

          {/* Footer */}
          <div className="pt-6 border-t border-white/10">
            <div className="flex justify-between items-center text-sm text-cyan-400/60 mb-3">
              <button onClick={handleBackToLogin} className="hover:text-cyan-300 transition-colors">← Back to Login</button>
              <a href="/about" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-300 transition-colors underline">About Us</a>
            </div>
            <p className="text-center text-xs text-cyan-400/40">© {year} KarmAnk™ - All Rights Reserved</p>
          </div>

        </div>
          </div>
        </div>
      </div>
    </CosmicBackground>
  );
}
