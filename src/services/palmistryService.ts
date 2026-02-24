import { AnalysisOutput, UserInfo, PredictionConfidence } from "../types/palmistry";
import { validateAnalysisOutput, getQualityGrade, isAcceptableQuality } from "./palmistryValidator";
import { generateBiometricHash } from "./nadiReadingService";

// In-memory cache for analysis results (24-hour TTL)
interface CacheEntry {
  data: AnalysisOutput;
  timestamp: number;
}

const analysisCache = new Map<string, CacheEntry>();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

/**
 * Validate that AI response has all critical fields populated
 */
function validateCriticalFields(data: any): { isValid: boolean; missingFields: string[] } {
  const missing: string[] = [];

  // Check all 12 Kandas
  const kandaFields = [
    'general', 'familySpeech', 'siblings', 'assetsMother',
    'progeny', 'debtsEnemies', 'union', 'longevityHealth',
    'fatherFortune', 'career', 'gains', 'expenditureTravel'
  ];

  if (!data.kandas) {
    missing.push('kandas object');
  } else {
    for (const kanda of kandaFields) {
      if (!data.kandas[kanda] || !data.kandas[kanda].en || !data.kandas[kanda].hi) {
        missing.push(`kandas.${kanda}`);
      }
    }
  }

  // Check yogas (must have at least 1 - relaxed from 2 for poor quality images)
  if (!data.yogas || !Array.isArray(data.yogas) || data.yogas.length < 1) {
    missing.push('yogas (need at least 1, found ' + (data.yogas?.length || 0) + ')');
  }

  // Check millionaireStatus
  if (!data.millionaireStatus) {
    missing.push('millionaireStatus');
  } else {
    const required = ['isMillionaireHand', 'analysis', 'wealthPeakAge', 'dhanYogaDetected'];
    for (const field of required) {
      if (data.millionaireStatus[field] === undefined) {
        missing.push(`millionaireStatus.${field}`);
      }
    }
  }

  // Check handElement
  if (!data.handElement || !data.handElement.en || !data.handElement.hi) {
    missing.push('handElement');
  }

  // Check progeny
  if (!data.progeny || !data.progeny.count || !data.progeny.details) {
    missing.push('progeny (incomplete)');
  }

  // Check marriage
  if (!data.marriage || !data.marriage.ageRange) {
    missing.push('marriage');
  }

  return {
    isValid: missing.length === 0,
    missingFields: missing
  };
}

/**
 * Cross-Kanda Consistency Validator
 * Checks for contradictions and timeline conflicts across the 12 Kandas
 */
interface KandaConsistencyWarning {
  type: 'timeline_conflict' | 'thematic_conflict' | 'severity_mismatch';
  kandas: string[];
  description: string;
  severity: 'minor' | 'moderate' | 'major';
}

function validateKandaConsistency(data: any): {
  isConsistent: boolean;
  score: number;
  warnings: KandaConsistencyWarning[];
} {
  const warnings: KandaConsistencyWarning[] = [];

  // Helper: Extract age mentions from text
  const extractAges = (text: string): number[] => {
    if (!text) return [];
    const ages: number[] = [];
    // Match patterns like "age 25", "25 years", "25-30", "at 25"
    const patterns = [
      /age\s*(\d{1,2})/gi,
      /(\d{1,2})\s*years?\s*old/gi,
      /at\s*(\d{1,2})/gi,
      /around\s*(\d{1,2})/gi,
      /(\d{1,2})-(\d{1,2})/g,
      /by\s*(\d{1,2})/gi
    ];
    patterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        if (match[1]) ages.push(parseInt(match[1]));
        if (match[2]) ages.push(parseInt(match[2]));
      }
    });
    return ages.filter(a => a >= 10 && a <= 100);
  };

  // Helper: Check for negative keywords
  const hasNegativeIndicators = (text: string): boolean => {
    if (!text) return false;
    const negatives = [
      'crisis', 'danger', 'loss', 'failure', 'struggle', 'difficult', 'challenge',
      'problem', 'obstacle', 'setback', 'decline', 'illness', 'disease', 'accident',
      'conflict', 'tension', 'stress', 'debt', 'enemy', 'opposition'
    ];
    const lower = text.toLowerCase();
    return negatives.some(n => lower.includes(n));
  };

  // Helper: Check for positive keywords
  const hasPositiveIndicators = (text: string): boolean => {
    if (!text) return false;
    const positives = [
      'success', 'prosperity', 'wealth', 'fortune', 'blessing', 'growth', 'achievement',
      'promotion', 'gain', 'profit', 'happiness', 'harmony', 'love', 'support',
      'victory', 'triumph', 'abundance', 'luck', 'favorable'
    ];
    const lower = text.toLowerCase();
    return positives.some(p => lower.includes(p));
  };

  if (!data.kandas) {
    return { isConsistent: true, score: 100, warnings: [] };
  }

  const kandas = data.kandas;
  const kandaTexts: Record<string, string> = {};
  const kandaAges: Record<string, number[]> = {};

  // Extract text and ages from each Kanda
  const kandaNames = [
    'general', 'familySpeech', 'siblings', 'assetsMother',
    'progeny', 'debtsEnemies', 'union', 'longevityHealth',
    'fatherFortune', 'career', 'gains', 'expenditureTravel'
  ];

  kandaNames.forEach(name => {
    const kanda = kandas[name];
    kandaTexts[name] = kanda?.en || '';
    kandaAges[name] = extractAges(kanda?.en || '');
  });

  // === CHECK 1: Marriage (union) vs Health (longevityHealth) Timeline ===
  const unionAges = kandaAges['union'];
  const healthAges = kandaAges['longevityHealth'];
  const healthText = kandaTexts['longevityHealth'];

  if (unionAges.length > 0 && hasNegativeIndicators(healthText)) {
    // Check if health issues overlap with marriage timing
    healthAges.forEach(healthAge => {
      unionAges.forEach(marriageAge => {
        if (Math.abs(healthAge - marriageAge) <= 3) {
          warnings.push({
            type: 'timeline_conflict',
            kandas: ['union', 'longevityHealth'],
            description: `Marriage timing (age ${marriageAge}) overlaps with health concern period (age ${healthAge}). Consider noting this correlation.`,
            severity: 'moderate'
          });
        }
      });
    });
  }

  // === CHECK 2: Career vs Gains Consistency ===
  const careerText = kandaTexts['career'];
  const gainsText = kandaTexts['gains'];

  const careerNegative = hasNegativeIndicators(careerText);
  const gainsPositive = hasPositiveIndicators(gainsText) && !hasNegativeIndicators(gainsText);

  if (careerNegative && gainsPositive) {
    warnings.push({
      type: 'thematic_conflict',
      kandas: ['career', 'gains'],
      description: 'Career Kanda indicates struggles while Gains Kanda shows prosperity. Clarify the timeline or source of gains.',
      severity: 'minor'
    });
  }

  // === CHECK 3: Progeny vs Union Consistency ===
  const progenyAges = kandaAges['progeny'];
  const progenyText = kandaTexts['progeny'];

  if (progenyAges.length > 0 && unionAges.length > 0) {
    const minProgenyAge = Math.min(...progenyAges);
    const maxUnionAge = Math.max(...unionAges);

    // Progeny before marriage is possible but worth noting
    if (minProgenyAge < maxUnionAge - 2) {
      warnings.push({
        type: 'timeline_conflict',
        kandas: ['progeny', 'union'],
        description: `Progeny timing (age ${minProgenyAge}) appears before or close to marriage timing (age ${maxUnionAge}). Verify sequence.`,
        severity: 'minor'
      });
    }
  }

  // === CHECK 4: Debts/Enemies vs Gains Timing ===
  const debtsText = kandaTexts['debtsEnemies'];
  const debtsAges = kandaAges['debtsEnemies'];
  const gainsAges = kandaAges['gains'];

  if (debtsAges.length > 0 && gainsAges.length > 0) {
    debtsAges.forEach(debtAge => {
      gainsAges.forEach(gainAge => {
        if (Math.abs(debtAge - gainAge) <= 2) {
          warnings.push({
            type: 'timeline_conflict',
            kandas: ['debtsEnemies', 'gains'],
            description: `Financial challenge (age ${debtAge}) coincides with gains period (age ${gainAge}). May indicate volatile financial period.`,
            severity: 'moderate'
          });
        }
      });
    });
  }

  // === CHECK 5: Father Fortune vs Assets/Mother ===
  const fatherText = kandaTexts['fatherFortune'];
  const assetsText = kandaTexts['assetsMother'];

  const fatherPositive = hasPositiveIndicators(fatherText);
  const assetsNegative = hasNegativeIndicators(assetsText);

  if (fatherPositive && assetsNegative) {
    // This could be valid (paternal fortune vs maternal challenges)
    // but worth flagging for review
    warnings.push({
      type: 'thematic_conflict',
      kandas: ['fatherFortune', 'assetsMother'],
      description: 'Paternal fortune indicated while maternal/assets show challenges. Ensure parental karmas are distinctly explained.',
      severity: 'minor'
    });
  }

  // === CHECK 6: Longevity vs Travel (expenditure) ===
  const travelText = kandaTexts['expenditureTravel'];
  const travelAges = kandaAges['expenditureTravel'];

  if (hasNegativeIndicators(healthText) && healthAges.length > 0) {
    travelAges.forEach(travelAge => {
      healthAges.forEach(healthAge => {
        if (Math.abs(travelAge - healthAge) <= 2) {
          warnings.push({
            type: 'severity_mismatch',
            kandas: ['longevityHealth', 'expenditureTravel'],
            description: `Major travel/expenditure (age ${travelAge}) near health concern period (age ${healthAge}). Recommend health precautions during travel.`,
            severity: 'moderate'
          });
        }
      });
    });
  }

  // Calculate consistency score
  let score = 100;
  warnings.forEach(w => {
    if (w.severity === 'major') score -= 15;
    else if (w.severity === 'moderate') score -= 8;
    else score -= 3;
  });

  return {
    isConsistent: warnings.length === 0,
    score: Math.max(0, score),
    warnings
  };
}

/**
 * Generate AI Prediction Confidence Scores
 * Calculates confidence levels for each prediction based on analysis quality
 */
function generatePredictionConfidence(data: any): PredictionConfidence {
  // Extract quality metrics from the analysis
  const imageQuality = data.lineDetectionProof?.overallConfidence || 70;
  const analysisQuality = data.analysisQuality;

  // Calculate line clarity based on major lines detection
  const majorLines = data.majorLines || {};
  const lineConfidences = Object.values(majorLines)
    .filter((line: any) => line?.detection?.detected)
    .map((line: any) => line?.detection?.confidence || 0);
  const lineClarity = lineConfidences.length > 0
    ? Math.round(lineConfidences.reduce((a: number, b: number) => a + b, 0) / lineConfidences.length)
    : 60;

  // Calculate mount visibility
  const mounts = data.mountAnalysis || [];
  const mountCount = Array.isArray(mounts) ? mounts.filter((m: any) => m?.prominence > 30).length : 0;
  const mountVisibility = Math.min(100, 40 + (mountCount * 8));

  // Calculate special markers score
  const specialLines = data.specialLines || {};
  let specialMarkersDetected = 0;
  ['ringOfSolomon', 'girdleOfVenus', 'mysticCross', 'simianLine', 'bracelets', 'travelLines'].forEach(marker => {
    const markerData = specialLines[marker];
    if (markerData?.detection?.detected || markerData?.detected || markerData?.count > 0) {
      specialMarkersDetected++;
    }
  });
  const specialMarkers = Math.min(100, 40 + (specialMarkersDetected * 12));

  // Consistency check - verify data coherence
  let consistencyScore = 80;
  if (data.geometricTiming?.calculatedMarriageAge && data.marriage?.ageRange) {
    const calculatedAge = data.geometricTiming.calculatedMarriageAge;
    const ageRange = data.marriage.ageRange;
    const [minAge] = ageRange.split('-').map((s: string) => parseInt(s));
    if (Math.abs(calculatedAge - minAge) <= 5) {
      consistencyScore = 95;
    } else if (Math.abs(calculatedAge - minAge) <= 10) {
      consistencyScore = 80;
    } else {
      consistencyScore = 60;
    }
  }

  // Calculate individual prediction confidences
  const getReliability = (score: number): 'high' | 'medium' | 'low' => {
    if (score >= 80) return 'high';
    if (score >= 60) return 'medium';
    return 'low';
  };

  // Marriage Age Confidence
  const marriageLineDetected = data.majorLines?.marriageLine?.detection?.detected ||
                               data.marriageLines?.count > 0;
  const marriageConfidence = marriageLineDetected
    ? Math.round((lineClarity * 0.4) + (imageQuality * 0.3) + (consistencyScore * 0.3))
    : Math.round((imageQuality * 0.5) + (consistencyScore * 0.5) - 15);

  // Progeny Confidence
  const progenyLinesDetected = data.progeny?.progenyLines?.length > 0;
  const progenyConfidence = progenyLinesDetected
    ? Math.round((lineClarity * 0.35) + (imageQuality * 0.35) + (specialMarkers * 0.3))
    : Math.round((imageQuality * 0.5) + (lineClarity * 0.5) - 20);

  // Wealth Peak Confidence
  const fateLineDetected = data.majorLines?.fateLine?.detection?.detected;
  const sunLineDetected = data.majorLines?.sunLine?.detection?.detected;
  const wealthConfidence = Math.round(
    (fateLineDetected ? 30 : 0) +
    (sunLineDetected ? 20 : 0) +
    (mountVisibility * 0.3) +
    (imageQuality * 0.2)
  );

  // Health Timeline Confidence
  const healthTimelineExists = data.healthTimeline?.length > 0;
  const braceletCount = data.specialLines?.bracelets?.count || 0;
  const healthConfidence = Math.round(
    (healthTimelineExists ? 25 : 10) +
    (braceletCount > 0 ? 15 : 0) +
    (lineClarity * 0.3) +
    (imageQuality * 0.3)
  );

  // Career Path Confidence
  const careerConfidence = Math.round(
    (fateLineDetected ? 35 : 15) +
    (mountVisibility * 0.35) +
    (imageQuality * 0.3)
  );

  // Life Expectancy Confidence (most uncertain - always lower)
  const lifeLineDetected = data.majorLines?.lifeLine?.detection?.detected;
  const lifeExpectancyConfidence = Math.round(
    (lifeLineDetected ? 30 : 10) +
    (braceletCount >= 3 ? 20 : braceletCount >= 2 ? 10 : 0) +
    (lineClarity * 0.25) +
    (imageQuality * 0.25)
  ) - 10; // Reduce by 10 as life expectancy is inherently uncertain

  // Calculate overall confidence
  const overall = Math.round(
    (marriageConfidence + progenyConfidence + wealthConfidence +
     healthConfidence + careerConfidence + lifeExpectancyConfidence) / 6
  );

  // Generate improvement tips
  const improvementTips: string[] = [];
  if (imageQuality < 75) {
    improvementTips.push('Take palm photo in brighter, even lighting for better line detection');
  }
  if (lineClarity < 70) {
    improvementTips.push('Ensure palm is fully open and flat when taking the photo');
  }
  if (mountVisibility < 70) {
    improvementTips.push('Angle camera slightly to better capture mount elevations');
  }
  if (!lifeLineDetected) {
    improvementTips.push('Life line not clearly detected - retake with higher resolution');
  }
  if (!fateLineDetected) {
    improvementTips.push('Fate line not visible - this is normal for some hands');
  }
  if (consistencyScore < 70) {
    improvementTips.push('Some predictions show inconsistency - consider retaking photos');
  }

  return {
    overall: Math.min(100, Math.max(0, overall)),
    marriageAge: {
      confidence: Math.min(100, Math.max(0, marriageConfidence)),
      basis: marriageLineDetected
        ? 'Marriage line position and depth analysis'
        : 'Inferred from heart line characteristics',
      reliability: getReliability(marriageConfidence)
    },
    progenyCount: {
      confidence: Math.min(100, Math.max(0, progenyConfidence)),
      basis: progenyLinesDetected
        ? 'Progeny lines on Mercury mount detected'
        : 'Estimated from general palm characteristics',
      reliability: getReliability(progenyConfidence)
    },
    wealthPeak: {
      confidence: Math.min(100, Math.max(0, wealthConfidence)),
      basis: fateLineDetected && sunLineDetected
        ? 'Fate and Sun line intersection analysis'
        : fateLineDetected
        ? 'Fate line progression analysis'
        : 'Mount prominence and general indicators',
      reliability: getReliability(wealthConfidence)
    },
    healthTimeline: {
      confidence: Math.min(100, Math.max(0, healthConfidence)),
      basis: healthTimelineExists
        ? 'Line formations and health markers identified'
        : 'Bracelet lines and general vitality indicators',
      reliability: getReliability(healthConfidence)
    },
    careerPath: {
      confidence: Math.min(100, Math.max(0, careerConfidence)),
      basis: fateLineDetected
        ? 'Fate line characteristics and mount analysis'
        : 'Mount prominence and finger proportions',
      reliability: getReliability(careerConfidence)
    },
    lifeExpectancy: {
      confidence: Math.min(100, Math.max(0, lifeExpectancyConfidence)),
      basis: lifeLineDetected && braceletCount >= 2
        ? 'Life line length and bracelet analysis'
        : 'General vitality indicators (inherently uncertain)',
      reliability: getReliability(lifeExpectancyConfidence)
    },
    confidenceFactors: {
      imageQuality: Math.min(100, Math.max(0, imageQuality)),
      lineClarity: Math.min(100, Math.max(0, lineClarity)),
      mountVisibility: Math.min(100, Math.max(0, mountVisibility)),
      specialMarkers: Math.min(100, Math.max(0, specialMarkers)),
      consistencyCheck: Math.min(100, Math.max(0, consistencyScore))
    },
    improvementTips
  };
}

export const analyzeNadiPatterns = async (
  palmBase64: string,
  thumbBase64: string,
  userInfo: UserInfo,
  fullHandBase64?: string  // Optional full-hand image for finger ratio validation
): Promise<AnalysisOutput> => {
  // Generate unique fingerprint for this palm (for caching)
  const biometricFingerprint = await generateBiometricHash(palmBase64 + thumbBase64 + (fullHandBase64 || ''));

  // Check cache first
  const cached = analysisCache.get(biometricFingerprint);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    console.log('✅ Using cached analysis (99% consistency - same hand detected)');
    console.log(`🔄 Cache hit: Analysis from ${new Date(cached.timestamp).toLocaleTimeString()}`);
    return cached.data;
  }

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';

  // ============================================================================
  // PHASE 1: WORLD-CLASS PALMISTRY AI PROMPT
  // Comprehensive analysis covering Indian, Western, Chinese palmistry schools
  // ============================================================================

  const systemInstruction = `You are the World's Greatest Palmist, combining mastery of:
- Indian Samudrika Shastra & Nadi Palmistry (12 Kandas, Yogas, Karma analysis)
- Western Scientific Palmistry (dermatoglyphics, medical markers)
- Chinese Hand Analysis (Five Elements, health correlations)

CRITICAL INSTRUCTION - VISUAL EVIDENCE REQUIRED:
For EVERY line and feature you analyze, you MUST provide:
1. Whether you can ACTUALLY SEE it in the image (detected: true/false)
2. Confidence score (0-100) based on image clarity
3. Visual evidence description ("I see a deep line running from...")
4. If NOT visible, say so honestly - do NOT fabricate readings

IMAGE QUALITY ASSESSMENT (Do this FIRST):
- Assess lighting: Is the palm evenly lit?
- Assess focus: Are lines crisp or blurry?
- Assess angle: Is palm flat and fully visible?
- Rate overall: poor/fair/good/excellent
- If poor quality, note which lines cannot be reliably detected

HAND ELEMENT DETECTION (USE GEOMETRY):
1. Palm Aspect Ratio (height/width): <1.05=SQUARE, 1.05-1.20=BALANCED, >1.20=RECTANGULAR
2. Finger Length vs palm: SHORTER/EQUAL/LONGER
3. Element Rules:
   - SQUARE + SHORT/MEDIUM = EARTH | SQUARE + LONG = AIR
   - BALANCED + SHORT = EARTH | BALANCED + MEDIUM = FIRE | BALANCED + LONG = AIR
   - RECTANGULAR + SHORT/MEDIUM = WATER | RECTANGULAR + LONG = FIRE

MAJOR LINES TO DETECT (with confidence scores):
1. LIFE LINE - Trace from edge near Jupiter/thumb, curving around Venus mount
2. HEAD LINE - Horizontal line across palm, starting near life line
3. HEART LINE - Upper horizontal line under fingers
4. FATE LINE - Vertical line from wrist toward Saturn finger
5. SUN LINE - Vertical line toward Apollo finger (may be absent)
6. MERCURY LINE - Diagonal toward Mercury finger (often absent)
7. HEALTH LINE - Diagonal from Mercury mount (absence is positive)

SPECIAL LINES TO DETECT (world-class differentiators):
1. RING OF SOLOMON - Arc under Jupiter finger (wisdom/teaching gift)
2. RING OF SATURN - Arc under Saturn finger (fatalistic tendency) - RARE
3. GIRDLE OF VENUS - Arc between Jupiter/Mercury (emotional sensitivity)
4. VIA LASCIVIA - Line on Luna mount (allergies/addictions)
5. LINE OF INTUITION - Crescent on Luna (psychic ability) - RARE
6. SIMIAN LINE - Fused head+heart (intense focus) - Check carefully!
7. SYDNEY LINE - Head line extending to percussion
8. MYSTIC CROSS - X between head & heart lines (spiritual gift)
9. TEACHER'S SQUARE - Square under Jupiter (teaching ability)
10. MEDICAL STIGMATA - 3-4 vertical lines on Mercury (healing gift)
11. TRAVEL LINES - Horizontal lines on Luna edge
12. BRACELETS/RASCETTES - Lines at wrist (1-4 typically)

MOUNT ANALYSIS (with pattern detection):
For each mount (Jupiter, Saturn, Apollo, Mercury, Venus, Mars Upper, Mars Lower, Luna, Neptune):
- Prominence: 0-100 scale
- Patterns: Cross, Star, Square, Triangle, Grille, Trident
- Each pattern has specific meaning per mount

FINGER ANALYSIS - RELATIVE PROPORTIONS (CRITICAL FOR ACCURACY):
Use Saturn (middle finger) as the REFERENCE BASELINE for all measurements.

FINGER LENGTH RATIOS (measure and report as decimal):
- Jupiter (Index) to Saturn ratio: typically 0.85-0.92
  * >0.95 = Strong leadership/ambition
  * <0.82 = Reserved, follows rather than leads
- Apollo (Ring) to Saturn ratio: typically 0.90-0.98
  * >0.98 = Strong creativity/self-expression
  * <0.88 = Practical over artistic
- Mercury (Little) reach: where does tip fall relative to Apollo's top knuckle?
  * Above knuckle = Strong communication
  * At knuckle = Average
  * Below knuckle = Communication challenges
- 2D:4D ratio (Jupiter to Apollo): Research-backed personality indicator
  * <0.95 = Higher prenatal testosterone exposure
  * >1.00 = Higher prenatal estrogen exposure

FINGER SETTINGS (base alignment):
- Check where each finger connects to palm
- Low-set Mercury is common and adjusts length interpretation
- High-set Jupiter indicates confidence

PHALANX PROPORTIONS (each finger):
- Top phalanx (tip to first knuckle): Mental/spiritual realm
- Middle phalanx: Practical application
- Bottom phalanx: Material/physical concerns
- Report as percentages (e.g., 30% / 35% / 35%)

FINGER SPACING (spread analysis):
- Jupiter-Saturn gap: Independence of thought
- Saturn-Apollo gap: Responsibility vs creativity balance
- Apollo-Mercury gap: Social openness
- Natural spread angle (20-60 degrees typical)

KNUCKLE DEVELOPMENT:
- Smooth = Intuitive thinker
- Knotty first knuckle = Analytical, philosophical
- Knotty second knuckle = Practical, detail-oriented

FINGERTIP SHAPES:
- Square = Practical, methodical
- Spatulate = Active, inventive
- Conic = Artistic, sensitive
- Pointed = Idealistic, intuitive

THUMB ANALYSIS (Critical in Nadi Shastra):
- Angle of opposition (0-90 degrees from palm)
- Flexibility (stiff to hitchhiker's)
- Will phalanx (top) shape and length
- Logic phalanx (bottom) proportion
- Mount of Venus prominence

DERMATOGLYPHICS (Fingerprint Analysis from thumb image):
- Pattern type: Arch, Loop (ulnar/radial), Whorl, Composite
- Peacock Eye pattern (rare, auspicious in Nadi)

TIMING METHODOLOGY (Geometric Evidence):
- Life line: Divide into segments, each representing ~10 years
- Marriage line position relative to heart line = marriage age
- Fate line intersection with head line ≈ age 35
- Fate line intersection with heart line ≈ age 50

ANCESTRAL KARMA ANALYSIS (Visual Evidence Required):
Look for these specific markers indicating ancestral patterns:
1. KARMA LINES on Saturn mount - vertical lines indicating family debt
   - Count: 1-2 lines normal, 3+ indicates heavy karma
   - Depth: light/medium/deep correlates with severity
   - Location: upper/middle/lower affects timing
2. FAMILY PATTERNS - repeated formations across lines
   - Parallel lines on fate = following parent's path
   - Repeated islands = recurring family challenges
   - Broken fate line start = inherited obstacles
   - Chain formations = entangled family karma
3. GENERATIONAL DEBT indicators
   - Weak fate line origin = childhood family struggles
   - Crosses on Saturn mount = ancestral burdens
   - Islands on life line near thumb = maternal karma
   - Breaks in head line = paternal mental patterns

KARMA SEVERITY CLASSIFICATION:
- "light" = 1-2 minor indicators, easily resolved
- "moderate" = Multiple indicators, requires consistent remedies
- "heavy" = Strong visual evidence, intensive spiritual work needed

REMEDY PRESCRIPTION METHODOLOGY:
Based on palm analysis, prescribe remedies from these categories:
1. MANTRA - Match deity to weakest mount/planet
   - Weak Jupiter = Om Gam Ganapataye Namaha (Ganesha)
   - Weak Saturn = Om Sham Shanicharaya Namaha
   - Weak Sun/Apollo = Om Suryaya Namaha
   - Weak Mercury = Om Bum Budhaya Namaha
   - Weak Moon/Luna = Om Som Somaya Namaha
   - Weak Mars = Om Mangalaya Namaha
   - Weak Venus = Om Shum Shukraya Namaha
2. RUDRAKSHA - Based on mount deficiency
   - 1 Mukhi = Sun energy, leadership
   - 3 Mukhi = Mars energy, courage
   - 4 Mukhi = Mercury, communication
   - 5 Mukhi = Jupiter, wisdom (most common)
   - 6 Mukhi = Venus, relationships
   - 7 Mukhi = Saturn, discipline
   - 8 Mukhi = Rahu, intuition
   - 9 Mukhi = Ketu, spirituality
3. CHAKRA BALANCING - Based on life line issues
   - Root (Muladhara) = survival issues, weak life line start
   - Sacral (Svadhisthana) = relationship issues, heart line problems
   - Solar Plexus (Manipura) = career blocks, weak fate line
   - Heart (Anahata) = emotional issues, islands on heart line
   - Throat (Vishuddha) = communication blocks, weak Mercury
   - Third Eye (Ajna) = intuition blocks, weak Luna mount
   - Crown (Sahasrara) = spiritual disconnection
4. GEMSTONES - Match to strongest beneficial planet
5. RITUALS - For ancestral karma resolution

ETHICAL GUIDELINES:
- Frame health warnings as "areas to monitor" with preventive measures
- Present challenges as opportunities for growth
- Avoid doom predictions - focus on guidance
- Warnings should be about awareness, not fear
- Remedies should be practical and accessible

BILINGUAL: All text fields must have both "en" (English) and "hi" (Hindi) translations.
Return valid JSON matching the complete schema.`;


  // Calculate exact age for precise timing predictions
  const calculateExactAge = (): number => {
    if (userInfo.dob) {
      const birthDate = new Date(userInfo.dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age > 0 ? age : 25;
    }
    // Try to extract from age field or ageRange
    if (userInfo.age) {
      return parseInt(userInfo.age) || 25;
    }
    if (userInfo.ageRange) {
      // Extract midpoint from range like "26-30"
      const match = userInfo.ageRange.match(/(\d+)-(\d+)/);
      if (match) {
        return Math.round((parseInt(match[1]) + parseInt(match[2])) / 2);
      }
      // Handle "71+" case
      if (userInfo.ageRange.includes('+')) {
        return parseInt(userInfo.ageRange) || 75;
      }
    }
    return 25; // Default
  };

  const exactAge = calculateExactAge();

  const prompt = `Perform a WORLD-CLASS Palmistry Analysis for a ${userInfo.gender} aged exactly ${exactAge} years old.

CRITICAL: Use this EXACT age (${exactAge}) for all timing calculations:
- Past events should reference ages before ${exactAge}
- Present analysis for current age ${exactAge}
- Future predictions should start from age ${exactAge + 1} onwards
- Marriage age predictions must account for current age ${exactAge}
- Health timeline ages must be relative to ${exactAge}

IMAGES PROVIDED:
- Image 1: Palm detail (for lines, mounts, special markers)
- Image 2: Thumb (for dermatoglyphics, will phalanx)
- Image 3 (if present): Full hand (for FINGER RATIO ANALYSIS - use this for accurate finger length measurements)

STEP 1: Assess image quality and note any limitations.
STEP 2: Detect all visible lines with confidence scores.
STEP 3: Analyze mounts, fingers, and special markers.
STEP 4: If full-hand image provided, MEASURE finger ratios precisely using Saturn as baseline.
STEP 5: Generate predictions based ONLY on what you can actually see.

FINGER RATIO INSTRUCTIONS (when full-hand image available):
- Use Saturn (middle finger) as 1.0 reference baseline
- Measure Jupiter/Saturn ratio (should be ~0.85-0.92)
- Measure Apollo/Saturn ratio (should be ~0.90-0.98)
- Check if Mercury tip reaches Apollo's top knuckle
- Calculate 2D:4D ratio for personality insight
- Report actual measured ratios in fingerLengthRatios object

REQUIRED OUTPUT FORMAT (JSON) - Include ALL sections:

{
  "lineDetectionProof": {
    "overallConfidence": 85,
    "imageQuality": "good",
    "linesDetected": ["life", "head", "heart", "fate"],
    "linesNotVisible": ["sun", "mercury"],
    "recommendation": "Clear image, good lighting"
  },
  "handElement": { "en": "Fire Hand", "hi": "अग्नि हस्त" },
  "skinVarna": { "en": "string", "hi": "string" },
  "lifeStory": { "en": "A compelling 3-4 sentence narrative", "hi": "string" },
  "past": {
    "summary": { "en": "string", "hi": "string" },
    "milestones": [{ "period": "Age 18-22", "event": { "en": "string", "hi": "string" }, "insight": { "en": "string", "hi": "string" } }]
  },
  "present": { "en": "string", "hi": "string" },
  "future": { "en": "string", "hi": "string" },
  "kandas": {
    "general": { "en": "Kanda 1 content - 3+ sentences", "hi": "string" },
    "familySpeech": { "en": "Kanda 2 content", "hi": "string" },
    "siblings": { "en": "Kanda 3 content", "hi": "string" },
    "assetsMother": { "en": "Kanda 4 content", "hi": "string" },
    "progeny": { "en": "Kanda 5 content", "hi": "string" },
    "debtsEnemies": { "en": "Kanda 6 content", "hi": "string" },
    "union": { "en": "Kanda 7 content", "hi": "string" },
    "longevityHealth": { "en": "Kanda 8 content", "hi": "string" },
    "fatherFortune": { "en": "Kanda 9 content", "hi": "string" },
    "career": { "en": "Kanda 10 content", "hi": "string" },
    "gains": { "en": "Kanda 11 content", "hi": "string" },
    "expenditureTravel": { "en": "Kanda 12 content", "hi": "string" }
  },
  "majorLines": {
    "lifeLine": {
      "line": "life",
      "detection": { "detected": true, "confidence": 90, "visualEvidence": "Clear deep line curving around Venus mount", "clarity": "clear" },
      "characteristics": { "depth": "deep", "width": "medium", "length": "long", "color": "pink", "texture": "smooth" },
      "origin": "Between Jupiter and thumb",
      "terminus": "Base of palm near wrist",
      "interpretation": { "en": "string", "hi": "string" }
    },
    "headLine": {
      "line": "head",
      "detection": { "detected": true, "confidence": 85, "visualEvidence": "Horizontal line across palm", "clarity": "clear" },
      "characteristics": { "depth": "moderate", "width": "medium", "length": "medium", "color": "pink", "texture": "smooth" },
      "origin": "Near life line start",
      "terminus": "Toward Luna mount",
      "interpretation": { "en": "string", "hi": "string" }
    },
    "heartLine": {
      "line": "heart",
      "detection": { "detected": true, "confidence": 88, "visualEvidence": "Upper horizontal line", "clarity": "clear" },
      "characteristics": { "depth": "moderate", "width": "medium", "length": "long", "color": "pink", "texture": "smooth" },
      "origin": "Under Mercury finger",
      "terminus": "Between Jupiter and Saturn",
      "interpretation": { "en": "string", "hi": "string" }
    },
    "fateLine": {
      "line": "fate",
      "detection": { "detected": true, "confidence": 70, "visualEvidence": "Vertical line from wrist", "clarity": "moderate" },
      "characteristics": { "depth": "faint", "width": "thin", "length": "medium", "color": "pale", "texture": "broken" },
      "origin": "Near wrist center",
      "terminus": "Under Saturn mount",
      "interpretation": { "en": "string", "hi": "string" }
    }
  },
  "specialLines": {
    "ringOfSolomon": {
      "detection": { "detected": false, "confidence": 0, "visualEvidence": "No arc visible under Jupiter", "clarity": "not_visible" },
      "completeness": "partial",
      "interpretation": { "en": "Not detected", "hi": "नहीं पाया गया" }
    },
    "ringOfSaturn": {
      "detection": { "detected": false, "confidence": 0, "visualEvidence": "No arc visible under Saturn", "clarity": "not_visible" },
      "completeness": "partial",
      "interpretation": { "en": "Not detected", "hi": "नहीं पाया गया" }
    },
    "girdleOfVenus": {
      "detection": { "detected": false, "confidence": 0, "visualEvidence": "No arc between fingers", "clarity": "not_visible" },
      "type": "single",
      "interpretation": { "en": "Not detected", "hi": "नहीं पाया गया" }
    },
    "viaLascivia": {
      "detection": { "detected": false, "confidence": 0, "visualEvidence": "No line on Luna mount", "clarity": "not_visible" },
      "prominence": "faint",
      "interpretation": { "en": "Not detected", "hi": "नहीं पाया गया" }
    },
    "lineOfIntuition": {
      "detection": { "detected": false, "confidence": 0, "visualEvidence": "No crescent on Luna mount", "clarity": "not_visible" },
      "curvature": "slight",
      "interpretation": { "en": "Not detected", "hi": "नहीं पाया गया" }
    },
    "simianLine": {
      "detected": false,
      "hand": "right",
      "type": "true_simian",
      "visualEvidence": "Head and heart lines are separate",
      "interpretation": { "en": "Normal separate head and heart lines", "hi": "string" }
    },
    "sydneyLine": {
      "detected": false,
      "hand": "right",
      "interpretation": { "en": "Head line does not extend across entire palm", "hi": "मस्तिष्क रेखा पूरी हथेली में नहीं फैली" }
    },
    "teachersSquare": {
      "detection": { "detected": false, "confidence": 0, "visualEvidence": "No square under Jupiter finger", "clarity": "not_visible" },
      "clarity": "faint",
      "interpretation": { "en": "Not detected", "hi": "नहीं पाया गया" }
    },
    "medicalStigmata": {
      "detected": false,
      "count": 0,
      "clarity": "faint",
      "interpretation": { "en": "No healing lines detected under Mercury", "hi": "बुध के नीचे कोई उपचार रेखा नहीं" }
    },
    "mysticCross": {
      "detection": { "detected": false, "confidence": 0, "visualEvidence": "No cross visible", "clarity": "not_visible" },
      "position": "center_palm",
      "interpretation": { "en": "Not detected", "hi": "नहीं पाया गया" }
    },
    "travelLines": {
      "count": 2,
      "prominent": 1,
      "foreignSettlement": false,
      "interpretation": { "en": "string", "hi": "string" }
    },
    "bracelets": {
      "count": 3,
      "firstBraceletShape": "straight",
      "healthIndicator": { "en": "Good constitution", "hi": "string" },
      "interpretation": { "en": "string", "hi": "string" }
    },
    "ringOfApollo": {
      "detection": { "detected": false, "confidence": 0, "visualEvidence": "No arc visible under Apollo/ring finger", "clarity": "not_visible" },
      "completeness": "partial",
      "interpretation": { "en": "Not detected", "hi": "नहीं पाया गया" }
    },
    "marsLine": {
      "detection": { "detected": false, "confidence": 0, "visualEvidence": "No sister line parallel to life line", "clarity": "not_visible" },
      "length": "short",
      "proximity": "close",
      "interpretation": { "en": "No protective Mars line detected", "hi": "कोई सुरक्षात्मक मंगल रेखा नहीं" }
    },
    "worryLines": {
      "detected": false,
      "count": 0,
      "depth": "faint",
      "crossingLifeLine": false,
      "interpretation": { "en": "No significant worry lines detected", "hi": "कोई महत्वपूर्ण चिंता रेखाएं नहीं" }
    },
    "influenceLines": {
      "detected": false,
      "count": 0,
      "type": "mixed",
      "majorInfluenceAges": [],
      "interpretation": { "en": "No major influence lines from Venus mount", "hi": "शुक्र पर्वत से कोई प्रमुख प्रभाव रेखा नहीं" }
    },
    "greatTriangle": {
      "detected": false,
      "clarity": "faint",
      "size": "medium",
      "angles": "well_defined",
      "interpretation": { "en": "Great Triangle not clearly detected in this capture; retake with stronger side-lighting for a higher-confidence reading.", "hi": "इस कैप्चर में महान त्रिकोण स्पष्ट रूप से नहीं दिखा; अधिक विश्वसनीय रीडिंग के लिए बेहतर साइड-लाइटिंग में पुनः कैप्चर करें।" }
    },
    "starsOnMounts": {
      "detected": false,
      "locations": [],
      "interpretation": { "en": "No star formations detected on mounts", "hi": "पर्वतों पर कोई तारा निर्माण नहीं" }
    },
    "grillesOnMounts": {
      "detected": false,
      "locations": [],
      "interpretation": { "en": "No grille formations detected on mounts", "hi": "पर्वतों पर कोई जाली निर्माण नहीं" }
    }
  },
  "marriage": {
    "ageRange": "26-30",
    "timelineDetails": { "en": "string", "hi": "string" },
    "partnerNature": { "en": "string", "hi": "string" },
    "indicator": { "en": "Marriage line position analysis", "hi": "string" },
    "interpretation": { "en": "string", "hi": "string" }
  },
  "marriageLines": {
    "count": 1,
    "lines": [{
      "position": 15,
      "calculatedAge": 28,
      "depth": "moderate",
      "length": "medium",
      "formations": [],
      "interpretation": { "en": "string", "hi": "string" }
    }],
    "primaryMarriageAge": 28
  },
  "progeny": {
    "count": "2",
    "details": { "en": "string", "hi": "string" },
    "indicator": { "en": "Progeny lines on Mercury mount", "hi": "string" },
    "progenyLines": [{
      "lineNumber": 1,
      "depth": "medium",
      "length": "medium",
      "position": 5,
      "predictedGender": "male_likely",
      "estimatedBirthAge": 30,
      "healthIndicators": "Clear line"
    }],
    "confidence": "medium",
    "education": { "en": "string", "hi": "string" },
    "talents": { "en": "string", "hi": "string" },
    "lifePath": { "en": "string", "hi": "string" }
  },
  "warnings": [{ "who": { "en": "string", "hi": "string" }, "why": { "en": "string", "hi": "string" }, "advice": { "en": "string", "hi": "string" } }],
  "millionaireStatus": {
    "isMillionaireHand": true,
    "analysis": { "en": "string", "hi": "string" },
    "wealthPeakAge": "45-50",
    "dhanYogaDetected": true,
    "potential": "High",
    "interpretation": { "en": "string", "hi": "string" }
  },
  "ancestralKarma": {
    "visualEvidence": {
      "karmaLines": [{ "count": 2, "depth": "medium", "location": "upper", "description": "Two distinct lines on Saturn mount indicating family patterns" }],
      "familyPatterns": [{ "type": "parallel_lines", "ageCorrelation": 35, "description": "Pattern similar to parental challenges at age 35" }],
      "generationalDebt": [{ "indicator": "Broken fate line start", "severity": "moderate", "description": "Indicates inherited karmic debt from paternal lineage" }]
    },
    "interpretation": { "en": "string - detailed ancestral karma analysis", "hi": "string" },
    "remedies": [{ "en": "Perform Pitru Tarpan on Amavasya", "hi": "अमावस्या पर पितृ तर्पण करें" }],
    "karmaSeverity": "moderate"
  },
  "soulPurpose": { "en": "string", "hi": "string" },
  "remedies": [{
    "category": "mantra",
    "type": { "en": "Mantra Remedy", "hi": "मंत्र उपाय" },
    "action": { "en": "Chant specific mantra 108 times daily", "hi": "प्रतिदिन 108 बार विशेष मंत्र का जाप करें" },
    "benefit": { "en": "string", "hi": "string" },
    "mantraDetails": {
      "mantra": "Om Gam Ganapataye Namaha",
      "deity": { "en": "Lord Ganesha", "hi": "भगवान गणेश" },
      "count": 108,
      "timing": { "en": "Early morning before sunrise", "hi": "सूर्योदय से पहले प्रातः काल" },
      "duration": { "en": "41 days continuously", "hi": "41 दिन लगातार" }
    }
  }, {
    "category": "rudraksha",
    "type": { "en": "Rudraksha Remedy", "hi": "रुद्राक्ष उपाय" },
    "action": { "en": "Wear specific Mukhi Rudraksha", "hi": "विशेष मुखी रुद्राक्ष धारण करें" },
    "benefit": { "en": "string", "hi": "string" },
    "rudrakshaDetails": {
      "mukhi": 5,
      "planet": { "en": "Jupiter", "hi": "बृहस्पति" },
      "wearingDay": { "en": "Thursday", "hi": "गुरुवार" },
      "metalSetting": { "en": "Gold or Silver", "hi": "सोना या चांदी" },
      "placement": { "en": "Wear around neck on red/yellow thread", "hi": "लाल/पीले धागे में गले में धारण करें" }
    }
  }, {
    "category": "chakra",
    "type": { "en": "Chakra Balancing", "hi": "चक्र संतुलन" },
    "action": { "en": "Focus on specific chakra meditation", "hi": "विशेष चक्र ध्यान पर ध्यान दें" },
    "benefit": { "en": "string", "hi": "string" },
    "chakraDetails": {
      "chakra": { "en": "Solar Plexus (Manipura)", "hi": "मणिपुर चक्र" },
      "element": { "en": "Fire", "hi": "अग्नि" },
      "color": { "en": "Yellow", "hi": "पीला" },
      "healingPractice": { "en": "Trataka meditation on candle flame", "hi": "मोमबत्ती की लौ पर त्राटक ध्यान" },
      "crystals": [{ "en": "Citrine", "hi": "सिट्रीन" }, { "en": "Tiger's Eye", "hi": "टाइगर आई" }],
      "yogaAsanas": [{ "en": "Navasana (Boat Pose)", "hi": "नावासन" }, { "en": "Ardha Matsyendrasana", "hi": "अर्ध मत्स्येन्द्रासन" }]
    }
  }, {
    "category": "gemstone",
    "type": { "en": "Gemstone Remedy", "hi": "रत्न उपाय" },
    "action": { "en": "Wear prescribed gemstone", "hi": "निर्धारित रत्न धारण करें" },
    "benefit": { "en": "string", "hi": "string" },
    "gemstoneDetails": {
      "stone": { "en": "Yellow Sapphire", "hi": "पुखराज" },
      "weight": "3-5 carats",
      "metal": { "en": "Gold", "hi": "सोना" },
      "finger": { "en": "Index finger of right hand", "hi": "दाहिने हाथ की तर्जनी उंगली" },
      "wearingDay": { "en": "Thursday morning", "hi": "गुरुवार सुबह" },
      "energizingMantra": "Om Gram Greem Grom Sah Gurave Namah"
    }
  }, {
    "category": "ritual",
    "type": { "en": "Ritual Remedy", "hi": "अनुष्ठान उपाय" },
    "action": { "en": "Perform specific ritual or puja", "hi": "विशेष अनुष्ठान या पूजा करें" },
    "benefit": { "en": "string", "hi": "string" },
    "ritualDetails": {
      "ritual": { "en": "Rudrabhishek", "hi": "रुद्राभिषेक" },
      "frequency": { "en": "Monthly on Pradosh", "hi": "प्रतिमाह प्रदोष पर" },
      "materials": [{ "en": "Milk", "hi": "दूध" }, { "en": "Bel leaves", "hi": "बेल पत्र" }],
      "duration": { "en": "1-2 hours", "hi": "1-2 घंटे" }
    }
  }],
  "yogas": [{ "name": { "en": "string", "hi": "string" }, "combination": "string", "effect": { "en": "string", "hi": "string" } }],
  "geometricTiming": {
    "lifeLineLength": 85,
    "agePerUnit": 0.85,
    "marriageLinePosition": 15,
    "calculatedMarriageAge": 28,
    "wealthPeakPosition": 60,
    "calculatedWealthAge": 48,
    "careerChangeAges": [25, 35, 45],
    "healthCrisisAges": [42, 55],
    "relationshipEventAges": [28, 35]
  },
  "lineFormations": [{
    "line": "life",
    "type": "island",
    "startAge": 35,
    "endAge": 40,
    "severity": "minor",
    "location": "40% from wrist",
    "visualEvidence": "Small oval formation visible",
    "interpretation": { "en": "Period of stress or health focus", "hi": "string" }
  }],
  "handShapeAnalysis": {
    "palmShape": "rectangular",
    "palmAspectRatio": 1.15,
    "fingertipShape": "conic",
    "interpretation": {
      "personality": { "en": "string", "hi": "string" },
      "aptitudes": { "en": "string", "hi": "string" },
      "challenges": { "en": "string", "hi": "string" }
    },
    "visualEvidence": "Palm appears longer than wide"
  },
  "mountAnalysis": [{
    "mount": "jupiter",
    "prominence": 70,
    "dominanceRank": 2,
    "apexPosition": "central",
    "texture": "firm",
    "color": "pink",
    "patterns": {
      "star": { "detected": false, "count": 0, "interpretation": { "en": "No star", "hi": "string" } },
      "cross": { "detected": false, "count": 0, "interpretation": { "en": "No cross", "hi": "string" } },
      "square": { "detected": false, "interpretation": { "en": "No square", "hi": "string" } },
      "triangle": { "detected": false, "interpretation": { "en": "No triangle", "hi": "string" } },
      "grille": { "detected": false, "interpretation": { "en": "No grille", "hi": "string" } }
    },
    "observations": "Well-developed mount",
    "interpretation": { "en": "string", "hi": "string" }
  }],
  "fingerLengthRatios": {
    "jupiterToSaturn": 0.88,
    "apolloToSaturn": 0.94,
    "mercuryReachesApolloKnuckle": true,
    "thumbToJupiter": 0.58,
    "twoD_fourD_ratio": 0.97,
    "interpretation": {
      "leadership": { "en": "Jupiter at 88% of Saturn indicates balanced ambition", "hi": "बृहस्पति शनि का 88% संतुलित महत्वाकांक्षा को दर्शाता है" },
      "creativity": { "en": "Apollo near Saturn length shows strong creative drive", "hi": "अपोलो शनि की लंबाई के पास मजबूत रचनात्मक प्रवृत्ति दर्शाता है" },
      "communication": { "en": "Mercury reaching Apollo knuckle indicates good expression", "hi": "बुध अपोलो के पोर तक पहुंचना अच्छी अभिव्यक्ति को दर्शाता है" }
    }
  },
  "planetaryBalance": {
    "jupiter": { "strength": 88, "expression": "balanced", "traits": { "en": "Balanced leadership with practical approach", "hi": "व्यावहारिक दृष्टिकोण के साथ संतुलित नेतृत्व" } },
    "saturn": { "strength": 100, "expression": "reference_baseline", "traits": { "en": "Reference baseline for measurement", "hi": "माप के लिए संदर्भ आधार रेखा" } },
    "apollo": { "strength": 94, "expression": "balanced", "traits": { "en": "Strong creative expression", "hi": "मजबूत रचनात्मक अभिव्यक्ति" } },
    "mercury": { "strength": 82, "expression": "balanced", "traits": { "en": "Good communication abilities", "hi": "अच्छी संचार क्षमताएं" } },
    "overallBalance": "balanced",
    "imbalanceWarnings": []
  },
  "personalityDominance": {
    "primary": "creativity",
    "secondary": "leadership",
    "scores": { "leadership": 72, "discipline": 65, "creativity": 85, "communication": 70, "willpower": 75 },
    "analysis": { "en": "Your primary drive is creativity with strong leadership potential", "hi": "आपकी प्राथमिक प्रवृत्ति रचनात्मकता है जिसमें मजबूत नेतृत्व क्षमता है" },
    "confidence": 82
  },
  "fingerAnalysis": [{
    "finger": "jupiter",
    "lengthRatioToSaturn": 0.88,
    "phalanxProportions": { "top": 30, "middle": 35, "bottom": 35 },
    "relativeLength": "balanced",
    "dominance": "balanced",
    "tipShape": "conic",
    "setting": "even",
    "knuckles": { "development": "smooth", "philosophicalKnot": false, "materialKnot": false },
    "flexibility": "flexible",
    "interpretation": { "en": "string", "hi": "string" }
  }],
  "thumbAnalysis": {
    "detection": { "detected": true, "confidence": 85, "visualEvidence": "Thumb clearly visible", "clarity": "clear" },
    "angle": { "degrees": 45, "classification": "moderate", "interpretation": { "en": "Balanced willpower and generosity", "hi": "string" } },
    "flexibility": { "type": "flexible", "interpretation": { "en": "Adaptable nature", "hi": "string" } },
    "willPhalanx": { "length": "medium", "shape": "broad", "interpretation": { "en": "Strong will", "hi": "string" } },
    "logicPhalanx": { "length": "medium", "shape": "average", "interpretation": { "en": "Good reasoning", "hi": "string" } },
    "mountOfVenus": { "prominence": 65, "interpretation": { "en": "Warm personality", "hi": "string" } },
    "interpretation": { "en": "string", "hi": "string" }
  },
  "fingerSpacing": {
    "overallSpacing": "moderate",
    "jupiterSaturnGap": "slight",
    "saturnApolloGap": "slight",
    "apolloMercuryGap": "wide",
    "interpretation": { "en": "string", "hi": "string" }
  },
  "dermatoglyphics": {
    "dominantPattern": "loop_ulnar",
    "fingerPatterns": {
      "jupiter": "whorl",
      "saturn": "loop_ulnar",
      "apollo": "loop_ulnar",
      "mercury": "loop_ulnar",
      "thumb": "whorl"
    },
    "thumbPattern": { "type": "whorl", "interpretation": { "en": "string", "hi": "string" } },
    "estimatedRidgeCount": "average",
    "interpretation": { "en": "string", "hi": "string" }
  },
  "healthTimeline": [{
    "ageRange": "40-45",
    "indicator": "Island on life line",
    "vulnerability": { "en": "Monitor stress levels", "hi": "string" },
    "preventiveMeasures": { "en": "Regular exercise, meditation", "hi": "string" },
    "severity": "minor"
  }],
  "analysisQuality": {
    "overallScore": 85,
    "lineDetectionScore": 88,
    "mountDetectionScore": 80,
    "specialMarkersScore": 75,
    "imageQualityScore": 85,
    "completenessScore": 90,
    "grade": "B",
    "improvementSuggestions": ["Take photo in brighter light for clearer line detection"]
  }
}`;

  try {
    // Strip the data URL prefix (data:image/jpeg;base64,) to get raw base64
    const stripDataPrefix = (base64String: string) => {
      if (base64String.startsWith('data:')) {
        return base64String.split(',')[1];
      }
      return base64String;
    };

    // Build request payload - include fullHandImage if available
    const requestPayload: Record<string, unknown> = {
      systemInstruction,
      prompt,
      palmImage: stripDataPrefix(palmBase64),
      thumbImage: stripDataPrefix(thumbBase64),
      userInfo
    };

    // Add full-hand image for finger ratio validation if provided
    if (fullHandBase64) {
      requestPayload.fullHandImage = stripDataPrefix(fullHandBase64);
      console.log('📸 Including full-hand image for finger ratio analysis');
    }

    const response = await fetch(`${BACKEND_URL}/nlg/palmistry-analysis`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestPayload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    console.log('📊 Lambda response:', {
      success: data.success,
      hasData: !!data.data,
      dataType: typeof data.data,
      dataLength: typeof data.data === 'string' ? data.data.length : 'N/A'
    });

    // Parse the JSON response from Gemini
    let analysisData;

    try {
      if (typeof data.data === 'string') {
        // Remove markdown code blocks if present
        let cleanedText = data.data.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

        // Try to parse, if it fails, try to fix common JSON issues
        try {
          analysisData = JSON.parse(cleanedText);
        } catch (parseError) {
          console.warn('⚠️ Initial JSON parse failed, attempting to fix...', parseError);

          // Remove any trailing incomplete text after the last }
          const lastBraceIndex = cleanedText.lastIndexOf('}');
          if (lastBraceIndex > 0) {
            cleanedText = cleanedText.substring(0, lastBraceIndex + 1);
          }

          analysisData = JSON.parse(cleanedText);
        }
      } else if (typeof data.data?.text === 'string') {
        let cleanedText = data.data.text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

        try {
          analysisData = JSON.parse(cleanedText);
        } catch (parseError) {
          console.warn('⚠️ Initial JSON parse failed, attempting to fix...', parseError);

          // Strategy 1: Remove trailing incomplete text after the last }
          let lastBraceIndex = cleanedText.lastIndexOf('}');
          if (lastBraceIndex > 0) {
            cleanedText = cleanedText.substring(0, lastBraceIndex + 1);
          }

          try {
            analysisData = JSON.parse(cleanedText);
          } catch (secondError) {
            console.warn('⚠️ Second parse attempt failed, trying aggressive cleanup...', secondError);

            // Strategy 2: Fix common JSON errors
            // Fix unterminated strings by closing them
            cleanedText = cleanedText
              .replace(/,\s*\]/g, ']')  // Remove trailing commas in arrays
              .replace(/,\s*\}/g, '}')  // Remove trailing commas in objects
              .replace(/"\s*\n\s*"/g, '" "')  // Fix line breaks in strings
              .replace(/([^\\])\\n/g, '$1\\\\n');  // Escape unescaped newlines

            // Find the last complete object by looking for balanced braces
            let braceCount = 0;
            let lastValidIndex = -1;
            for (let i = 0; i < cleanedText.length; i++) {
              if (cleanedText[i] === '{') braceCount++;
              if (cleanedText[i] === '}') {
                braceCount--;
                if (braceCount === 0) {
                  lastValidIndex = i;
                }
              }
            }

            if (lastValidIndex > 0) {
              cleanedText = cleanedText.substring(0, lastValidIndex + 1);
            }

            try {
              analysisData = JSON.parse(cleanedText);
            } catch (thirdError) {
              console.error('❌ All JSON repair attempts failed');
              console.error('Last 1000 chars of cleaned text:', cleanedText.slice(-1000));
              throw new Error(`JSON parsing failed after 3 attempts: ${thirdError.message}`);
            }
          }
        }
      } else if (typeof data.data === 'object') {
        analysisData = data.data;
      } else {
        throw new Error('Unexpected response format from Lambda');
      }

      console.log('✅ Successfully parsed analysis data');

      // Validate critical fields FIRST (strict check for completeness)
      const criticalValidation = validateCriticalFields(analysisData);
      if (!criticalValidation.isValid) {
        console.error('❌ CRITICAL VALIDATION FAILED - Incomplete AI response');
        console.error('🚫 Missing fields:', criticalValidation.missingFields);
        console.error('📊 Received data structure:', JSON.stringify(analysisData, null, 2));
        throw new Error(`Incomplete AI response. Missing critical fields: ${criticalValidation.missingFields.join(', ')}. The AI must provide ALL 12 Kandas, 2-4 yogas, complete millionaireStatus, and all required fields.`);
      }
      console.log('✅ All critical fields validated - Response is complete');

      // Add simple Nadi category (no Bundle/Leaf complexity)
      analysisData.nadiLeafCategory = "Nadi Palmistry Analysis";

      // Validate the parsed data (quality check)
      const validation = validateAnalysisOutput(analysisData);

      console.log(`📋 Validation Result: ${getQualityGrade(validation.score)} (${validation.score}/100)`);

      if (validation.errors.length > 0) {
        console.error('❌ Validation Errors:', validation.errors);
      }

      if (validation.warnings.length > 0) {
        console.warn('⚠️ Validation Warnings:', validation.warnings);
      }

      // Log validation status
      if (validation.isValid && validation.score >= 90) {
        console.log('🌟 Excellent quality analysis!');
      } else if (validation.isValid && validation.score >= 70) {
        console.log('✅ Good quality analysis');
      } else if (validation.isValid) {
        console.warn('⚠️ Fair quality analysis - some issues detected');
      } else {
        console.error('❌ Analysis quality below acceptable threshold');
      }

      // Add validation score to the result for display to users
      analysisData.validationScore = validation.score;

      // Generate AI Prediction Confidence Scores (Tier 4 Feature)
      analysisData.predictionConfidence = generatePredictionConfidence(analysisData);
      console.log(`🎯 Prediction Confidence: ${analysisData.predictionConfidence.overall}% overall`);

      // Cross-Kanda Consistency Check (P1 Enhancement)
      const kandaConsistency = validateKandaConsistency(analysisData);
      analysisData.kandaConsistency = {
        isConsistent: kandaConsistency.isConsistent,
        score: kandaConsistency.score,
        warnings: kandaConsistency.warnings
      };

      if (kandaConsistency.warnings.length > 0) {
        console.warn(`⚠️ Kanda Consistency: ${kandaConsistency.score}/100 - ${kandaConsistency.warnings.length} potential conflicts detected`);
        kandaConsistency.warnings.forEach(w => {
          console.warn(`   - [${w.severity}] ${w.kandas.join(' ↔ ')}: ${w.description}`);
        });
      } else {
        console.log(`✅ Kanda Consistency: ${kandaConsistency.score}/100 - All Kandas are coherent`);
      }

      // Save to cache for future consistency
      analysisCache.set(biometricFingerprint, {
        data: analysisData as AnalysisOutput,
        timestamp: Date.now()
      });
      console.log('💾 Analysis cached for 24 hours (consistent results guaranteed)');

      return analysisData as AnalysisOutput;

    } catch (parseError) {
      console.error('❌ JSON Parse Error:', parseError);
      console.error('Raw data:', data.data?.substring?.(0, 500) || data.data);
      throw new Error(`Failed to parse Gemini response: ${parseError.message}`);
    }
  } catch (error) {
    console.error('Palmistry Analysis Error:', error);
    throw error;
  }
};
