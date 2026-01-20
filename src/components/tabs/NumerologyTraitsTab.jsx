import React, { useMemo } from "react";
import Card from "../Card";
import SectionTitle from "../SectionTitle";
import { getText } from "../../utils/helpers"; // Import getText
import { GradientText } from "../GradientText";

const NumerologyTraitsTab = ({ report, gender, language = "en" }) => {
  if (!report) return null;
  const { destinyNumber, destinyTraits, destinyProfessions } = report;
  const traits = destinyTraits; // Now comes from report (backend API)
  const professions = destinyProfessions; // Now comes from report (backend API)

  const supportAnalysis = useMemo(() => {
    if (!professions || !professions.supportNeeded) return [];
    const supportNeededText = getText(professions.supportNeeded, language);
    const supportNumbers = supportNeededText.match(/\d+/g)?.map(Number) || [];
    return supportNumbers.map((num) => ({
      number: num,
      isPresent: report.baseKundliGrid[num] > 0,
    }));
  }, [professions, report.baseKundliGrid, language]);

  if (!traits) {
    return (
      <Card>
        <p>No detailed traits available for Destiny Number {destinyNumber}.</p>
      </Card>
    );
  }

  // Icon mapping for each trait category
  const traitIcons = {
    "Planet (Grah)": "🪐",
    Finance: "💰",
    "Health Defects": "⚕️",
    "Lucky Days": "📅",
    "Lucky Colours": "🎨",
    "Lucky Jewels": "💎",
    "Important Years": "⏳",
    "Friendly Number": "🤝",
    "Good Quality": "✨",
    "Spiritual Insights": "🕉️",
    Drawback: "⚠️",
    "As Wife": "👰",
    "As Husband": "🤵",
  };

  const TraitItem = ({
    label,
    value,
    fullWidth = false,
    highlight = false,
  }) => (
    <div
      className={`relative overflow-hidden rounded-lg border border-white/10 ${
        fullWidth ? "col-span-full" : ""
      } ${
        highlight
          ? "bg-gradient-to-br from-purple-900/40 via-indigo-900/40 to-blue-900/40"
          : "bg-gradient-to-br from-gray-900/60 to-gray-800/60"
      } p-5 transition-all hover:shadow-lg hover:shadow-purple-500/20 hover:scale-[1.02]`}
    >
      <div className="flex items-start gap-3">
        <span className="text-xl flex-shrink-0 mt-0.5 print:text-base">
          {traitIcons[label] || "📋"}
        </span>
        <div className="flex-1 min-w-0">
          <h4
            className={`font-bold mb-2 text-base print:text-sm ${
              highlight ? "text-purple-300" : "text-yellow-400"
            }`}
          >
            {label}
          </h4>
          <p className="text-white/90 leading-relaxed text-sm print:text-xs">
            {value}
          </p>
        </div>
      </div>
      {/* Decorative gradient accent */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-white/5 to-transparent rounded-bl-full" />
    </div>
  );

  const ProfessionColumn = ({ title, items, type }) => {
    const typeStyles = {
      suggested: {
        bg: "bg-gradient-to-br from-emerald-900/40 to-green-900/40",
        text: "text-emerald-300",
        icon: "✓",
        borderColor: "border-emerald-500/30",
      },
      neutral: {
        bg: "bg-gradient-to-br from-amber-900/40 to-yellow-900/40",
        text: "text-amber-300",
        icon: "○",
        borderColor: "border-amber-500/30",
      },
      ideal: {
        bg: "bg-gradient-to-br from-blue-900/40 to-cyan-900/40",
        text: "text-cyan-300",
        icon: "★",
        borderColor: "border-cyan-500/30",
      },
      avoid: {
        bg: "bg-gradient-to-br from-red-900/40 to-rose-900/40",
        text: "text-rose-300",
        icon: "✕",
        borderColor: "border-rose-500/30",
      },
    };
    const styles = typeStyles[type];

    return (
      <div
        className={`relative p-6 rounded-xl border ${styles.borderColor} ${styles.bg} h-full transition-all hover:shadow-lg hover:shadow-purple-500/10 print:p-4`}
      >
        {/* Decorative top accent */}
        <div
          className={`absolute top-0 left-0 right-0 h-1 ${styles.bg} opacity-70`}
        />

        <div className="flex items-center justify-center gap-2 mb-4 print:mb-3">
          <span className={`text-lg ${styles.text} print:text-base`}>
            {styles.icon}
          </span>
          <h4 className={`font-bold ${styles.text} text-lg print:text-sm`}>
            {title}
          </h4>
        </div>

        <ul className="space-y-3 print:space-y-2">
          {items.map((item, index) => (
            <li
              key={getText(item, language)}
              className="flex items-start gap-2 text-left group"
            >
              <span
                className={`${styles.text} text-xs mt-0.5 opacity-60 group-hover:opacity-100 transition-opacity print:text-[10px]`}
              >
                {styles.icon}
              </span>
              <span className="text-white/90 text-sm leading-relaxed flex-1 print:text-xs print:leading-snug">
                {getText(item, language)}
              </span>
            </li>
          ))}
        </ul>

        {/* Decorative bottom corner */}
        <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-white/5 to-transparent rounded-tl-full" />
      </div>
    );
  };

  return (
    <div className="space-y-0">
      {/* Page 1: Header & Featured Traits */}
      <Card
        className="pdf-page-break-after mb-12"
        style={{ pageBreakAfter: "always", pageBreakInside: "avoid" }}
      >
        <div className="text-center mb-10 print:mb-6">
          <div className="inline-block relative">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent print:text-2xl">
              Destiny Number {destinyNumber}
            </h2>
            <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-full" />
          </div>
          <p className="text-white/60 text-sm mt-4 print:text-xs print:mt-2">
            Complete Numerological Profile
          </p>
        </div>

        {/* Featured Top Traits - Full Width Highlights */}
        <div className="grid gap-5 mb-8">
          <TraitItem
            label="Spiritual Insights"
            value={getText(traits["Spiritual Insights"], language)}
            fullWidth={true}
            highlight={true}
          />
          <TraitItem
            label="Good Quality"
            value={getText(traits["Good Quality"], language)}
            fullWidth={true}
            highlight={true}
          />
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 my-8">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
          <span className="text-purple-400 text-sm font-medium">
            Core Attributes
          </span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
        </div>

        {/* Two-Column Detailed Traits */}
        <div className="grid md:grid-cols-2 gap-5">
          <TraitItem
            label="Planet (Grah)"
            value={getText(traits.Planet, language)}
          />
          <TraitItem
            label="Finance"
            value={getText(traits.Finance, language)}
          />
          <TraitItem
            label="Lucky Days"
            value={getText(traits["Lucky Days"], language)}
          />
          <TraitItem
            label="Lucky Colours"
            value={getText(traits["Lucky Colours"], language)}
          />
          <TraitItem
            label="Lucky Jewels"
            value={getText(traits["Lucky Jewels"], language)}
          />
          <TraitItem
            label="Important Years"
            value={getText(traits["Important Years"], language)}
          />
          <TraitItem
            label="Friendly Number"
            value={getText(traits["Friendly Number"], language)}
          />
          <TraitItem
            label="Health Defects"
            value={getText(traits["Health Defects"], language)}
          />
        </div>
      </Card>

      {/* Page 2: Areas for Growth & Relationship */}
      <Card
        className="pdf-page-break-after mt-12 mb-12"
        style={{
          pageBreakAfter: "always",
          pageBreakBefore: "always",
          pageBreakInside: "avoid",
        }}
      >
        {/* Section Header */}
        <div className="text-center mb-10 print:mb-6">
          <div className="inline-block relative">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 bg-clip-text text-transparent print:text-2xl">
              Personal Development
            </h2>
            <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 rounded-full" />
          </div>
          <p className="text-white/60 text-sm mt-4 print:text-xs print:mt-2">
            Growth Areas & Relationships
          </p>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
          <span className="text-amber-400 text-base font-semibold">
            Areas for Growth
          </span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
        </div>

        {/* Drawback - Highlighted Warning */}
        <div className="grid gap-5 mb-10">
          <TraitItem
            label="Drawback"
            value={getText(traits.Drawback, language)}
            fullWidth={true}
          />
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 my-8">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-pink-500/50 to-transparent" />
          <span className="text-pink-400 text-base font-semibold">
            Relationship Profile
          </span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-pink-500/50 to-transparent" />
        </div>

        {/* Relationship Trait - Featured */}
        <div className="grid gap-5">
          <TraitItem
            label={gender === "Female" ? "As Wife" : "As Husband"}
            value={getText(
              traits[gender === "Female" ? "As Wife" : "As Husband"],
              language,
            )}
            fullWidth={true}
            highlight={true}
          />
        </div>
      </Card>

      {/* Page 3: Career & Profession Profile */}
      {professions && (
        <>
          <Card
            className="pdf-page-break-after mt-12 mb-12"
            style={{
              pageBreakAfter: "always",
              pageBreakBefore: "always",
              pageBreakInside: "avoid",
            }}
          >
            <div className="text-center mb-10 print:mb-6">
              <div className="inline-block relative">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent print:text-2xl">
                  Career & Profession Profile
                </h2>
                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-full" />
              </div>
              <p className="text-white/60 text-sm mt-4 print:text-xs print:mt-2">
                Professional Path Guidance
              </p>
            </div>

            <div className="space-y-10">
              {/* Top Priority Professions */}
              <div className="grid lg:grid-cols-2 gap-6">
                <ProfessionColumn
                  title="★ Highly Recommended"
                  items={professions.suggested}
                  type="suggested"
                />
                <ProfessionColumn
                  title="★ Ideal Corporate Roles"
                  items={professions.idealCorporate}
                  type="ideal"
                />
              </div>

              {/* Divider */}
              <div className="flex items-center gap-4 my-8">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />
                <span className="text-blue-400 text-base font-semibold">
                  Alternative Options
                </span>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />
              </div>

              {/* Neutral and Avoid */}
              <div className="grid lg:grid-cols-2 gap-6">
                <ProfessionColumn
                  title="Neutral Fields"
                  items={professions.neutral}
                  type="neutral"
                />
                <ProfessionColumn
                  title="Fields to Avoid"
                  items={professions.avoid}
                  type="avoid"
                />
              </div>
            </div>
          </Card>

          {/* Page 4: Success Support Analysis */}
          <Card
            className="pdf-page-break-after mt-12 mb-12"
            style={{
              pageBreakAfter: "always",
              pageBreakBefore: "always",
              pageBreakInside: "avoid",
            }}
          >
            <div className="text-center mb-10 print:mb-6">
              <div className="inline-block relative">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent print:text-2xl">
                  Success Support Analysis
                </h2>
                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full" />
              </div>
              <p className="text-white/60 text-sm mt-4 print:text-xs print:mt-2">
                Numerological Support for Career Success
              </p>
            </div>

            {/* Support Analysis - Premium Card */}
            <div className="relative overflow-hidden rounded-xl border border-indigo-500/30 bg-gradient-to-br from-indigo-900/40 via-purple-900/40 to-blue-900/40 p-8 print:p-6">
              {/* Decorative background pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 left-0 w-40 h-40 bg-purple-500 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-0 w-40 h-40 bg-blue-500 rounded-full blur-3xl" />
              </div>

              <div className="relative z-10">
                <div className="flex items-center justify-center gap-3 mb-8 print:mb-6">
                  <span className="text-4xl print:text-2xl">🎯</span>
                  <h4 className="font-bold text-indigo-300 text-2xl print:text-xl">
                    Required Number Support
                  </h4>
                </div>

                <p className="text-white/90 text-center mb-10 leading-relaxed max-w-3xl mx-auto text-base print:text-sm print:mb-8">
                  {getText(professions.supportNeeded, language)}
                </p>

                <div className="flex justify-center flex-wrap gap-5 print:gap-3 mb-10 print:mb-8">
                  {supportAnalysis.map((item) => (
                    <div
                      key={item.number}
                      className={`flex items-center gap-3 px-6 py-4 rounded-full font-semibold transition-all hover:scale-105 shadow-xl print:px-4 print:py-3 ${
                        item.isPresent
                          ? "bg-emerald-500/20 text-emerald-300 border-2 border-emerald-500/50"
                          : "bg-rose-500/20 text-rose-300 border-2 border-rose-500/50"
                      }`}
                    >
                      <span className="text-xl print:text-base">
                        {item.isPresent ? "✓" : "!"}
                      </span>
                      <span className="text-base font-bold print:text-sm">
                        Number {item.number}
                      </span>
                      <span
                        className={`text-sm print:text-xs ${item.isPresent ? "text-emerald-200" : "text-rose-200"}`}
                      >
                        {item.isPresent ? "Present" : "Missing"}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Info text */}
                <div className="text-center mt-10 print:mt-8">
                  <p className="text-white/70 text-base italic print:text-sm mb-4 print:mb-3">
                    These numbers provide supportive energy for your career
                    success
                  </p>
                  <p className="text-white/50 text-sm print:text-xs">
                    {supportAnalysis.filter((item) => item.isPresent).length} of{" "}
                    {supportAnalysis.length} support numbers are present in your
                    chart
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </>
      )}
    </div>
  );
};

export default NumerologyTraitsTab;
