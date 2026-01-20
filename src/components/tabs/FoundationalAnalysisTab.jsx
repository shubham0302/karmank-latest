import React, { useMemo } from "react";
import Card from "../Card";
import SectionTitle from "../SectionTitle";
import NlgSummaryComponent from "../NlgSummaryComponent";
import { getText } from "../../utils/helpers"; // Import getText
import { GradientText } from "../GradientText";

const FoundationalAnalysisTab = ({
  analysis,
  yogas,
  specialInsights,
  language = "en",
}) => {
  // Re-process analysis with current language
  // Note: recurringNumberInfluence is static reference data and can be included
  const staticRecurringNumberInfluence = {
    // This would normally come from relevantData, but for now use a minimal version
    // In production, this should be part of the filtered data
  };

  const translatedAnalysis = useMemo(() => {
    if (!analysis || analysis.length === 0) return [];

    return analysis.map((item) => {
      const rule = DATA.recurringNumberInfluence[item.number];

      // If no rule in frontend (data moved to backend), show generic message
      if (!rule) {
        return {
          ...item,
          influence: `This number appears ${item.occurrences} times in your chart, amplifying its influence on your life path.`,
        };
      }

      let influence = [];
      const count = item.occurrences;
      const isDestinyMatch = item.isDestinyMatch || false;

      if (rule.base) influence.push(getText(rule.base, language));
      if (count >= 3 && rule.threeOrMore)
        influence.push(getText(rule.threeOrMore, language));
      if (isDestinyMatch && rule.withDestiny)
        influence.push(getText(rule.withDestiny, language));
      if (rule.evenCount && count % 2 === 0)
        influence.push(getText(rule.evenCount, language));
      if (rule.oddCount && count % 2 !== 0)
        influence.push(getText(rule.oddCount, language));

      return {
        ...item,
        influence: influence.join(" "),
      };
    });
  }, [analysis, language]);

  const nlgPrompt = useMemo(() => {
    if (!analysis && !yogas) return null;

    // Language-specific prompt instruction
    let languageInstruction = "";
    if (language === "hi") {
      languageInstruction =
        "You are a Vedic numerologist. Based on the following foundational chart analysis, write a 2-4 sentence summary of the person's key strengths and challenges in HINDI (हिंदी). Use Devanagari script. \n\n";
    } else if (language === "en-hi") {
      languageInstruction =
        "You are a Vedic numerologist. Based on the following foundational chart analysis, write a 2-4 sentence summary of the person's key strengths and challenges in HINGLISH (Roman script with Hindi words). Use conversational Hindi-English mix. \n\n";
    } else {
      languageInstruction =
        "You are a Vedic numerologist. Based on the following foundational chart analysis, write a 2-4 sentence summary of the person's key strengths and challenges in ENGLISH. \n\n";
    }

    let prompt = languageInstruction;

    if (yogas.length > 0) {
      prompt += "Foundational Yogas Present:\n";
      yogas.forEach((yoga) => {
        prompt += `- ${getText(yoga.name, language)}: ${getText(yoga.description, language)}\n`;
      });
    } else {
      prompt += "No significant foundational yogas are present.\n";
    }
    if (analysis.length > 0) {
      prompt += "\nInfluence of Recurring Numbers:\n";
      analysis.forEach((item) => {
        prompt += `- Number ${item.number} (appears ${item.occurrences} times): ${item.influence}\n`;
      });
    }
    if (specialInsights.length > 0) {
      prompt += "\nSpecial Foundational Insights:\n";
      specialInsights.forEach((insight) => {
        prompt += `- ${getText(insight.title, language)}: ${getText(insight.text, language)}\n`;
      });
    }
    prompt +=
      "\nSummarize the most important takeaways for the user in a gentle and empowering tone.";
    return prompt;
  }, [analysis, yogas, specialInsights, language]);

  return (
    <div className="space-y-6">
      <NlgSummaryComponent
        title="Your Foundational Blueprint"
        prompt={nlgPrompt}
      />
      <Card>
        <SectionTitle>Influence of Recurring Numbers</SectionTitle>

        {translatedAnalysis.length > 0 ? (
          <div className="space-y-6">
            {translatedAnalysis.map((item) => (
              <div
                key={item.number}
                className="bg-gray-900/50 p-4 rounded-md border-l-4 border-yellow-500"
              >
                <div className="flex justify-between items-baseline">
                  <GradientText as="h3" size="xl">
                    Number: {item.number}
                  </GradientText>
                  <span className="text-sm text-white/70">
                    Occurrences: {item.occurrences}
                  </span>
                </div>
                <div className="mt-3">
                  <GradientText as="h4" size="base" className="mb-1">
                    Influence:
                  </GradientText>
                  <p className="text-white/90">{item.influence}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>
            No numbers recur in your chart. The energy of each number is
            balanced.
          </p>
        )}
      </Card>
      {specialInsights && specialInsights.length > 0 && (
        <Card>
          <SectionTitle>Special Foundational Insights</SectionTitle>
          <div className="space-y-4">
            {specialInsights.map((insight, index) => (
              <div
                key={index}
                className="bg-indigo-900/40 p-4 rounded-md border-l-4 border-purple-400"
              >
                <GradientText as="h3" size="xl" className="mb-2">
                  {getText(insight.title, language)}
                </GradientText>
                <p className="text-white/90 mt-2">
                  {getText(insight.text, language)}
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}
      <Card>
        <SectionTitle>Foundational Yogas</SectionTitle>
        <div className="text-center bg-blue-900/30 text-blue-300 p-2 rounded-md mb-4 text-sm">
          <p>This Yoga is based on the individual's Base Chart.</p>
        </div>
        {yogas.length > 0 ? (
          <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
            {yogas.map((yoga) => (
              <div
                key={getText(yoga.name, language)}
                className="bg-gray-900/30 p-3 rounded-md"
              >
                <strong className="text-yellow-500">
                  {getText(yoga.name, language)}
                </strong>
                <p className="text-sm text-white/90">
                  {getText(yoga.description, language)}
                </p>
                {yoga.traits && (
                  <ul className="list-disc list-inside text-xs mt-1 text-white/70">
                    {yoga.traits.map((trait) => (
                      <li key={getText(trait, language)}>
                        {getText(trait, language)}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p>No foundational yogas detected in the birth chart.</p>
        )}
      </Card>
    </div>
  );
};

export default FoundationalAnalysisTab;
