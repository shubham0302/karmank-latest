import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Shield, Lock } from "lucide-react";
import CosmicBackground from "../components/CosmicBackground";
import { GradientText, gradientUtils } from "../components/GradientText";

export default function PrivacyPage() {
  const year = new Date().getFullYear();
  const navigate = useNavigate();

  const handleBackToLogin = () => {
    navigate("/login");
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
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `
                linear-gradient(to right, rgba(34, 211, 238, 0.1) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(34, 211, 238, 0.1) 1px, transparent 1px)
              `,
                backgroundSize: "40px 40px",
                transform: "perspective(500px) rotateX(60deg)",
                transformOrigin: "center bottom",
              }}
            />
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
                  PRIVACY POLICY
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
          <div className="bg-gradient-to-r from-blue-900/20 to-indigo-900/20 border border-blue-500/30 rounded-xl p-6 mb-8 backdrop-blur-md">
            <div className="flex items-start gap-4">
              <Shield className="h-6 w-6 text-blue-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-bold text-blue-300 mb-2">
                  Your Privacy Matters
                </h3>
                <p className="text-blue-100/80 text-sm leading-relaxed">
                  KarmAnk™ is committed to protecting your personal data and
                  privacy. This Privacy Policy explains how we collect, use,
                  store, and protect your information when you use our Vedic
                  numerology services. We will never sell your personal data.
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="bg-gray-900/60 backdrop-blur-md rounded-xl border border-cyan-500/20 shadow-2xl p-8">
            {/* TOC */}
            <div className="mb-8 rounded-xl border border-cyan-500/20 bg-cyan-900/10 p-5 backdrop-blur-xl">
              <p className="mb-2 text-sm uppercase tracking-wider text-cyan-400/60">
                On this page
              </p>
              <nav className="grid gap-2 text-sm text-cyan-100/70">
                <a
                  href="#intro"
                  className="hover:text-cyan-300 transition-colors"
                >
                  Introduction
                </a>
                <a
                  href="#what"
                  className="hover:text-cyan-300 transition-colors"
                >
                  What We Collect
                </a>
                <a
                  href="#why"
                  className="hover:text-cyan-300 transition-colors"
                >
                  Why We Collect & Legal Bases
                </a>
                <a
                  href="#how"
                  className="hover:text-cyan-300 transition-colors"
                >
                  How We Use & Share Data
                </a>
                <a
                  href="#cookies"
                  className="hover:text-cyan-300 transition-colors"
                >
                  Cookies & Tracking
                </a>
                <a
                  href="#retention"
                  className="hover:text-cyan-300 transition-colors"
                >
                  Data Retention
                </a>
                <a
                  href="#security"
                  className="hover:text-cyan-300 transition-colors"
                >
                  Security
                </a>
                <a
                  href="#international"
                  className="hover:text-cyan-300 transition-colors"
                >
                  International Transfers
                </a>
                <a
                  href="#rights"
                  className="hover:text-cyan-300 transition-colors"
                >
                  Your Rights
                </a>
                <a
                  href="#deletion"
                  className="hover:text-cyan-300 transition-colors"
                >
                  Data Deletion Request
                </a>
                <a
                  href="#children"
                  className="hover:text-cyan-300 transition-colors"
                >
                  Children
                </a>
                <a
                  href="#contact"
                  className="hover:text-cyan-300 transition-colors"
                >
                  Contact & DPO
                </a>
              </nav>
            </div>

            <div className="space-y-10 leading-relaxed text-white/80">
              <section id="intro">
                <h2 className="text-xl font-semibold mb-3 text-cyan-300">
                  Introduction
                </h2>
                <p>
                  KarmAnk ("we", "our", "us") respects your privacy and is
                  committed to protecting your personal data. This Privacy
                  Policy explains what personal data we collect, why we collect
                  it, how we use and share it, how long we keep it, and the
                  rights you have in relation to your personal data. KarmAnk is
                  an application built on principles of{" "}
                  <strong>Vedic Ank Shashtra (Vedic Numerology)</strong>, and
                  many inputs you provide are used to generate interpretative
                  numerology outputs. This policy applies to data collected via
                  www.karmank.in, the mobile/web app, and related services.
                </p>
              </section>

              <section id="what">
                <h2 className="text-xl font-semibold mb-3 text-cyan-300">
                  What We Collect
                </h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Account & Contact:</strong> name, email, username,
                    password (hashed), profile data you provide.
                  </li>
                  <li>
                    <strong>Numerology Inputs:</strong> date of birth, full
                    name, time/place of birth (if provided), and any other
                    inputs used to generate reports or readings.
                  </li>
                  <li>
                    <strong>Payment & Billing:</strong> transaction IDs and
                    payment metadata (payments are processed by third-party
                    gateways — we do not store full card numbers).
                  </li>
                  <li>
                    <strong>Usage & Analytics:</strong> pages visited, features
                    used, device type, browser, IP address, timestamps, and
                    crash logs.
                  </li>
                  <li>
                    <strong>Communications:</strong> support requests, feedback,
                    and other messages you send to us.
                  </li>
                </ul>
              </section>

              <section id="why">
                <h2 className="text-xl font-semibold mb-3 text-cyan-300">
                  Why We Collect Data & Our Legal Bases
                </h2>
                <p>
                  We collect and process personal data for legitimate business
                  purposes, including:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    To provide and operate KarmAnk services and generate
                    personalised numerology readings.
                  </li>
                  <li>
                    To perform our contract with you (e.g., paid reports,
                    subscriptions).
                  </li>
                  <li>
                    To comply with legal obligations (tax, fraud prevention, law
                    enforcement).
                  </li>
                  <li>
                    For our legitimate interests such as product improvement,
                    analytics, security, and detection/prevention of abuse —
                    balanced against your privacy rights.
                  </li>
                  <li>
                    With your consent where required (e.g., marketing
                    communications, optional analytics/tracking).
                  </li>
                </ul>
              </section>

              <section id="how">
                <h2 className="text-xl font-semibold mb-3 text-cyan-300">
                  How We Use & Share Data
                </h2>
                <p>
                  We use personal data to deliver the service, personalise
                  content, send transactional communications, process payments,
                  and maintain security. We will not sell your personal data.
                </p>
                <h3 className="font-medium mt-3 text-cyan-200">
                  Who we share with
                </h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Service Providers:</strong> hosting providers,
                    analytics providers, email and notification services,
                    payment gateways — only as needed and under contract.
                  </li>
                  <li>
                    <strong>Legal & Safety:</strong> when required by law, to
                    respond to legal process, or to protect rights, safety, or
                    property.
                  </li>
                  <li>
                    <strong>Business Transfers:</strong> in the event of a
                    merger, acquisition, or sale of assets, personal data may be
                    transferred as part of the transaction (with notice and
                    appropriate protections).
                  </li>
                </ul>
              </section>

              <section id="cookies">
                <h2 className="text-xl font-semibold mb-3 text-cyan-300">
                  Cookies & Tracking
                </h2>
                <p>
                  We use cookies and similar technologies to operate the site,
                  provide core functionality, remember preferences, and analyze
                  usage. You can manage cookie preferences via the cookie banner
                  and your browser settings. Disabling certain cookies may limit
                  functionality.
                </p>
                <p className="mt-2">
                  <strong>Third-party analytics:</strong> we use reputable
                  analytics providers to measure product performance — these
                  providers may set their own cookies under their privacy
                  policies.
                </p>
              </section>

              <section id="retention">
                <h2 className="text-xl font-semibold mb-3 text-cyan-300">
                  Data Retention
                </h2>
                <p>
                  We retain personal data only as long as necessary to provide
                  the service, meet legal obligations, resolve disputes, and
                  enforce agreements. Typical retention periods include:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    Account data: retained while account is active + up to 3
                    years after account deletion for legal/operational reasons.
                  </li>
                  <li>
                    Payment & billing records: retained for tax and accounting
                    purposes as required by law (commonly 6–7 years).
                  </li>
                  <li>
                    Analytics and logs: retained in aggregated or pseudonymised
                    form for product improvement; raw logs up to 12–24 months
                    depending on purpose.
                  </li>
                </ul>
              </section>

              <section id="security">
                <h2 className="text-xl font-semibold mb-3 text-cyan-300">
                  Security
                </h2>
                <p>
                  We implement administrative, technical, and physical
                  safeguards designed to protect personal data against loss,
                  misuse and unauthorised access. Examples include encryption in
                  transit (TLS), restricted access controls, hashed passwords,
                  and regular security reviews. However, no system is completely
                  secure — if a breach occurs, we will notify affected users and
                  authorities as required by applicable law.
                </p>
              </section>

              <section id="international">
                <h2 className="text-xl font-semibold mb-3 text-cyan-300">
                  International Transfers
                </h2>
                <p>
                  KarmAnk may transfer data to service providers or affiliates
                  located in other jurisdictions. When transfers occur, we apply
                  appropriate safeguards (e.g., contractual protections,
                  standard contractual clauses) to ensure adequate protection.
                </p>
              </section>

              <section id="rights">
                <h2 className="text-xl font-semibold mb-3 text-cyan-300">
                  Your Rights
                </h2>
                <p>Subject to local law, you may have the right to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    Request access to the personal data we hold about you.
                  </li>
                  <li>Request correction of inaccurate or incomplete data.</li>
                  <li>
                    Request deletion of your data (subject to retention
                    obligations and legitimate interests).
                  </li>
                  <li>
                    Request restriction of processing or object to processing
                    (where applicable).
                  </li>
                  <li>
                    Request data portability for data you provided in a
                    structured, commonly used format.
                  </li>
                  <li>
                    Withdraw consent where processing is based on consent
                    (withdrawal will not affect processing prior to withdrawal).
                  </li>
                </ul>
                <p className="mt-2">
                  To exercise any rights, contact us at the address below. We
                  aim to respond to verifiable requests promptly and in
                  accordance with applicable law.
                </p>
              </section>

              <section id="deletion">
                <h2 className="text-xl font-semibold mb-3 text-cyan-300">
                  Data Deletion Request
                </h2>
                <p>
                  Users may request deletion of their personal data collected by
                  the KarmAnk app at any time.
                </p>
                <p className="mt-3">
                  To request data deletion, please email us at:{" "}
                  <a
                    href="mailto:support@karmank.app"
                    className="text-cyan-300 hover:text-cyan-200 underline font-semibold"
                  >
                    support@karmank.app
                  </a>
                </p>
                <p className="mt-3">
                  Please include the subject line:{" "}
                  <strong className="text-cyan-300">"Data Deletion Request – KarmAnk"</strong>
                </p>
                <p className="mt-3">
                  We will process all valid requests within a reasonable
                  timeframe, in accordance with applicable laws.
                </p>
              </section>

              <section id="children">
                <h2 className="text-xl font-semibold mb-3 text-cyan-300">
                  Children
                </h2>
                <p>
                  KarmAnk is not intended for children under 13. We do not
                  knowingly collect personal data from children under 13 without
                  parental consent. If you believe we have collected such data,
                  contact us and we will take steps to delete it.
                </p>
              </section>

              <section id="contact">
                <h2 className="text-xl font-semibold mb-3 text-cyan-300">
                  Contact & Data Protection Officer (DPO)
                </h2>
                <p>
                  For questions about this Privacy Policy, to exercise your
                  rights, or to request data access/deletion, contact:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Email:</strong>{" "}
                    <a
                      href="mailto:privacy@karmank.in"
                      className="text-cyan-300 hover:text-cyan-200 underline font-semibold"
                    >
                      privacy@karmank.in
                    </a>
                  </li>
                  <li>
                    <strong>Support:</strong>{" "}
                    <a
                      href="mailto:support@karmank.in"
                      className="text-cyan-300 hover:text-cyan-200 underline font-semibold"
                    >
                      support@karmank.in
                    </a>
                  </li>
                </ul>
                <p className="mt-3">
                  If you are unsatisfied with our response, you may lodge a
                  complaint with the competent supervisory authority in your
                  jurisdiction.
                </p>
              </section>

              <section id="changes">
                <h2 className="text-xl font-semibold mb-3 text-cyan-300">
                  Changes to this Policy
                </h2>
                <p>
                  We may update this Privacy Policy from time to time. We will
                  post the updated policy with a revised "Last updated" date.
                  Continued use of the service after changes indicates your
                  acceptance of the updated policy.
                </p>
              </section>

              <section id="governing">
                <h2 className="text-xl font-semibold mb-3 text-cyan-300">
                  Governing Law
                </h2>
                <p>
                  This Privacy Policy shall be governed by and construed in
                  accordance with the laws of India. Any disputes relating to
                  this policy shall be subject to the exclusive jurisdiction of
                  the courts of <strong> India</strong>.
                </p>
              </section>

              <div className="pt-6 border-t border-white/10">
                <div className="flex justify-between items-center text-sm text-cyan-400/60 mb-3">
                  <button
                    onClick={handleBackToLogin}
                    className="hover:text-cyan-300 transition-colors"
                  >
                    ← Back to Login
                  </button>
                  <a
                    href="/about"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-cyan-300 transition-colors underline"
                  >
                    About Us
                  </a>
                </div>
                <p className="text-center text-xs text-cyan-400/40">
                  © {year} KarmAnk™ - All Rights Reserved
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CosmicBackground>
  );
}
