/**
 * Comprehensive Yoga Interpretations
 * Provides detailed explanations of yogas and their life impacts
 */

export interface YogaInterpretation {
  fullName: string;
  category: string;
  meaning: string;
  lifeImpact: string;
  positiveManifestations: string[];
  challenges: string[];
  workingWithThisEnergy: string[];
  planetaryNature: string;
}

export const YOGA_INTERPRETATIONS: { [key: string]: YogaInterpretation } = {
  // ============================================================================
  // RAJA YOGAS (Royal Combinations - Power, Authority, Success)
  // ============================================================================

  "Raja Yoga": {
    fullName: "Raja Yoga - The Royal Combination",
    category: "Raja Yoga",
    meaning: "This is one of the most auspicious yogas in Vedic astrology. It occurs when the lords of angle houses (1st, 4th, 7th, 10th) combine with the lords of trine houses (1st, 5th, 9th). This creates a powerful combination that bestows leadership, authority, and success.",
    lifeImpact: "You have the potential for significant achievement, recognition, and leadership in your chosen field. This yoga supports career advancement, social status, and the ability to influence others positively.",
    positiveManifestations: [
      "Natural leadership abilities and charisma",
      "Career success and professional recognition",
      "Ability to achieve positions of authority and responsibility",
      "Strong willpower and determination to succeed",
      "Respect and admiration from peers and society"
    ],
    challenges: [
      "May face pressure and high expectations from others",
      "Need to balance ambition with personal relationships",
      "Responsibility that comes with leadership positions",
      "Potential for ego inflation if not kept in check"
    ],
    workingWithThisEnergy: [
      "Cultivate humility while embracing your leadership potential",
      "Use your influence to help and uplift others",
      "Set clear goals and work systematically towards them",
      "Balance professional ambitions with personal well-being",
      "Develop your skills continuously to match your potential"
    ],
    planetaryNature: "The strength of this yoga depends on the specific planets involved and their dignities"
  },

  "Dharma Karmadhipati Raja Yoga": {
    fullName: "Dharma Karmadhipati Raja Yoga - The Yoga of Righteous Action",
    category: "Raja Yoga",
    meaning: "This yoga forms when the lords of the 9th house (dharma/fortune) and 10th house (karma/career) are connected. It's a powerful combination that brings success through righteous means and ethical conduct.",
    lifeImpact: "Your career and life path are aligned with your higher purpose. Success comes through ethical means, and you're likely to find fulfillment in work that serves a greater good.",
    positiveManifestations: [
      "Career success aligned with ethical values",
      "Recognition for integrity and principled actions",
      "Opportunities that align with your life purpose",
      "Ability to make a positive impact through your work",
      "Good fortune in professional endeavors"
    ],
    challenges: [
      "May need to choose ethics over quick gains",
      "Balancing idealism with practical considerations",
      "Standing firm in values may sometimes be difficult"
    ],
    workingWithThisEnergy: [
      "Choose career paths that align with your values",
      "Maintain ethical standards even under pressure",
      "Seek mentors who embody integrity",
      "Trust that doing the right thing will bring success",
      "Use your position to create positive change"
    ],
    planetaryNature: "Strength depends on the condition of 9th and 10th lords"
  },

  // ============================================================================
  // DHANA YOGAS (Wealth Combinations)
  // ============================================================================

  "Dhana Yoga": {
    fullName: "Dhana Yoga - The Wealth Combination",
    category: "Dhana Yoga",
    meaning: "This yoga forms when planets associated with wealth houses (2nd, 5th, 9th, 11th) combine favorably. It indicates potential for financial prosperity and material abundance.",
    lifeImpact: "You have the potential to accumulate wealth and enjoy material comforts. Financial opportunities may come through various channels, and you have the ability to create and maintain prosperity.",
    positiveManifestations: [
      "Good earning potential and financial opportunities",
      "Ability to accumulate and grow wealth",
      "Material comforts and financial security",
      "Skill in financial management and investments",
      "Generosity in sharing resources with others"
    ],
    challenges: [
      "Need to avoid excessive materialism",
      "Balancing wealth accumulation with spiritual growth",
      "Managing finances wisely to maintain prosperity",
      "Not letting money define your self-worth"
    ],
    workingWithThisEnergy: [
      "Develop financial literacy and investment skills",
      "Use wealth to create security for yourself and others",
      "Practice generosity and charitable giving",
      "Maintain a healthy relationship with money",
      "Remember that true wealth includes relationships and experiences"
    ],
    planetaryNature: "Strength varies based on which wealth lords are involved"
  },

  "Jupiter-Venus Conjunction": {
    fullName: "Guru-Shukra Conjunction (Jupiter-Venus Dhana Yoga)",
    category: "Dhana Yoga",
    meaning: "When Jupiter (the great benefic, planet of wisdom and expansion) combines with Venus (planet of wealth, beauty, and pleasure), it creates a powerful wealth-generating combination. This is considered highly auspicious for both material and spiritual prosperity.",
    lifeImpact: "This combination brings opportunities for wealth creation, artistic talents, refined tastes, and the ability to enjoy life's pleasures while maintaining wisdom. You may find success in fields related to finance, arts, luxury goods, counseling, or teaching.",
    positiveManifestations: [
      "Strong potential for financial prosperity and abundance",
      "Refined artistic and aesthetic sensibilities",
      "Ability to attract wealth through creative or advisory roles",
      "Love for beauty, luxury, and the finer things in life",
      "Wise use of resources and generosity",
      "Success in fields like finance, arts, education, or counseling",
      "Harmonious relationships and social grace"
    ],
    challenges: [
      "Tendency towards over-indulgence or extravagance",
      "May have high expectations in relationships and lifestyle",
      "Need to balance material desires with spiritual values",
      "Possible conflicts between expansion (Jupiter) and pleasure (Venus)"
    ],
    workingWithThisEnergy: [
      "Channel your aesthetic sense into creative or business ventures",
      "Use your wealth wisely - invest in things that grow in value",
      "Practice moderation in pleasures to avoid excess",
      "Share your knowledge and resources generously",
      "Combine beauty with purpose in your endeavors",
      "Seek careers that blend creativity with financial reward",
      "Cultivate relationships based on shared values, not just pleasure"
    ],
    planetaryNature: "Both Jupiter and Venus are natural benefics; the house and sign placement determines the specific area of life most affected"
  },

  // ============================================================================
  // BUDHA-ADITYA YOGA (Sun-Mercury)
  // ============================================================================

  "Budha-Aditya Yoga": {
    fullName: "Budha-Aditya Yoga - The Combination of Intelligence and Authority",
    category: "Intelligence Yoga",
    meaning: "When the Sun (representing authority, confidence, and soul purpose) combines with Mercury (representing intelligence, communication, and analytical skills), it creates this powerful yoga. This enhances intellectual capabilities and communication skills.",
    lifeImpact: "You possess sharp intelligence combined with confidence in expressing your ideas. This yoga supports careers in writing, speaking, teaching, business, or any field requiring both intellectual prowess and self-assurance.",
    positiveManifestations: [
      "Exceptional intelligence and analytical abilities",
      "Strong communication and persuasive skills",
      "Confidence in expressing ideas and opinions",
      "Success in intellectual or communicative professions",
      "Quick learning ability and mental agility",
      "Leadership through knowledge and expertise"
    ],
    challenges: [
      "Mercury gets 'combust' when too close to Sun (within 14 degrees)",
      "May be overly confident or argumentative",
      "Tendency to dominate conversations",
      "Need to listen to others' perspectives"
    ],
    workingWithThisEnergy: [
      "Use your communication skills to educate and inspire",
      "Balance confidence with humility",
      "Write, speak, or teach to share your knowledge",
      "Develop active listening skills",
      "Channel intellectual energy into constructive projects"
    ],
    planetaryNature: "Best when Mercury is not too close to Sun (combust); works well in signs where both planets are comfortable"
  },

  // ============================================================================
  // GAJAKESARI YOGA (Moon-Jupiter)
  // ============================================================================

  "Gajakesari Yoga": {
    fullName: "Gajakesari Yoga - The Elephant-Lion Combination",
    category: "Auspicious Yoga",
    meaning: "One of the most celebrated yogas, formed when Jupiter is in a kendra (1st, 4th, 7th, or 10th house) from the Moon. The name means 'elephant-lion,' symbolizing strength, wisdom, and nobility.",
    lifeImpact: "This yoga bestows intelligence, eloquence, prosperity, and respect in society. You may have a dignified personality, strong moral character, and the ability to influence others positively. Success in life often comes through wisdom, education, and ethical conduct.",
    positiveManifestations: [
      "Natural wisdom and good judgment",
      "Respect and recognition in society",
      "Strong moral and ethical foundation",
      "Prosperity and material comforts",
      "Eloquence and persuasive communication",
      "Protective and nurturing towards others",
      "Success through education and knowledge"
    ],
    challenges: [
      "High expectations from self and others",
      "May be too idealistic at times",
      "Need to stay grounded despite success",
      "Balancing emotional needs (Moon) with expansion (Jupiter)"
    ],
    workingWithThisEnergy: [
      "Pursue higher education and continuous learning",
      "Share your wisdom generously with others",
      "Maintain ethical standards in all dealings",
      "Use your influence for social good",
      "Stay emotionally balanced and mentally expansive",
      "Teach, mentor, or guide others",
      "Trust your intuition combined with knowledge"
    ],
    planetaryNature: "Strength depends on the sign placements and aspects; works best when both Moon and Jupiter are well-placed"
  },

  // ============================================================================
  // CHANDRA-MANGAL YOGA (Moon-Mars)
  // ============================================================================

  "Chandra-Mangal Yoga": {
    fullName: "Chandra-Mangal Yoga - The Moon-Mars Wealth Combination",
    category: "Dhana Yoga",
    meaning: "When the Moon (emotions, mind, nurturing) combines with Mars (energy, action, courage), it creates a dynamic yoga that brings wealth through action and emotional intelligence. This combination provides both the drive to act and the emotional intelligence to succeed.",
    lifeImpact: "You have the ability to turn emotional intelligence into material success. This yoga supports entrepreneurship, real estate, business ventures, and any field requiring both emotional connection and decisive action.",
    positiveManifestations: [
      "Strong earning potential through business or real estate",
      "Emotional courage and resilience",
      "Ability to take calculated risks",
      "Success in ventures requiring both heart and action",
      "Protective instincts towards family and loved ones",
      "Dynamic personality with emotional depth"
    ],
    challenges: [
      "Emotional volatility or mood swings",
      "Impulsive decisions driven by feelings",
      "Tendency towards aggression when emotionally triggered",
      "Need to balance passion with patience"
    ],
    workingWithThisEnergy: [
      "Channel emotional energy into productive action",
      "Practice emotional regulation techniques",
      "Use your passion to fuel your goals, not derail them",
      "Invest in property or tangible assets",
      "Develop emotional intelligence alongside courage",
      "Take action on your feelings in constructive ways"
    ],
    planetaryNature: "Works best in earthy or watery signs; strength depends on house placement and aspects"
  },

  // ============================================================================
  // VESI YOGA / VOSI YOGA (Planets around Sun)
  // ============================================================================

  "Vesi Yoga": {
    fullName: "Vesi Yoga - Planets Following the Sun",
    category: "Solar Yoga",
    meaning: "This yoga forms when planets (except Moon) occupy the 2nd house from the Sun. It indicates wealth, truthfulness, and skill in speech. The person builds on their self-expression and values.",
    lifeImpact: "You have the ability to build upon your core identity and values to create success. Your communication style and value system become key assets in your life journey.",
    positiveManifestations: [
      "Strong communication abilities",
      "Accumulation of wealth through personal skills",
      "Truthful and reliable character",
      "Ability to express yourself effectively",
      "Value-driven approach to life"
    ],
    challenges: [
      "May be too focused on material security",
      "Need to balance values with flexibility",
      "Can be stubborn about personal beliefs"
    ],
    workingWithThisEnergy: [
      "Develop your speaking and communication skills",
      "Build wealth through your unique talents",
      "Stay true to your values while being open to growth",
      "Use your voice to advocate for what matters"
    ],
    planetaryNature: "Depends on which planets form this yoga and their natural qualities"
  },

  "Vosi Yoga": {
    fullName: "Vosi Yoga - Planets Preceding the Sun",
    category: "Solar Yoga",
    meaning: "This yoga forms when planets (except Moon) occupy the 12th house from the Sun. It indicates charitable nature, spiritual inclinations, and success through behind-the-scenes work.",
    lifeImpact: "You may find fulfillment in work that happens behind the scenes or in service to others. Your greatest strengths may be in areas not immediately visible to the public eye.",
    positiveManifestations: [
      "Charitable and compassionate nature",
      "Spiritual depth and introspection",
      "Success in research, healing, or spiritual fields",
      "Ability to work independently",
      "Strong intuitive abilities"
    ],
    challenges: [
      "May not receive public recognition for efforts",
      "Tendency towards isolation or withdrawal",
      "Need to balance solitude with social connection"
    ],
    workingWithThisEnergy: [
      "Embrace careers in research, spirituality, or healing",
      "Develop your inner life through meditation and reflection",
      "Find satisfaction in service rather than recognition",
      "Use solitude productively for creative or spiritual work"
    ],
    planetaryNature: "Depends on which planets form this yoga and their dignities"
  },

  "Ubhayachari Yoga": {
    fullName: "Ubhayachari Yoga - Surrounded by Support",
    category: "Solar Yoga",
    meaning: "This yoga forms when planets (except Moon) are placed on both sides of the Sun - in both the 2nd and 12th houses from it. This creates a protective and supportive energy, like the Sun being surrounded by counselors and advisors.",
    lifeImpact: "You have a balanced personality with both material wisdom and spiritual depth. Success comes through having support from multiple areas of life - both visible achievements and behind-the-scenes assistance. You're likely to be well-rounded and capable in various domains.",
    positiveManifestations: [
      "Balanced approach to material and spiritual life",
      "Support from multiple sources and people",
      "Well-rounded personality and capabilities",
      "Ability to see both practical and hidden aspects",
      "Natural diplomacy and balanced judgment",
      "Success through collaborative efforts"
    ],
    challenges: [
      "May feel pulled in different directions",
      "Need to maintain balance between competing interests",
      "Can be indecisive due to seeing multiple perspectives"
    ],
    workingWithThisEnergy: [
      "Cultivate relationships in both public and private spheres",
      "Balance material pursuits with spiritual growth",
      "Use your ability to see multiple sides for mediation",
      "Appreciate both your visible achievements and quiet strengths",
      "Build diverse support networks"
    ],
    planetaryNature: "Strength depends on the planets on either side of the Sun and their condition"
  },

  // ============================================================================
  // MAHAPURUSHA YOGAS (Great Person Yogas)
  // ============================================================================

  "Ruchaka Yoga": {
    fullName: "Ruchaka Yoga - The Mars Mahapurusha Yoga",
    category: "Mahapurusha Yoga",
    meaning: "Formed when Mars is in its own sign (Aries or Scorpio) or exaltation (Capricorn) in a kendra house (1st, 4th, 7th, 10th). This creates a powerful warrior archetype with courage, leadership, and achievement.",
    lifeImpact: "You possess exceptional courage, physical vitality, and leadership abilities. Success comes through your own efforts, determination, and ability to overcome obstacles. You may excel in military, sports, surgery, engineering, or competitive fields.",
    positiveManifestations: [
      "Exceptional physical strength and vitality",
      "Courageous and fearless nature",
      "Strong leadership and competitive abilities",
      "Success through personal effort and determination",
      "Ability to overcome significant obstacles",
      "Protective of those under your care"
    ],
    challenges: [
      "May be too aggressive or confrontational",
      "Tendency to dominate or control",
      "Need to channel Mars energy constructively",
      "Can be impulsive or hasty in actions"
    ],
    workingWithThisEnergy: [
      "Channel competitive energy into constructive goals",
      "Develop patience alongside courage",
      "Use your strength to protect and serve others",
      "Engage in physical activity or sports regularly",
      "Lead with courage but temper with wisdom"
    ],
    planetaryNature: "Very strong Mars yoga; effects are powerful and direct"
  },

  "Bhadra Yoga": {
    fullName: "Bhadra Yoga - The Mercury Mahapurusha Yoga",
    category: "Mahapurusha Yoga",
    meaning: "Formed when Mercury is in its own sign (Gemini or Virgo) or exaltation (Virgo) in a kendra house. This creates exceptional intellectual abilities, communication skills, and business acumen.",
    lifeImpact: "You have outstanding intelligence, analytical abilities, and communication skills. Success comes through intellectual pursuits, business, writing, or any field requiring sharp mental faculties. You may be recognized for your wisdom and eloquence.",
    positiveManifestations: [
      "Exceptional intelligence and learning ability",
      "Outstanding communication and writing skills",
      "Business acumen and commercial success",
      "Analytical and problem-solving abilities",
      "Skill in multiple languages or subjects",
      "Respected for knowledge and expertise"
    ],
    challenges: [
      "May overthink or analyze excessively",
      "Tendency towards nervousness or anxiety",
      "Can be too critical or perfectionist",
      "Need to balance intellect with emotion"
    ],
    workingWithThisEnergy: [
      "Pursue intellectual and educational endeavors",
      "Write, speak, or teach to share your knowledge",
      "Develop business skills and commercial understanding",
      "Balance mental activity with physical relaxation",
      "Use your analytical skills to solve real problems"
    ],
    planetaryNature: "Very strong Mercury yoga; provides sharp intellect and versatility"
  },

  "Hamsa Yoga": {
    fullName: "Hamsa Yoga - The Jupiter Mahapurusha Yoga",
    category: "Mahapurusha Yoga",
    meaning: "Formed when Jupiter is in its own sign (Sagittarius or Pisces) or exaltation (Cancer) in a kendra house. This is one of the most auspicious yogas, bestowing wisdom, spirituality, and prosperity.",
    lifeImpact: "You possess exceptional wisdom, spiritual depth, and moral character. Success comes through knowledge, teaching, counseling, or spiritual leadership. You're likely to be respected as a guide and mentor to others.",
    positiveManifestations: [
      "Exceptional wisdom and spiritual understanding",
      "Strong moral and ethical character",
      "Success in teaching, counseling, or spiritual fields",
      "Prosperity and material comforts",
      "Respected and honored in society",
      "Generous and charitable nature",
      "Good fortune and divine protection"
    ],
    challenges: [
      "May be too idealistic or preachy",
      "Tendency towards complacency due to good fortune",
      "Need to stay humble despite recognition",
      "Can overlook practical details"
    ],
    workingWithThisEnergy: [
      "Pursue spiritual practices and higher knowledge",
      "Teach, guide, or mentor others generously",
      "Maintain high ethical standards in all areas",
      "Use prosperity to help others",
      "Balance idealism with practical action",
      "Stay grateful and humble despite success"
    ],
    planetaryNature: "Extremely auspicious and powerful yoga; brings both material and spiritual blessings"
  },

  "Malavya Yoga": {
    fullName: "Malavya Yoga - The Venus Mahapurusha Yoga",
    category: "Mahapurusha Yoga",
    meaning: "Formed when Venus is in its own sign (Taurus or Libra) or exaltation (Pisces) in a kendra house. This yoga bestows exceptional beauty, artistic talents, luxury, and harmonious relationships.",
    lifeImpact: "You possess refined aesthetic sense, artistic abilities, and attraction of material comforts. Success comes through arts, beauty, fashion, luxury goods, or relationship counseling. You naturally attract beauty and harmony into your life.",
    positiveManifestations: [
      "Exceptional beauty and personal charm",
      "Outstanding artistic and creative talents",
      "Attraction of wealth and luxury",
      "Harmonious and fulfilling relationships",
      "Success in arts, fashion, or beauty industries",
      "Refined tastes and cultural appreciation",
      "Social grace and diplomatic abilities"
    ],
    challenges: [
      "May be overly focused on appearances or pleasure",
      "Tendency towards indulgence or laziness",
      "Can be too dependent on comfort and luxury",
      "Need to develop inner substance alongside outer beauty"
    ],
    workingWithThisEnergy: [
      "Develop your artistic and creative talents fully",
      "Create beauty in your environment and work",
      "Use your charm and social skills constructively",
      "Practice moderation in pleasures and luxuries",
      "Cultivate inner beauty alongside outer appearance",
      "Share your aesthetic sense to uplift others"
    ],
    planetaryNature: "Very strong Venus yoga; brings beauty, wealth, and artistic success"
  },

  "Shasha Yoga": {
    fullName: "Shasha Yoga - The Saturn Mahapurusha Yoga",
    category: "Mahapurusha Yoga",
    meaning: "Formed when Saturn is in its own sign (Capricorn or Aquarius) or exaltation (Libra) in a kendra house. This yoga bestows discipline, longevity, authority, and success through perseverance.",
    lifeImpact: "You possess exceptional discipline, patience, and organizational abilities. Success comes through hard work, systematic effort, and long-term planning. You may achieve positions of significant authority and responsibility, often later in life.",
    positiveManifestations: [
      "Exceptional discipline and self-control",
      "Strong organizational and managerial abilities",
      "Success through systematic effort and perseverance",
      "Longevity and good health in later life",
      "Authority and respect, especially after age 36",
      "Ability to handle responsibility and pressure",
      "Wisdom gained through life experience"
    ],
    challenges: [
      "May face delays or obstacles initially",
      "Tendency towards pessimism or excessive caution",
      "Can be too rigid or controlling",
      "Need to balance work with enjoyment of life"
    ],
    workingWithThisEnergy: [
      "Embrace discipline as your path to success",
      "Plan long-term and work systematically",
      "Be patient - your greatest success may come later",
      "Develop organizational and leadership skills",
      "Balance responsibility with self-care",
      "Use your authority to create lasting structures"
    ],
    planetaryNature: "Powerful Saturn yoga; brings success through effort and time"
  },

  // ============================================================================
  // PARIVARTANA YOGAS (Exchange Yogas)
  // ============================================================================

  "Maha Parivartana Yoga": {
    fullName: "Maha Parivartana Yoga - The Great Exchange",
    category: "Parivartana Yoga",
    meaning: "Formed when lords of auspicious houses (1st, 4th, 5th, 7th, 9th, 10th) exchange signs. This creates a powerful connection between two life areas, amplifying their positive effects.",
    lifeImpact: "Two important areas of your life are deeply interconnected and mutually supportive. Success in one area naturally supports the other, creating a synergistic effect.",
    positiveManifestations: [
      "Strong connection between two life areas",
      "Mutual support between different aspects of life",
      "Enhanced results in both areas involved",
      "Ability to leverage one strength to build another",
      "Versatility in multiple life domains"
    ],
    challenges: [
      "Need to maintain balance between both areas",
      "Success requires attention to both houses",
      "May feel pulled between two important areas"
    ],
    workingWithThisEnergy: [
      "Identify how the two areas support each other",
      "Develop both areas simultaneously",
      "Use strength in one to build the other",
      "Find creative ways to integrate both life areas"
    ],
    planetaryNature: "Depends on which house lords are exchanging; generally very beneficial"
  },

  // ============================================================================
  // VIPARITA RAJA YOGAS (Reversal Yogas - Success from Adversity)
  // ============================================================================

  "Viparita Raja Yoga": {
    fullName: "Viparita Raja Yoga - Success Through Adversity",
    category: "Viparita Raja Yoga",
    meaning: "Formed when lords of difficult houses (6th, 8th, 12th) are placed in other difficult houses or combine together. Paradoxically, this creates success through overcoming obstacles, transforming challenges into opportunities.",
    lifeImpact: "You have the remarkable ability to transform difficulties into advantages. Challenges that would defeat others become stepping stones for your growth and success. Your greatest strengths emerge through adversity.",
    positiveManifestations: [
      "Ability to overcome significant obstacles",
      "Success emerging from challenging situations",
      "Resilience and transformative power",
      "Victory over enemies and competitors",
      "Strength through crisis and difficulty",
      "Ability to help others through similar challenges"
    ],
    challenges: [
      "May face more obstacles than others initially",
      "Success often comes after struggle",
      "Need to stay positive during difficult times",
      "Can become hardened by challenges if not careful"
    ],
    workingWithThisEnergy: [
      "View challenges as opportunities for growth",
      "Develop resilience and transformative skills",
      "Help others who face similar obstacles",
      "Trust that difficulties are temporary and purposeful",
      "Use crisis as catalyst for positive change",
      "Maintain faith during challenging periods"
    ],
    planetaryNature: "Depends on which dusthana lords are involved; requires careful analysis"
  },

  // ============================================================================
  // NEECHA BHANGA RAJA YOGA (Cancellation of Debilitation)
  // ============================================================================

  "Neecha Bhanga Raja Yoga": {
    fullName: "Neecha Bhanga Raja Yoga - Debilitation Cancellation",
    category: "Neecha Bhanga Yoga",
    meaning: "When a debilitated planet's negative effects are cancelled through specific planetary positions, it creates this powerful yoga. The planet transforms from weakness to exceptional strength, often bringing remarkable success.",
    lifeImpact: "An area of potential weakness or challenge becomes a source of exceptional strength and achievement. You may overcome early difficulties to achieve remarkable success in that life area.",
    positiveManifestations: [
      "Transformation of weakness into strength",
      "Exceptional achievement in areas of initial difficulty",
      "Resilience and ability to overcome limitations",
      "Success through personal transformation",
      "Inspiration to others facing similar challenges"
    ],
    challenges: [
      "May face initial struggles or setbacks",
      "Requires effort to activate the cancellation",
      "Success may come later rather than earlier",
      "Need to work harder than those with natural strengths"
    ],
    workingWithThisEnergy: [
      "Recognize that initial weakness can become strength",
      "Work consciously on developing the challenged area",
      "Seek support and learning in your weak areas",
      "Be patient with your development process",
      "Use your transformation story to inspire others"
    ],
    planetaryNature: "Strength depends on the specific cancellation factors present"
  },

  // ============================================================================
  // KALASARPA YOGA / KALA AMRITA YOGA
  // ============================================================================

  "Kala Sarpa Yoga": {
    fullName: "Kala Sarpa Yoga - The Serpent of Time",
    category: "Karmic Yoga",
    meaning: "Formed when all seven planets are hemmed between Rahu and Ketu (the lunar nodes). This is considered a karmic yoga that brings intense life experiences, challenges, and ultimately, significant spiritual growth.",
    lifeImpact: "Your life may have intense ups and downs, with periods of significant challenge followed by breakthrough. This yoga indicates a karmic journey that requires you to overcome obstacles and develop inner strength. Success comes through perseverance and spiritual development.",
    positiveManifestations: [
      "Strong karmic purpose and spiritual depth",
      "Ability to overcome significant obstacles",
      "Potential for transformative breakthroughs",
      "Deep wisdom gained through experience",
      "Resilience and inner strength",
      "Success after persistent effort"
    ],
    challenges: [
      "May face recurring obstacles or delays",
      "Intense life experiences and karmic lessons",
      "Periods of feeling blocked or restricted",
      "Need for patience and persistence",
      "Emotional intensity and internal struggles"
    ],
    workingWithThisEnergy: [
      "Develop spiritual practices (meditation, yoga, prayer)",
      "View challenges as opportunities for growth",
      "Cultivate patience and long-term perspective",
      "Work on releasing past karmic patterns",
      "Seek guidance from spiritual teachers or counselors",
      "Practice regular worship or rituals for Rahu-Ketu",
      "Transform obstacles into wisdom and strength"
    ],
    planetaryNature: "Effects vary based on which axis (houses) Rahu-Ketu occupy and the placement of planets between them"
  },

  // ============================================================================
  // NITHYA YOGAS (27 Lunar Yogas - Sun-Moon Combinations)
  // ============================================================================

  "Vishkambha (Nithya Yoga)": {
    fullName: "Vishkambha Nithya Yoga - The Pillar",
    category: "Lunar Yoga",
    meaning: "The first of the 27 Nithya Yogas, formed when the Sun-Moon angle is between 0-13°20'. Vishkambha means 'pillar' or 'support'. This yoga initially presents obstacles but ultimately leads to success through persistent effort.",
    lifeImpact: "You may face initial challenges in new endeavors, but your determination and ability to overcome obstacles leads to lasting achievements. You have the strength to be a pillar of support for others.",
    positiveManifestations: [
      "Strong ability to overcome obstacles",
      "Persistence and determination",
      "Capacity to support and help others",
      "Success through sustained effort",
      "Resilient character"
    ],
    challenges: [
      "Initial obstacles in new ventures",
      "May face resistance from others",
      "Need patience to see results"
    ],
    workingWithThisEnergy: [
      "Develop patience and persistence",
      "View obstacles as opportunities for growth",
      "Don't give up when faced with initial resistance",
      "Use your strength to help stabilize difficult situations",
      "Build foundations slowly and steadily"
    ],
    planetaryNature: "Based on Sun-Moon angular relationship; effects vary with Moon phase"
  },

  "Priti (Nithya Yoga)": {
    fullName: "Priti Nithya Yoga - Love and Affection",
    category: "Lunar Yoga",
    meaning: "Formed when the Sun-Moon angle is between 13°20'-26°40'. Priti means 'love', 'affection', and 'pleasure'. This is one of the most favorable Nithya Yogas, bestowing charm, popularity, and loving relationships.",
    lifeImpact: "You naturally attract love, affection, and positive relationships. People are drawn to your warm personality, and you find joy in creating harmonious connections with others.",
    positiveManifestations: [
      "Natural charm and likability",
      "Ability to form loving relationships",
      "Popularity and social success",
      "Joyful and positive disposition",
      "Success in partnership-oriented activities"
    ],
    challenges: [
      "May rely too heavily on others' approval",
      "Can avoid necessary conflicts",
      "Need to develop independence alongside relationships"
    ],
    workingWithThisEnergy: [
      "Cultivate genuine, meaningful relationships",
      "Use your charm for positive purposes",
      "Share love and kindness generously",
      "Balance social life with personal development",
      "Express affection authentically"
    ],
    planetaryNature: "Highly auspicious; benefits increase during waxing Moon phases"
  },

  "Ayushman (Nithya Yoga)": {
    fullName: "Ayushman Nithya Yoga - Longevity",
    category: "Lunar Yoga",
    meaning: "Formed when the Sun-Moon angle is between 26°40'-40°. Ayushman means 'long life' and 'vitality'. This yoga bestows good health, longevity, and energetic vitality.",
    lifeImpact: "You are blessed with good health, vitality, and potentially long life. Your energetic nature helps you accomplish much and maintain enthusiasm throughout life.",
    positiveManifestations: [
      "Good health and vitality",
      "Long life and sustained energy",
      "Quick recovery from illness",
      "Enthusiastic approach to life",
      "Physical strength and endurance"
    ],
    challenges: [
      "May overextend due to high energy",
      "Need to practice moderation",
      "Can take health for granted"
    ],
    workingWithThisEnergy: [
      "Maintain healthy lifestyle habits",
      "Use your vitality for productive purposes",
      "Practice preventive health care",
      "Channel high energy into meaningful activities",
      "Help others with health and wellness"
    ],
    planetaryNature: "Very auspicious for health and longevity"
  },

  "Saubhagya (Nithya Yoga)": {
    fullName: "Saubhagya Nithya Yoga - Good Fortune",
    category: "Lunar Yoga",
    meaning: "Formed when the Sun-Moon angle is between 40°-53°20'. Saubhagya means 'good fortune' and 'prosperity'. This yoga brings luck, wealth, and overall well-being.",
    lifeImpact: "You are fortunate in life and tend to attract prosperity and good opportunities. Success comes relatively easily, and you enjoy material comforts.",
    positiveManifestations: [
      "Natural good fortune and luck",
      "Material prosperity",
      "Comfortable lifestyle",
      "Opportunities come easily",
      "General sense of well-being"
    ],
    challenges: [
      "May not develop resilience through struggle",
      "Can become complacent",
      "Need to appreciate blessings"
    ],
    workingWithThisEnergy: [
      "Use your good fortune to help others",
      "Don't take prosperity for granted",
      "Develop gratitude practices",
      "Share your abundance generously",
      "Continue growing despite ease"
    ],
    planetaryNature: "Very auspicious for wealth and material success"
  },

  "Sobhana (Nithya Yoga)": {
    fullName: "Sobhana Nithya Yoga - Splendor",
    category: "Lunar Yoga",
    meaning: "Formed when the Sun-Moon angle is between 53°20'-66°40'. Sobhana means 'splendid', 'beautiful', and 'virtuous'. This yoga bestows good character, beauty, and auspicious qualities.",
    lifeImpact: "You possess natural grace, virtue, and an attractive personality. Your character and conduct inspire respect and admiration from others.",
    positiveManifestations: [
      "Virtuous and ethical character",
      "Natural grace and beauty",
      "Respected by others",
      "Auspicious presence",
      "Moral integrity"
    ],
    challenges: [
      "High standards can be hard to maintain",
      "May be judgmental of others",
      "Need to balance idealism with reality"
    ],
    workingWithThisEnergy: [
      "Maintain ethical standards in all actions",
      "Lead by example",
      "Cultivate both inner and outer beauty",
      "Use your influence for good",
      "Practice humility alongside virtue"
    ],
    planetaryNature: "Auspicious for character development and reputation"
  },

  "Atiganda (Nithya Yoga)": {
    fullName: "Atiganda Nithya Yoga - Great Knot",
    category: "Lunar Yoga",
    meaning: "Formed when the Sun-Moon angle is between 66°40'-80°. Atiganda means 'great knot' or 'obstacle'. This is a challenging yoga that brings obstacles, aggression, and the need for careful action.",
    lifeImpact: "You may face significant obstacles and conflicts in life that require careful navigation. Success comes through overcoming challenges and controlling aggressive tendencies.",
    positiveManifestations: [
      "Strength forged through challenges",
      "Ability to untie complex problems",
      "Courage in facing difficulties",
      "Develops problem-solving skills",
      "Resilience and toughness"
    ],
    challenges: [
      "Tendency towards aggression or conflict",
      "Obstacles in endeavors",
      "Need for patience and careful planning",
      "May face opposition from others"
    ],
    workingWithThisEnergy: [
      "Practice patience and anger management",
      "Approach obstacles systematically",
      "Avoid impulsive or aggressive reactions",
      "Seek peaceful resolution to conflicts",
      "Use challenges as growth opportunities"
    ],
    planetaryNature: "Challenging yoga; requires conscious effort to work with constructively"
  },

  "Sukarma (Nithya Yoga)": {
    fullName: "Sukarma Nithya Yoga - Good Actions",
    category: "Lunar Yoga",
    meaning: "Formed when the Sun-Moon angle is between 80°-93°20'. Sukarma means 'good deeds' and 'righteous actions'. This yoga promotes ethical conduct and beneficial activities.",
    lifeImpact: "You have a natural inclination towards good deeds and righteous actions. Your ethical conduct and helpful nature create positive karma and bring rewards.",
    positiveManifestations: [
      "Strong ethical foundation",
      "Inclination towards good deeds",
      "Positive karma creation",
      "Helpful and service-oriented",
      "Satisfaction from doing right"
    ],
    challenges: [
      "May be taken advantage of",
      "Can be overly idealistic",
      "Need to balance giving with receiving"
    ],
    workingWithThisEnergy: [
      "Engage in charitable and helpful activities",
      "Maintain ethical standards",
      "Create positive karma consciously",
      "Set healthy boundaries while helping",
      "Find work that serves others"
    ],
    planetaryNature: "Auspicious for dharmic and ethical pursuits"
  },

  "Dhriti (Nithya Yoga)": {
    fullName: "Dhriti Nithya Yoga - Patience",
    category: "Lunar Yoga",
    meaning: "Formed when the Sun-Moon angle is between 93°20'-106°40'. Dhriti means 'patience', 'firmness', and 'determination'. This yoga bestows steadfastness and the ability to persist.",
    lifeImpact: "You possess exceptional patience and determination. Your ability to remain steady and persistent through difficulties leads to eventual success.",
    positiveManifestations: [
      "Exceptional patience and persistence",
      "Steady and reliable character",
      "Ability to endure difficulties",
      "Firm determination",
      "Long-term perspective"
    ],
    challenges: [
      "May be too slow to act",
      "Can become stubborn",
      "Need to balance patience with timely action"
    ],
    workingWithThisEnergy: [
      "Cultivate patience as a strength",
      "Take on long-term projects",
      "Be the steady presence in chaos",
      "Balance persistence with flexibility",
      "Help others develop patience"
    ],
    planetaryNature: "Favorable for sustained efforts and long-term goals"
  },

  "Soola (Nithya Yoga)": {
    fullName: "Soola Nithya Yoga - The Spear",
    category: "Lunar Yoga",
    meaning: "Formed when the Sun-Moon angle is between 106°40'-120°. Soola means 'spear' or 'pain'. This is a challenging yoga that can bring suffering, sharp difficulties, and the need for healing.",
    lifeImpact: "You may experience periods of pain or difficulty that require healing and transformation. These challenges ultimately lead to greater compassion and strength.",
    positiveManifestations: [
      "Deep compassion from experiencing pain",
      "Strong healing abilities",
      "Wisdom gained through difficulty",
      "Ability to help others who suffer",
      "Transformative strength"
    ],
    challenges: [
      "May experience physical or emotional pain",
      "Tendency towards pessimism",
      "Need for healing and recovery",
      "Can be overly sensitive to suffering"
    ],
    workingWithThisEnergy: [
      "Seek appropriate healing modalities",
      "Transform pain into compassion",
      "Help others who are suffering",
      "Develop resilience through challenges",
      "Practice self-care and healing",
      "Don't let past pain define your future"
    ],
    planetaryNature: "Challenging yoga; requires healing work and transformation"
  },

  "Ganda (Nithya Yoga)": {
    fullName: "Ganda Nithya Yoga - The Knot",
    category: "Lunar Yoga",
    meaning: "Formed when the Sun-Moon angle is between 120°-133°20'. Ganda means 'knot' or 'obstacle'. This yoga can bring accidents, obstacles, and complicated situations that need careful untangling.",
    lifeImpact: "You may face complicated situations and obstacles that require patience and wisdom to resolve. Success comes through careful problem-solving and avoiding rash action.",
    positiveManifestations: [
      "Excellent problem-solving abilities",
      "Ability to handle complexity",
      "Patience in difficult situations",
      "Learns to prevent problems",
      "Develops caution and wisdom"
    ],
    challenges: [
      "Prone to accidents or obstacles",
      "Complicated life situations",
      "Need for extra caution",
      "May feel stuck or entangled"
    ],
    workingWithThisEnergy: [
      "Practice extra caution in actions",
      "Solve problems systematically",
      "Avoid impulsive decisions",
      "Seek wise counsel when stuck",
      "Develop patience and careful planning",
      "Learn from obstacles to prevent future ones"
    ],
    planetaryNature: "Challenging yoga; requires caution and careful navigation"
  },

  "Vriddhi (Nithya Yoga)": {
    fullName: "Vriddhi Nithya Yoga - Growth",
    category: "Lunar Yoga",
    meaning: "Formed when the Sun-Moon angle is between 133°20'-146°40'. Vriddhi means 'growth', 'increase', and 'expansion'. This is an auspicious yoga that brings prosperity and growth in various areas of life.",
    lifeImpact: "You experience steady growth and expansion in life. Whether in wealth, knowledge, or personal development, you tend to see continuous increase and improvement.",
    positiveManifestations: [
      "Continuous growth and expansion",
      "Increasing prosperity",
      "Business and financial growth",
      "Personal development",
      "Accumulation of knowledge and wisdom"
    ],
    challenges: [
      "May expand too quickly",
      "Can become materialistic",
      "Need to ensure quality alongside quantity"
    ],
    workingWithThisEnergy: [
      "Pursue continuous learning and growth",
      "Invest in long-term growth opportunities",
      "Expand businesses or projects steadily",
      "Share growing resources with others",
      "Maintain balance during expansion"
    ],
    planetaryNature: "Very auspicious for business, wealth, and personal growth"
  },

  "Dhruva (Nithya Yoga)": {
    fullName: "Dhruva Nithya Yoga - The Fixed One",
    category: "Lunar Yoga",
    meaning: "Formed when the Sun-Moon angle is between 146°40'-160°. Dhruva means 'fixed', 'stable', and 'permanent'. This yoga bestows stability, reliability, and lasting results.",
    lifeImpact: "You create lasting, permanent results in your endeavors. Your stable and reliable nature makes you a cornerstone in relationships and professional settings.",
    positiveManifestations: [
      "Exceptional stability and reliability",
      "Creates lasting results",
      "Trustworthy character",
      "Permanent achievements",
      "Grounded and centered presence"
    ],
    challenges: [
      "May resist necessary change",
      "Can become too rigid",
      "Difficulty with flexibility"
    ],
    workingWithThisEnergy: [
      "Build foundations that last",
      "Be the stable presence others can rely on",
      "Create permanent positive change",
      "Balance stability with necessary adaptability",
      "Focus on long-term, sustainable results"
    ],
    planetaryNature: "Excellent for permanent works, foundations, and lasting achievements"
  },

  "Vyaghata (Nithya Yoga)": {
    fullName: "Vyaghata Nithya Yoga - Striking",
    category: "Lunar Yoga",
    meaning: "Formed when the Sun-Moon angle is between 160°-173°20'. Vyaghata means 'striking' or 'attack'. This challenging yoga can bring conflicts, attacks, and the need for protection.",
    lifeImpact: "You may face conflicts or attacks from others that require defensive action and protection. Developing strength and boundaries is important for navigating this energy.",
    positiveManifestations: [
      "Develops strong defensive abilities",
      "Learns to set boundaries",
      "Becomes resilient through conflict",
      "Ability to protect self and others",
      "Strategic thinking"
    ],
    challenges: [
      "Prone to conflicts and attacks",
      "May face opposition from others",
      "Need for constant vigilance",
      "Can become overly defensive"
    ],
    workingWithThisEnergy: [
      "Develop healthy boundaries",
      "Learn conflict resolution skills",
      "Protect yourself wisely without becoming aggressive",
      "Choose battles carefully",
      "Use strength for defense, not offense",
      "Transform conflict into growth"
    ],
    planetaryNature: "Challenging yoga; requires development of boundaries and protection"
  },

  "Harshana (Nithya Yoga)": {
    fullName: "Harshana Nithya Yoga - Joy",
    category: "Lunar Yoga",
    meaning: "Formed when the Sun-Moon angle is between 173°20'-186°40'. Harshana means 'joy', 'happiness', and 'cheerfulness'. This delightful yoga brings joy, optimism, and positive energy.",
    lifeImpact: "You naturally experience and spread joy and happiness. Your cheerful disposition uplifts others and attracts positive experiences into your life.",
    positiveManifestations: [
      "Natural joy and happiness",
      "Optimistic outlook on life",
      "Ability to uplift others",
      "Attracts positive experiences",
      "Cheerful and pleasant disposition"
    ],
    challenges: [
      "May avoid dealing with serious issues",
      "Can be seen as superficial",
      "Need to develop depth alongside cheerfulness"
    ],
    workingWithThisEnergy: [
      "Spread joy and positivity to others",
      "Maintain optimism while being realistic",
      "Use humor and cheerfulness therapeutically",
      "Create happy environments",
      "Balance lightness with depth"
    ],
    planetaryNature: "Very auspicious for happiness, celebrations, and positive energy"
  },

  "Vajra (Nithya Yoga)": {
    fullName: "Vajra Nithya Yoga - Diamond",
    category: "Lunar Yoga",
    meaning: "Formed when the Sun-Moon angle is between 186°40'-200°. Vajra means 'diamond' or 'thunderbolt'. This powerful yoga bestows diamond-like strength, hardness, and indestructibility.",
    lifeImpact: "You possess exceptional strength and resilience, like a diamond or thunderbolt. Your unbreakable spirit allows you to withstand tremendous pressure and emerge victorious.",
    positiveManifestations: [
      "Exceptional strength and resilience",
      "Indestructible spirit",
      "Ability to withstand pressure",
      "Clarity and brilliance like a diamond",
      "Powerful presence and impact"
    ],
    challenges: [
      "May be too hard or inflexible",
      "Can lack gentleness",
      "May hurt others unintentionally with hardness"
    ],
    workingWithThisEnergy: [
      "Use strength wisely and compassionately",
      "Be unbreakable in your principles",
      "Balance hardness with softness when needed",
      "Develop inner clarity and brilliance",
      "Protect those who are vulnerable"
    ],
    planetaryNature: "Powerful yoga; excellent for strength and endurance"
  },

  "Siddhi (Nithya Yoga)": {
    fullName: "Siddhi Nithya Yoga - Perfection",
    category: "Lunar Yoga",
    meaning: "Formed when the Sun-Moon angle is between 200°-213°20'. Siddhi means 'perfection', 'success', and 'accomplishment'. This highly auspicious yoga brings success, achievement, and even spiritual powers.",
    lifeImpact: "You have the ability to achieve success and perfection in your endeavors. Your focused efforts lead to accomplishment, and you may develop special abilities or insights.",
    positiveManifestations: [
      "Success in endeavors",
      "Achievement of goals",
      "Development of special abilities",
      "Perfection in chosen fields",
      "Spiritual attainment possible"
    ],
    challenges: [
      "Perfectionism can be paralyzing",
      "May set unrealistic standards",
      "Can become obsessed with achievement"
    ],
    workingWithThisEnergy: [
      "Pursue excellence without perfectionism",
      "Develop your special talents fully",
      "Use achievements to serve others",
      "Balance material and spiritual success",
      "Celebrate accomplishments appropriately"
    ],
    planetaryNature: "Highly auspicious for success, achievement, and spiritual practices"
  },

  "Vyatipata (Nithya Yoga)": {
    fullName: "Vyatipata Nithya Yoga - Calamity",
    category: "Lunar Yoga",
    meaning: "Formed when the Sun-Moon angle is between 213°20'-226°40'. Vyatipata means 'calamity' or 'misfortune'. This is one of the most challenging Nithya Yogas, bringing unexpected difficulties and the need for crisis management.",
    lifeImpact: "You may face unexpected calamities or crises that require strong crisis management skills. These challenges ultimately develop your resilience and ability to help others in difficult times.",
    positiveManifestations: [
      "Excellent crisis management abilities",
      "Develops extreme resilience",
      "Ability to help others in emergencies",
      "Wisdom from overcoming calamities",
      "Strength forged in fire"
    ],
    challenges: [
      "Prone to unexpected difficulties",
      "May experience sudden losses or setbacks",
      "Need for constant preparedness",
      "Can develop anxiety or fear"
    ],
    workingWithThisEnergy: [
      "Develop emergency preparedness",
      "Build strong support networks",
      "Learn crisis management skills",
      "Transform challenges into wisdom",
      "Help others who face calamities",
      "Practice resilience and faith",
      "Don't let fear paralyze you"
    ],
    planetaryNature: "Very challenging yoga; requires resilience and crisis management skills"
  },

  "Variyan (Nithya Yoga)": {
    fullName: "Variyan Nithya Yoga - Excellence",
    category: "Lunar Yoga",
    meaning: "Formed when the Sun-Moon angle is between 226°40'-240°. Variyan means 'best', 'excellent', and 'noble'. This auspicious yoga bestows excellence, nobility, and high-quality results.",
    lifeImpact: "You naturally strive for and achieve excellence in your pursuits. Your noble character and high standards lead to superior results and recognition.",
    positiveManifestations: [
      "Excellence in chosen fields",
      "Noble character and conduct",
      "High-quality work and results",
      "Recognition for superiority",
      "Inspirational to others"
    ],
    challenges: [
      "May be too demanding of self and others",
      "Can create stress through high standards",
      "Need to accept human imperfection"
    ],
    workingWithThisEnergy: [
      "Pursue excellence without perfectionism",
      "Lead by example",
      "Maintain high standards with compassion",
      "Share knowledge of excellence with others",
      "Balance achievement with acceptance"
    ],
    planetaryNature: "Very auspicious for achieving excellence and recognition"
  },

  "Parigha (Nithya Yoga)": {
    fullName: "Parigha Nithya Yoga - Iron Bar",
    category: "Lunar Yoga",
    meaning: "Formed when the Sun-Moon angle is between 240°-253°20'. Parigha means 'iron bar' or 'obstacle'. This challenging yoga brings restrictions, limitations, and obstacles like an iron bar blocking the path.",
    lifeImpact: "You may face restrictions and limitations that feel like iron bars across your path. Learning to work within or overcome these limitations builds character and resourcefulness.",
    positiveManifestations: [
      "Develops resourcefulness",
      "Learns to work within limitations",
      "Builds character through restriction",
      "Finds creative solutions to obstacles",
      "Develops determination"
    ],
    challenges: [
      "Faces restrictions and limitations",
      "May feel blocked or confined",
      "Obstacles in path to goals",
      "Can feel frustrated by barriers"
    ],
    workingWithThisEnergy: [
      "Work creatively within limitations",
      "Find ways around or through obstacles",
      "Develop patience with restrictions",
      "Use limitations as creative constraints",
      "Help others overcome barriers",
      "Don't let restrictions define your limits"
    ],
    planetaryNature: "Challenging yoga; requires patience and creative problem-solving"
  },

  "Shiva (Nithya Yoga)": {
    fullName: "Shiva Nithya Yoga - Auspiciousness",
    category: "Lunar Yoga",
    meaning: "Formed when the Sun-Moon angle is between 253°20'-266°40'. Named after Lord Shiva, this highly auspicious yoga brings prosperity, transformation, and divine blessings.",
    lifeImpact: "You are blessed with auspicious energy and the ability to transform yourself and your circumstances. Prosperity and positive change flow naturally in your life.",
    positiveManifestations: [
      "Highly auspicious energy",
      "Prosperity and abundance",
      "Transformative abilities",
      "Spiritual connection",
      "Divine blessings and protection"
    ],
    challenges: [
      "May undergo intense transformations",
      "Need to embrace change",
      "Can face destruction before creation"
    ],
    workingWithThisEnergy: [
      "Embrace transformation and change",
      "Use prosperity for good purposes",
      "Develop spiritual practices",
      "Be a force for positive transformation",
      "Share blessings with others"
    ],
    planetaryNature: "Highly auspicious for prosperity and spiritual growth"
  },

  "Siddha (Nithya Yoga)": {
    fullName: "Siddha Nithya Yoga - Accomplished",
    category: "Lunar Yoga",
    meaning: "Formed when the Sun-Moon angle is between 266°40'-280°. Siddha means 'accomplished', 'perfected', and 'adept'. This exceptional yoga bestows mastery, accomplishment, and the ability to achieve perfection.",
    lifeImpact: "You have the potential for mastery and accomplishment in your chosen fields. Your dedication and ability lead to becoming a true adept or expert.",
    positiveManifestations: [
      "Mastery in chosen fields",
      "Accomplishment of goals",
      "Expertise and skill development",
      "Recognition as an expert",
      "Ability to perfect techniques"
    ],
    challenges: [
      "May become isolated in expertise",
      "Can be overly focused on mastery",
      "Need to share knowledge, not hoard it"
    ],
    workingWithThisEnergy: [
      "Dedicate yourself to mastery",
      "Develop deep expertise",
      "Share your knowledge with students",
      "Balance mastery with humility",
      "Use expertise to serve others"
    ],
    planetaryNature: "Highly auspicious for mastery, expertise, and accomplishment"
  },

  "Sadhya (Nithya Yoga)": {
    fullName: "Sadhya Nithya Yoga - Achievable",
    category: "Lunar Yoga",
    meaning: "Formed when the Sun-Moon angle is between 280°-293°20'. Sadhya means 'achievable', 'attainable', and 'feasible'. This yoga indicates that your goals and aspirations are within reach and can be accomplished.",
    lifeImpact: "Your dreams and goals are achievable through proper effort. You have the practical wisdom to set realistic goals and the determination to accomplish them.",
    positiveManifestations: [
      "Realistic goal-setting abilities",
      "Dreams that can be achieved",
      "Practical approach to aspirations",
      "Steady progress towards goals",
      "Satisfaction of accomplishment"
    ],
    challenges: [
      "May limit aspirations to what seems achievable",
      "Can lack vision of greater possibilities",
      "Need to dream big while being practical"
    ],
    workingWithThisEnergy: [
      "Set clear, achievable goals",
      "Work steadily towards aspirations",
      "Balance practicality with ambition",
      "Help others achieve their goals",
      "Celebrate each accomplishment",
      "Expand what you believe is achievable"
    ],
    planetaryNature: "Favorable for practical goal achievement and steady progress"
  },

  "Shubha (Nithya Yoga)": {
    fullName: "Shubha Nithya Yoga - Auspicious",
    category: "Lunar Yoga",
    meaning: "Formed when the Sun-Moon angle is between 293°20'-306°40'. Shubha means 'auspicious', 'fortunate', and 'blessed'. This highly favorable yoga brings good fortune, blessings, and positive outcomes.",
    lifeImpact: "You are blessed with auspicious energy that attracts positive outcomes and good fortune. Your presence itself brings blessings to situations and people.",
    positiveManifestations: [
      "Natural good fortune",
      "Auspicious presence",
      "Positive outcomes in endeavors",
      "Blessed with opportunities",
      "Brings blessings to others"
    ],
    challenges: [
      "May not develop resilience through struggle",
      "Can take good fortune for granted",
      "Need to appreciate blessings consciously"
    ],
    workingWithThisEnergy: [
      "Use your auspicious energy wisely",
      "Bring blessings to others consciously",
      "Practice gratitude for good fortune",
      "Share positive energy generously",
      "Don't waste auspicious opportunities"
    ],
    planetaryNature: "Highly auspicious for all positive endeavors"
  },

  "Shukla (Nithya Yoga)": {
    fullName: "Shukla Nithya Yoga - Pure Brightness",
    category: "Lunar Yoga",
    meaning: "Formed when the Sun-Moon angle is between 306°40'-320°. Shukla means 'pure', 'white', and 'bright'. This yoga bestows purity, clarity, brightness, and virtue.",
    lifeImpact: "You possess natural purity of character and clarity of mind. Your bright, clean energy attracts truth and virtue into your life.",
    positiveManifestations: [
      "Pure intentions and character",
      "Mental clarity and brightness",
      "Virtuous conduct",
      "Attracts truth and honesty",
      "Clean, positive energy"
    ],
    challenges: [
      "May be naïve or too trusting",
      "Can be shocked by impurity in others",
      "Need to develop discernment with purity"
    ],
    workingWithThisEnergy: [
      "Maintain purity in thoughts and actions",
      "Cultivate clarity of mind",
      "Be a force for truth and honesty",
      "Purify yourself and your environment",
      "Balance purity with worldly wisdom"
    ],
    planetaryNature: "Very auspicious for purity, clarity, and virtuous living"
  },

  "Brahma (Nithya Yoga)": {
    fullName: "Brahma Nithya Yoga - The Creator",
    category: "Lunar Yoga",
    meaning: "Formed when the Sun-Moon angle is between 320°-333°20'. Named after Brahma the Creator, this yoga bestows creative power, spiritual wisdom, and the ability to manifest.",
    lifeImpact: "You possess exceptional creative abilities and the power to manifest your visions. Your connection to creative and spiritual forces helps you bring new things into existence.",
    positiveManifestations: [
      "Exceptional creative abilities",
      "Spiritual wisdom and insight",
      "Power to manifest visions",
      "Connection to divine creative force",
      "Ability to create something from nothing"
    ],
    challenges: [
      "May get lost in creation",
      "Can be detached from material world",
      "Need to ground creative visions"
    ],
    workingWithThisEnergy: [
      "Develop creative talents fully",
      "Use creativity for positive purposes",
      "Cultivate spiritual practices",
      "Manifest visions into reality",
      "Balance creation with preservation",
      "Share creative gifts generously"
    ],
    planetaryNature: "Highly auspicious for creativity, spirituality, and manifestation"
  },

  "Indra (Nithya Yoga)": {
    fullName: "Indra Nithya Yoga - The King of Gods",
    category: "Lunar Yoga",
    meaning: "Formed when the Sun-Moon angle is between 333°20'-346°40'. Named after Indra, king of the gods, this yoga bestows power, authority, leadership, and royal qualities.",
    lifeImpact: "You possess natural leadership abilities and kingly qualities. Authority, power, and the ability to rule or lead come naturally to you.",
    positiveManifestations: [
      "Natural leadership abilities",
      "Authority and power",
      "Royal or noble qualities",
      "Ability to command respect",
      "Success in positions of authority",
      "Protective of those under your care"
    ],
    challenges: [
      "May be too authoritarian",
      "Can develop ego or pride",
      "Need to lead with wisdom, not just power"
    ],
    workingWithThisEnergy: [
      "Lead with wisdom and compassion",
      "Use authority responsibly",
      "Protect and serve those you lead",
      "Balance power with humility",
      "Be a just and fair leader",
      "Develop leadership skills continuously"
    ],
    planetaryNature: "Very auspicious for leadership, authority, and positions of power"
  },

  "Vaidhriti (Nithya Yoga)": {
    fullName: "Vaidhriti Nithya Yoga - Separation",
    category: "Lunar Yoga",
    meaning: "Formed when the Sun-Moon angle is between 346°40'-360°. Vaidhriti means 'separation' or 'holding apart'. This challenging yoga can bring separations, obstacles, and the need for extra caution.",
    lifeImpact: "You may experience separations or divisions that require healing and integration. Learning to bring together what has been separated becomes an important life lesson.",
    positiveManifestations: [
      "Ability to heal separations",
      "Understanding of duality and integration",
      "Skills in mediation and bringing unity",
      "Wisdom from experiencing separation",
      "Develops independence through separation"
    ],
    challenges: [
      "May experience painful separations",
      "Tendency towards division or separation",
      "Obstacles and setbacks",
      "Need for extra caution in actions"
    ],
    workingWithThisEnergy: [
      "Work on healing and integration",
      "Be cautious in important matters",
      "Bring together what has been separated",
      "Develop independence constructively",
      "Help others heal from separations",
      "Practice unity consciousness",
      "Don't let separations define you"
    ],
    planetaryNature: "Challenging yoga; requires work on integration and healing separations"
  }
};

/**
 * Get detailed interpretation for a yoga
 */
export function getYogaInterpretation(yogaName: string): YogaInterpretation | null {
  // Try exact match first
  if (YOGA_INTERPRETATIONS[yogaName]) {
    return YOGA_INTERPRETATIONS[yogaName];
  }

  // Try partial matches for common variations
  const normalizedName = yogaName.toLowerCase().replace(/[- ]/g, '');

  for (const [key, interpretation] of Object.entries(YOGA_INTERPRETATIONS)) {
    const normalizedKey = key.toLowerCase().replace(/[- ]/g, '');
    if (normalizedName.includes(normalizedKey) || normalizedKey.includes(normalizedName)) {
      return interpretation;
    }
  }

  return null;
}

/**
 * Get summary of yoga impact
 */
export function getYogaImpactSummary(yogaName: string): string {
  const interpretation = getYogaInterpretation(yogaName);
  if (!interpretation) {
    return "This yoga combines planetary energies that influence various aspects of your life.";
  }
  return interpretation.lifeImpact;
}

/**
 * Get category description
 */
export function getCategoryDescription(category: string): string {
  const descriptions: { [key: string]: string } = {
    "Raja Yoga": "Royal combinations that bring power, authority, and success",
    "Dhana Yoga": "Wealth combinations that support financial prosperity",
    "Mahapurusha Yoga": "Great person yogas that create exceptional individuals",
    "Intelligence Yoga": "Combinations enhancing mental abilities and communication",
    "Auspicious Yoga": "Highly favorable combinations bringing overall well-being",
    "Solar Yoga": "Combinations involving the Sun, affecting self-expression and vitality",
    "Lunar Yoga": "One of 27 Nithya Yogas based on Sun-Moon angular relationship, affecting daily life and character",
    "Parivartana Yoga": "Exchange yogas creating strong connections between life areas",
    "Viparita Raja Yoga": "Paradoxical yogas bringing success through adversity",
    "Neecha Bhanga Yoga": "Cancellation of planetary debilitation creating hidden strength",
    "Karmic Yoga": "Yogas indicating karmic patterns and spiritual lessons"
  };

  return descriptions[category] || "Special planetary combination affecting your life path";
}
