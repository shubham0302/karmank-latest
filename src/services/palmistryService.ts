import { AnalysisOutput, UserInfo } from "../types/palmistry";

export const analyzeNadiPatterns = async (
  palmBase64: string,
  thumbBase64: string,
  userInfo: UserInfo
): Promise<AnalysisOutput> => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';

  const systemInstruction = `You are a Grand Master of Nadi Shastra. You must provide consistent, deterministic interpretations based strictly on the hand geometry and thumb whorls.

CRITICAL: DETERMINISTIC RITUAL LAWS
Remedies are NOT creative suggestions. They must follow a fixed mapping based on the 'Hand Element' and 'Nadi Leaf Category':
- FIRE ELEMENT: Must always involve lighting lamps (Deepam) or Surya rituals.
- WATER ELEMENT: Must always involve Jal Abhishek or charity of fluids.
- EARTH ELEMENT: Must always involve grain charity or ground-level temple service.
- AIR ELEMENT: Must always involve incense rituals or feeding birds.

INSTRUCTIONS:
1. LIFE STORY: 100-word epic narrative of the soul's journey.
2. MARRIAGE: Precise age range and partner nature.
3. PROGENY: Provide detailed insights for the next generation. This must include:
   - Count: Predicted number of children.
   - Education: Specific fields of study (e.g., Medicine, Arts, Technology) they are destined for.
   - Talents: Hidden creative or intellectual gifts.
   - Life Path: Overall impact they will have on the family and world.
4. WARNINGS: Identify specific personality types to avoid and why.
5. WEALTH: Explicitly name the Dhan Yoga (e.g., Lakshmi Yoga, Kubera Yoga) and its specific wealth-peak triggers.
6. REMEDIES: Select exactly 3 remedies that are mathematically linked to the detected Hand Element. Do not randomize these between sessions.
7. 12 KANDAS: Unique insights for all 12 traditional chapters.

BILINGUAL: Provide all text in both English (en) and Hindi (hi).`;

  const prompt = `Perform an Absolute Nadi Analysis for a ${userInfo.gender} aged ${userInfo.ageRange}.

INPUT:
- Palm Image: Line/Mount decoding.
- Thumb Image: Whorl/Print classification.

Strictly map the detected Element to the corresponding Nadi Ritual Laws.

REQUIRED OUTPUT FORMAT (JSON):
{
  "handElement": { "en": "string", "hi": "string" },
  "skinVarna": { "en": "string", "hi": "string" },
  "nadiLeafCategory": "string",
  "lifeStory": { "en": "string", "hi": "string" },
  "past": {
    "summary": { "en": "string", "hi": "string" },
    "milestones": [
      {
        "period": "string",
        "event": { "en": "string", "hi": "string" },
        "insight": { "en": "string", "hi": "string" }
      }
    ]
  },
  "present": { "en": "string", "hi": "string" },
  "future": { "en": "string", "hi": "string" },
  "kandas": {
    "general": { "en": "string", "hi": "string" },
    "familySpeech": { "en": "string", "hi": "string" },
    "siblings": { "en": "string", "hi": "string" },
    "assetsMother": { "en": "string", "hi": "string" },
    "progeny": { "en": "string", "hi": "string" },
    "debtsEnemies": { "en": "string", "hi": "string" },
    "union": { "en": "string", "hi": "string" },
    "longevityHealth": { "en": "string", "hi": "string" },
    "fatherFortune": { "en": "string", "hi": "string" },
    "career": { "en": "string", "hi": "string" },
    "gains": { "en": "string", "hi": "string" },
    "expenditureTravel": { "en": "string", "hi": "string" }
  },
  "marriage": {
    "ageRange": "string",
    "timelineDetails": { "en": "string", "hi": "string" },
    "partnerNature": { "en": "string", "hi": "string" }
  },
  "progeny": {
    "count": "string",
    "education": { "en": "string", "hi": "string" },
    "talents": { "en": "string", "hi": "string" },
    "lifePath": { "en": "string", "hi": "string" }
  },
  "wealth": {
    "dhanYoga": { "en": "string", "hi": "string" },
    "peakTriggers": { "en": "string", "hi": "string" }
  },
  "warnings": {
    "personalityTypesToAvoid": { "en": "string", "hi": "string" },
    "reasoning": { "en": "string", "hi": "string" }
  },
  "remedies": [
    {
      "title": { "en": "string", "hi": "string" },
      "description": { "en": "string", "hi": "string" },
      "frequency": { "en": "string", "hi": "string" }
    }
  ]
}`;

  try {
    const response = await fetch(`${BACKEND_URL}/nlg/palmistry-analysis`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        systemInstruction,
        prompt,
        palmImage: palmBase64,
        thumbImage: thumbBase64,
        userInfo
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Parse the JSON response from Gemini
    let analysisData;
    if (typeof data.data === 'string') {
      // Remove markdown code blocks if present
      const cleanedText = data.data.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      analysisData = JSON.parse(cleanedText);
    } else if (typeof data.data.text === 'string') {
      const cleanedText = data.data.text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      analysisData = JSON.parse(cleanedText);
    } else {
      analysisData = data.data;
    }

    return analysisData as AnalysisOutput;
  } catch (error) {
    console.error('Palmistry Analysis Error:', error);
    throw error;
  }
};
