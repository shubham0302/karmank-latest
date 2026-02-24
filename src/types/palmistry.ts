
export interface TranslatedText {
  en: string;
  hi: string;
}

export interface TimelineItem {
  period: string; // e.g., "Age 32-36"
  event: TranslatedText;
  insight: TranslatedText;
  // Alternative field names used by some components
  title?: TranslatedText;
  description?: TranslatedText;
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

// ============================================================================
// ADVANCED REMEDY SYSTEM
// Comprehensive remedy types for mantra, rudraksha, chakra, gemstone, ritual
// ============================================================================

export interface MantraDetails {
  mantra: string; // The actual mantra text
  deity: TranslatedText;
  count: number; // e.g., 108
  timing: TranslatedText; // When to chant
  duration: TranslatedText; // How long to continue
}

export interface RudrakshaDetails {
  mukhi: number; // 1-21 mukhi
  planet: TranslatedText;
  wearingDay: TranslatedText;
  metalSetting: TranslatedText; // Gold, Silver, Copper
  placement: TranslatedText; // Where and how to wear
}

export interface ChakraDetails {
  chakra: TranslatedText; // Chakra name
  element: TranslatedText; // Associated element
  color: TranslatedText;
  healingPractice: TranslatedText;
  crystals: TranslatedText[]; // Recommended healing crystals
  yogaAsanas: TranslatedText[]; // Yoga poses for this chakra
}

export interface GemstoneDetails {
  stone: TranslatedText;
  weight: string; // e.g., "3-5 carats"
  metal: TranslatedText;
  finger: TranslatedText; // Which finger to wear
  wearingDay: TranslatedText;
  energizingMantra: string;
}

export interface RitualDetails {
  ritual: TranslatedText;
  frequency: TranslatedText; // Daily, weekly, monthly
  materials: TranslatedText[]; // Items needed
  duration: TranslatedText;
}

export type RemedyCategory = 'mantra' | 'rudraksha' | 'chakra' | 'gemstone' | 'ritual' | 'general';

export interface AdvancedRemedy {
  category: RemedyCategory;
  type: TranslatedText;
  action: TranslatedText;
  benefit: TranslatedText;
  // Category-specific details (only one will be present based on category)
  mantraDetails?: MantraDetails;
  rudrakshaDetails?: RudrakshaDetails;
  chakraDetails?: ChakraDetails;
  gemstoneDetails?: GemstoneDetails;
  ritualDetails?: RitualDetails;
}

// Legacy remedy format for backward compatibility
export interface LegacyRemedy {
  type: TranslatedText;
  action: TranslatedText;
  benefit: TranslatedText;
}

// ============================================================================
// PHASE 1: WORLD-CLASS PALMISTRY TYPES
// Complete palmistry indicator system covering Indian, Western, Chinese schools
// ============================================================================

// Line Detection with Confidence Scoring
export interface LineDetection {
  detected: boolean;
  confidence: number; // 0-100 confidence score
  visualEvidence: string; // What AI actually sees: "Clear deep line from wrist to Jupiter"
  clarity: 'not_visible' | 'faint' | 'moderate' | 'clear' | 'very_clear';

  // Geometric coordinates for overlay visualization (percentage of palm)
  coordinates?: {
    startX: number; // 0-100
    startY: number; // 0-100
    endX: number;
    endY: number;
    curvature?: 'straight' | 'slight_curve' | 'moderate_curve' | 'strong_curve';
    controlPoints?: { x: number; y: number }[]; // For bezier curve rendering
  };
}

// Major Lines with Detection Proof
export interface MajorLineAnalysis {
  line: 'life' | 'head' | 'heart' | 'fate' | 'sun' | 'mercury' | 'health';
  detection: LineDetection;

  // Line characteristics
  characteristics: {
    depth: 'very_faint' | 'faint' | 'moderate' | 'deep' | 'very_deep';
    width: 'thin' | 'medium' | 'broad';
    length: 'short' | 'medium' | 'long' | 'very_long';
    color: 'pale' | 'pink' | 'red' | 'dark';
    texture: 'smooth' | 'chained' | 'islanded' | 'feathered' | 'broken';
  };

  // Starting and ending points
  origin: string; // e.g., "Edge of palm near Jupiter mount"
  terminus: string; // e.g., "Under Saturn mount"

  // Branches and subsidiary lines
  branches?: {
    direction: 'upward' | 'downward' | 'toward_jupiter' | 'toward_saturn' | 'toward_apollo' | 'toward_mercury' | 'toward_luna';
    position: string; // e.g., "At 40% of line length"
    meaning: TranslatedText;
  }[];

  interpretation: TranslatedText;
}

// SPECIAL LINES - Previously Missing
export interface SpecialLineAnalysis {
  // Ring of Solomon (under Jupiter finger - wisdom/teaching)
  ringOfSolomon?: {
    detection: LineDetection;
    completeness: 'partial' | 'complete' | 'double';
    interpretation: TranslatedText;
  };

  // Ring of Saturn (under Saturn finger - fatalistic)
  ringOfSaturn?: {
    detection: LineDetection;
    completeness: 'partial' | 'complete';
    interpretation: TranslatedText;
  };

  // Girdle of Venus (emotional sensitivity arc)
  girdleOfVenus?: {
    detection: LineDetection;
    type: 'single' | 'double' | 'fragmented' | 'chained';
    interpretation: TranslatedText;
  };

  // Via Lascivia (allergy/addiction line)
  viaLascivia?: {
    detection: LineDetection;
    prominence: 'faint' | 'moderate' | 'strong';
    interpretation: TranslatedText;
  };

  // Line of Intuition (psychic crescent on Luna)
  lineOfIntuition?: {
    detection: LineDetection;
    curvature: 'slight' | 'moderate' | 'strong';
    interpretation: TranslatedText;
  };

  // Simian Line (fused head + heart - major indicator)
  simianLine?: {
    detected: boolean;
    hand: 'left' | 'right' | 'both';
    type: 'true_simian' | 'simian_variant' | 'sydney_line';
    visualEvidence: string;
    interpretation: TranslatedText;
  };

  // Sydney Line (extended head line variant)
  sydneyLine?: {
    detected: boolean;
    hand: 'left' | 'right' | 'both';
    interpretation: TranslatedText;
  };

  // Teacher's Square (under Jupiter - teaching ability)
  teachersSquare?: {
    detection: LineDetection;
    clarity: 'faint' | 'clear' | 'very_clear';
    interpretation: TranslatedText;
  };

  // Medical Stigmata (healing ability lines on Mercury)
  medicalStigmata?: {
    detected: boolean;
    count: number; // Usually 3-4 vertical lines
    clarity: 'faint' | 'moderate' | 'clear';
    interpretation: TranslatedText;
  };

  // Mystic Cross (between head and heart - spiritual gift)
  mysticCross?: {
    detection: LineDetection;
    position: 'under_jupiter' | 'under_saturn' | 'center_palm';
    interpretation: TranslatedText;
  };

  // Travel Lines (on Luna mount edge)
  travelLines?: {
    count: number;
    prominent: number; // Number of prominent ones
    foreignSettlement: boolean;
    interpretation: TranslatedText;
  };

  // Bracelets/Rascettes (wrist lines - health/longevity)
  bracelets?: {
    count: number; // 1-4 typically
    firstBraceletShape: 'straight' | 'arched_up' | 'chained' | 'broken';
    healthIndicator: TranslatedText;
    interpretation: TranslatedText;
  };

  // ============================================================================
  // ADDITIONAL SPECIAL LINES (7 more for comprehensive 19-marker system)
  // ============================================================================

  // Ring of Apollo (under ring finger - fame/artistic success)
  ringOfApollo?: {
    detection: LineDetection;
    completeness: 'partial' | 'complete' | 'double';
    interpretation: TranslatedText;
  };

  // Mars Line / Sister Line (parallel to life line - protection/vitality)
  marsLine?: {
    detection: LineDetection;
    length: 'short' | 'medium' | 'long';
    proximity: 'close' | 'moderate' | 'distant'; // Distance from life line
    interpretation: TranslatedText;
  };

  // Worry Lines (horizontal lines on Venus mount - stress patterns)
  worryLines?: {
    detected: boolean;
    count: number;
    depth: 'faint' | 'moderate' | 'deep';
    crossingLifeLine: boolean; // More significant if they cross
    interpretation: TranslatedText;
  };

  // Influence Lines (from Venus mount - people who impact your life)
  influenceLines?: {
    detected: boolean;
    count: number;
    type: 'supportive' | 'challenging' | 'mixed';
    majorInfluenceAges?: number[]; // Ages when major influences appear
    interpretation: TranslatedText;
  };

  // Great Triangle (formed by Life, Head, and Health/Mercury lines)
  greatTriangle?: {
    detected: boolean;
    clarity: 'faint' | 'moderate' | 'clear' | 'very_clear';
    size: 'small' | 'medium' | 'large';
    angles: 'well_defined' | 'open' | 'tight';
    interpretation: TranslatedText;
  };

  // Stars on Mounts (sudden events - context depends on mount location)
  starsOnMounts?: {
    detected: boolean;
    locations: {
      mount: 'jupiter' | 'saturn' | 'apollo' | 'mercury' | 'venus' | 'mars_upper' | 'mars_lower' | 'moon';
      clarity: 'faint' | 'clear';
      meaning: TranslatedText;
    }[];
    interpretation: TranslatedText;
  };

  // Grilles on Mounts (obstacles/challenges in that domain)
  grillesOnMounts?: {
    detected: boolean;
    locations: {
      mount: 'jupiter' | 'saturn' | 'apollo' | 'mercury' | 'venus' | 'mars_upper' | 'mars_lower' | 'moon';
      density: 'sparse' | 'moderate' | 'dense';
      meaning: TranslatedText;
    }[];
    interpretation: TranslatedText;
  };
}

// Enhanced Line Formation with age mapping
export interface LineFormation {
  line: 'life' | 'head' | 'heart' | 'fate' | 'sun' | 'mercury' | 'marriage' | 'health' | 'intuition' | 'travel';
  type: 'break' | 'island' | 'chain' | 'tassel' | 'fork' | 'split' | 'star' | 'cross' | 'square' | 'triangle' | 'grille' | 'dot' | 'circle';
  startAge: number;
  endAge?: number;
  severity: 'minor' | 'moderate' | 'major';
  location: string;
  visualEvidence: string;
  interpretation: TranslatedText;

  // Coordinates for visualization
  coordinates?: {
    x: number; // percentage
    y: number; // percentage
  };
}

export interface GeometricTiming {
  // Life line timing (measured from wrist to Jupiter mount)
  lifeLineLength: number; // Total length in relative units
  agePerUnit: number; // Years per unit length

  // Marriage timing (measured from Mercury mount base)
  marriageLinePosition?: number; // Distance from base
  calculatedMarriageAge?: number; // Geometrically derived age

  // Wealth peak timing (from fate/sun line intersection)
  wealthPeakPosition?: number;
  calculatedWealthAge?: number;

  // Major event ages (derived from line intersections)
  careerChangeAges?: number[];
  healthCrisisAges?: number[];
  relationshipEventAges?: number[];
  // Optional current age marker for timeline visualizations
  currentAge?: number;
}

export interface HandShapeAnalysis {
  palmShape: 'square' | 'rectangular' | 'spatulate' | 'conic' | 'psychic' | 'mixed';
  palmAspectRatio: number; // height/width
  fingertipShape: 'square' | 'spatulate' | 'conic' | 'pointed' | 'mixed';

  interpretation: {
    personality: TranslatedText;
    aptitudes: TranslatedText;
    challenges: TranslatedText;
  };

  visualEvidence: string; // What measurements were used
}

// Enhanced Mount Analysis with Patterns
export interface MountAnalysis {
  mount: 'jupiter' | 'saturn' | 'apollo' | 'mercury' | 'venus' | 'mars_upper' | 'mars_lower' | 'mars_plain' | 'moon' | 'neptune' | 'pluto';
  prominence: number; // 0-100 relative scale
  dominanceRank: number; // 1 = most prominent
  apexPosition: 'central' | 'displaced_jupiter' | 'displaced_saturn' | 'displaced_apollo' | 'displaced_mercury' | 'displaced_luna' | 'low' | 'high';

  // Mount texture and quality
  texture: 'flat' | 'soft' | 'firm' | 'hard' | 'padded';
  color: 'pale' | 'pink' | 'red' | 'bluish';

  // PATTERNS ON MOUNT - Previously Missing
  patterns?: {
    cross?: {
      detected: boolean;
      count: number;
      interpretation: TranslatedText;
    };
    star?: {
      detected: boolean;
      count: number;
      interpretation: TranslatedText;
    };
    square?: {
      detected: boolean;
      interpretation: TranslatedText; // Protection sign
    };
    triangle?: {
      detected: boolean;
      interpretation: TranslatedText; // Talent/success sign
    };
    grille?: {
      detected: boolean;
      interpretation: TranslatedText; // Energy block/diffusion
    };
    circle?: {
      detected: boolean;
      interpretation: TranslatedText; // Rare - special meaning
    };
    trident?: {
      detected: boolean;
      interpretation: TranslatedText; // Very auspicious
    };
  };

  observations: string;
  interpretation: TranslatedText;
}

// Mars Plain (Triangle of Mars) - Previously Missing
export interface MarsPlainAnalysis {
  detected: boolean;
  shape: 'well_formed' | 'irregular' | 'absent';
  size: 'small' | 'medium' | 'large';
  interpretation: TranslatedText; // Courage, temper, aggression
}

// Enhanced Finger Analysis - Complete Assessment
export interface FingerAnalysis {
  finger: 'jupiter' | 'saturn' | 'apollo' | 'mercury' | 'thumb';

  // Phalanx proportions (percentage of total finger length)
  phalanxProportions: {
    top: number; // Mental/spiritual realm
    middle: number; // Practical application
    bottom: number; // Material/physical desires
  };

  relativeLength: 'very_short' | 'short' | 'balanced' | 'long' | 'very_long';
  dominance: 'underdeveloped' | 'balanced' | 'overdeveloped';

  // FINGER TIP SHAPE - Previously incomplete
  tipShape: 'square' | 'spatulate' | 'conic' | 'pointed' | 'mixed';

  // FINGER SETTING - Previously Missing
  setting: 'very_low' | 'low' | 'even' | 'high'; // Relative to other fingers

  // KNUCKLE DEVELOPMENT - Previously Missing
  knuckles: {
    development: 'smooth' | 'slightly_knotty' | 'knotty' | 'very_knotty';
    philosophicalKnot: boolean; // Upper knuckle - analytical thinking
    materialKnot: boolean; // Lower knuckle - orderliness
  };

  // FLEXIBILITY - Previously Missing
  flexibility: 'stiff' | 'firm' | 'flexible' | 'supple' | 'double_jointed';

  interpretation: TranslatedText;
}

// Thumb Analysis - Enhanced (Critical in Nadi Shastra)
export interface ThumbAnalysis {
  detection: LineDetection;

  // Thumb angle (angle of opposition)
  angle: {
    degrees: number; // 0-90 degrees from palm
    classification: 'close_set' | 'moderate' | 'wide_set' | 'very_wide';
    interpretation: TranslatedText; // Willpower, generosity
  };

  // Thumb flexibility
  flexibility: {
    type: 'stiff' | 'firm' | 'flexible' | 'supple' | 'hitchhikers';
    interpretation: TranslatedText; // Adaptability vs stubbornness
  };

  // Phalanx analysis
  willPhalanx: {
    length: 'short' | 'medium' | 'long';
    shape: 'clubbed' | 'waisted' | 'broad' | 'paddle';
    interpretation: TranslatedText;
  };

  logicPhalanx: {
    length: 'short' | 'medium' | 'long';
    shape: 'thin' | 'average' | 'thick';
    interpretation: TranslatedText;
  };

  // Mount of Venus (base of thumb)
  mountOfVenus: {
    prominence: number; // 0-100
    interpretation: TranslatedText;
  };

  // Overall thumb interpretation
  interpretation: TranslatedText;
}

// Finger Spacing Analysis - Previously Missing
export interface FingerSpacingAnalysis {
  overallSpacing: 'tight' | 'close' | 'moderate' | 'wide' | 'very_wide';

  // Individual gaps
  jupiterSaturnGap: 'closed' | 'slight' | 'wide'; // Independence
  saturnApolloGap: 'closed' | 'slight' | 'wide'; // Freedom from worry
  apolloMercuryGap: 'closed' | 'slight' | 'wide'; // Independence of thought

  interpretation: TranslatedText;
}

// Nail Analysis - Previously Missing
export interface NailAnalysis {
  finger: 'jupiter' | 'saturn' | 'apollo' | 'mercury' | 'thumb';

  shape: 'square' | 'broad' | 'fan_shaped' | 'narrow' | 'almond' | 'pointed' | 'short_bitten';

  // Health indicators
  color: 'pale' | 'pink' | 'red' | 'bluish' | 'yellowish';
  texture: 'smooth' | 'ridged_vertical' | 'ridged_horizontal' | 'pitted' | 'spoon_shaped';

  // Moons (lunulae)
  moons: {
    visible: boolean;
    size: 'absent' | 'small' | 'medium' | 'large';
  };

  healthIndicator: TranslatedText;
  personalityIndicator: TranslatedText;
}

// Dermatoglyphic Analysis - Previously Missing (Fingerprint Patterns)
export interface DermatoglyphicAnalysis {
  dominantPattern: 'arch' | 'loop_ulnar' | 'loop_radial' | 'whorl' | 'composite';

  // Individual finger patterns
  fingerPatterns: {
    jupiter: 'arch' | 'loop_ulnar' | 'loop_radial' | 'whorl' | 'composite' | 'tented_arch';
    saturn: 'arch' | 'loop_ulnar' | 'loop_radial' | 'whorl' | 'composite' | 'tented_arch';
    apollo: 'arch' | 'loop_ulnar' | 'loop_radial' | 'whorl' | 'composite' | 'tented_arch';
    mercury: 'arch' | 'loop_ulnar' | 'loop_radial' | 'whorl' | 'composite' | 'tented_arch';
    thumb: 'arch' | 'loop_ulnar' | 'loop_radial' | 'whorl' | 'composite' | 'tented_arch';
  };

  // Thumb pattern (critical in Nadi)
  thumbPattern: {
    type: 'arch' | 'loop_ulnar' | 'loop_radial' | 'whorl' | 'composite' | 'peacock_eye';
    ridgeCount?: number;
    interpretation: TranslatedText;
  };

  // Total ridge count (TRC) - scientific measure
  estimatedRidgeCount: 'low' | 'average' | 'high';

  interpretation: TranslatedText;
}

export interface HealthTimeline {
  ageRange: string; // e.g., "28-32"
  indicator: string; // Specific palm feature
  vulnerability: TranslatedText;
  preventiveMeasures: TranslatedText;
  severity: 'minor' | 'moderate' | 'major';
}

export interface ProgenyAnalysis {
  count: string;
  details: TranslatedText;
  indicator?: TranslatedText; // Palm feature showing progeny lines

  // NEW: Geometric evidence
  progenyLines?: {
    lineNumber: number;
    depth: 'shallow' | 'medium' | 'deep';
    length: 'short' | 'medium' | 'long';
    position: number; // Distance from Mercury base
    predictedGender: 'male_likely' | 'female_likely' | 'neutral';
    estimatedBirthAge?: number;
    healthIndicators?: string; // Breaks, islands, etc.
  }[];

  confidence: 'low' | 'medium' | 'high'; // Based on line clarity

  education: TranslatedText;
  talents: TranslatedText;
  lifePath: TranslatedText;
}

export interface AncestralKarmaAnalysis {
  // Visual Evidence from Palm
  visualEvidence: {
    karmaLines?: {
      count: number;
      depth: 'light' | 'medium' | 'deep';
      location: 'upper' | 'middle' | 'lower'; // Position on Saturn mount
      description: string;
    }[];
    familyPatterns?: {
      type: 'parallel_lines' | 'repeated_islands' | 'broken_fate' | 'chain_formations';
      ageCorrelation?: number; // If matches parent's age of challenge
      description: string;
    }[];
    generationalDebt?: {
      indicator: string; // e.g., "Weak fate line start", "Multiple crosses on Saturn"
      severity: 'minor' | 'moderate' | 'major';
      description: string;
    }[];
  };

  // Interpretation based on evidence
  interpretation: TranslatedText;

  // Specific remedies for ancestral karma
  remedies: TranslatedText[];

  // Overall karma severity
  karmaSeverity: 'light' | 'moderate' | 'heavy';
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
    indicator?: TranslatedText; // Palm feature showing marriage line
    interpretation?: TranslatedText; // Detailed interpretation
  };

  progeny: ProgenyAnalysis;

  warnings: Warning[]; // Who to be aware of and why

  millionaireStatus: {
    isMillionaireHand: boolean;
    analysis: TranslatedText;
    wealthPeakAge: string;
    dhanYogaDetected: boolean;
    potential?: string; // Millionaire potential classification (e.g., "High", "Moderate")
    interpretation?: TranslatedText; // Detailed wealth interpretation
  };

  ancestralKarma: TranslatedText | AncestralKarmaAnalysis; // Support both old and new formats
  soulPurpose: TranslatedText;
  remedies: (AdvancedRemedy | LegacyRemedy)[]; // Support both advanced and legacy remedy formats
  yogas: { name: TranslatedText; combination: string; effect: TranslatedText }[];

  groundingSources?: GroundingSource[];

  // ============================================================================
  // PHASE 1: WORLD-CLASS PALMISTRY ANALYSIS FIELDS
  // ============================================================================

  // GEOMETRIC TIMING (existing)
  geometricTiming?: GeometricTiming;

  // LINE FORMATIONS with ages (existing, enhanced)
  lineFormations?: LineFormation[];

  // HAND SHAPE ANALYSIS (existing)
  handShapeAnalysis?: HandShapeAnalysis;

  // MOUNT ANALYSIS with patterns (enhanced)
  mountAnalysis?: MountAnalysis[];

  // MARS PLAIN / Triangle of Mars (NEW)
  marsPlain?: MarsPlainAnalysis;

  // FINGER ANALYSIS (enhanced)
  fingerAnalysis?: FingerAnalysis[];

  // THUMB ANALYSIS - Critical for Nadi (NEW)
  thumbAnalysis?: ThumbAnalysis;

  // FINGER SPACING (NEW)
  fingerSpacing?: FingerSpacingAnalysis;

  // NAIL ANALYSIS (NEW)
  nailAnalysis?: NailAnalysis[];

  // DERMATOGLYPHIC / Fingerprint Analysis (NEW)
  dermatoglyphics?: DermatoglyphicAnalysis;

  // HEALTH TIMELINE (existing)
  healthTimeline?: HealthTimeline[];

  // MAJOR LINES with Detection Proof (NEW)
  majorLines?: {
    lifeLine?: MajorLineAnalysis;
    headLine?: MajorLineAnalysis;
    heartLine?: MajorLineAnalysis;
    fateLine?: MajorLineAnalysis;
    sunLine?: MajorLineAnalysis;
    mercuryLine?: MajorLineAnalysis;
    healthLine?: MajorLineAnalysis;
  };

  // SPECIAL LINES - Previously Missing (NEW)
  specialLines?: SpecialLineAnalysis;

  // MARRIAGE LINES with Detection (NEW - enhanced)
  marriageLines?: {
    count: number;
    lines: {
      position: number; // Distance from heart line
      calculatedAge: number;
      depth: 'faint' | 'moderate' | 'deep';
      length: 'short' | 'medium' | 'long';
      formations?: string[]; // "fork", "island", "break"
      interpretation: TranslatedText;
    }[];
    primaryMarriageAge: number;
  };

  // LINE DETECTION PROOF - Visual Evidence (NEW)
  lineDetectionProof?: {
    overallConfidence: number; // 0-100
    imageQuality: 'poor' | 'fair' | 'good' | 'excellent';
    linesDetected: string[];
    linesNotVisible: string[];
    recommendation?: string; // "Please retake with better lighting"

    // For overlay visualization
    detectedCoordinates?: {
      line: string;
      points: { x: number; y: number }[];
      confidence: number;
    }[];
  };

  // HAND COMPARISON (Left vs Right) - NEW
  handComparison?: {
    analyzedHand: 'left' | 'right';
    dominantHand: 'left' | 'right';
    recommendation: TranslatedText; // Which hand to read for what
  };

  // Verification & Quality
  verificationConfidence?: number;
  validationScore?: number;

  // ANALYSIS QUALITY METRICS (NEW)
  analysisQuality?: {
    overallScore: number; // 0-100
    lineDetectionScore: number;
    mountDetectionScore: number;
    specialMarkersScore: number;
    imageQualityScore: number;
    completenessScore: number;
    grade: 'A' | 'B' | 'C' | 'D' | 'F';
    improvementSuggestions: string[];
  };

  // PREDICTION CONFIDENCE SCORES (TIER 4 - World Class)
  predictionConfidence?: PredictionConfidence;

  // CROSS-KANDA CONSISTENCY CHECK (P1 Enhancement)
  kandaConsistency?: {
    isConsistent: boolean;
    score: number; // 0-100
    warnings: {
      type: 'timeline_conflict' | 'thematic_conflict' | 'severity_mismatch';
      kandas: string[];
      description: string;
      severity: 'minor' | 'moderate' | 'major';
    }[];
  };

  // RELATIVE FINGER ANALYSIS (Full-Hand Capture)
  fingerLengthRatios?: {
    jupiterToSaturn: number;
    apolloToSaturn: number;
    mercuryReachesApolloKnuckle: boolean;
    thumbToJupiter: number;
    twoD_fourD_ratio?: number;
    interpretation?: {
      leadership?: TranslatedText;
      creativity?: TranslatedText;
      communication?: TranslatedText;
    };
  };

  planetaryBalance?: {
    jupiter: { strength: number; expression: string; traits: TranslatedText };
    saturn: { strength: number; expression: string; traits: TranslatedText };
    apollo: { strength: number; expression: string; traits: TranslatedText };
    mercury: { strength: number; expression: string; traits: TranslatedText };
    overallBalance: string;
    imbalanceWarnings?: TranslatedText[];
  };

  personalityDominance?: {
    primary: string;
    secondary: string | null;
    scores: {
      leadership: number;
      discipline: number;
      creativity: number;
      communication: number;
      willpower: number;
    };
    analysis: TranslatedText;
    confidence: number;
  };
}

// Prediction Confidence Interface - Shows AI confidence for each prediction
export interface PredictionConfidence {
  overall: number; // 0-100 overall confidence

  // Individual prediction confidences
  marriageAge: {
    confidence: number;
    basis: string; // What the prediction is based on
    reliability: 'high' | 'medium' | 'low';
  };

  progenyCount: {
    confidence: number;
    basis: string;
    reliability: 'high' | 'medium' | 'low';
  };

  wealthPeak: {
    confidence: number;
    basis: string;
    reliability: 'high' | 'medium' | 'low';
  };

  healthTimeline: {
    confidence: number;
    basis: string;
    reliability: 'high' | 'medium' | 'low';
  };

  careerPath: {
    confidence: number;
    basis: string;
    reliability: 'high' | 'medium' | 'low';
  };

  lifeExpectancy: {
    confidence: number;
    basis: string;
    reliability: 'high' | 'medium' | 'low';
  };

  // Factors affecting confidence
  confidenceFactors: {
    imageQuality: number;
    lineClarity: number;
    mountVisibility: number;
    specialMarkers: number;
    consistencyCheck: number;
  };

  // Recommendations for improving confidence
  improvementTips: string[];
}

export interface UserInfo {
  name?: string;
  gender: 'male' | 'female' | 'other';
  ageRange?: string;
  dob?: string;  // Date of birth (YYYY-MM-DD format)
  age?: string;  // Age in years (string for form input)
}

export type CaptureState = 'idle' | 'onboarding' | 'capturing_palm' | 'capturing_thumb' | 'analyzing' | 'result';

export interface CapturedImages {
  palm: string | null;
  thumb: string | null;
}

export type Language = 'en' | 'hi' | 'ta' | 'sa' | 'en-hi';

// Extended translated text supporting all languages
export interface MultiLangText {
  en: string;
  hi: string;
  ta?: string; // Tamil
  sa?: string; // Sanskrit
}

// ============================================================================
// FULL-HAND CAPTURE ARCHITECTURE
// Two-layer capture system for relative finger analysis
// ============================================================================

// Finger length measurements (relative to Saturn/middle finger = 1.0)
export interface FingerLengthRatios {
  jupiter: number;    // Index finger - typically 0.85-0.92 of Saturn
  saturn: number;     // Middle finger - always 1.0 (reference)
  apollo: number;     // Ring finger - typically 0.90-0.98 of Saturn
  mercury: number;    // Little finger - typically 0.70-0.85 of Apollo
  thumb: number;      // Thumb - typically 0.55-0.65 of Jupiter
}

// Phalanx (finger section) proportions
export interface PhalanxProportions {
  top: number;        // Tip section (mental/spiritual) - percentage
  middle: number;     // Middle section (practical) - percentage
  bottom: number;     // Base section (material) - percentage
}

// Individual finger metrics
export interface FingerMetrics {
  totalLength: number;           // Pixels or relative units
  phalanxProportions: PhalanxProportions;
  tipShape: 'square' | 'spatulate' | 'conic' | 'pointed' | 'mixed';
  setting: 'very_low' | 'low' | 'even' | 'high';  // Base position relative to others
  knuckles: {
    development: 'smooth' | 'slightly_knotty' | 'knotty' | 'very_knotty';
    philosophicalKnot: boolean;   // First knuckle prominence (analytical mind)
    materialKnot: boolean;        // Second knuckle prominence (practical detail)
  };
  flexibility: 'stiff' | 'firm' | 'flexible' | 'supple' | 'double_jointed';
  curvature: number;              // Degrees of curve (+ toward saturn, - toward mercury)
}

// Finger spread analysis
export interface FingerSpreadMetrics {
  totalSpreadAngle: number;       // Total angle from Jupiter to Mercury (degrees)
  jupiterSaturnGap: 'closed' | 'slight' | 'moderate' | 'wide';
  saturnApolloGap: 'closed' | 'slight' | 'moderate' | 'wide';
  apolloMercuryGap: 'closed' | 'slight' | 'moderate' | 'wide';
  naturalPosture: 'closed' | 'moderate' | 'open';
  interpretation: {
    jupiterSaturn: TranslatedText;   // Independence indicator
    saturnApollo: TranslatedText;    // Responsibility-creativity balance
    apolloMercury: TranslatedText;   // Social openness
  };
}

// Thumb-specific metrics
export interface ThumbMetrics {
  angle: number;                  // Opposition angle (0-90 degrees from palm)
  flexibility: 'stiff' | 'moderate' | 'flexible' | 'hitchhiker';
  willPhalanx: {
    length: 'short' | 'medium' | 'long';
    shape: 'clubbed' | 'broad' | 'average' | 'waisted';
  };
  logicPhalanx: {
    length: 'short' | 'medium' | 'long';
    shape: 'thick' | 'average' | 'narrow';
  };
  willToLogicRatio: number;       // Top / bottom phalanx ratio
  lengthRatio: number;            // Thumb / Jupiter ratio
}

// Complete full-hand metrics (extracted from single full-hand image)
export interface FullHandMetrics {
  // === CAPTURE METADATA ===
  captureTimestamp: number;
  imageQuality: number;           // 0-100 overall quality score

  // === FINGER LENGTH RATIOS (Key palmistry features) ===
  fingerLengthRatios: FingerLengthRatios;

  // === INDIVIDUAL FINGER METRICS ===
  fingers: {
    jupiter: FingerMetrics;
    saturn: FingerMetrics;
    apollo: FingerMetrics;
    mercury: FingerMetrics;
  };

  // === THUMB METRICS ===
  thumb: ThumbMetrics;

  // === FINGER SPREAD ANALYSIS ===
  spread: FingerSpreadMetrics;

  // === HAND SHAPE (requires full hand view) ===
  handShape: {
    palmAspectRatio: number;      // Palm height / width
    fingerPalmRatio: number;      // Average finger length / palm length
    element: 'earth' | 'air' | 'fire' | 'water';
    classification: 'square' | 'rectangular' | 'spatulate' | 'conic' | 'psychic' | 'mixed';
  };

  // === VALIDATION FLAGS ===
  validation: {
    allFingersVisible: boolean;
    thumbVisible: boolean;
    palmOpen: boolean;
    noMotionBlur: boolean;
    lightingEven: boolean;
    fingertipsSharp: boolean;
    naturalSpread: boolean;
    wristVisible: boolean;
  };
}

// Planetary balance derived from finger analysis
export interface PlanetaryBalance {
  jupiter: {
    strength: number;             // 0-100 relative to Saturn baseline
    expression: 'weak' | 'underdeveloped' | 'balanced' | 'strong' | 'dominant';
    traits: TranslatedText;
  };
  saturn: {
    strength: number;             // Always 100 (reference)
    expression: 'reference_baseline';
    traits: TranslatedText;
  };
  apollo: {
    strength: number;
    expression: 'weak' | 'underdeveloped' | 'balanced' | 'strong' | 'dominant';
    traits: TranslatedText;
  };
  mercury: {
    strength: number;
    expression: 'weak' | 'underdeveloped' | 'balanced' | 'strong' | 'dominant';
    traits: TranslatedText;
  };
  overallBalance: 'balanced' | 'jupiter_dominant' | 'saturn_dominant' |
                  'apollo_dominant' | 'mercury_dominant' | 'mixed';
  imbalanceWarnings: TranslatedText[];
}

// Personality dominance derived from finger proportions
export interface PersonalityDominance {
  primary: 'leadership' | 'discipline' | 'creativity' | 'communication' | 'willpower';
  secondary: 'leadership' | 'discipline' | 'creativity' | 'communication' | 'willpower' | null;
  scores: {
    leadership: number;           // 0-100 (Jupiter indicators)
    discipline: number;           // 0-100 (Saturn indicators)
    creativity: number;           // 0-100 (Apollo indicators)
    communication: number;        // 0-100 (Mercury indicators)
    willpower: number;            // 0-100 (Thumb indicators)
  };
  analysis: TranslatedText;
  confidence: number;
}

// Two-layer capture session
export interface CaptureSession {
  sessionId: string;
  userId: string;

  // Layer 1 - MANDATORY: Full hand capture
  fullHandCapture: {
    image: string;                // Base64
    captured: boolean;
    validated: boolean;
    metrics: FullHandMetrics | null;
    qualityScore: number;
    failureReasons: string[];
  };

  // Layer 2 - OPTIONAL: Detail captures (use Layer 1 as reference)
  detailCaptures: {
    palmCloseup?: { image: string; qualityScore: number };
    thumbCloseup?: { image: string; qualityScore: number };
    fingerCloseups?: {
      jupiter?: { image: string; qualityScore: number };
      saturn?: { image: string; qualityScore: number };
      apollo?: { image: string; qualityScore: number };
      mercury?: { image: string; qualityScore: number };
    };
  };

  // Derived analysis
  planetaryBalance: PlanetaryBalance | null;
  personalityDominance: PersonalityDominance | null;

  // Session state
  state: 'awaiting_full_hand' | 'validating_full_hand' | 'full_hand_failed' |
         'full_hand_complete' | 'capturing_details' | 'analysis_ready';
}

// Full-hand image validation result
export interface FullHandValidation {
  passed: boolean;
  score: number;                  // 0-100 weighted score
  checks: {
    name: string;
    passed: boolean;
    score: number;
    weight: number;
    message?: string;
  }[];
  criticalFailures: string[];
  suggestions: string[];
}

// Extended capture state to support two-layer architecture
export type ExtendedCaptureState =
  | 'idle'
  | 'onboarding'
  | 'capturing_full_hand'         // NEW: Layer 1
  | 'validating_full_hand'        // NEW: Validation
  | 'capturing_palm'              // Layer 2 detail
  | 'capturing_thumb'             // Layer 2 detail
  | 'capturing_fingers'           // NEW: Layer 2 individual fingers
  | 'analyzing'
  | 'result';

// Extended captured images to include full hand
export interface ExtendedCapturedImages {
  fullHand: string | null;        // NEW: Mandatory first capture
  palm: string | null;
  thumb: string | null;
  fingers?: {
    jupiter?: string;
    saturn?: string;
    apollo?: string;
    mercury?: string;
  };
}
