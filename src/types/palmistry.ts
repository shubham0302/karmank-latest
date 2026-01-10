
export interface TranslatedText {
  en: string;
  hi: string;
}

export interface TimelineItem {
  period: string; // e.g., "Age 32-36"
  event: TranslatedText;
  insight: TranslatedText;
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface Warning {
  who: TranslatedText;
  why: TranslatedText;
  advice: TranslatedText;
}

export interface AnalysisOutput {
  handElement: TranslatedText;
  skinVarna: TranslatedText;
  nadiLeafCategory: string;
  
  lifeStory: TranslatedText; 

  past: {
    summary: TranslatedText;
    milestones: TimelineItem[]; 
  };
  present: TranslatedText;
  future: TranslatedText;
  
  kandas: {
    general: TranslatedText;      // Kanda 1
    familySpeech: TranslatedText; // Kanda 2
    siblings: TranslatedText;     // Kanda 3
    assetsMother: TranslatedText; // Kanda 4
    progeny: TranslatedText;      // Kanda 5
    debtsEnemies: TranslatedText; // Kanda 6
    union: TranslatedText;        // Kanda 7
    longevityHealth: TranslatedText; // Kanda 8
    fatherFortune: TranslatedText; // Kanda 9
    career: TranslatedText;       // Kanda 10
    gains: TranslatedText;        // Kanda 11
    expenditureTravel: TranslatedText; // Kanda 12
  };

  marriage: {
    ageRange: string;
    timelineDetails: TranslatedText;
    partnerNature: TranslatedText;
  };

  progeny: {
    count: string;
    details: TranslatedText;
    education: TranslatedText;
    talents: TranslatedText;
    lifePath: TranslatedText;
  };

  warnings: Warning[]; // Who to be aware of and why

  millionaireStatus: {
    isMillionaireHand: boolean;
    analysis: TranslatedText;
    wealthPeakAge: string;
    dhanYogaDetected: boolean;
  };
  
  ancestralKarma: TranslatedText;
  soulPurpose: TranslatedText;
  remedies: { type: TranslatedText; action: TranslatedText; benefit: TranslatedText }[];
  yogas: { name: TranslatedText; combination: string; effect: TranslatedText }[];
  
  groundingSources?: GroundingSource[];
}

export interface UserInfo {
  gender: 'male' | 'female' | 'other';
  ageRange: string;
}

export type CaptureState = 'idle' | 'onboarding' | 'capturing_palm' | 'capturing_thumb' | 'analyzing' | 'result';

export interface CapturedImages {
  palm: string | null;
  thumb: string | null;
}

export type Language = 'en' | 'hi';
