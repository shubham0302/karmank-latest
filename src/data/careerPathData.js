// Educational & Career Path - Psychometric Test Data
// 3-Pillar Profiler: Personality (Big Five), Interests (RIASEC), Aptitude

// ============================================================
// BIG FIVE (OCEAN) QUESTIONS - 30 items
// 6 questions per trait (3 keyed positive, 3 keyed negative)
// ============================================================
export const BIG_FIVE_QUESTIONS = [
  { id: 1, text: "I make friends easily.", trait: "Extraversion", keyed: "+" },
  { id: 2, text: "I often feel sad or low.", trait: "Neuroticism", keyed: "+" },
  { id: 3, text: "I enjoy trying new and unfamiliar activities.", trait: "Openness", keyed: "+" },
  { id: 4, text: "I always complete my homework and assignments on time.", trait: "Conscientiousness", keyed: "+" },
  { id: 5, text: "I help my friends when they need support.", trait: "Agreeableness", keyed: "+" },
  { id: 6, text: "I prefer to stay alone rather than talk to people.", trait: "Extraversion", keyed: "-" },
  { id: 7, text: "I worry a lot about things going wrong.", trait: "Neuroticism", keyed: "+" },
  { id: 8, text: "I like reading books on different topics.", trait: "Openness", keyed: "+" },
  { id: 9, text: "I keep my room and study area clean and organized.", trait: "Conscientiousness", keyed: "+" },
  { id: 10, text: "I get into arguments easily with others.", trait: "Agreeableness", keyed: "-" },
  { id: 11, text: "I feel confident speaking in front of a group.", trait: "Extraversion", keyed: "+" },
  { id: 12, text: "I remain calm even when something goes wrong.", trait: "Neuroticism", keyed: "-" },
  { id: 13, text: "I prefer doing things the same way rather than experimenting.", trait: "Openness", keyed: "-" },
  { id: 14, text: "I often forget to bring my books or materials to class.", trait: "Conscientiousness", keyed: "-" },
  { id: 15, text: "I forgive my friends quickly after a disagreement.", trait: "Agreeableness", keyed: "+" },
  { id: 16, text: "I enjoy being the center of attention.", trait: "Extraversion", keyed: "+" },
  { id: 17, text: "I feel stressed before exams or competitions.", trait: "Neuroticism", keyed: "+" },
  { id: 18, text: "I enjoy creative activities like drawing, writing, or music.", trait: "Openness", keyed: "+" },
  { id: 19, text: "I plan my study schedule carefully.", trait: "Conscientiousness", keyed: "+" },
  { id: 20, text: "I consider others' feelings before saying something.", trait: "Agreeableness", keyed: "+" },
  { id: 21, text: "I feel drained after spending time with a lot of people.", trait: "Extraversion", keyed: "-" },
  { id: 22, text: "I feel confident about my abilities.", trait: "Neuroticism", keyed: "-" },
  { id: 23, text: "I prefer realistic and practical subjects over imaginative ones.", trait: "Openness", keyed: "-" },
  { id: 24, text: "I rush through my work to finish quickly.", trait: "Conscientiousness", keyed: "-" },
  { id: 25, text: "I find it difficult to understand why others feel upset.", trait: "Agreeableness", keyed: "-" },
  { id: 26, text: "I enjoy meeting new people.", trait: "Extraversion", keyed: "+" },
  { id: 27, text: "I get anxious easily in uncertain situations.", trait: "Neuroticism", keyed: "+" },
  { id: 28, text: "I like discussing new ideas and theories.", trait: "Openness", keyed: "+" },
  { id: 29, text: "I check my work carefully for mistakes.", trait: "Conscientiousness", keyed: "+" },
  { id: 30, text: "I am willing to compromise in disagreements.", trait: "Agreeableness", keyed: "+" }
];

// ============================================================
// RIASEC (HOLLAND CODES) QUESTIONS - Path A (60 items)
// 10 questions per type (R, I, A, S, E, C)
// ============================================================
export const RIASEC_QUESTIONS = [
  // Realistic (R) - 10 questions
  { id: 1, text: "Assemble or repair bicycles, fans or toys with tools.", type: "R" },
  { id: 2, text: "Grow plants in pots or help in kitchen gardening.", type: "R" },
  { id: 3, text: "Fix small electrical appliances or gadgets at home.", type: "R" },
  { id: 4, text: "Build models with clay, cardboard or LEGO blocks.", type: "R" },
  { id: 5, text: "Work on crafts like origami, knitting, or woodwork.", type: "R" },
  { id: 6, text: "Help with cooking by measuring ingredients accurately.", type: "R" },
  { id: 7, text: "Learn to operate machines or devices like cameras, drones.", type: "R" },
  { id: 8, text: "Participate in outdoor activities like camping or trekking.", type: "R" },
  { id: 9, text: "Play sports that require physical strength and skill.", type: "R" },
  { id: 10, text: "Organize or fix things around the house (furniture, storage).", type: "R" },

  // Investigative (I) - 10 questions
  { id: 11, text: "Conduct simple science experiments at home or school.", type: "I" },
  { id: 12, text: "Read about space, planets, or the universe.", type: "I" },
  { id: 13, text: "Solve puzzles, brain teasers, or riddles.", type: "I" },
  { id: 14, text: "Research topics like animals, plants, or technology.", type: "I" },
  { id: 15, text: "Watch documentaries about nature, science, or history.", type: "I" },
  { id: 16, text: "Ask questions about how things work or why things happen.", type: "I" },
  { id: 17, text: "Study maps, charts, or graphs to understand data.", type: "I" },
  { id: 18, text: "Learn about diseases, health, or the human body.", type: "I" },
  { id: 19, text: "Explore coding, programming, or robotics.", type: "I" },
  { id: 20, text: "Analyze problems logically to find solutions.", type: "I" },

  // Artistic (A) - 10 questions
  { id: 21, text: "Draw, sketch, or paint pictures.", type: "A" },
  { id: 22, text: "Write stories, poems, or essays.", type: "A" },
  { id: 23, text: "Sing, play a musical instrument, or compose music.", type: "A" },
  { id: 24, text: "Act in plays, skits, or drama performances.", type: "A" },
  { id: 25, text: "Design posters, cards, or digital graphics.", type: "A" },
  { id: 26, text: "Dance or choreograph performances.", type: "A" },
  { id: 27, text: "Create videos, animations, or short films.", type: "A" },
  { id: 28, text: "Decorate rooms or organize events creatively.", type: "A" },
  { id: 29, text: "Photograph people, places, or objects artistically.", type: "A" },
  { id: 30, text: "Express emotions through art, writing, or performance.", type: "A" },

  // Social (S) - 10 questions
  { id: 31, text: "Help classmates understand difficult lessons or topics.", type: "S" },
  { id: 32, text: "Volunteer for social causes or community service.", type: "S" },
  { id: 33, text: "Organize group activities or team projects.", type: "S" },
  { id: 34, text: "Listen to friends' problems and give advice.", type: "S" },
  { id: 35, text: "Take care of younger siblings or cousins.", type: "S" },
  { id: 36, text: "Participate in clubs focused on helping others.", type: "S" },
  { id: 37, text: "Work in teams where everyone contributes equally.", type: "S" },
  { id: 38, text: "Teach a skill or hobby to someone else.", type: "S" },
  { id: 39, text: "Comfort someone who is upset or sad.", type: "S" },
  { id: 40, text: "Encourage and motivate friends or teammates.", type: "S" },

  // Enterprising (E) - 10 questions
  { id: 41, text: "Lead group projects or team activities.", type: "E" },
  { id: 42, text: "Organize events like birthday parties or school functions.", type: "E" },
  { id: 43, text: "Debate or discuss ideas confidently with others.", type: "E" },
  { id: 44, text: "Sell items or organize small fundraising activities.", type: "E" },
  { id: 45, text: "Take charge when a group needs direction.", type: "E" },
  { id: 46, text: "Convince others to agree with your point of view.", type: "E" },
  { id: 47, text: "Set goals and work hard to achieve them.", type: "E" },
  { id: 48, text: "Start new initiatives or clubs at school.", type: "E" },
  { id: 49, text: "Make decisions quickly when needed.", type: "E" },
  { id: 50, text: "Compete in contests or competitions to win.", type: "E" },

  // Conventional (C) - 10 questions
  { id: 51, text: "Organize your notes, files, or study materials neatly.", type: "C" },
  { id: 52, text: "Follow instructions carefully step-by-step.", type: "C" },
  { id: 53, text: "Keep track of schedules, deadlines, or appointments.", type: "C" },
  { id: 54, text: "Maintain records or lists (e.g., books read, expenses).", type: "C" },
  { id: 55, text: "Arrange things in a specific order or system.", type: "C" },
  { id: 56, text: "Check work carefully for accuracy and correctness.", type: "C" },
  { id: 57, text: "Work with numbers, data, or calculations.", type: "C" },
  { id: 58, text: "Prefer tasks that have clear rules and procedures.", type: "C" },
  { id: 59, text: "Help with administrative tasks like filing or sorting.", type: "C" },
  { id: 60, text: "Enjoy working on detailed, organized projects.", type: "C" }
];

// ============================================================
// ADVANCED RIASEC - Path B (120 items)
// Forced-choice pairings for 11th-12th grade students
// 15 pairings × 8 questions each
// ============================================================
export const ADVANCED_RIASEC_QUESTIONS = [
  // R-I Pairing (8 questions)
  { id: "ri1", pairing: "R-I", optionA: { text: "Work with machinery or tools", type: "R" }, optionB: { text: "Conduct scientific research or experiments", type: "I" } },
  { id: "ri2", pairing: "R-I", optionA: { text: "Repair electrical equipment", type: "R" }, optionB: { text: "Analyze data to find patterns", type: "I" } },
  { id: "ri3", pairing: "R-I", optionA: { text: "Build or construct physical objects", type: "R" }, optionB: { text: "Study complex theories or concepts", type: "I" } },
  { id: "ri4", pairing: "R-I", optionA: { text: "Operate technical equipment", type: "R" }, optionB: { text: "Investigate problems systematically", type: "I" } },
  { id: "ri5", pairing: "R-I", optionA: { text: "Do hands-on mechanical work", type: "R" }, optionB: { text: "Research and explore new ideas", type: "I" } },
  { id: "ri6", pairing: "R-I", optionA: { text: "Work outdoors with physical tasks", type: "R" }, optionB: { text: "Work in a laboratory setting", type: "I" } },
  { id: "ri7", pairing: "R-I", optionA: { text: "Assemble or install equipment", type: "R" }, optionB: { text: "Develop mathematical models", type: "I" } },
  { id: "ri8", pairing: "R-I", optionA: { text: "Maintain and service machines", type: "R" }, optionB: { text: "Solve abstract problems", type: "I" } },

  // R-A Pairing (8 questions)
  { id: "ra1", pairing: "R-A", optionA: { text: "Fix or build tangible objects", type: "R" }, optionB: { text: "Create artistic designs or works", type: "A" } },
  { id: "ra2", pairing: "R-A", optionA: { text: "Work with tools and equipment", type: "R" }, optionB: { text: "Express ideas through art or music", type: "A" } },
  { id: "ra3", pairing: "R-A", optionA: { text: "Do practical, structured work", type: "R" }, optionB: { text: "Work on creative, open-ended projects", type: "A" } },
  { id: "ra4", pairing: "R-A", optionA: { text: "Follow technical blueprints", type: "R" }, optionB: { text: "Design something original", type: "A" } },
  { id: "ra5", pairing: "R-A", optionA: { text: "Operate machinery", type: "R" }, optionB: { text: "Perform or compose music", type: "A" } },
  { id: "ra6", pairing: "R-A", optionA: { text: "Work in manufacturing or construction", type: "R" }, optionB: { text: "Work in arts or entertainment", type: "A" } },
  { id: "ra7", pairing: "R-A", optionA: { text: "Repair mechanical devices", type: "R" }, optionB: { text: "Write stories or poetry", type: "A" } },
  { id: "ra8", pairing: "R-A", optionA: { text: "Do hands-on technical work", type: "R" }, optionB: { text: "Engage in creative expression", type: "A" } },

  // R-S Pairing (8 questions)
  { id: "rs1", pairing: "R-S", optionA: { text: "Work independently with tools", type: "R" }, optionB: { text: "Help or teach others directly", type: "S" } },
  { id: "rs2", pairing: "R-S", optionA: { text: "Do physical or technical tasks", type: "R" }, optionB: { text: "Provide care or support to people", type: "S" } },
  { id: "rs3", pairing: "R-S", optionA: { text: "Build or repair things", type: "R" }, optionB: { text: "Counsel or guide individuals", type: "S" } },
  { id: "rs4", pairing: "R-S", optionA: { text: "Focus on objects and machinery", type: "R" }, optionB: { text: "Focus on people's needs", type: "S" } },
  { id: "rs5", pairing: "R-S", optionA: { text: "Work in agriculture or construction", type: "R" }, optionB: { text: "Work in education or healthcare", type: "S" } },
  { id: "rs6", pairing: "R-S", optionA: { text: "Operate equipment alone", type: "R" }, optionB: { text: "Collaborate with people in teams", type: "S" } },
  { id: "rs7", pairing: "R-S", optionA: { text: "Fix or maintain machinery", type: "R" }, optionB: { text: "Support others emotionally", type: "S" } },
  { id: "rs8", pairing: "R-S", optionA: { text: "Do hands-on practical work", type: "R" }, optionB: { text: "Work in social services", type: "S" } },

  // R-E Pairing (8 questions)
  { id: "re1", pairing: "R-E", optionA: { text: "Work with machinery or technical tasks", type: "R" }, optionB: { text: "Lead projects or teams", type: "E" } },
  { id: "re2", pairing: "R-E", optionA: { text: "Do hands-on physical work", type: "R" }, optionB: { text: "Persuade or influence others", type: "E" } },
  { id: "re3", pairing: "R-E", optionA: { text: "Build or repair equipment", type: "R" }, optionB: { text: "Manage business operations", type: "E" } },
  { id: "re4", pairing: "R-E", optionA: { text: "Follow technical procedures", type: "R" }, optionB: { text: "Make strategic decisions", type: "E" } },
  { id: "re5", pairing: "R-E", optionA: { text: "Work independently on tasks", type: "R" }, optionB: { text: "Coordinate group activities", type: "E" } },
  { id: "re6", pairing: "R-E", optionA: { text: "Operate tools and equipment", type: "R" }, optionB: { text: "Sell products or services", type: "E" } },
  { id: "re7", pairing: "R-E", optionA: { text: "Focus on practical, tangible outcomes", type: "R" }, optionB: { text: "Focus on growth and profit", type: "E" } },
  { id: "re8", pairing: "R-E", optionA: { text: "Do technical maintenance work", type: "R" }, optionB: { text: "Negotiate or compete", type: "E" } },

  // R-C Pairing (8 questions)
  { id: "rc1", pairing: "R-C", optionA: { text: "Work with hands-on tools", type: "R" }, optionB: { text: "Organize files and records", type: "C" } },
  { id: "rc2", pairing: "R-C", optionA: { text: "Do outdoor or physical work", type: "R" }, optionB: { text: "Work at a desk with data", type: "C" } },
  { id: "rc3", pairing: "R-C", optionA: { text: "Repair or construct objects", type: "R" }, optionB: { text: "Maintain detailed records", type: "C" } },
  { id: "rc4", pairing: "R-C", optionA: { text: "Operate machinery", type: "R" }, optionB: { text: "Process information systematically", type: "C" } },
  { id: "rc5", pairing: "R-C", optionA: { text: "Work in manufacturing", type: "R" }, optionB: { text: "Work in accounting or administration", type: "C" } },
  { id: "rc6", pairing: "R-C", optionA: { text: "Focus on tangible products", type: "R" }, optionB: { text: "Focus on accuracy and detail", type: "C" } },
  { id: "rc7", pairing: "R-C", optionA: { text: "Build or assemble items", type: "R" }, optionB: { text: "Input or verify data", type: "C" } },
  { id: "rc8", pairing: "R-C", optionA: { text: "Do hands-on technical tasks", type: "R" }, optionB: { text: "Follow standard procedures", type: "C" } },

  // I-A Pairing (8 questions)
  { id: "ia1", pairing: "I-A", optionA: { text: "Conduct research or experiments", type: "I" }, optionB: { text: "Create artistic works", type: "A" } },
  { id: "ia2", pairing: "I-A", optionA: { text: "Analyze data logically", type: "I" }, optionB: { text: "Express ideas creatively", type: "A" } },
  { id: "ia3", pairing: "I-A", optionA: { text: "Solve complex problems", type: "I" }, optionB: { text: "Design original concepts", type: "A" } },
  { id: "ia4", pairing: "I-A", optionA: { text: "Work in a lab or research setting", type: "I" }, optionB: { text: "Work in a studio or creative space", type: "A" } },
  { id: "ia5", pairing: "I-A", optionA: { text: "Study scientific theories", type: "I" }, optionB: { text: "Produce music or art", type: "A" } },
  { id: "ia6", pairing: "I-A", optionA: { text: "Use logic and reason", type: "I" }, optionB: { text: "Use imagination and intuition", type: "A" } },
  { id: "ia7", pairing: "I-A", optionA: { text: "Investigate facts systematically", type: "I" }, optionB: { text: "Explore ideas freely", type: "A" } },
  { id: "ia8", pairing: "I-A", optionA: { text: "Focus on objective truth", type: "I" }, optionB: { text: "Focus on aesthetic beauty", type: "A" } },

  // I-S Pairing (8 questions)
  { id: "is1", pairing: "I-S", optionA: { text: "Research and analyze information", type: "I" }, optionB: { text: "Help and support people", type: "S" } },
  { id: "is2", pairing: "I-S", optionA: { text: "Work independently on complex problems", type: "I" }, optionB: { text: "Work with people directly", type: "S" } },
  { id: "is3", pairing: "I-S", optionA: { text: "Study scientific concepts", type: "I" }, optionB: { text: "Teach or counsel others", type: "S" } },
  { id: "is4", pairing: "I-S", optionA: { text: "Focus on ideas and theories", type: "I" }, optionB: { text: "Focus on people's well-being", type: "S" } },
  { id: "is5", pairing: "I-S", optionA: { text: "Conduct experiments", type: "I" }, optionB: { text: "Provide care or assistance", type: "S" } },
  { id: "is6", pairing: "I-S", optionA: { text: "Work in research or academia", type: "I" }, optionB: { text: "Work in healthcare or education", type: "S" } },
  { id: "is7", pairing: "I-S", optionA: { text: "Solve abstract problems", type: "I" }, optionB: { text: "Solve interpersonal issues", type: "S" } },
  { id: "is8", pairing: "I-S", optionA: { text: "Develop new knowledge", type: "I" }, optionB: { text: "Support others' growth", type: "S" } },

  // I-E Pairing (8 questions)
  { id: "ie1", pairing: "I-E", optionA: { text: "Research and investigate topics", type: "I" }, optionB: { text: "Lead and manage projects", type: "E" } },
  { id: "ie2", pairing: "I-E", optionA: { text: "Work on theoretical problems", type: "I" }, optionB: { text: "Persuade and influence people", type: "E" } },
  { id: "ie3", pairing: "I-E", optionA: { text: "Analyze data systematically", type: "I" }, optionB: { text: "Make business decisions", type: "E" } },
  { id: "ie4", pairing: "I-E", optionA: { text: "Focus on knowledge discovery", type: "I" }, optionB: { text: "Focus on achieving goals", type: "E" } },
  { id: "ie5", pairing: "I-E", optionA: { text: "Work in research settings", type: "I" }, optionB: { text: "Work in business or sales", type: "E" } },
  { id: "ie6", pairing: "I-E", optionA: { text: "Study complex concepts alone", type: "I" }, optionB: { text: "Coordinate team activities", type: "E" } },
  { id: "ie7", pairing: "I-E", optionA: { text: "Seek deep understanding", type: "I" }, optionB: { text: "Seek competitive advantage", type: "E" } },
  { id: "ie8", pairing: "I-E", optionA: { text: "Develop scientific methods", type: "I" }, optionB: { text: "Develop business strategies", type: "E" } },

  // I-C Pairing (8 questions)
  { id: "ic1", pairing: "I-C", optionA: { text: "Conduct research or experiments", type: "I" }, optionB: { text: "Organize and maintain records", type: "C" } },
  { id: "ic2", pairing: "I-C", optionA: { text: "Explore new theories", type: "I" }, optionB: { text: "Follow established procedures", type: "C" } },
  { id: "ic3", pairing: "I-C", optionA: { text: "Investigate complex problems", type: "I" }, optionB: { text: "Process data accurately", type: "C" } },
  { id: "ic4", pairing: "I-C", optionA: { text: "Work on abstract concepts", type: "I" }, optionB: { text: "Work on detailed tasks", type: "C" } },
  { id: "ic5", pairing: "I-C", optionA: { text: "Focus on discovery", type: "I" }, optionB: { text: "Focus on precision", type: "C" } },
  { id: "ic6", pairing: "I-C", optionA: { text: "Study natural phenomena", type: "I" }, optionB: { text: "Manage files and databases", type: "C" } },
  { id: "ic7", pairing: "I-C", optionA: { text: "Develop new knowledge", type: "I" }, optionB: { text: "Ensure accuracy in records", type: "C" } },
  { id: "ic8", pairing: "I-C", optionA: { text: "Work in labs or research facilities", type: "I" }, optionB: { text: "Work in offices with structured systems", type: "C" } },

  // A-S Pairing (8 questions)
  { id: "as1", pairing: "A-S", optionA: { text: "Create art, music, or designs", type: "A" }, optionB: { text: "Help or teach people", type: "S" } },
  { id: "as2", pairing: "A-S", optionA: { text: "Express yourself creatively", type: "A" }, optionB: { text: "Support others emotionally", type: "S" } },
  { id: "as3", pairing: "A-S", optionA: { text: "Work on artistic projects", type: "A" }, optionB: { text: "Provide care or guidance", type: "S" } },
  { id: "as4", pairing: "A-S", optionA: { text: "Focus on beauty and aesthetics", type: "A" }, optionB: { text: "Focus on people's well-being", type: "S" } },
  { id: "as5", pairing: "A-S", optionA: { text: "Perform or create works", type: "A" }, optionB: { text: "Counsel or assist individuals", type: "S" } },
  { id: "as6", pairing: "A-S", optionA: { text: "Work in arts or entertainment", type: "A" }, optionB: { text: "Work in education or healthcare", type: "S" } },
  { id: "as7", pairing: "A-S", optionA: { text: "Design original concepts", type: "A" }, optionB: { text: "Facilitate group activities", type: "S" } },
  { id: "as8", pairing: "A-S", optionA: { text: "Use imagination freely", type: "A" }, optionB: { text: "Build relationships with people", type: "S" } },

  // A-E Pairing (8 questions)
  { id: "ae1", pairing: "A-E", optionA: { text: "Create artistic works", type: "A" }, optionB: { text: "Lead business ventures", type: "E" } },
  { id: "ae2", pairing: "A-E", optionA: { text: "Express ideas through art", type: "A" }, optionB: { text: "Persuade and influence people", type: "E" } },
  { id: "ae3", pairing: "A-E", optionA: { text: "Work on creative projects", type: "A" }, optionB: { text: "Manage teams or operations", type: "E" } },
  { id: "ae4", pairing: "A-E", optionA: { text: "Focus on artistic expression", type: "A" }, optionB: { text: "Focus on achieving goals", type: "E" } },
  { id: "ae5", pairing: "A-E", optionA: { text: "Perform or design", type: "A" }, optionB: { text: "Sell or negotiate", type: "E" } },
  { id: "ae6", pairing: "A-E", optionA: { text: "Work in creative fields", type: "A" }, optionB: { text: "Work in business or sales", type: "E" } },
  { id: "ae7", pairing: "A-E", optionA: { text: "Use imagination and intuition", type: "A" }, optionB: { text: "Use strategy and competition", type: "E" } },
  { id: "ae8", pairing: "A-E", optionA: { text: "Create beauty or meaning", type: "A" }, optionB: { text: "Create profit or success", type: "E" } },

  // A-C Pairing (8 questions)
  { id: "ac1", pairing: "A-C", optionA: { text: "Work on creative, open-ended projects", type: "A" }, optionB: { text: "Work on structured, organized tasks", type: "C" } },
  { id: "ac2", pairing: "A-C", optionA: { text: "Express ideas freely", type: "A" }, optionB: { text: "Follow standard procedures", type: "C" } },
  { id: "ac3", pairing: "A-C", optionA: { text: "Create art or designs", type: "A" }, optionB: { text: "Maintain records and files", type: "C" } },
  { id: "ac4", pairing: "A-C", optionA: { text: "Use imagination and originality", type: "A" }, optionB: { text: "Use precision and accuracy", type: "C" } },
  { id: "ac5", pairing: "A-C", optionA: { text: "Focus on aesthetics", type: "A" }, optionB: { text: "Focus on detail and order", type: "C" } },
  { id: "ac6", pairing: "A-C", optionA: { text: "Work in creative fields", type: "A" }, optionB: { text: "Work in administration or accounting", type: "C" } },
  { id: "ac7", pairing: "A-C", optionA: { text: "Explore new ideas freely", type: "A" }, optionB: { text: "Complete tasks systematically", type: "C" } },
  { id: "ac8", pairing: "A-C", optionA: { text: "Perform or compose", type: "A" }, optionB: { text: "Organize or document", type: "C" } },

  // S-E Pairing (8 questions)
  { id: "se1", pairing: "S-E", optionA: { text: "Help or support individuals", type: "S" }, optionB: { text: "Lead or manage people", type: "E" } },
  { id: "se2", pairing: "S-E", optionA: { text: "Teach or counsel others", type: "S" }, optionB: { text: "Persuade or influence groups", type: "E" } },
  { id: "se3", pairing: "S-E", optionA: { text: "Focus on people's well-being", type: "S" }, optionB: { text: "Focus on achieving objectives", type: "E" } },
  { id: "se4", pairing: "S-E", optionA: { text: "Provide care or assistance", type: "S" }, optionB: { text: "Make strategic decisions", type: "E" } },
  { id: "se5", pairing: "S-E", optionA: { text: "Work in healthcare or education", type: "S" }, optionB: { text: "Work in business or management", type: "E" } },
  { id: "se6", pairing: "S-E", optionA: { text: "Support others emotionally", type: "S" }, optionB: { text: "Compete and win", type: "E" } },
  { id: "se7", pairing: "S-E", optionA: { text: "Facilitate group harmony", type: "S" }, optionB: { text: "Drive team performance", type: "E" } },
  { id: "se8", pairing: "S-E", optionA: { text: "Help individuals grow", type: "S" }, optionB: { text: "Build business success", type: "E" } },

  // S-C Pairing (8 questions)
  { id: "sc1", pairing: "S-C", optionA: { text: "Help or teach people", type: "S" }, optionB: { text: "Organize files and data", type: "C" } },
  { id: "sc2", pairing: "S-C", optionA: { text: "Work directly with individuals", type: "S" }, optionB: { text: "Work with systems and procedures", type: "C" } },
  { id: "sc3", pairing: "S-C", optionA: { text: "Support others emotionally", type: "S" }, optionB: { text: "Maintain accuracy in records", type: "C" } },
  { id: "sc4", pairing: "S-C", optionA: { text: "Focus on relationships", type: "S" }, optionB: { text: "Focus on details and order", type: "C" } },
  { id: "sc5", pairing: "S-C", optionA: { text: "Provide care or guidance", type: "S" }, optionB: { text: "Process information systematically", type: "C" } },
  { id: "sc6", pairing: "S-C", optionA: { text: "Work in healthcare or education", type: "S" }, optionB: { text: "Work in administration or accounting", type: "C" } },
  { id: "sc7", pairing: "S-C", optionA: { text: "Counsel individuals", type: "S" }, optionB: { text: "Follow standard procedures", type: "C" } },
  { id: "sc8", pairing: "S-C", optionA: { text: "Help people develop", type: "S" }, optionB: { text: "Ensure precision and consistency", type: "C" } },

  // E-C Pairing (8 questions)
  { id: "ec1", pairing: "E-C", optionA: { text: "Lead projects or teams", type: "E" }, optionB: { text: "Organize records and data", type: "C" } },
  { id: "ec2", pairing: "E-C", optionA: { text: "Persuade or influence others", type: "E" }, optionB: { text: "Follow established procedures", type: "C" } },
  { id: "ec3", pairing: "E-C", optionA: { text: "Make strategic decisions", type: "E" }, optionB: { text: "Maintain detailed files", type: "C" } },
  { id: "ec4", pairing: "E-C", optionA: { text: "Focus on growth and competition", type: "E" }, optionB: { text: "Focus on accuracy and detail", type: "C" } },
  { id: "ec5", pairing: "E-C", optionA: { text: "Manage business operations", type: "E" }, optionB: { text: "Process data systematically", type: "C" } },
  { id: "ec6", pairing: "E-C", optionA: { text: "Work in sales or leadership", type: "E" }, optionB: { text: "Work in administration or accounting", type: "C" } },
  { id: "ec7", pairing: "E-C", optionA: { text: "Drive results and achieve goals", type: "E" }, optionB: { text: "Ensure precision and consistency", type: "C" } },
  { id: "ec8", pairing: "E-C", optionA: { text: "Negotiate or compete", type: "E" }, optionB: { text: "Organize or document", type: "C" } }
];

// ============================================================
// APTITUDE QUESTIONS - Section-Adaptive (90 items)
// 30 Math, 30 Logic/Reasoning, 30 Verbal
// Each section: 10 easy, 10 medium, 10 hard
// ============================================================
export const APTITUDE_QUESTIONS = {
  math: [
    // Easy (10)
    { id: "m1", question: "If a shirt is sold for Rs. 500 after a 20% discount, what was its original price?", options: ["Rs. 600", "Rs. 625", "Rs. 650", "Rs. 700"], answer: "Rs. 625", difficulty: "easy" },
    { id: "m2", question: "The average of 5 numbers is 40. If one number is 60, what is the average of the remaining 4 numbers?", options: ["30", "35", "38", "42"], answer: "35", difficulty: "easy" },
    { id: "m3", question: "What is 15% of 200?", options: ["20", "25", "30", "35"], answer: "30", difficulty: "easy" },
    { id: "m4", question: "If 3x + 5 = 20, what is the value of x?", options: ["3", "5", "7", "10"], answer: "5", difficulty: "easy" },
    { id: "m5", question: "A train travels 60 km in 1 hour. How far will it travel in 3.5 hours at the same speed?", options: ["180 km", "200 km", "210 km", "220 km"], answer: "210 km", difficulty: "easy" },
    { id: "m6", question: "What is the next number in the sequence: 2, 4, 8, 16, __?", options: ["20", "24", "30", "32"], answer: "32", difficulty: "easy" },
    { id: "m7", question: "If a rectangle has a length of 10 cm and width of 5 cm, what is its area?", options: ["15 sq cm", "30 sq cm", "50 sq cm", "60 sq cm"], answer: "50 sq cm", difficulty: "easy" },
    { id: "m8", question: "What is 25% of 80?", options: ["15", "20", "25", "30"], answer: "20", difficulty: "easy" },
    { id: "m9", question: "If 2y - 3 = 7, what is the value of y?", options: ["3", "4", "5", "6"], answer: "5", difficulty: "easy" },
    { id: "m10", question: "A book costs Rs. 120. If there's a 10% discount, what is the sale price?", options: ["Rs. 100", "Rs. 105", "Rs. 108", "Rs. 110"], answer: "Rs. 108", difficulty: "easy" },

    // Medium (10)
    { id: "m11", question: "A shopkeeper marks his goods 30% above cost price but gives a 15% discount. What is his profit percentage?", options: ["10%", "10.5%", "12%", "15%"], answer: "10.5%", difficulty: "medium" },
    { id: "m12", question: "The ratio of boys to girls in a class is 3:5. If there are 24 boys, how many girls are there?", options: ["30", "35", "40", "45"], answer: "40", difficulty: "medium" },
    { id: "m13", question: "If (x + 5)(x - 3) = 0, what are the values of x?", options: ["-5 and 3", "5 and -3", "-5 and -3", "5 and 3"], answer: "-5 and 3", difficulty: "medium" },
    { id: "m14", question: "A pipe can fill a tank in 6 hours. Another pipe can empty it in 8 hours. If both are opened, how long will it take to fill the tank?", options: ["12 hours", "18 hours", "24 hours", "30 hours"], answer: "24 hours", difficulty: "medium" },
    { id: "m15", question: "What is the compound interest on Rs. 10,000 at 10% per annum for 2 years?", options: ["Rs. 2,000", "Rs. 2,050", "Rs. 2,100", "Rs. 2,200"], answer: "Rs. 2,100", difficulty: "medium" },
    { id: "m16", question: "The sum of three consecutive even numbers is 48. What is the largest number?", options: ["14", "16", "18", "20"], answer: "18", difficulty: "medium" },
    { id: "m17", question: "If the perimeter of a square is 40 cm, what is its area?", options: ["80 sq cm", "100 sq cm", "120 sq cm", "160 sq cm"], answer: "100 sq cm", difficulty: "medium" },
    { id: "m18", question: "A car travels 240 km at 60 km/h, then 180 km at 90 km/h. What is the average speed for the entire journey?", options: ["70 km/h", "72 km/h", "75 km/h", "80 km/h"], answer: "70 km/h", difficulty: "medium" },
    { id: "m19", question: "If 2^x = 32, what is the value of x?", options: ["3", "4", "5", "6"], answer: "5", difficulty: "medium" },
    { id: "m20", question: "The ages of A and B are in the ratio 5:7. After 6 years, the ratio becomes 3:4. What is A's current age?", options: ["15", "18", "21", "24"], answer: "15", difficulty: "medium" },

    // Hard (10)
    { id: "m21", question: "A and B together can complete a work in 12 days. A alone can do it in 20 days. In how many days can B alone complete the work?", options: ["25 days", "28 days", "30 days", "35 days"], answer: "30 days", difficulty: "hard" },
    { id: "m22", question: "The average of 6 numbers is 30. If one number is excluded, the average becomes 25. What is the excluded number?", options: ["40", "45", "50", "55"], answer: "55", difficulty: "hard" },
    { id: "m23", question: "If log₂(x) = 5, what is the value of x?", options: ["10", "16", "25", "32"], answer: "32", difficulty: "hard" },
    { id: "m24", question: "A sum of money doubles itself in 8 years at simple interest. In how many years will it triple itself?", options: ["12 years", "14 years", "16 years", "18 years"], answer: "16 years", difficulty: "hard" },
    { id: "m25", question: "If x² - 7x + 12 = 0, what is the sum of the roots?", options: ["5", "6", "7", "12"], answer: "7", difficulty: "hard" },
    { id: "m26", question: "A sphere and a cylinder have the same radius and height. What is the ratio of their volumes?", options: ["1:2", "2:3", "3:4", "1:1"], answer: "2:3", difficulty: "hard" },
    { id: "m27", question: "If sin θ = 3/5 and θ is acute, what is the value of cos θ?", options: ["3/5", "4/5", "5/3", "5/4"], answer: "4/5", difficulty: "hard" },
    { id: "m28", question: "A number when divided by 5 gives remainder 3. What will be the remainder when the square of this number is divided by 5?", options: ["1", "2", "3", "4"], answer: "4", difficulty: "hard" },
    { id: "m29", question: "The HCF and LCM of two numbers are 12 and 180 respectively. If one number is 36, what is the other number?", options: ["45", "60", "72", "90"], answer: "60", difficulty: "hard" },
    { id: "m30", question: "If a:b = 2:3 and b:c = 4:5, what is a:c?", options: ["6:15", "8:15", "10:15", "12:15"], answer: "8:15", difficulty: "hard" }
  ],

  logic: [
    // Easy (10)
    { id: "l1", question: "Complete the series: 5, 10, 15, 20, __?", options: ["22", "23", "25", "30"], answer: "25", difficulty: "easy" },
    { id: "l2", question: "If all roses are flowers and some flowers are red, which is definitely true?", options: ["All roses are red", "Some roses are red", "All red things are roses", "None of these"], answer: "None of these", difficulty: "easy" },
    { id: "l3", question: "What comes next: A, C, E, G, __?", options: ["H", "I", "J", "K"], answer: "I", difficulty: "easy" },
    { id: "l4", question: "If CAT is coded as 3120, how is DOG coded?", options: ["4157", "41507", "4-15-7", "Cannot be determined"], answer: "4157", difficulty: "easy" },
    { id: "l5", question: "Which one is different: Apple, Banana, Carrot, Mango?", options: ["Apple", "Banana", "Carrot", "Mango"], answer: "Carrot", difficulty: "easy" },
    { id: "l6", question: "Complete: 2, 6, 12, 20, __?", options: ["28", "30", "32", "36"], answer: "30", difficulty: "easy" },
    { id: "l7", question: "If North becomes East, East becomes South, what does West become?", options: ["North", "South", "East", "West"], answer: "North", difficulty: "easy" },
    { id: "l8", question: "Which number doesn't belong: 2, 4, 6, 9, 10?", options: ["2", "4", "6", "9"], answer: "9", difficulty: "easy" },
    { id: "l9", question: "If 'COMPUTER' is coded as 'PMOCRETU', how is 'CHAIR' coded?", options: ["RCIHA", "RIAHC", "HCRIA", "RCHIA"], answer: "RIAHC", difficulty: "easy" },
    { id: "l10", question: "Complete the pattern: 1, 1, 2, 3, 5, 8, __?", options: ["11", "12", "13", "14"], answer: "13", difficulty: "easy" },

    // Medium (10)
    { id: "l11", question: "In a code, MONKEY is written as XDJMNL. How is TIGER written in that code?", options: ["SHFDQ", "SITED", "UJHFS", "QDFHS"], answer: "SHFDQ", difficulty: "medium" },
    { id: "l12", question: "If in a certain language, GRAPE is coded as 27354 and BEAD is coded as 1426, what is the code for BRIDGE?", options: ["172634", "172364", "127364", "Cannot be determined"], answer: "Cannot be determined", difficulty: "medium" },
    { id: "l13", question: "A is taller than B. C is shorter than D but taller than A. Who is the tallest?", options: ["A", "B", "C", "D"], answer: "D", difficulty: "medium" },
    { id: "l14", question: "Complete the series: 3, 6, 11, 18, 27, __?", options: ["36", "38", "40", "42"], answer: "38", difficulty: "medium" },
    { id: "l15", question: "If '×' means '+', '÷' means '×', '+' means '÷' and '-' means '-', what is 15 × 3 ÷ 5 - 2?", options: ["23", "25", "28", "30"], answer: "23", difficulty: "medium" },
    { id: "l16", question: "Complete: ACE, FHJ, KMO, __?", options: ["PRT", "PQS", "QSU", "RTW"], answer: "PRT", difficulty: "medium" },
    { id: "l17", question: "Five friends A, B, C, D, E are sitting in a row. A and E are at the ends. C is between A and B. Where is D sitting?", options: ["Between B and E", "Between C and B", "Next to A", "Cannot be determined"], answer: "Between B and E", difficulty: "medium" },
    { id: "l18", question: "If 'FLOWER' is coded as 'UOLDVI', what is the code for 'GARDEN'?", options: ["TZIVWM", "TZIWVM", "TZIUWM", "TZIUMW"], answer: "TZIVWM", difficulty: "medium" },
    { id: "l19", question: "Complete the pattern: 2, 5, 11, 23, 47, __?", options: ["94", "95", "96", "97"], answer: "95", difficulty: "medium" },
    { id: "l20", question: "If all pencils are pens and some pens are erasers, which conclusion is valid?", options: ["All pencils are erasers", "Some pencils are erasers", "No pencil is an eraser", "None of these"], answer: "None of these", difficulty: "medium" },

    // Hard (10)
    { id: "l21", question: "In a family of 6, P is the sister of Q. R is the brother of S's husband. S is the daughter of Q and sister of T. How is R related to P?", options: ["Brother", "Nephew", "Uncle", "Brother-in-law"], answer: "Brother-in-law", difficulty: "hard" },
    { id: "l22", question: "If CLOCK is coded as 34235 and TIME is coded as 8679, what is the code for LIMP?", options: ["3967", "3697", "6397", "Cannot be determined"], answer: "Cannot be determined", difficulty: "hard" },
    { id: "l23", question: "Complete the series: 1, 4, 9, 16, 25, 36, 49, 64, 81, __?", options: ["90", "99", "100", "121"], answer: "100", difficulty: "hard" },
    { id: "l24", question: "A cube is painted red on all faces. It is cut into 64 smaller cubes of equal size. How many cubes have exactly one face painted?", options: ["8", "24", "32", "48"], answer: "24", difficulty: "hard" },
    { id: "l25", question: "If 5*3 = 19, 7*4 = 37, 9*5 = 59, what is 6*8?", options: ["62", "68", "72", "78"], answer: "62", difficulty: "hard" },
    { id: "l26", question: "Complete: Z1, Y2, X4, W8, __?", options: ["V10", "V12", "V14", "V16"], answer: "V16", difficulty: "hard" },
    { id: "l27", question: "In a row of students, A is 15th from left and B is 18th from right. If they interchange positions, A becomes 20th from left. How many students are in the row?", options: ["33", "35", "37", "39"], answer: "37", difficulty: "hard" },
    { id: "l28", question: "If @ means ×, # means ÷, $ means +, and % means -, what is 12 @ 3 # 2 $ 5 % 3?", options: ["18", "20", "22", "24"], answer: "20", difficulty: "hard" },
    { id: "l29", question: "A, B, C, D, E sit in a circle facing center. C is between A and E. D is not between A and B. Who sits to the immediate left of B?", options: ["A", "C", "D", "E"], answer: "E", difficulty: "hard" },
    { id: "l30", question: "Complete the series: 1, 8, 27, 64, 125, __?", options: ["180", "196", "200", "216"], answer: "216", difficulty: "hard" }
  ],

  verbal: [
    // Easy (10)
    { id: "v1", question: "Choose the correctly spelled word:", options: ["Occassion", "Occasion", "Ocassion", "Ocasion"], answer: "Occasion", difficulty: "easy" },
    { id: "v2", question: "Synonym of 'Happy':", options: ["Sad", "Joyful", "Angry", "Tired"], answer: "Joyful", difficulty: "easy" },
    { id: "v3", question: "Antonym of 'Hot':", options: ["Warm", "Cold", "Cool", "Freezing"], answer: "Cold", difficulty: "easy" },
    { id: "v4", question: "Fill in the blank: She __ to school every day.", options: ["go", "goes", "going", "gone"], answer: "goes", difficulty: "easy" },
    { id: "v5", question: "Choose the correct sentence:", options: ["He don't like apples", "He doesn't likes apples", "He doesn't like apples", "He not like apples"], answer: "He doesn't like apples", difficulty: "easy" },
    { id: "v6", question: "Synonym of 'Big':", options: ["Small", "Large", "Tiny", "Little"], answer: "Large", difficulty: "easy" },
    { id: "v7", question: "Antonym of 'Fast':", options: ["Quick", "Rapid", "Slow", "Swift"], answer: "Slow", difficulty: "easy" },
    { id: "v8", question: "Fill in the blank: They __ playing cricket.", options: ["is", "are", "am", "be"], answer: "are", difficulty: "easy" },
    { id: "v9", question: "Choose the correctly spelled word:", options: ["Recieve", "Receive", "Receve", "Receeve"], answer: "Receive", difficulty: "easy" },
    { id: "v10", question: "Synonym of 'Smart':", options: ["Dull", "Intelligent", "Stupid", "Foolish"], answer: "Intelligent", difficulty: "easy" },

    // Medium (10)
    { id: "v11", question: "Choose the word closest in meaning to 'Abundant':", options: ["Scarce", "Plentiful", "Rare", "Limited"], answer: "Plentiful", difficulty: "medium" },
    { id: "v12", question: "Identify the error: 'Each of the students have submitted their assignment.'", options: ["Each of", "have submitted", "their assignment", "No error"], answer: "have submitted", difficulty: "medium" },
    { id: "v13", question: "Complete the idiom: 'A blessing in __'", options: ["disguise", "time", "need", "heaven"], answer: "disguise", difficulty: "medium" },
    { id: "v14", question: "Antonym of 'Generous':", options: ["Kind", "Selfish", "Giving", "Charitable"], answer: "Selfish", difficulty: "medium" },
    { id: "v15", question: "Choose the correct passive voice: 'She writes a letter.'", options: ["A letter is written by her", "A letter was written by her", "A letter is being written by her", "A letter has been written by her"], answer: "A letter is written by her", difficulty: "medium" },
    { id: "v16", question: "Synonym of 'Authentic':", options: ["Fake", "Genuine", "False", "Imitation"], answer: "Genuine", difficulty: "medium" },
    { id: "v17", question: "Fill in the blank with the correct preposition: 'She is good __ mathematics.'", options: ["in", "at", "on", "with"], answer: "at", difficulty: "medium" },
    { id: "v18", question: "One word for 'A person who loves books':", options: ["Bibliophile", "Philanthropist", "Misanthrope", "Bibliophobe"], answer: "Bibliophile", difficulty: "medium" },
    { id: "v19", question: "Choose the correct sentence:", options: ["Neither of them are coming", "Neither of them is coming", "Neither of them were coming", "Neither of them have come"], answer: "Neither of them is coming", difficulty: "medium" },
    { id: "v20", question: "Antonym of 'Courage':", options: ["Bravery", "Valor", "Cowardice", "Boldness"], answer: "Cowardice", difficulty: "medium" },

    // Hard (10)
    { id: "v21", question: "Choose the word that best completes the analogy: Doctor : Hospital :: Teacher : __", options: ["School", "Student", "Books", "Learning"], answer: "School", difficulty: "hard" },
    { id: "v22", question: "Identify the figure of speech: 'The wind whispered through the trees.'", options: ["Metaphor", "Simile", "Personification", "Hyperbole"], answer: "Personification", difficulty: "hard" },
    { id: "v23", question: "Synonym of 'Ephemeral':", options: ["Permanent", "Temporary", "Eternal", "Lasting"], answer: "Temporary", difficulty: "hard" },
    { id: "v24", question: "Choose the correct sentence:", options: ["If I was rich, I would travel", "If I were rich, I would travel", "If I am rich, I would travel", "If I will be rich, I would travel"], answer: "If I were rich, I would travel", difficulty: "hard" },
    { id: "v25", question: "Antonym of 'Benevolent':", options: ["Kind", "Generous", "Malevolent", "Compassionate"], answer: "Malevolent", difficulty: "hard" },
    { id: "v26", question: "One word for 'A government by the wealthy':", options: ["Democracy", "Plutocracy", "Autocracy", "Oligarchy"], answer: "Plutocracy", difficulty: "hard" },
    { id: "v27", question: "Complete the proverb: 'A rolling stone __'", options: ["breaks easily", "gathers no moss", "is never found", "rolls forever"], answer: "gathers no moss", difficulty: "hard" },
    { id: "v28", question: "Identify the part of speech of the underlined word: 'She can *dance* beautifully.'", options: ["Noun", "Verb", "Adjective", "Adverb"], answer: "Verb", difficulty: "hard" },
    { id: "v29", question: "Choose the correct indirect speech: He said, 'I am writing a letter.'", options: ["He said that he was writing a letter", "He said that he is writing a letter", "He said that he wrote a letter", "He said that he has written a letter"], answer: "He said that he was writing a letter", difficulty: "hard" },
    { id: "v30", question: "Synonym of 'Tenacious':", options: ["Weak", "Persistent", "Yielding", "Fragile"], answer: "Persistent", difficulty: "hard" }
  ]
};

// ============================================================
// BIG FIVE (OCEAN) MODEL INFO
// ============================================================
export const BIG_FIVE_INFO = {
  Openness: {
    title: "Openness to Experience",
    description: "Reflects imagination, creativity, and willingness to try new things.",
    high: "You are creative, curious, and open to new experiences. You enjoy exploring ideas, art, and unconventional approaches.",
    low: "You prefer routine, practicality, and familiar methods. You value tradition and concrete results."
  },
  Conscientiousness: {
    title: "Conscientiousness",
    description: "Measures organization, responsibility, and goal-directed behavior.",
    high: "You are organized, disciplined, and reliable. You plan ahead and follow through on commitments.",
    low: "You are flexible and spontaneous, preferring to adapt to situations rather than follow strict schedules."
  },
  Extraversion: {
    title: "Extraversion",
    description: "Indicates sociability, assertiveness, and energy in social settings.",
    high: "You are outgoing, energetic, and enjoy being around people. You thrive in social environments.",
    low: "You are reserved, prefer solitude or small groups, and recharge through quiet time."
  },
  Agreeableness: {
    title: "Agreeableness",
    description: "Reflects empathy, cooperation, and concern for others.",
    high: "You are compassionate, cooperative, and considerate. You value harmony and helping others.",
    low: "You are independent, competitive, and direct. You prioritize logic over emotions."
  },
  Neuroticism: {
    title: "Emotional Stability (Neuroticism)",
    description: "Measures emotional resilience and tendency to experience negative emotions.",
    high: "You may experience stress, worry, or mood fluctuations more frequently. You are emotionally sensitive.",
    low: "You are calm, emotionally stable, and resilient. You handle stress well and remain composed."
  }
};

// ============================================================
// RIASEC (HOLLAND CODES) MODEL INFO
// ============================================================
export const RIASEC_INFO = {
  R: {
    title: "Realistic",
    description: "Practical, hands-on problem-solvers who enjoy working with objects, tools, and machines.",
    traits: "Physical, hands-on, practical, mechanical",
    careers: "Engineer, Mechanic, Electrician, Pilot, Farmer, Architect, Surveyor, Chef",
    activities: "Building things, operating machinery, working outdoors, sports, technical work"
  },
  I: {
    title: "Investigative",
    description: "Analytical thinkers who enjoy exploring ideas, research, and scientific inquiry.",
    traits: "Analytical, intellectual, curious, logical",
    careers: "Scientist, Researcher, Doctor, Mathematician, Programmer, Psychologist, Data Analyst",
    activities: "Conducting experiments, solving puzzles, reading, researching, analyzing data"
  },
  A: {
    title: "Artistic",
    description: "Creative individuals who express themselves through art, design, and innovation.",
    traits: "Creative, imaginative, expressive, original",
    careers: "Artist, Designer, Writer, Musician, Photographer, Actor, Filmmaker, Fashion Designer",
    activities: "Drawing, painting, writing, performing, designing, creating"
  },
  S: {
    title: "Social",
    description: "Empathetic helpers who enjoy working with and supporting people.",
    traits: "Helpful, empathetic, cooperative, communicative",
    careers: "Teacher, Counselor, Nurse, Social Worker, HR Manager, Therapist, Coach",
    activities: "Teaching, helping others, volunteering, teamwork, counseling"
  },
  E: {
    title: "Enterprising",
    description: "Persuasive leaders who enjoy influencing, managing, and achieving goals.",
    traits: "Confident, persuasive, ambitious, energetic",
    careers: "Entrepreneur, Manager, Salesperson, Lawyer, Politician, Marketing Executive, CEO",
    activities: "Leading teams, debating, selling, organizing events, competing"
  },
  C: {
    title: "Conventional",
    description: "Organized individuals who excel at structured tasks, data management, and detail-oriented work.",
    traits: "Organized, detail-oriented, systematic, reliable",
    careers: "Accountant, Banker, Administrator, Librarian, Data Entry Clerk, Auditor, Secretary",
    activities: "Organizing files, managing data, following procedures, maintaining records"
  }
};

// ============================================================
// STREAM RECOMMENDATIONS (Path A - 9th/10th Grade)
// ============================================================
export const STREAM_RECOMMENDATIONS = {
  Science: {
    title: "Science Stream",
    description: "For students interested in mathematics, research, and scientific inquiry.",
    bestFor: "Students with high Investigative and Realistic interests, high Conscientiousness and Openness.",
    careers: "Engineering, Medicine, Research, Technology, Architecture, Pharmacy",
    subjects: "Physics, Chemistry, Biology, Mathematics"
  },
  Commerce: {
    title: "Commerce Stream",
    description: "For students interested in business, finance, and economics.",
    bestFor: "Students with high Enterprising and Conventional interests, high Conscientiousness.",
    careers: "Chartered Accountant, Business Management, Economics, Banking, Finance",
    subjects: "Accountancy, Business Studies, Economics, Mathematics"
  },
  Humanities: {
    title: "Humanities/Arts Stream",
    description: "For students interested in social sciences, literature, and creative expression.",
    bestFor: "Students with high Artistic and Social interests, high Openness and Agreeableness.",
    careers: "Law, Psychology, Journalism, Social Work, Literature, History, Political Science",
    subjects: "History, Political Science, Economics, Sociology, Psychology, Languages"
  }
};

// ============================================================
// CAREER CLUSTERS (Path B - 11th/12th Grade)
// ============================================================
export const CAREER_CLUSTERS = {
  // Engineering & Technology
  engineering: {
    title: "Engineering & Technology",
    riasecCodes: ["R", "I"],
    personalityFit: ["High Conscientiousness", "Moderate-High Openness"],
    fields: [
      "Computer Science Engineering", "Mechanical Engineering", "Electrical Engineering",
      "Civil Engineering", "Electronics Engineering", "Aerospace Engineering",
      "Chemical Engineering", "Biotechnology Engineering"
    ]
  },
  // Healthcare & Medical
  healthcare: {
    title: "Healthcare & Medical Sciences",
    riasecCodes: ["I", "S"],
    personalityFit: ["High Agreeableness", "High Conscientiousness", "Low Neuroticism"],
    fields: [
      "MBBS (Medicine)", "BDS (Dentistry)", "Nursing", "Pharmacy",
      "Physiotherapy", "Veterinary Science", "Medical Lab Technology", "Public Health"
    ]
  },
  // Business & Management
  business: {
    title: "Business & Management",
    riasecCodes: ["E", "C"],
    personalityFit: ["High Extraversion", "High Conscientiousness"],
    fields: [
      "BBA (Business Administration)", "MBA", "Marketing", "Human Resources",
      "Finance & Banking", "Entrepreneurship", "International Business", "Retail Management"
    ]
  },
  // Arts & Design
  arts: {
    title: "Arts, Design & Creative Fields",
    riasecCodes: ["A"],
    personalityFit: ["High Openness", "Moderate Extraversion"],
    fields: [
      "Graphic Design", "Fashion Design", "Interior Design", "Animation & VFX",
      "Fine Arts", "Photography", "Film Making", "Product Design"
    ]
  },
  // Social Sciences & Humanities
  social: {
    title: "Social Sciences & Humanities",
    riasecCodes: ["S", "A"],
    personalityFit: ["High Agreeableness", "High Openness"],
    fields: [
      "Psychology", "Sociology", "Social Work", "Law",
      "Journalism", "Mass Communication", "Political Science", "History"
    ]
  },
  // Science & Research
  research: {
    title: "Pure Sciences & Research",
    riasecCodes: ["I"],
    personalityFit: ["High Openness", "High Conscientiousness"],
    fields: [
      "Physics", "Chemistry", "Biology", "Mathematics",
      "Environmental Science", "Biotechnology", "Microbiology", "Genetics"
    ]
  },
  // Commerce & Finance
  commerce: {
    title: "Commerce, Accounting & Finance",
    riasecCodes: ["C", "E"],
    personalityFit: ["High Conscientiousness", "Moderate Extraversion"],
    fields: [
      "Chartered Accountancy (CA)", "Company Secretary (CS)", "Cost Accountant (CMA)",
      "B.Com", "Economics", "Actuarial Science", "Investment Banking", "Stock Market Analysis"
    ]
  },
  // Education & Teaching
  education: {
    title: "Education & Teaching",
    riasecCodes: ["S"],
    personalityFit: ["High Agreeableness", "High Extraversion", "High Conscientiousness"],
    fields: [
      "B.Ed (Bachelor of Education)", "Early Childhood Education", "Special Education",
      "Subject-specific Teaching", "Educational Technology", "School Counseling"
    ]
  }
};
