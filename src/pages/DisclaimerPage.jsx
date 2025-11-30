import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import CosmicBackground from "../components/CosmicBackground";
import { GradientText, gradientUtils } from "../components/GradientText";

export default function DisclaimerPage() {
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
                <div className="text-4xl font-bold">
                  <GradientText as="span" size="4xl" className="font-serif">
                    KarmAnk
                  </GradientText>
                  <sup className={`text-2xl -top-2 ${gradientUtils.text}`}>
                    ™
                  </sup>
                </div>
                <div className="text-sm text-cyan-400/60 tracking-widest">
                  DISCLAIMER
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

          {/* Important Notice */}
          <div className="bg-gradient-to-r from-orange-900/20 to-red-900/20 border border-orange-500/30 rounded-xl p-6 mb-8 backdrop-blur-md">
            <div className="flex items-start gap-4">
              <AlertTriangle className="h-6 w-6 text-orange-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-bold text-orange-300 mb-2">Please Read Carefully</h3>
                <p className="text-orange-100/80 text-sm leading-relaxed">
                  KarmAnk™ provides interpretative insights based on Vedic Ank Shashtra (Vedic Numerology). The information provided is for spiritual guidance and educational purposes only. These are not scientifically validated predictions or professional advice.
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="bg-gray-900/60 backdrop-blur-md rounded-xl border border-cyan-500/20 shadow-2xl p-8">

        <div className="space-y-10 leading-relaxed text-white/80">

          {/* Nature of Service */}
          <section>
            <h2 className="text-xl font-semibold mb-3 text-cyan-300">Nature of Service</h2>
            <p>
              KarmAnk™ is a digital platform that provides numerological interpretations and insights based on the ancient principles of{" "}
              <strong>Vedic Ank Shashtra (Vedic Numerology)</strong>. All readings, reports, compatibility analyses, forecasts, and guidance
              are interpretative in nature and derived from traditional numerological systems.
            </p>
            <p className="mt-3">
              <strong>These interpretations are NOT:</strong>
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Scientifically validated predictions or guarantees</li>
              <li>Professional advice (medical, legal, financial, or psychological)</li>
              <li>Absolute truths or certainties about your future</li>
              <li>Replacements for professional consultation in any domain</li>
            </ul>
          </section>

          {/* No Professional Advice */}
          <section>
            <h2 className="text-xl font-semibold mb-3 text-cyan-300">Not Professional Advice</h2>
            <p>
              The content provided by KarmAnk™ is for <strong>informational, spiritual, and entertainment purposes only</strong>.
              It should never be used as a substitute for professional advice in matters of:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li><strong>Medical Health:</strong> Always consult qualified medical professionals for health concerns, diagnosis, treatment, or medical decisions.</li>
              <li><strong>Mental Health:</strong> Seek licensed therapists, psychologists, or psychiatrists for mental health issues, emotional distress, or psychological guidance.</li>
              <li><strong>Financial Decisions:</strong> Consult certified financial advisors, accountants, or investment professionals for financial planning, investments, or monetary decisions.</li>
              <li><strong>Legal Matters:</strong> Always seek advice from licensed attorneys or legal professionals for any legal questions, disputes, or decisions.</li>
              <li><strong>Career & Business:</strong> Consult career counselors, business advisors, or industry professionals for career planning and business decisions.</li>
              <li><strong>Relationships:</strong> Consider professional relationship counselors or therapists for serious relationship issues.</li>
            </ul>
          </section>

          {/* Personal Responsibility */}
          <section>
            <h2 className="text-xl font-semibold mb-3 text-cyan-300">Personal Responsibility</h2>
            <p>
              By using KarmAnk™, you acknowledge and agree that:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>You are solely responsible for any decisions, actions, or outcomes resulting from the use of our services.</li>
              <li>You understand that numerological insights are interpretative and symbolic, not factual or guaranteed.</li>
              <li>You will not rely on KarmAnk™ content for critical life decisions without seeking appropriate professional guidance.</li>
              <li>You use the service at your own risk and discretion.</li>
            </ul>
          </section>

          {/* Accuracy & Reliability */}
          <section>
            <h2 className="text-xl font-semibold mb-3 text-cyan-300">Accuracy & Reliability</h2>
            <p>
              While we strive to provide high-quality interpretative content based on established numerological principles,
              we do not guarantee the accuracy, completeness, reliability, or timeliness of any information provided.
            </p>
            <p className="mt-3">
              Numerological interpretations are inherently subjective and may vary based on interpretation methods, cultural context,
              and individual circumstances. Results may differ from person to person, and outcomes are not guaranteed.
            </p>
          </section>

          {/* Spiritual & Cultural Context */}
          <section>
            <h2 className="text-xl font-semibold mb-3 text-cyan-300">Spiritual & Cultural Context</h2>
            <p>
              KarmAnk™ is rooted in <strong>Vedic Ank Shashtra</strong>, a traditional Indian numerological system with spiritual
              and cultural significance. The insights provided are intended to:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Offer spiritual guidance and self-reflection tools</li>
              <li>Provide insights into personal tendencies, life patterns, and cosmic influences</li>
              <li>Support personal growth and self-awareness journeys</li>
              <li>Encourage exploration of ancient wisdom traditions</li>
            </ul>
            <p className="mt-3">
              These insights should be understood within their traditional, spiritual, and interpretative context.
            </p>
          </section>

          {/* No Guarantees */}
          <section>
            <h2 className="text-xl font-semibold mb-3 text-cyan-300">No Guarantees or Warranties</h2>
            <p>
              KarmAnk™ provides all services on an <strong>"AS IS"</strong> and <strong>"AS AVAILABLE"</strong> basis.
              We make no warranties, representations, or guarantees regarding:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>The accuracy or correctness of numerological interpretations</li>
              <li>The outcome of any actions taken based on our content</li>
              <li>The achievement of specific life results, goals, or predictions</li>
              <li>Compatibility, success, or harmony in relationships, business, or life events</li>
              <li>Uninterrupted, error-free, or secure operation of the platform</li>
            </ul>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h2 className="text-xl font-semibold mb-3 text-cyan-300">Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by Indian law, KarmAnk™, its founders, employees, partners, and affiliates
              shall not be liable for any direct, indirect, incidental, consequential, special, punitive, or exemplary damages
              arising from or related to:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Your use or reliance on any content, interpretations, or reports provided by KarmAnk™</li>
              <li>Decisions, actions, or outcomes based on numerological insights</li>
              <li>Any loss of profits, opportunities, relationships, business, data, or reputation</li>
              <li>Emotional distress, disappointment, or dissatisfaction with interpretations</li>
              <li>Technical issues, errors, interruptions, or data loss</li>
            </ul>
          </section>

          {/* Third-Party Content */}
          <section>
            <h2 className="text-xl font-semibold mb-3 text-cyan-300">Third-Party Content & Links</h2>
            <p>
              KarmAnk™ may contain links to third-party websites, services, or content for informational purposes.
              We do not endorse, verify, or assume responsibility for the accuracy, reliability, or content of third-party resources.
              Use of third-party services is at your own risk.
            </p>
          </section>

          {/* User Age & Consent */}
          <section>
            <h2 className="text-xl font-semibold mb-3 text-cyan-300">Age & Parental Consent</h2>
            <p>
              KarmAnk™ is intended for users aged 18 and above. Users under 18 must have explicit parental or guardian consent
              to use the service. Parents and guardians are responsible for monitoring minors' use of the platform.
            </p>
          </section>

          {/* Interpretative Nature */}
          <section>
            <h2 className="text-xl font-semibold mb-3 text-cyan-300">Interpretative & Symbolic Nature</h2>
            <p>
              All numerological outputs — including vibration analyses, destiny numbers, compatibility scores, yoga identifications,
              forecasts, chakra alignments, and remedial suggestions — are <strong>interpretative and symbolic</strong>.
            </p>
            <p className="mt-3">
              Numbers and their meanings carry symbolic significance within the Vedic tradition. These interpretations should be
              understood as tools for self-exploration and spiritual reflection, not as literal predictions or absolute truths.
            </p>
          </section>

          {/* Remedies & Guidance */}
          <section>
            <h2 className="text-xl font-semibold mb-3 text-cyan-300">Remedies & Guidance</h2>
            <p>
              Remedial suggestions provided by KarmAnk™ (such as mantras, rudraksha recommendations, gemstone guidance, chakra
              practices, or lifestyle adjustments) are based on traditional numerological and spiritual principles.
            </p>
            <p className="mt-3">
              <strong>These remedies are NOT medical treatments or cures.</strong> Always consult healthcare professionals for
              medical conditions. Practice spiritual remedies responsibly and according to your comfort level and beliefs.
            </p>
          </section>

          {/* Changes to Disclaimer */}
          <section>
            <h2 className="text-xl font-semibold mb-3 text-cyan-300">Changes to This Disclaimer</h2>
            <p>
              We may update this Disclaimer from time to time to reflect changes in our practices or legal requirements.
              Continued use of KarmAnk™ after changes indicates acceptance of the updated Disclaimer.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-xl font-semibold mb-3 text-cyan-300">Questions or Concerns</h2>
            <p>
              If you have questions about this Disclaimer, please contact us at:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li><strong>Email:</strong> <a href="mailto:support@karmank.in" className="text-cyan-300 hover:text-cyan-200 underline font-semibold">support@karmank.in</a></li>
            </ul>
          </section>

          {/* Final Statement */}
          <section>
            <h2 className="text-xl font-semibold mb-3 text-cyan-300">Acknowledgment</h2>
            <p>
              By using KarmAnk™, you acknowledge that you have read, understood, and agree to this Disclaimer.
              You accept that the service is provided for spiritual exploration and educational purposes, and you will not hold
              KarmAnk™ liable for any outcomes resulting from your use of the service.
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
