import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, DollarSign, RefreshCcw } from "lucide-react";
import CosmicBackground from "../components/CosmicBackground";

export default function RefundPage() {
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
                <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-500">
                  KarmAnk™
                </div>
                <div className="text-sm text-cyan-400/60 tracking-widest">
                  REFUND & CANCELLATION POLICY
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
          <div className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 border border-green-500/30 rounded-xl p-6 mb-8 backdrop-blur-md">
            <div className="flex items-start gap-4">
              <DollarSign className="h-6 w-6 text-green-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-bold text-green-300 mb-2">
                  Digital Services Policy
                </h3>
                <p className="text-green-100/80 text-sm leading-relaxed">
                  All KarmAnk™ services are digital and delivered instantly. Due
                  to the interpretative nature of Vedic numerology readings, all
                  purchases are final once delivered. Please review this policy
                  carefully to understand refund eligibility and cancellation
                  procedures.
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="bg-gray-900/60 backdrop-blur-md rounded-xl border border-cyan-500/20 shadow-2xl p-8">
            <div className="space-y-10 leading-relaxed text-white/80">
              {/* Overview */}
              <section>
                <h2 className="text-xl font-semibold mb-3 text-cyan-300">
                  Overview
                </h2>
                <p>
                  KarmAnk provides personalised outputs, reports, insights, and
                  readings based on{" "}
                  <strong>Vedic Ank Shashtra (Vedic Numerology)</strong>. These
                  are immediately generated digital services that cannot be
                  returned or revoked once delivered. This Refund & Cancellation
                  Policy explains how refunds, cancellations, billing disputes,
                  and chargebacks are handled.
                </p>
              </section>

              {/* Eligibility */}
              <section>
                <h2 className="text-xl font-semibold mb-3 text-cyan-300">
                  Eligibility for Refunds
                </h2>
                <p className="mb-3">
                  Due to the nature of digital spiritual/numerological services,
                  all purchases are <strong>final and non-refundable</strong>{" "}
                  once the service or report has been delivered. However,
                  refunds may be considered in the following limited situations:
                </p>

                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Duplicate charges</strong> caused by a payment
                    gateway error.
                  </li>
                  <li>
                    <strong>Confirmed technical issues</strong> where the
                    service was not delivered.
                  </li>
                  <li>
                    Accidental purchases may be reviewed on a case-by-case basis
                    but are not guaranteed.
                  </li>
                  <li>
                    Personal dissatisfaction with numerological insights,
                    interpretations, scores, compatibility reports, or outcomes
                    does <strong>not</strong> qualify for a refund, as these are
                    interpretative and subjective by nature.
                  </li>
                  <li>
                    Refund requests must be submitted within{" "}
                    <strong>7 days</strong> of purchase.
                  </li>
                </ul>
              </section>

              {/* Subscription & Cancellations */}
              <section>
                <h2 className="text-xl font-semibold mb-3 text-cyan-300">
                  Subscriptions & Cancellations
                </h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    You may cancel your subscription anytime from your account
                    settings.
                  </li>
                  <li>
                    Cancellation stops future renewals; past subscription
                    charges are non-refundable.
                  </li>
                  <li>
                    Premium access remains active until the end of the current
                    billing period.
                  </li>
                  <li>
                    Failure to use the service, forgetting to cancel, or
                    dissatisfaction with interpretative outcomes does not make a
                    subscription eligible for a refund.
                  </li>
                </ul>
              </section>

              {/* How to Request */}
              <section>
                <h2 className="text-xl font-semibold mb-3 text-cyan-300">
                  How to Request a Refund
                </h2>
                <p>
                  To request a refund for eligible cases, email us at{" "}
                  <a
                    href="mailto:billing@karmank.in"
                    className="text-cyan-300 hover:text-cyan-200 underline font-semibold"
                  >
                    billing@karmank.in
                  </a>{" "}
                  with the following details:
                </p>

                <ul className="list-disc pl-6 space-y-2 mt-3">
                  <li>Your account email</li>
                  <li>Transaction ID or receipt</li>
                  <li>A clear description of the issue</li>
                </ul>

                <p className="mt-3">
                  We may require additional verification for security or
                  fraud-prevention purposes.
                </p>
              </section>

              {/* Chargebacks */}
              <section>
                <h2 className="text-xl font-semibold mb-3 text-cyan-300">
                  Chargebacks & Payment Disputes
                </h2>
                <p>
                  Filing a chargeback without contacting us first may result in
                  temporary account suspension while the dispute is
                  investigated. Most payment issues can be resolved quickly if
                  you reach out to our billing team before contacting your bank.
                </p>
              </section>

              {/* Digital Goods Clause */}
              <section>
                <h2 className="text-xl font-semibold mb-3 text-cyan-300">
                  Digital Goods & Instant Delivery
                </h2>
                <p>
                  All numerology reports, compatibility analyses, vibration
                  readings, and related outputs are{" "}
                  <strong>digitally delivered instantly</strong>. Once generated
                  or accessed, the service is considered fully delivered, and
                  refunds are not applicable.
                </p>
              </section>

              {/* Misuse */}
              <section>
                <h2 className="text-xl font-semibold mb-3 text-cyan-300">
                  Misuse, Abuse & Fraud
                </h2>
                <p>
                  KarmAnk reserves the right to deny refunds in cases of misuse,
                  excessive refund requests, fraudulent transactions,
                  exploitation of promotional offers, or violation of our Terms
                  & Conditions.
                </p>
              </section>

              {/* Governing Law */}
              <section>
                <h2 className="text-xl font-semibold mb-3 text-cyan-300">
                  Governing Law & Jurisdiction
                </h2>
                <p>
                  This Refund & Cancellation Policy is governed by the laws of
                  India. Any disputes will fall under the exclusive jurisdiction
                  of the courts of <strong> India</strong>.
                </p>
              </section>

              {/* Footer */}
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
