/**
 * Kundli Interpretations - User-Friendly Meanings
 *
 * This file provides human-readable interpretations of planetary positions
 * to help users understand what their birth chart means for them.
 */

// Planet in Sign Interpretations
export const getPlanetInSignMeaning = (planet: string, sign: string): string => {
  const interpretations: Record<string, Record<string, string>> = {
    Sun: {
      Aries: "Strong leadership qualities, pioneering spirit, natural confidence. You shine when taking initiative.",
      Taurus: "Steady and reliable nature, appreciation for beauty and comfort. You value stability and security.",
      Gemini: "Intellectual curiosity, versatile communication skills. You express yourself through ideas and learning.",
      Cancer: "Nurturing personality, strong emotional intelligence. Family and home are central to your identity.",
      Leo: "Natural charisma, creative self-expression (exalted). You radiate confidence and warmth.",
      Virgo: "Analytical mind, service-oriented nature. You find purpose in helping and improving things.",
      Libra: "Diplomatic and balanced approach (debilitated). You seek harmony in relationships and surroundings.",
      Scorpio: "Intense and transformative nature. You possess deep insight and emotional strength.",
      Sagittarius: "Philosophical outlook, love for truth and expansion. You're drawn to higher knowledge.",
      Capricorn: "Ambitious and disciplined approach. You achieve through perseverance and structure.",
      Aquarius: "Innovative and humanitarian spirit. You value independence and progressive thinking.",
      Pisces: "Compassionate and intuitive nature. You're sensitive to spiritual and artistic dimensions."
    },
    Moon: {
      Aries: "Quick emotional responses, independent feelings. You need freedom to express emotions.",
      Taurus: "Emotionally stable and grounded (exalted). You find comfort in material and sensory security.",
      Gemini: "Changeable moods, intellectual emotions. You process feelings through communication.",
      Cancer: "Deep emotional sensitivity, strong maternal instincts. You naturally nurture and protect.",
      Leo: "Generous heart, need for emotional recognition. You express feelings dramatically and warmly.",
      Virgo: "Practical emotions, tendency to analyze feelings. You show care through helpful actions.",
      Libra: "Need for emotional balance, partnership-oriented feelings. You thrive in harmonious relationships.",
      Scorpio: "Intense emotional depth (debilitated). You experience feelings profoundly and transformatively.",
      Sagittarius: "Optimistic emotions, need for emotional freedom. You're uplifted by philosophy and adventure.",
      Capricorn: "Controlled emotions, practical feelings. You're cautious but deeply committed once attached.",
      Aquarius: "Detached emotions, humanitarian feelings. You care for humanity more than individual intimacy.",
      Pisces: "Highly sensitive and empathetic. You're deeply connected to collective and spiritual emotions."
    },
    Mars: {
      Aries: "Powerful drive and courage. You take direct action and lead fearlessly.",
      Taurus: "Steady determination, patience in action (debilitated). You work slowly but effectively.",
      Gemini: "Quick mental energy, scattered focus. You act through intellect and communication.",
      Cancer: "Protective instincts, emotional drive (debilitated). You fight for family and emotional security.",
      Leo: "Bold and confident action. You pursue goals with creativity and pride.",
      Virgo: "Precise and methodical energy. You channel drive into detailed, practical work.",
      Libra: "Diplomatic action, strategic approach (debilitated). You pursue goals through partnership.",
      Scorpio: "Intense willpower, transformative energy. You pursue desires with depth and strategy.",
      Sagittarius: "Enthusiastic action, philosophical warrior. You fight for beliefs and higher truths.",
      Capricorn: "Disciplined ambition, strategic action (exalted). You achieve through patient, calculated effort.",
      Aquarius: "Innovative energy, rebellious drive. You act to bring social change and progress.",
      Pisces: "Compassionate action, spiritual warrior. You fight for ideals and help the vulnerable."
    },
    Mercury: {
      Aries: "Quick thinking, impulsive communication. You speak directly and decisively.",
      Taurus: "Practical intelligence, deliberate speech. You think slowly but thoroughly.",
      Gemini: "Sharp intellect, versatile communication. You excel at gathering and sharing information.",
      Cancer: "Intuitive thinking, emotional communication. You understand through feelings and memory.",
      Leo: "Creative intelligence, dramatic expression. You communicate with confidence and flair.",
      Virgo: "Analytical mind, precise communication (exalted). You excel at details and practical solutions.",
      Libra: "Balanced thinking, diplomatic communication. You see multiple perspectives easily.",
      Scorpio: "Penetrating mind, secretive communication. You think deeply and speak strategically.",
      Sagittarius: "Philosophical thinking, expansive communication (debilitated). You discuss big ideas and truths.",
      Capricorn: "Structured thinking, serious communication. You value practical, goal-oriented information.",
      Aquarius: "Original thinking, scientific communication. You innovate and share progressive ideas.",
      Pisces: "Intuitive intelligence, poetic communication (debilitated). You understand through symbolism and feeling."
    },
    Jupiter: {
      Aries: "Pioneering wisdom, enthusiastic faith. You expand through action and leadership.",
      Taurus: "Grounded wisdom, appreciation for material blessings. You grow through practical abundance.",
      Gemini: "Intellectual expansion, curious learner (debilitated). You seek wisdom through variety and information.",
      Cancer: "Nurturing wisdom, family-oriented faith (exalted). You grow through caring and protecting others.",
      Leo: "Generous wisdom, royal beneficence. You expand through creative self-expression and leadership.",
      Virgo: "Practical wisdom, service-oriented faith (debilitated). You grow through helping and improving.",
      Libra: "Balanced wisdom, harmonious expansion. You find meaning in relationships and fairness.",
      Scorpio: "Deep wisdom, transformative faith. You expand through profound experiences and insight.",
      Sagittarius: "Natural wisdom, philosophical expansion. You're meant to teach, travel, and explore truth.",
      Capricorn: "Structured wisdom, disciplined faith (debilitated). You grow through responsibility and achievement.",
      Aquarius: "Progressive wisdom, humanitarian expansion. You find meaning in social betterment and innovation.",
      Pisces: "Spiritual wisdom, compassionate faith. You expand through universal love and mystical understanding."
    },
    Venus: {
      Aries: "Passionate love, impulsive attractions (debilitated). You desire excitement in relationships.",
      Taurus: "Sensual appreciation, stable love. You value beauty, comfort, and lasting partnerships.",
      Gemini: "Intellectual attraction, versatile love. You connect through communication and mental stimulation.",
      Cancer: "Nurturing love, emotional devotion. You show affection through care and domestic comfort.",
      Leo: "Dramatic romance, creative love. You express affection generously and expect appreciation.",
      Virgo: "Practical love, service-oriented affection (debilitated). You show love through helpful actions.",
      Libra: "Harmonious relationships, balanced love. You're natural at partnership and diplomacy.",
      Scorpio: "Intense passion, transformative love (debilitated). You experience deep, powerful attractions.",
      Sagittarius: "Freedom-loving, philosophical romance. You're attracted to adventure and higher ideals.",
      Capricorn: "Serious love, committed partnerships. You value loyalty, status, and long-term relationships.",
      Aquarius: "Unconventional love, friendship-based romance. You need independence and intellectual connection.",
      Pisces: "Spiritual love, compassionate devotion (exalted). You love unconditionally and idealize partners."
    },
    Saturn: {
      Aries: "Disciplined action, restricted initiative (debilitated). You learn patience through challenges.",
      Taurus: "Practical discipline, material responsibility. You build security through steady effort.",
      Gemini: "Serious communication, disciplined learning. You're methodical in gathering knowledge.",
      Cancer: "Emotional responsibility, family duties (debilitated). You learn maturity through emotional challenges.",
      Leo: "Disciplined creativity, responsible leadership (debilitated). You gain authority through hard work.",
      Virgo: "Practical discipline, service through structure. You excel at organized, detailed work.",
      Libra: "Balanced responsibility, just authority (exalted). You gain respect through fair, measured approach.",
      Scorpio: "Deep discipline, transformative challenges. You develop power through intense experiences.",
      Sagittarius: "Philosophical discipline, responsible wisdom. You gain knowledge through patient study.",
      Capricorn: "Natural discipline, ambitious responsibility. You're meant to achieve and build lasting structures.",
      Aquarius: "Innovative discipline, structured progress. You bring change through patient, systematic work.",
      Pisces: "Spiritual discipline, compassionate responsibility. You serve through sacrificial dedication."
    },
    Rahu: {
      Aries: "Ambitious drive, restless energy. You pursue goals with unconventional courage.",
      Taurus: "Material obsessions, unconventional values (exalted). You're drawn to unique pleasures and wealth.",
      Gemini: "Mental restlessness, unconventional communication (exalted). You think outside traditional boundaries.",
      Cancer: "Emotional confusion, foreign emotional patterns. You seek security in unusual ways.",
      Leo: "Fame-seeking, dramatic ambitions (debilitated). You desire recognition through unique self-expression.",
      Virgo: "Unconventional service, foreign health concerns. You approach work and health differently.",
      Libra: "Unusual partnerships, foreign relationships. You're attracted to exotic or unconventional partners.",
      Scorpio: "Intense obsessions, deep mysteries (debilitated). You're drawn to hidden, taboo, or occult matters.",
      Sagittarius: "Foreign philosophy, unconventional beliefs. You seek wisdom in non-traditional ways.",
      Capricorn: "Ambitious authority, foreign status. You gain position through unusual or modern means.",
      Aquarius: "Innovative obsessions, technological focus. You're naturally drawn to future and progress.",
      Pisces: "Spiritual confusion, foreign mysticism. You explore unconventional spiritual paths."
    },
    Ketu: {
      Aries: "Spiritual warrior, detached action. You've mastered courage in past lives.",
      Taurus: "Detachment from material (debilitated). You're learning to release attachment to comfort.",
      Gemini: "Intuitive knowledge, spiritual communication. You understand beyond logic.",
      Cancer: "Past-life family karma, emotional intuition. You have natural nurturing wisdom.",
      Leo: "Detached from ego, spiritual creativity. You're learning humility and selfless expression.",
      Virgo: "Service without attachment, spiritual healing. You naturally help without expectation.",
      Libra: "Past relationship patterns, spiritual balance (debilitated). You're releasing partnership karma.",
      Scorpio: "Mystical insight, spiritual transformation (exalted). You naturally understand hidden truths.",
      Sagittarius: "Natural wisdom, spiritual seeking (exalted). You have innate philosophical understanding.",
      Capricorn: "Detachment from status, spiritual responsibility. You're learning to serve without ambition.",
      Aquarius: "Spiritual innovation, detached from society. You have unconventional spiritual gifts.",
      Pisces: "Ultimate spiritual connection, mystical wisdom. You're naturally attuned to the divine."
    }
  };

  return interpretations[planet]?.[sign] || `${planet} in ${sign} - brings unique energy to your chart.`;
};

// Planet in House Interpretations
export const getPlanetInHouseMeaning = (planet: string, house: number): string => {
  const interpretations: Record<string, Record<number, string>> = {
    Sun: {
      1: "Strong self-identity and confidence. You naturally lead and shine in life.",
      2: "Focus on building wealth and family values. Your ego is tied to resources and speech.",
      3: "Courage and initiative in communication. You excel through siblings, skills, and effort.",
      4: "Connection to mother and homeland. Your happiness comes from home and emotional security.",
      5: "Creative intelligence and spiritual wisdom. You shine through children, creativity, and learning.",
      6: "Service-oriented identity, health focus. You overcome obstacles through discipline and effort.",
      7: "Identity through partnership. Your spouse and business partnerships are central to life.",
      8: "Interest in mysteries and transformation. You face challenges but gain deep wisdom.",
      9: "Natural dharma and higher learning. You're fortunate through father, gurus, and spirituality.",
      10: "Career and public recognition are central. You're meant for authority and professional success.",
      11: "Gains through networks and aspirations. Your social circles and elder siblings support you.",
      12: "Spiritual seeking and foreign connections. You find yourself through solitude and service."
    },
    Moon: {
      1: "Emotional and nurturing personality. Your moods and feelings are visible to others.",
      2: "Emotional connection to family and wealth. You feel secure through resources and food.",
      3: "Changeable communication and relationships with siblings. Emotions drive your courage.",
      4: "Very comfortable and happy at heart (natural position). Strong connection to mother.",
      5: "Emotional creativity and devotion to children. Your happiness comes from learning and romance.",
      6: "Emotional service, fluctuating health. You may worry but have healing capacity.",
      7: "Emotional partnerships, need for companionship. Your mood depends on relationships.",
      8: "Deep emotional transformation. You experience intense feelings and interest in mysteries.",
      9: "Emotional connection to faith and higher learning. You feel uplifted by philosophy and travel.",
      10: "Public emotional expression, caring profession. Your career involves nurturing or public service.",
      11: "Emotional fulfillment through friendships and gains. Your wishes are tied to social connections.",
      12: "Emotional solitude, spiritual sensitivity. You need alone time for emotional processing."
    },
    Mars: {
      1: "Energetic and assertive personality. You take initiative and may be impulsive or courageous.",
      2: "Aggressive speech, earning through effort. You fight to build and protect family wealth.",
      3: "Courageous communication, strong willpower. You're bold with siblings and in taking action.",
      4: "Property-related conflicts or gains. Your home life has energy, possibly from mother or vehicles.",
      5: "Competitive in sports, assertive with children. Your intelligence is sharp and argumentative.",
      6: "Excellent for overcoming enemies and obstacles. You thrive in competitive or service roles.",
      7: "Passionate partnerships, potential conflicts. Your spouse is energetic, possibly aggressive.",
      8: "Interest in research, surgery, or occult. You face sudden changes but have survival strength.",
      9: "Fighting for dharma and beliefs. You're passionate about religion, father, or higher learning.",
      10: "Ambitious career drive, leadership in profession. You're meant for executive or competitive roles.",
      11: "Gains through effort and courage. Your elder siblings and friends may be competitive.",
      12: "Energy in foreign lands or spiritual practices. You may face hidden conflicts or expenses."
    },
    Jupiter: {
      1: "Wise and optimistic personality. You're naturally lucky, generous, and knowledgeable.",
      2: "Wealth through wisdom and speaking. Your family is blessed, and you value higher knowledge.",
      3: "Wise communication, helpful siblings. Your courage comes from faith and optimistic effort.",
      4: "Happy home life, educated mother. You're blessed with property, vehicles, and emotional joy.",
      5: "Excellent for children, creativity, and learning. You're naturally intelligent and dharmic.",
      6: "Service through teaching or healing. You overcome obstacles through wisdom and faith.",
      7: "Wise and dharmic spouse. Your partnerships bring growth, luck, and spiritual connection.",
      8: "Interest in mysticism and research. You gain through inheritance, occult, or transformation.",
      9: "Most auspicious position - fortune through father, gurus, and dharma. Natural wisdom and luck.",
      10: "Successful career through wisdom. You're respected as a teacher, advisor, or ethical leader.",
      11: "Abundant gains and fulfilled wishes. Your friends are wise, and aspirations are blessed.",
      12: "Spiritual wisdom, foreign blessings. You gain through charity, meditation, or overseas."
    },
    Venus: {
      1: "Charming and artistic personality. You're naturally attractive, diplomatic, and pleasure-loving.",
      2: "Wealth through arts, beauty, or partnership. You speak sweetly and value family harmony.",
      3: "Artistic communication, harmonious siblings. You're creative in skills and enjoy learning.",
      4: "Beautiful home, comfortable life. You have a loving relationship with mother and luxury items.",
      5: "Romantic and creative. You're blessed with love affairs, children (especially daughters), and arts.",
      6: "Service in beauty, health, or relationships. You may face relationship or health challenges.",
      7: "Loving and harmonious spouse. Marriage brings happiness, partnerships are pleasant and beneficial.",
      8: "Gains through inheritance or spouse's wealth. Interest in mystical or sensual experiences.",
      9: "Fortunate partnerships with gurus or through father. You're blessed in dharma and higher learning.",
      10: "Career in arts, beauty, or diplomacy. You're known for charm and achieve through relationships.",
      11: "Abundant gains, especially from partnerships. Your wishes for love and wealth are fulfilled.",
      12: "Pleasures in foreign lands or spiritual pursuits. You may spend on luxuries or secret relationships."
    },
    Saturn: {
      1: "Serious and responsible personality. You face early life challenges but gain wisdom and discipline.",
      2: "Struggles with speech and wealth early on. You build resources slowly through hard work.",
      3: "Disciplined communication, karmic siblings. Your efforts are slow but steady and lasting.",
      4: "Challenges with mother or home, but property through effort. You learn emotional maturity late.",
      5: "Delays with children or education. Your intelligence matures slowly, possibly strict with kids.",
      6: "Excellent for service and overcoming enemies. You work hard but defeat obstacles systematically.",
      7: "Serious or older spouse, delayed marriage. Partnerships require work but can be stable.",
      8: "Interest in longevity, research, or chronic issues. You face slow transformations and inheritance delays.",
      9: "Testing of faith and father. You gain wisdom through hardship but become a practical philosopher.",
      10: "Natural position for authority and career. You're meant for responsibility and long-term success.",
      11: "Delayed but substantial gains. Your elder siblings may challenge you, wishes fulfilled slowly.",
      12: "Natural for spiritual discipline and foreign residence. You find peace through solitude and service."
    },
    Rahu: {
      1: "Unusual personality, ambitious for recognition. You think outside norms and seek unique identity.",
      2: "Obsession with wealth and status. You may earn through foreign sources or unconventional means.",
      3: "Unusual communication, ambiguous with siblings. Your skills may be in technology or foreign subjects.",
      4: "Foreign connections to home or mother. You may live abroad or have an unusual domestic life.",
      5: "Unconventional intelligence or romance. Children may be unusual, or creative in modern fields.",
      6: "Overcoming enemies through unconventional means. You may work in foreign service or technology.",
      7: "Foreign or unusual spouse. Partnerships may be cross-cultural or unconventional in nature.",
      8: "Deep interest in mysteries, occult, or sudden gains. You face transformations through unusual means.",
      9: "Foreign philosophy or unconventional beliefs. You may connect with gurus from different cultures.",
      10: "Career in technology, foreign lands, or unusual fields. You gain recognition in modern domains.",
      11: "Gains through networks, technology, or foreign friends. Your wishes involve material obsessions.",
      12: "Foreign residence or spiritual confusion. You spend on unusual or overseas matters."
    },
    Ketu: {
      1: "Spiritual or detached personality. You're intuitive and may feel disconnected from ego or body.",
      2: "Disinterest in accumulation, spiritual speech. Family wealth may be unstable or you're detached.",
      3: "Intuitive communication, spiritual siblings. You have skills from past lives, less interest in effort.",
      4: "Emotional detachment or spiritual mother. You may feel unsettled at home or seek spiritual peace.",
      5: "Spiritual intelligence, past-life wisdom. Children may be spiritual, or you're detached from romance.",
      6: "Natural healing ability, spiritual service. You overcome obstacles through intuition and past karma.",
      7: "Spiritual or detached spouse. Partnerships may involve spiritual seeking or past-life connections.",
      8: "Deep mystical insight and moksha-seeking. You naturally understand hidden realms and transformation.",
      9: "Past-life dharmic wisdom. You have innate spiritual knowledge and may be detached from father.",
      10: "Spiritual profession or detachment from status. You achieve through intuition, not worldly ambition.",
      11: "Detachment from gains and social circles. Your wishes are spiritual, or gains come unexpectedly.",
      12: "Most natural position for moksha and liberation. You're meant for meditation, solitude, and enlightenment."
    }
  };

  return interpretations[planet]?.[house] || `${planet} in ${house}th house - brings specific influence to this life area.`;
};

// Get simplified planet strength description
export const getPlanetStrengthDescription = (planet: string, sign: string): { strength: string; color: string; description: string } => {
  const strengths: Record<string, Record<string, { strength: string; color: string; description: string }>> = {
    Sun: {
      Aries: { strength: "Exalted", color: "text-green-600", description: "Very strong - brings best results" },
      Leo: { strength: "Own Sign", color: "text-blue-600", description: "Strong - comfortable and effective" },
      Libra: { strength: "Debilitated", color: "text-red-600", description: "Weak - needs support" }
    },
    Moon: {
      Taurus: { strength: "Exalted", color: "text-green-600", description: "Very strong - emotionally stable" },
      Cancer: { strength: "Own Sign", color: "text-blue-600", description: "Strong - natural emotional comfort" },
      Scorpio: { strength: "Debilitated", color: "text-red-600", description: "Challenging - emotional intensity" }
    },
    Mars: {
      Capricorn: { strength: "Exalted", color: "text-green-600", description: "Very strong - disciplined action" },
      "Aries": { strength: "Own Sign", color: "text-blue-600", description: "Strong - natural courage" },
      "Scorpio": { strength: "Own Sign", color: "text-blue-600", description: "Strong - strategic power" },
      Cancer: { strength: "Debilitated", color: "text-red-600", description: "Weak - emotional action" }
    },
    Mercury: {
      Virgo: { strength: "Exalted & Own", color: "text-green-600", description: "Very strong - perfect analysis" },
      Gemini: { strength: "Own Sign", color: "text-blue-600", description: "Strong - versatile communication" },
      Pisces: { strength: "Debilitated", color: "text-red-600", description: "Weak - confused thinking" }
    },
    Jupiter: {
      Cancer: { strength: "Exalted", color: "text-green-600", description: "Very strong - nurturing wisdom" },
      Sagittarius: { strength: "Own Sign", color: "text-blue-600", description: "Strong - natural philosophy" },
      Pisces: { strength: "Own Sign", color: "text-blue-600", description: "Strong - spiritual wisdom" },
      Capricorn: { strength: "Debilitated", color: "text-red-600", description: "Weak - restricted expansion" }
    },
    Venus: {
      Pisces: { strength: "Exalted", color: "text-green-600", description: "Very strong - unconditional love" },
      Taurus: { strength: "Own Sign", color: "text-blue-600", description: "Strong - sensual pleasure" },
      Libra: { strength: "Own Sign", color: "text-blue-600", description: "Strong - harmonious relationships" },
      Virgo: { strength: "Debilitated", color: "text-red-600", description: "Weak - critical in love" }
    },
    Saturn: {
      Libra: { strength: "Exalted", color: "text-green-600", description: "Very strong - just authority" },
      Capricorn: { strength: "Own Sign", color: "text-blue-600", description: "Strong - natural discipline" },
      Aquarius: { strength: "Own Sign", color: "text-blue-600", description: "Strong - innovative structure" },
      Aries: { strength: "Debilitated", color: "text-red-600", description: "Weak - frustrated action" }
    },
    Rahu: {
      Taurus: { strength: "Exalted", color: "text-green-600", description: "Strong - material success" },
      Gemini: { strength: "Exalted", color: "text-green-600", description: "Strong - innovative thinking" },
      Scorpio: { strength: "Debilitated", color: "text-red-600", description: "Intense - obsessive tendencies" }
    },
    Ketu: {
      Scorpio: { strength: "Exalted", color: "text-green-600", description: "Strong - mystical insight" },
      Sagittarius: { strength: "Exalted", color: "text-green-600", description: "Strong - spiritual wisdom" },
      Taurus: { strength: "Debilitated", color: "text-red-600", description: "Detached - material challenges" }
    }
  };

  return strengths[planet]?.[sign] || { strength: "Neutral", color: "text-gray-600", description: "Moderate strength" };
};
