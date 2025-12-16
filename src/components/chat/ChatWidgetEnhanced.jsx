import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Send, ThumbsUp, ThumbsDown, X, MessageCircle, Minimize2, Sparkles, Zap } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { DATA } from '../../data/data';

const CHAT_API_URL = import.meta.env.VITE_CHAT_API_URL || 'http://localhost:8080';
const STORAGE_KEY = 'ishira_chat_history';

export default function ChatWidget({ userContext, report, dashaReport, language = 'en' }) {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId] = useState(() => crypto.randomUUID());
  const userConsent = true; // Consent given at login
  const [justMounted, setJustMounted] = useState(true);
  const [suggestedQuestions, setSuggestedQuestions] = useState([]);
  const [hasGreeted, setHasGreeted] = useState(false);
  const messagesEndRef = useRef(null);

  // Entrance animation on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setJustMounted(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Load conversation history from localStorage
  useEffect(() => {
    if (user && isOpen) {
      loadConversationHistory();
    }
  }, [user, isOpen]);

  // Save conversation history to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      saveConversationHistory();
    }
  }, [messages]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Update suggested questions based on context
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      generateSuggestedQuestions();
    }
  }, [isOpen, report, userContext]);

  const loadConversationHistory = () => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_${user.id}`);
      if (stored) {
        const history = JSON.parse(stored);
        // Only load messages from last 24 hours
        const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
        const recentMessages = history.filter(msg =>
          new Date(msg.timestamp).getTime() > oneDayAgo
        );
        if (recentMessages.length > 0) {
          setMessages(recentMessages);
        }
      }
    } catch (err) {
      console.error('Failed to load conversation history:', err);
    }
  };

  const saveConversationHistory = () => {
    try {
      if (user) {
        localStorage.setItem(`${STORAGE_KEY}_${user.id}`, JSON.stringify(messages));
      }
    } catch (err) {
      console.error('Failed to save conversation history:', err);
    }
  };

  const getGreetingMessage = () => {
    const userName = userContext?.name || 'there';
    const destinyNum = userContext?.destinyNumber;
    const basicNum = userContext?.basicNumber;

    if (language === 'hi') {
      return `🙏 नमस्ते ${userName}!\n\nमैं इशिरा हूं, आपकी व्यक्तिगत अंकज्योतिष सहायक। मैं आपकी संख्याओं, दशाओं और जीवन पथ को समझने में आपकी मदद करने के लिए यहां हूं।\n\n${destinyNum ? `आपकी नियति संख्या **${destinyNum}** है और मूल संख्या **${basicNum}** है।` : ''}\n\nमैं आपकी कैसे सहायता कर सकती हूं? 💫`;
    } else if (language === 'en-hi') {
      return `🙏 Namaste ${userName}!\n\nMain Ishira hoon, aapki personal numerology assistant. Main aapko aapke numbers, dashas aur life path ko samajhne mein madad karne ke liye yahaan hoon.\n\n${destinyNum ? `Aapka Destiny Number **${destinyNum}** hai aur Basic Number **${basicNum}** hai।` : ''}\n\nMain aapki kaise madad kar sakti hoon? 💫`;
    } else {
      return `🙏 Namaste ${userName}!\n\nI'm Ishira, your personal numerology assistant. I'm here to help you understand your numbers, dashas, and life path.\n\n${destinyNum ? `Your Destiny Number is **${destinyNum}** and Basic Number is **${basicNum}**.` : ''}\n\nHow can I assist you today? 💫`;
    }
  };

  // Send greeting when chat opens for the first time
  useEffect(() => {
    if (isOpen && !hasGreeted && messages.length === 0) {
      const greetingMsg = {
        role: 'assistant',
        content: getGreetingMessage(),
        timestamp: new Date().toISOString(),
        id: crypto.randomUUID()
      };
      setMessages([greetingMsg]);
      setHasGreeted(true);
    }
  }, [isOpen, hasGreeted, messages.length, language, userContext]);

  // Helper function to translate common phrases and responses
  const translateResponse = (englishText) => {
    if (language === 'en') return englishText;

    // Common translations
    const translations = {
      'hi': {
        'Your Current Yearly Dasha': 'आपकी वर्तमान वार्षिक दशा',
        'Your Current Maha Dasha': 'आपकी वर्तमान महा दशा',
        'Number': 'संख्या',
        'Period': 'अवधि',
        'Core Energy': 'मूल ऊर्जा',
        'What This Means': 'इसका अर्थ',
        'Want to know more?': 'और जानना चाहते हैं?',
        'This Year': 'इस वर्ष',
        'Energy': 'ऊर्जा',
        'Dasha Timeline Overview': 'दशा समयरेखा अवलोकन',
        'Maha Dasha': 'महा दशा',
        'Yearly Dasha': 'वार्षिक दशा',
        'Monthly Dasha': 'मासिक दशा',
        'Daily Dasha': 'दैनिक दशा',
        'Visit the': 'देखें',
        'Advanced Dasha': 'उन्नत दशा',
        'Life Cycle': 'जीवन चक्र',
        'tabs to explore': 'टैब्स में',
        'Yearly dashas influence the themes': 'वार्षिक दशाएं प्रत्येक वर्ष की थीम और अवसरों को प्रभावित करती हैं',
        'year brings': 'वर्ष लाता है',
        'energy into focus': 'ऊर्जा को फोकस में',
        'You are running': 'आप चला रहे हैं',
        'yearly dasha': 'वार्षिक दशा',
        'You are in': 'आप में हैं',
        'major cycle': 'प्रमुख चक्र',
        'influence': 'प्रभाव',
        '9-year planetary cycles': '9-वर्षीय ग्रह चक्र',
        'Annual influences within each cycle': 'प्रत्येक चक्र के भीतर वार्षिक प्रभाव',
        'Pratyantara periods': 'प्रत्यंतरा अवधि',
        'days': 'दिन',
        'Daily planetary energies': 'दैनिक ग्रह ऊर्जा',
        'to see how this yearly energy blends': 'यह देखने के लिए कि यह वार्षिक ऊर्जा कैसे मिश्रित होती है'
      },
      'en-hi': {
        'Your Current Yearly Dasha': 'Aapki Current Yearly Dasha',
        'Your Current Maha Dasha': 'Aapki Current Maha Dasha',
        'Number': 'Number',
        'Period': 'Period',
        'Core Energy': 'Core Energy',
        'What This Means': 'Iska Matlab',
        'Want to know more?': 'Aur jaanna chahte hain?',
        'This Year': 'Is Saal',
        'Energy': 'Energy',
        'Dasha Timeline Overview': 'Dasha Timeline Overview',
        'Maha Dasha': 'Maha Dasha',
        'Yearly Dasha': 'Yearly Dasha',
        'Monthly Dasha': 'Monthly Dasha',
        'Daily Dasha': 'Daily Dasha',
        'Visit the': 'Dekhiye',
        'Advanced Dasha': 'Advanced Dasha',
        'Life Cycle': 'Life Cycle',
        'tabs to explore': 'tabs mein',
        'Yearly dashas influence the themes': 'Yearly dashas har saal ki themes aur opportunities ko influence karte hain',
        'year brings': 'year laata hai',
        'energy into focus': 'energy ko focus mein',
        'You are running': 'Aap chal rahe hain',
        'yearly dasha': 'yearly dasha',
        'You are in': 'Aap hain',
        'major cycle': 'major cycle',
        'influence': 'influence',
        '9-year planetary cycles': '9-year planetary cycles',
        'Annual influences within each cycle': 'Har cycle ke andar annual influences',
        'Pratyantara periods': 'Pratyantara periods',
        'days': 'din',
        'Daily planetary energies': 'Daily planetary energies',
        'to see how this yearly energy blends': 'yeh dekhne ke liye ki yearly energy kaise blend hoti hai'
      }
    };

    const dict = translations[language];
    if (!dict) return englishText;

    let translated = englishText;
    Object.keys(dict).forEach(key => {
      const regex = new RegExp(key, 'gi');
      translated = translated.replace(regex, dict[key]);
    });

    return translated;
  };

  // Common generic questions available to all users
  const getGenericQuestions = () => {
    const allGenericQuestions = [
      // Numbers & Meanings
      { text: 'What do my numbers mean?', icon: '🔢', category: 'numbers' },
      { text: 'How do numbers affect my life?', icon: '✨', category: 'numbers' },
      { text: 'What is my lucky number?', icon: '🍀', category: 'numbers' },

      // Dasha & Timing
      { text: 'What is my current dasha?', icon: '🌙', category: 'dasha' },
      { text: 'When is the best time for important decisions?', icon: '⏰', category: 'dasha' },
      { text: 'What does this year hold for me?', icon: '📅', category: 'dasha' },

      // Remedies & Guidance
      { text: 'What remedies should I follow?', icon: '🕉️', category: 'remedies' },
      { text: 'How can I improve my life?', icon: '🌟', category: 'remedies' },
      { text: 'Which gemstones suit me?', icon: '💎', category: 'remedies' },

      // Traits & Personality
      { text: 'What are my strengths?', icon: '💪', category: 'traits' },
      { text: 'What are my weaknesses?', icon: '🎯', category: 'traits' },
      { text: 'What is my personality like?', icon: '🌈', category: 'traits' },

      // Career & Life Path
      { text: 'What career suits me best?', icon: '💼', category: 'career' },
      { text: 'Tell me about my life path', icon: '🛤️', category: 'forecast' },
      { text: 'When will I achieve success?', icon: '🏆', category: 'forecast' },

      // Relationships
      { text: 'What about my relationships?', icon: '❤️', category: 'relationships' },
      { text: 'Am I compatible with my partner?', icon: '💑', category: 'relationships' },
      { text: 'When will I get married?', icon: '💍', category: 'relationships' },
    ];

    // Randomly select 6 questions to show variety
    const shuffled = [...allGenericQuestions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 6);
  };

  const generateSuggestedQuestions = () => {
    const suggestions = [];

    // Personalized quick questions based on user's data
    if (userContext?.destinyNumber) {
      suggestions.push({
        text: `What does my destiny number ${userContext.destinyNumber} mean?`,
        icon: '🔮',
        category: 'personalized',
        isPersonalized: true
      });
    }

    if (userContext?.basicNumber) {
      suggestions.push({
        text: `Tell me about my basic number ${userContext.basicNumber}`,
        icon: '⭐',
        category: 'personalized',
        isPersonalized: true
      });
    }

    if (userContext?.currentDasha) {
      suggestions.push({
        text: 'What is my current dasha period?',
        icon: '🌙',
        category: 'personalized',
        isPersonalized: true
      });
    }

    setSuggestedQuestions(suggestions);
  };

  const generateFollowUpQuestions = (lastBotMessage) => {
    const followUps = [];
    const content = lastBotMessage.content.toLowerCase();

    if (content.includes('destiny') || content.includes('number')) {
      followUps.push(
        { text: 'How does this affect my career?', icon: '💼' },
        { text: 'What are the remedies for this?', icon: '🌿' }
      );
    }

    if (content.includes('dasha')) {
      followUps.push(
        { text: 'When does my next dasha start?', icon: '📅' },
        { text: 'How can I make the most of this period?', icon: '✨' }
      );
    }

    if (content.includes('remedy') || content.includes('remedies')) {
      followUps.push(
        { text: 'Which remedy is most important?', icon: '⚡' },
        { text: 'How do I perform these remedies?', icon: '🙏' }
      );
    }

    if (content.includes('strength') || content.includes('weakness')) {
      followUps.push(
        { text: 'How can I improve my weaknesses?', icon: '📈' },
        { text: 'What career suits my strengths?', icon: '🎯' }
      );
    }

    return followUps.slice(0, 3);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSuggestedQuestion = (question) => {
    setInputValue(question.text);
    // Auto-send after a brief delay for better UX
    setTimeout(() => sendMessage(question.text), 100);
  };

  const sendMessage = async (customMessage) => {
    const messageText = customMessage || inputValue.trim();
    if (!messageText || isLoading) return;

    setInputValue('');

    // Add user message to chat
    const newUserMessage = {
      id: Date.now(),
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newUserMessage]);

    // Handle greetings locally (no backend needed)
    const lowerMessage = messageText.toLowerCase();
    const greetings = ['hi', 'hello', 'hey', 'namaste', 'namaskar', 'greetings', 'good morning', 'good afternoon', 'good evening'];
    const isGreeting = greetings.some(greeting => lowerMessage === greeting || lowerMessage.startsWith(greeting + ' ') || lowerMessage.startsWith(greeting + ','));

    if (isGreeting) {
      const greetingResponses = [
        `Namaste! 🙏 I'm Ishira, your personal numerology guide. I can help you understand your destiny number, current dasha, remedies, and much more about your cosmic influences. What would you like to know?`,
        `Hello! ✨ I'm Ishira. I'm here to help you explore your numerology insights. Feel free to ask me about your numbers, dashas, or any guidance you seek!`,
        `Greetings! 🌟 I'm Ishira, here to illuminate your numerological path. Ask me anything about your destiny, strengths, or cosmic timing!`
      ];
      const randomGreeting = greetingResponses[Math.floor(Math.random() * greetingResponses.length)];

      const botMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: randomGreeting,
        timestamp: new Date(),
        source: 'deterministic',
      };
      setMessages((prev) => [...prev, botMessage]);

      // Generate follow-up suggestions
      const followUps = [
        { text: 'What does my destiny number mean?', icon: '🔮' },
        { text: 'Tell me about my current dasha', icon: '🌙' },
        { text: 'What are my strengths?', icon: '💪' }
      ];
      setSuggestedQuestions(followUps);
      return;
    }

    setIsLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(`${CHAT_API_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          message: messageText,
          userContext: {
            ...userContext,
            report: report,
          },
          conversationId,
          userConsent,
        }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('You are asking too many questions. Please wait a moment.');
        } else if (response.status === 401) {
          throw new Error('Please log in to use the chatbot.');
        } else {
          throw new Error('Failed to get response from chatbot.');
        }
      }

      const data = await response.json();

      const botMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: data.text,
        timestamp: new Date(),
        source: data.source,
        blocked: data.blocked,
        conversationId: data.conversationId || conversationId,
      };
      setMessages((prev) => [...prev, botMessage]);

      // Generate context-aware follow-ups
      const followUps = generateFollowUpQuestions(botMessage);
      if (followUps.length > 0) {
        setSuggestedQuestions(followUps);
      }

    } catch (err) {
      console.error('Chat error:', err);

      // Provide helpful fallback with detailed numerology insights
      let fallbackMessage = '';
      const lowerMsg = messageText.toLowerCase();

      // Detect language for fallback response
      const isHinglish = /\b(mera|kya|hai|kaise|kaisa|rahega|hoga|batao|saal|year)\b/i.test(lowerMsg);
      const isHindi = /[\u0900-\u097F]/.test(messageText);

      // Handle Hinglish year/forecast queries specifically
      if ((lowerMsg.includes('saal') || lowerMsg.includes('year')) && (lowerMsg.includes('kaisa') || lowerMsg.includes('kaise') || lowerMsg.includes('rahega') || lowerMsg.includes('hoga'))) {
        const destinyNum = userContext?.destinyNumber || report?.destinyNumber;
        const basicNum = userContext?.basicNumber || report?.basicNumber;
        const currentDasha = userContext?.currentDasha || report?.basicNumber;
        const dashaDetails = DATA.numberDetails?.[currentDasha];

        if (currentDasha && dashaDetails) {
          const dashaName = dashaDetails.name?.en || '';

          if (isHinglish) {
            fallbackMessage = `**Aapka Yeh Saal (This Year) 🌟**\n\nAap abhi **${dashaName}** dasha period mein hai. Yeh saal aapke liye special hai!\n\n**Is Saal Ka Energy:**\n• Aapka Destiny Number ${destinyNum} aapko apne goals ki taraf guide kar raha hai\n• ${dashaName} period aapko naye opportunities de raha hai\n• Apne strengths ko use karein aur challenges ko opportunities samjhein\n\n**Kya Karein:**\n✨ **"LifeCycle"** tab dekhein - har month ki detailed prediction\n✨ **"Forecast"** tab mein apne important life events ka timing dekhein\n✨ **"Advanced Dasha"** tab mein pura yearly breakdown milega\n\n**Pro Tip:** Life tab ko explore karke aap apne poore saal ka roadmap dekh sakte hain—kaunsa time best hai career, relationship, aur personal growth ke liye!\n\n*Chatbot server abhi unavailable hai, isliye main aapko tabs se information lene ka suggest kar rahi hoon.* 🙏`;
          } else {
            fallbackMessage = `**Your Year Ahead 🌟**\n\nYou're currently in the **${dashaName}** dasha period. This year holds special significance for you!\n\n**This Year's Energy:**\n• Your Destiny Number ${destinyNum} is guiding you toward your goals\n• ${dashaName} period brings specific opportunities\n• Use your strengths and view challenges as growth opportunities\n\n**What To Do:**\n✨ Check **"LifeCycle"** tab - detailed monthly predictions\n✨ Visit **"Forecast"** tab for important life event timings\n✨ Explore **"Advanced Dasha"** tab for complete yearly breakdown\n\n**Pro Tip:** The LifeCycle tab shows you a complete roadmap of your year—which times are best for career moves, relationships, and personal growth!\n\n*The chatbot server is currently unavailable, so I'm directing you to the tabs for detailed information.* 🙏`;
          }
        } else {
          fallbackMessage = isHinglish
            ? `**Apna Saal Jaaniye! 🌟**\n\nAapke is saal ke baare mein jaanne ke liye:\n\n✨ **"LifeCycle"** tab - Har month ki detailed predictions\n✨ **"Forecast"** tab - Important timings aur life events\n✨ **"Advanced Dasha"** tab - Pura yearly planetary influence\n\nYeh tabs aapko batayenge ki kaunsa time aapke liye best hai aur kaunse areas pe focus karna chahiye!\n\n*Chatbot server offline hai, toh tabs use karke apni full yearly insights dekhein!* 🙏`
            : `**Discover Your Year! 🌟**\n\nTo learn about your year ahead:\n\n✨ **"LifeCycle"** tab - Detailed monthly predictions\n✨ **"Forecast"** tab - Important timings and life events\n✨ **"Advanced Dasha"** tab - Complete yearly planetary influences\n\nThese tabs will show you which times are best for you and which areas to focus on!\n\n*The chatbot server is offline, so please use the tabs for your complete yearly insights!* 🙏`;
        }
      } else if (lowerMsg.includes('destiny') && lowerMsg.includes('mean')) {
        // Detailed destiny number explanation
        const destinyNum = userContext?.destinyNumber || report?.destinyNumber;
        const destinyDetails = DATA.destinyNumberDetails?.[destinyNum];
        const destinyTraits = DATA.destinyTraits?.[destinyNum];

        if (destinyNum && destinyDetails) {
          const description = destinyDetails.description?.en || '';
          const planet = destinyTraits?.Planet?.en || '';
          const goodQuality = destinyTraits?.['Good Quality']?.en || '';

          fallbackMessage = `**Your Destiny Number ${destinyNum}** ${planet ? `(${planet})` : ''}\n\n${description}\n\n**Key Strengths:** ${goodQuality || 'Leadership, determination, and strong willpower.'}\n\nFor more insights about how this influences your career, relationships, and life path, explore the tabs above!`;
        } else {
          fallbackMessage = `Your Destiny Number is **${destinyNum}**. This powerful number reveals your life purpose and the path you're meant to walk. Check the "Numerology Traits" tab for comprehensive insights!`;
        }
      } else if (lowerMsg.includes('basic') && lowerMsg.includes('number')) {
        // Detailed basic number explanation
        const basicNum = userContext?.basicNumber || report?.basicNumber;
        const basicDetails = DATA.numberDetails?.[basicNum];

        if (basicNum && basicDetails) {
          const name = basicDetails.name?.en || '';
          const description = basicDetails.description?.en || '';
          const coreVibration = basicDetails.coreVibration?.en || '';

          fallbackMessage = `**Your Basic Number ${basicNum}** - ${name}\n\n**Core Vibration:** ${coreVibration}\n\n${description}\n\nThis is your inner self—the real you! Explore the "Welcome" and "Foundational Analysis" tabs to discover more about how this shapes your personality.`;
        } else {
          fallbackMessage = `Your Basic Number is **${basicNum}**. This is your core personality number, revealing who you truly are. Check your report tabs for deeper insights!`;
        }
      } else if (lowerMsg.includes('destiny') || lowerMsg.includes('number')) {
        // General number inquiry
        const destinyNum = userContext?.destinyNumber || report?.destinyNumber;
        const basicNum = userContext?.basicNumber || report?.basicNumber;
        const destinyDetails = DATA.destinyNumberDetails?.[destinyNum];
        const basicDetails = DATA.numberDetails?.[basicNum];

        let detailedInfo = `**Your Core Numbers:**\n\n`;

        if (destinyNum && destinyDetails) {
          const destinyDesc = destinyDetails.description?.en || '';
          const shortDesc = destinyDesc.split('.')[0] + '.';
          detailedInfo += `🔮 **Destiny Number ${destinyNum}:** ${shortDesc}\n\n`;
        }

        if (basicNum && basicDetails) {
          const basicName = basicDetails.name?.en || '';
          const basicCore = basicDetails.coreVibration?.en || '';
          detailedInfo += `⭐ **Basic Number ${basicNum}** (${basicName}): Core vibration is ${basicCore}.\n\n`;
        }

        detailedInfo += `These numbers work together to shape your personality, life purpose, and destiny. Explore the tabs above for complete insights!`;
        fallbackMessage = detailedInfo;
      } else if (lowerMsg.includes('dasha')) {
        // Enhanced dasha information with yearly dasha support
        const now = new Date();

        // Find current Maha Dasha
        const currentMaha = dashaReport?.mahaDashaTimeline?.find(m => {
          const start = new Date(m.startDate);
          const end = new Date(m.endDate);
          return now >= start && now <= end;
        });

        // Find current Yearly Dasha
        const currentYearly = dashaReport?.yearlyDashaTimeline?.find(y => {
          const start = new Date(y.startDate);
          const end = new Date(y.endDate);
          return now >= start && now <= end;
        });

        // Check if query is specifically about yearly dasha
        const isYearlyQuery = lowerMsg.includes('yearly') || lowerMsg.includes('annual') || lowerMsg.includes('this year');

        if (isYearlyQuery && currentYearly) {
          const yearlyNum = currentYearly.dashaNumber;
          const yearlyDetails = DATA.numberDetails?.[yearlyNum];
          const yearlyName = yearlyDetails?.name?.en || `Number ${yearlyNum}`;
          const yearlyCore = yearlyDetails?.coreVibration?.en || 'transformational';
          const startDate = new Date(currentYearly.startDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
          const endDate = new Date(currentYearly.endDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

          fallbackMessage = translateResponse(`**Your Current Yearly Dasha 📅**\n\nYou are running **${yearlyName}** (Number **${yearlyNum}**) yearly dasha.\n\n🗓️ **Period:** ${startDate} to ${endDate}\n✨ **Core Energy:** ${yearlyCore}\n\n**What This Means:**\nYearly dashas influence the themes and opportunities of each year within your 9-year Maha Dasha cycle. This ${yearlyName} year brings ${yearlyCore} energy into focus.\n\n💡 **Want to know more?** Visit the **"Advanced Dasha"** or **"Life Cycle"** tabs to see how this yearly energy blends with your major cycle and get AI-powered predictions!`);
        } else if (currentMaha) {
          const mahaNum = currentMaha.dashaNumber;
          const mahaDetails = DATA.numberDetails?.[mahaNum];
          const mahaName = mahaDetails?.name?.en || `Number ${mahaNum}`;
          const mahaCore = mahaDetails?.coreVibration?.en || 'transformational';

          let dashaInfo = `**Your Current Maha Dasha 🌟**\n\nYou are in **${mahaName}** (Number **${mahaNum}**) major cycle.\n✨ **Energy:** ${mahaCore}\n\n`;

          if (currentYearly) {
            const yearlyNum = currentYearly.dashaNumber;
            const yearlyDetails = DATA.numberDetails?.[yearlyNum];
            const yearlyName = yearlyDetails?.name?.en || `Number ${yearlyNum}`;
            dashaInfo += `📅 **This Year:** ${yearlyName} (Number ${yearlyNum}) influence\n\n`;
          }

          dashaInfo += `**Dasha Timeline Overview:**\n• **Maha Dasha:** 9-year planetary cycles\n• **Yearly Dasha:** Annual influences within each cycle\n• **Monthly Dasha:** Pratyantara periods (8-74 days)\n• **Daily Dasha:** Daily planetary energies\n\nVisit the **"Advanced Dasha"** or **"Life Cycle"** tabs to explore your complete timeline and get personalized predictions!`;
          fallbackMessage = translateResponse(dashaInfo);
        } else {
          fallbackMessage = `Your dasha periods reveal the planetary influences shaping different phases of your life. Visit the **"Advanced Dasha"** tab above to see your complete timeline—from daily influences to 9-year cycles!`;
        }
      } else if (lowerMsg.includes('remedy') || lowerMsg.includes('remedies')) {
        // Enhanced remedy guidance
        const destinyNum = userContext?.destinyNumber || report?.destinyNumber;
        const destinyTraits = DATA.destinyTraits?.[destinyNum];

        let remedyInfo = `**Personalized Remedies for You:**\n\n`;

        if (destinyTraits) {
          const luckyColors = destinyTraits['Lucky Colours']?.en;
          const luckyJewels = destinyTraits['Lucky Jewels']?.en;
          const luckyDays = destinyTraits['Lucky Days']?.en;

          if (luckyColors) remedyInfo += `🎨 **Lucky Colors:** ${luckyColors}\n\n`;
          if (luckyJewels) remedyInfo += `💎 **Lucky Gemstones:** ${luckyJewels}\n\n`;
          if (luckyDays) remedyInfo += `📅 **Lucky Days:** ${luckyDays}\n\n`;
        }

        remedyInfo += `For complete remedial guidance including:\n• Rudraksha recommendations\n• Powerful mantras\n• Gemstone therapy\n• Chakra healing\n• Yantra placement\n\nVisit the **"Remedies & Guidance"** tab above!`;
        fallbackMessage = remedyInfo;
      } else if (lowerMsg.includes('strength') || lowerMsg.includes('weakness') || lowerMsg.includes('trait')) {
        // Enhanced traits information
        const destinyNum = userContext?.destinyNumber || report?.destinyNumber;
        const destinyTraits = DATA.destinyTraits?.[destinyNum];

        if (destinyTraits) {
          const goodQuality = destinyTraits['Good Quality']?.en || '';
          const drawback = destinyTraits['Drawback']?.en || '';

          fallbackMessage = `**Your Personality Traits:**\n\n✨ **Strengths:** ${goodQuality}\n\n⚠️ **Areas for Growth:** ${drawback}\n\nEvery number has both light and shadow aspects. Understanding both helps you maximize your potential and work on areas that need attention.\n\nFor a complete personality analysis, visit the **"Numerology Traits"** tab above!`;
        } else {
          fallbackMessage = `Your numerology chart reveals unique strengths and areas for growth. Visit the **"Numerology Traits"** tab above for a comprehensive personality analysis based on your numbers!`;
        }
      } else if (lowerMsg.includes('lucky') || lowerMsg.includes('color') || lowerMsg.includes('colour') || lowerMsg.includes('day')) {
        // Lucky elements
        const destinyNum = userContext?.destinyNumber || report?.destinyNumber;
        const destinyTraits = DATA.destinyTraits?.[destinyNum];

        if (destinyTraits) {
          const luckyColors = destinyTraits['Lucky Colours']?.en || '';
          const luckyDays = destinyTraits['Lucky Days']?.en || '';
          const luckyJewels = destinyTraits['Lucky Jewels']?.en || '';

          fallbackMessage = `**Your Lucky Elements:**\n\n🎨 **Colors:** ${luckyColors}\n\n📅 **Days:** ${luckyDays}\n\n💎 **Gemstones:** ${luckyJewels}\n\nUsing these lucky elements in your daily life—wearing these colors, planning important events on lucky days, and wearing appropriate gemstones—can enhance positive energies and attract good fortune!`;
        } else {
          fallbackMessage = `Every destiny number has specific lucky colors, days, and gemstones that enhance its positive energies. Check the **"Numerology Traits"** tab for your personalized lucky elements!`;
        }
      } else if (lowerMsg.includes('purpose') || lowerMsg.includes('calling') || lowerMsg.includes('soul') || lowerMsg.includes('path') || lowerMsg.includes('lesson')) {
        // PURPOSE_PATH intent - Soul purpose and life lessons
        const destinyNum = userContext?.destinyNumber || report?.destinyNumber;
        const destinyTraits = DATA.destinyTraits?.[destinyNum];
        const destinyDetails = DATA.destinyNumberDetails?.[destinyNum];

        if (destinyTraits?.['Spiritual Insights']?.en) {
          const spiritualInsight = destinyTraits['Spiritual Insights'].en;
          const destinyDesc = destinyDetails?.description?.en || '';
          const shortDesc = destinyDesc ? destinyDesc.split('.').slice(0, 2).join('.') + '.' : '';

          fallbackMessage = `**Your Soul's Purpose 🕉️**\n\n${spiritualInsight}\n\n${shortDesc ? `**Your Path:** ${shortDesc}\n\n` : ''}Your Destiny Number **${destinyNum}** carries a specific karmic lesson. Every challenge you face is shaping you for your higher purpose.\n\nExplore the **"Numerology Traits"** and **"Forecast"** tabs to understand your life path and spiritual journey more deeply.`;
        } else {
          fallbackMessage = `**Understanding Your Life Purpose 🕉️**\n\nYour Destiny Number **${destinyNum}** reveals your soul's mission in this lifetime. Every experience—joy or challenge—is guiding you toward spiritual growth and self-realization.\n\nVisit the **"Numerology Traits"** tab for insights into your karmic lessons, and the **"Forecast"** tab to understand how your purpose unfolds through different life phases.`;
        }
      } else if (lowerMsg.includes('share') || lowerMsg.includes('export') || lowerMsg.includes('download') || lowerMsg.includes('save')) {
        // REPORT_SHARING intent - Export and sharing functionality
        fallbackMessage = `**Share Your Insights! 📥**\n\nYou can export our conversation:\n\n• Click the **download icon (📥)** in the chat header above\n• Choose "Export as Text" or "Export as JSON"\n• Share via email, WhatsApp, or save for yourself!\n\n**Your Full Numerology Report** is also available in all the tabs above. You can:\n• Take screenshots of specific sections\n• Print pages for journaling\n• Share insights with friends and family\n\nYour wisdom is worth preserving! ✨`;
      } else if (lowerMsg.includes('support') || lowerMsg.includes('help me') || lowerMsg.includes('contact') || lowerMsg.includes('talk to someone') || lowerMsg.includes('real person')) {
        // SUPPORT_ESCALATION intent - Human support contact
        fallbackMessage = `**I'm Here to Help! 🙏**\n\nIf you need additional support or have technical questions:\n\n📧 **Email:** support@karmank.com\n⏰ **Response Time:** Within 24 hours\n\nOur team is ready to assist you with:\n• Technical issues\n• Report clarifications\n• Feature requests\n• Billing questions\n\nIn the meantime, I can help you explore your numerology report. What specific question can I answer about your numbers, dashas, or cosmic influences?`;
      } else if (
        // FORECAST_GUIDANCE intent - Timing, daily/weekly/monthly energies, cosmic alignment
        lowerMsg.includes('today') || lowerMsg.includes('this week') || lowerMsg.includes('this month') ||
        lowerMsg.includes('right now') || lowerMsg.includes('current') || lowerMsg.includes('forecast') ||
        lowerMsg.includes('phase') || lowerMsg.includes('period') || lowerMsg.includes('cycle') ||
        lowerMsg.includes('energy') || lowerMsg.includes('vibration') || lowerMsg.includes('alignment') ||
        lowerMsg.includes('is this a good time') || lowerMsg.includes('should i start') ||
        lowerMsg.includes('should i wait') || lowerMsg.includes('upcoming')
      ) {
        const destinyNum = userContext?.destinyNumber || report?.destinyNumber;
        const basicNum = userContext?.basicNumber || report?.basicNumber;
        const currentDasha = userContext?.currentDasha || report?.basicNumber;
        const dashaDetails = DATA.numberDetails?.[currentDasha];

        // Detect time granularity
        let timeframe = 'general';
        if (lowerMsg.includes('today') || lowerMsg.includes('right now')) {
          timeframe = 'daily';
        } else if (lowerMsg.includes('this week') || lowerMsg.includes('week')) {
          timeframe = 'weekly';
        } else if (lowerMsg.includes('this month') || lowerMsg.includes('month')) {
          timeframe = 'monthly';
        } else if (lowerMsg.includes('phase') || lowerMsg.includes('cycle') || lowerMsg.includes('period')) {
          timeframe = 'phase';
        }

        if (currentDasha && dashaDetails) {
          const dashaName = dashaDetails.name?.en || '';
          const destinyTraits = DATA.destinyTraits?.[destinyNum];

          if (timeframe === 'daily') {
            const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
            fallbackMessage = `**Today's Cosmic Energy ☀️**\n\nYou're currently flowing through the **${dashaName}** dasha period. Today (${today}) carries its own unique vibration.\n\n**Current Influence:** Your Maha Dasha (${dashaName}) shapes the broader theme, while today's energy brings specific opportunities.\n\n**Focus for Today:**\n• Align with your Destiny ${destinyNum}'s purpose\n• Honor your inner nature (Basic ${basicNum})\n• Stay present with what arises\n\n**Guidance:** Each day within a dasha period has its own rhythm. Visit the **"Advanced Dasha"** tab to see your daily planetary influences and the **"Forecast"** tab for detailed timing guidance.\n\nToday is an opportunity to respond consciously to the energies you're being given.`;
          } else if (timeframe === 'weekly') {
            fallbackMessage = `**This Week's Energy Flow 🌙**\n\nYou're navigating through your **${dashaName}** dasha period, which colors this week's experiences.\n\n**Weekly Theme:** The ${dashaName} energy invites specific lessons and opportunities this week. Your responses shape your trajectory.\n\n**This Week's Focus:**\n• Work with your Destiny ${destinyNum}'s path\n• Notice patterns emerging\n• Stay flexible with changing energies\n\n**Mindful Timing:** Weeks within dasha periods have their own waves. Some days flow, others challenge—both serve your growth.\n\nExplore **"Advanced Dasha"** for detailed weekly influences and **"Forecast"** for deeper timing wisdom.`;
          } else if (timeframe === 'monthly') {
            fallbackMessage = `**This Month's Cosmic Blueprint 🌟**\n\nYour current **${dashaName}** Maha Dasha creates the foundation for this month's journey.\n\n**Monthly Energy:** This period invites you to integrate the lessons of ${dashaName} into your daily life. Each month within a dasha unfolds a specific chapter.\n\n**This Month's Invitation:**\n• Align decisions with your Destiny ${destinyNum}\n• Honor your emotional truth (Basic ${basicNum})\n• Trust the timing of your life\n\n**Growth Opportunity:** Months are containers for transformation. What you plant now will bloom in its right season.\n\nVisit **"Advanced Dasha"** to understand your monthly Pratyantara periods and **"Forecast"** for marriage, career, and life event timings.`;
          } else if (timeframe === 'phase') {
            const spiritualInsight = destinyTraits?.['Spiritual Insights']?.en || '';
            fallbackMessage = `**Your Current Life Phase 🌀**\n\nYou're in the **${dashaName}** Maha Dasha—a ${dashaName === 'Surya (Sun)' ? '1' : dashaName === 'Chandra (Moon)' ? '2' : dashaName === 'Guru (Jupiter)' ? '3' : dashaName === 'Rahu (North Node)' ? '4' : dashaName === 'Budh (Mercury)' ? '5' : dashaName === 'Shukra (Venus)' ? '6' : dashaName === 'Ketu (South Node)' ? '7' : dashaName === 'Shani (Saturn)' ? '8' : '9'}-year cycle of specific growth and development.\n\n**This Phase's Purpose:**\nYour soul is working through the energies of ${dashaName}. This entire period is designed to teach you specific lessons.\n\n${spiritualInsight ? `**Your Soul's Guidance:** ${spiritualInsight}\n\n` : ''}**How to Navigate This Phase:**\n• Trust the timing (even delays have purpose)\n• Respond rather than react to challenges\n• Stay aligned with your Destiny ${destinyNum}'s path\n\n**Remember:** You're exactly where you need to be. Explore **"Advanced Dasha"** to see when this phase transitions and **"Forecast"** for key life events during this cycle.`;
          } else {
            // General forecast guidance
            fallbackMessage = `**Understanding Your Cosmic Timing ⏰**\n\nYou're currently in the **${dashaName}** Maha Dasha, which governs the overarching theme of your life right now.\n\n**Timing Layers:**\n• **Maha Dasha (${dashaName}):** Your multi-year phase\n• **Yearly Dasha:** Changes each birthday\n• **Monthly Periods:** Shift every 16-74 days\n• **Daily Influences:** Based on the day of the week\n\n**Why Timing Matters:**\nCertain energies favor action, others favor patience. Understanding your current cycle helps you move with—not against—cosmic flow.\n\n**Your Numbers Guide Timing:**\n• Destiny ${destinyNum}: Shows what to pursue\n• Basic ${basicNum}: Shows how to respond\n• Current Dasha: Shows when energies support you\n\nExplore **"Advanced Dasha"** for your complete timeline and **"Forecast"** for specific life event predictions.`;
          }
        } else {
          fallbackMessage = `**Cosmic Timing & Forecast Guidance ⏰**\n\nUnderstanding the right timing for decisions, actions, and life events is one of numerology's greatest gifts.\n\n**Your Forecast Includes:**\n• Daily planetary influences\n• Weekly energy waves\n• Monthly cycles (Pratyantara periods)\n• Multi-year phases (Maha Dasha)\n• Life event timing (marriage, career changes, etc.)\n\n**To access your personalized forecast:**\n• Visit the **"Advanced Dasha"** tab for detailed timing\n• Check the **"Forecast"** tab for life event predictions\n\nI can provide specific guidance once your chart is generated. Each number in your chart has optimal and challenging periods—knowing these helps you make aligned decisions.`;
        }
      } else if (
        // SELF_DISCOVERY intent - Deep introspective questions about identity, patterns, nature
        lowerMsg.includes('who am i') || lowerMsg.includes('who i am') || lowerMsg.includes('true self') ||
        lowerMsg.includes('authentic self') || lowerMsg.includes('my nature') || lowerMsg.includes('my personality') ||
        lowerMsg.includes('repeating pattern') || lowerMsg.includes('keep repeating') || lowerMsg.includes('same pattern') ||
        lowerMsg.includes('why do i attract') || lowerMsg.includes('react') ||
        lowerMsg.includes('inner conflict') ||
        lowerMsg.includes('struggle with') || lowerMsg.includes('evolving') || lowerMsg.includes('transforming') ||
        lowerMsg.includes('shadow self') || lowerMsg.includes('hidden') || lowerMsg.includes('subconscious')
      ) {
        const destinyNum = userContext?.destinyNumber || report?.destinyNumber;
        const basicNum = userContext?.basicNumber || report?.basicNumber;
        const destinyTraits = DATA.destinyTraits?.[destinyNum];
        const destinyDetails = DATA.destinyNumberDetails?.[destinyNum];
        const basicDetails = DATA.numberDetails?.[basicNum];

        // Detect sub-pattern for personalized response
        let responseType = 'general';
        if (lowerMsg.includes('pattern') || lowerMsg.includes('repeat') || lowerMsg.includes('attract')) {
          responseType = 'patterns';
        } else if (lowerMsg.includes('emotional') || lowerMsg.includes('react') || lowerMsg.includes('feel')) {
          responseType = 'emotional';
        } else if (lowerMsg.includes('karmic') || lowerMsg.includes('soul') || lowerMsg.includes('past')) {
          responseType = 'karmic';
        } else if (lowerMsg.includes('struggle') || lowerMsg.includes('conflict') || lowerMsg.includes('resist')) {
          responseType = 'conflict';
        } else if (lowerMsg.includes('evolve') || lowerMsg.includes('transform') || lowerMsg.includes('growth')) {
          responseType = 'transformation';
        }

        if (destinyNum && basicNum) {
          const planet = destinyTraits?.Planet?.en || '';
          const goodQuality = destinyTraits?.['Good Quality']?.en || '';
          const drawback = destinyTraits?.['Drawback']?.en || '';
          const spiritualInsight = destinyTraits?.['Spiritual Insights']?.en || '';
          const basicName = basicDetails?.name?.en || '';
          const coreVibration = basicDetails?.coreVibration?.en || '';

          // Build response based on sub-pattern
          if (responseType === 'patterns') {
            fallbackMessage = `**Understanding Your Life Patterns ✨**\n\nYour Destiny Number **${destinyNum}** ${planet ? `(${planet})` : ''} and Basic Number **${basicNum}** (${basicName}) create a unique energetic signature that attracts certain experiences repeatedly.\n\n**Why Patterns Repeat:**\nYour core vibration is **${coreVibration}**. Until you master the lessons associated with these energies, similar situations will return to teach you what your soul needs to learn.\n\n${spiritualInsight ? `**Your Soul's Lesson:** ${spiritualInsight}\n\n` : ''}**Areas of Growth:** ${drawback || 'Self-awareness and conscious choice-making'}\n\nEvery repeated pattern is an invitation to respond differently. Explore the **"Forecast"** tab to understand your current growth phase.`;
          } else if (responseType === 'emotional') {
            fallbackMessage = `**Your Emotional Blueprint 💫**\n\nYour Basic Number **${basicNum}** (${basicName}) governs your emotional nature. Your core vibration—**${coreVibration}**—shapes how you process feelings and respond to the world.\n\n**Why You React This Way:**\nNumber ${basicNum} carries both gifts and challenges in the emotional realm. Your sensitivity is actually a strength when channeled consciously.\n\n**Your Emotional Strengths:** ${goodQuality || 'Empathy, intuition, depth of feeling'}\n\n**Growth Edge:** ${drawback || 'Learning to balance emotion with wisdom'}\n\nUnderstanding your emotional triggers helps you respond rather than react. Visit **"Numerology Traits"** for your complete emotional profile.`;
          } else if (responseType === 'karmic') {
            fallbackMessage = `**Your Karmic Imprint 🕉️**\n\nYour Destiny Number **${destinyNum}** reveals the karmic lessons your soul chose for this lifetime. Every challenge you face is purposeful.\n\n${spiritualInsight ? `**Soul Guidance:** ${spiritualInsight}\n\n` : ''}**Karmic Strengths:** ${goodQuality || 'Natural wisdom, inner knowing'}\n\n**Karmic Challenges:** ${drawback || 'Patterns requiring conscious transformation'}\n\nYou didn't take birth with this number by accident. Your soul selected these energies to grow through specific experiences. Each difficulty is shaping you toward your higher purpose.\n\nExplore **"Advanced Dasha"** to see which karmic period you're currently navigating.`;
          } else if (responseType === 'conflict') {
            const pathText = planet || 'your soul path';
            fallbackMessage = `**Navigating Inner Conflict 🌙**\n\nYour chart reveals a natural tension between your Destiny (${destinyNum}) and Basic (${basicNum}) numbers—this is where your growth lives.\n\n**The Struggle:**\nYour inner self (Basic ${basicNum}: ${coreVibration}) sometimes conflicts with your life purpose (Destiny ${destinyNum}: ${pathText}).\n\n**Why You Resist:** ${drawback || 'Change requires releasing old patterns that once protected you'}\n\n**Your Path Forward:** ${spiritualInsight || 'Integrate both energies—honor your nature while growing toward your destiny'}\n\nInner conflict isn't a problem to solve—it's a creative tension that births transformation. Visit **"Remedies & Guidance"** for balancing practices.`;
          } else if (responseType === 'transformation') {
            const changingText = planet || `number ${destinyNum}`;
            fallbackMessage = `**Your Transformation Journey 🦋**\n\nYes, you are evolving. Your Destiny Number **${destinyNum}** is calling you toward your higher expression, and your soul is responding.\n\n**What's Changing:**\nYou're integrating the lessons of ${changingText}. This phase feels uncomfortable because growth always dismantles old versions of self.\n\n**Emerging Qualities:** ${goodQuality || 'Wisdom, strength, authenticity'}\n\n**What's Falling Away:** ${drawback || 'Patterns that no longer serve your evolution'}\n\n${spiritualInsight ? `**Spiritual Insight:** ${spiritualInsight}\n\n` : ''}Trust this metamorphosis. The discomfort means you're expanding beyond your previous limits. Check **"Forecast"** to understand this transformation phase's timeline.`;
          } else {
            // General self-discovery response
            fallbackMessage = `**Who You Truly Are ✨**\n\nYour essence is captured in two sacred numbers:\n\n**Destiny ${destinyNum}** ${planet ? `(${planet})` : ''} - Your soul's purpose and outer expression\n**Basic ${basicNum}** (${basicName}) - Your inner nature and emotional core\n\n**Your Core Vibration:** ${coreVibration}\n\n**Natural Gifts:** ${goodQuality || 'Unique strengths waiting to be fully expressed'}\n\n**Growth Edges:** ${drawback || 'Areas inviting conscious development'}\n\n${spiritualInsight ? `**Soul Wisdom:** ${spiritualInsight}\n\n` : ''}You are not one fixed thing—you're an unfolding process. Your chart shows your potential, but YOU choose how to express these energies.\n\nExplore **"Numerology Traits"** for your complete personality analysis and **"Foundational Analysis"** for deeper patterns.`;
          }
        } else {
          fallbackMessage = `**Exploring Your True Nature ✨**\n\nDeep self-discovery questions like yours require understanding the full context of your numerology chart. Your numbers reveal:\n\n• Your soul's purpose (Destiny Number)\n• Your inner nature (Basic Number)\n• Your emotional patterns\n• Your karmic lessons\n• Your growth trajectory\n\nI can provide personalized insights once your chart is generated. For now, explore the tabs above—each section illuminates a different facet of who you are.\n\n**Start with:** "Numerology Traits" for personality insights, or "Foundational Analysis" for deeper patterns.`;
        }
      } else if (
        // EMOTIONAL_INSIGHT intent - Feelings, emotional states, sensitivity, overwhelm
        lowerMsg.includes('feeling') || lowerMsg.includes('feel') || lowerMsg.includes('emotion') ||
        lowerMsg.includes('overwhelm') || lowerMsg.includes('drained') || lowerMsg.includes('heavy') ||
        lowerMsg.includes('sensitive') || lowerMsg.includes('anxiety') || lowerMsg.includes('sad') ||
        lowerMsg.includes('disconnected') || lowerMsg.includes('lost') || lowerMsg.includes('burden') ||
        lowerMsg.includes('restless') || lowerMsg.includes('vulnerable') || lowerMsg.includes('upset') ||
        lowerMsg.includes('crying') || lowerMsg.includes('withdrawn') || lowerMsg.includes('pressure') ||
        lowerMsg.includes('stuck') || lowerMsg.includes('peace') || lowerMsg.includes('foggy') ||
        lowerMsg.includes('confused') || lowerMsg.includes('detached') || lowerMsg.includes('unprotected')
      ) {
        const destinyNum = userContext?.destinyNumber || report?.destinyNumber;
        const basicNum = userContext?.basicNumber || report?.basicNumber;
        const currentDasha = userContext?.currentDasha || report?.basicNumber;
        const destinyTraits = DATA.destinyTraits?.[destinyNum];
        const basicDetails = DATA.numberDetails?.[basicNum];
        const dashaDetails = DATA.numberDetails?.[currentDasha];

        // Detect emotional sub-type
        let emotionalType = 'general';
        if (lowerMsg.includes('drained') || lowerMsg.includes('exhausted') || lowerMsg.includes('tired')) {
          emotionalType = 'drained';
        } else if (lowerMsg.includes('overwhelm') || lowerMsg.includes('intense') || lowerMsg.includes('too much')) {
          emotionalType = 'overwhelmed';
        } else if (lowerMsg.includes('sensitive') || lowerMsg.includes('vulnerable') || lowerMsg.includes('unprotected')) {
          emotionalType = 'sensitive';
        } else if (lowerMsg.includes('anxiety') || lowerMsg.includes('anxious') || lowerMsg.includes('worried')) {
          emotionalType = 'anxiety';
        } else if (lowerMsg.includes('sad') || lowerMsg.includes('crying') || lowerMsg.includes('heavy')) {
          emotionalType = 'sadness';
        } else if (lowerMsg.includes('disconnected') || lowerMsg.includes('lost') || lowerMsg.includes('detached')) {
          emotionalType = 'disconnection';
        } else if (lowerMsg.includes('stuck') || lowerMsg.includes('stagnant') || lowerMsg.includes('trapped')) {
          emotionalType = 'stuck';
        }

        if (destinyNum && basicNum) {
          const coreVibration = basicDetails?.coreVibration?.en || '';
          const dashaName = dashaDetails?.name?.en || '';
          const spiritualInsight = destinyTraits?.['Spiritual Insights']?.en || '';
          const goodQuality = destinyTraits?.['Good Quality']?.en || '';

          // Build response based on emotional type
          if (emotionalType === 'drained') {
            fallbackMessage = `**Understanding Your Emotional Exhaustion 💫**\n\nFeeling drained isn't weakness—it's information. Your Basic Number **${basicNum}** governs your emotional energy reserves.\n\n**Why You Feel Drained:**\nYour core vibration (${coreVibration}) processes emotions deeply. When you absorb too much—from people, situations, or your own inner work—depletion happens.\n\n**Your Current Dasha (${dashaName})** may be intensifying this. Some planetary periods demand more emotional labor than others.\n\n**Immediate Relief:**\n• Honor the need to withdraw and recharge\n• Your sensitivity isn't a flaw—it's a gift requiring boundaries\n• Check **"Remedies & Guidance"** for energy restoration practices\n\n**Deeper Truth:** Exhaustion often signals misalignment. Are you giving energy to what truly matters?\n\nVisit **"Advanced Dasha"** to see if this is a temporary transit or a longer phase requiring adjustment.`;
          } else if (emotionalType === 'overwhelmed') {
            fallbackMessage = `**Navigating Emotional Overwhelm 🌊**\n\nFeeling overwhelmed is your system saying "Too much, too fast." Your Basic Number **${basicNum}** (${coreVibration}) has specific capacity thresholds.\n\n**Why This Is Happening:**\nYour current **${dashaName}** dasha is bringing more experiences than usual. Your emotional system is processing multiple layers simultaneously.\n\n**What Your Numbers Reveal:**\n• Destiny ${destinyNum}: Shows what you're meant to handle\n• Basic ${basicNum}: Shows your natural pace\n• When these conflict → overwhelm\n\n**How to Ground:**\n1. Pause everything non-essential\n2. Return to your body (breathe, move, rest)\n3. One thing at a time—your way, your pace\n\n**Soul Wisdom:** Overwhelm is often growth trying to happen too quickly. Slow down without stopping.\n\nCheck **"Forecast"** to see when this intensity phase shifts, and **"Remedies & Guidance"** for grounding practices.`;
          } else if (emotionalType === 'sensitive') {
            fallbackMessage = `**Honoring Your Sensitivity 🌸**\n\nYour heightened sensitivity right now isn't something to "fix"—it's your soul becoming more attuned.\n\n**Your Emotional Nature:**\nBasic Number **${basicNum}** (${coreVibration}) gives you emotional receptivity. Some periods amplify this—you feel EVERYTHING more deeply.\n\n**Current Influence:**\nYour **${dashaName}** dasha may be thinning the veil between you and subtle energies. This makes you more vulnerable but also more intuitive.\n\n**Why Sensitivity Surges:**\n• Growth phases heighten perception\n• Your soul is recalibrating\n• Old protective walls are dissolving\n\n**Protection Practices:**\n${goodQuality ? `Use your natural gifts: ${goodQuality}` : 'Ground daily, create energetic boundaries, limit exposure to harsh energies'}\n\n**Remember:** Sensitivity is spiritual strength when channeled consciously. You're not too sensitive—the world is too harsh.\n\nVisit **"Remedies & Guidance"** for energetic protection techniques and **"Numerology Traits"** to understand your empathic nature.`;
          } else if (emotionalType === 'anxiety') {
            fallbackMessage = `**Understanding Your Anxiety 🕊️**\n\nAnxiety is often future-focused fear meeting present-moment uncertainty. Your numbers hold keys to understanding this.\n\n**Your Emotional Blueprint:**\nBasic Number **${basicNum}** (${coreVibration}) processes uncertainty in specific ways. Anxiety often means your system senses change before your mind understands it.\n\n**Current Dasha Context:**\nThe **${dashaName}** period you're in can amplify restlessness. Some planetary energies naturally create inner agitation—it's not personal failure.\n\n**Root Causes:**\n• Control vs. Trust conflict\n• Transition between life phases\n• Unprocessed emotional material\n• Misalignment with your Destiny ${destinyNum}'s path\n\n${spiritualInsight ? `**Soul Message:** ${spiritualInsight}` : '**Guidance:** Your anxiety may be redirected life force. What does it want you to do differently?'}\n\n**Calming Practices:**\nCheck **"Remedies & Guidance"** for anxiety-specific mantras, breathwork, and gemstone support.\n\nVisit **"Forecast"** to understand if this anxiety phase is temporary or requires deeper life adjustments.`;
          } else if (emotionalType === 'sadness') {
            fallbackMessage = `**Holding Your Sadness Gently 💙**\n\nSadness that arrives "for no reason" often has the deepest reasons. Your soul is speaking.\n\n**Why You Feel This Way:**\nYour Basic Number **${basicNum}** (${coreVibration}) holds your emotional truth. Sometimes sadness is:\n• Grief for who you're becoming (letting old self die)\n• Release of accumulated unprocessed emotion\n• Soul-level recognition that change is needed\n\n**Current Dasha (${dashaName}) Context:**\nSome planetary periods bring melancholy—not as punishment but as invitation to go deeper.\n\n**What This Sadness May Be:**\n• Unexpressed creativity seeking outlet\n• Mourning a life path you're releasing\n• Deep empathy for collective pain\n• Soul fatigue from living inauthentically\n\n**Permission to Feel:**\nDon't rush to "fix" this. Sadness is sacred—it clears space for new joy.\n\n${spiritualInsight ? `**Your Soul's Wisdom:** ${spiritualInsight}` : '**Guidance:** Let yourself grieve. Transformation requires composting the old.'}\n\nVisit **"Remedies & Guidance"** for emotional healing practices and **"Numerology Traits"** to understand your emotional depth as gift.`;
          } else if (emotionalType === 'disconnection') {
            const disconnectionTruth = "You are not lost—you are becoming.";
            fallbackMessage = `**When You Feel Disconnected 🌑**\n\nFeeling lost or detached from yourself is often a sign you are between identities—shedding an old self, not yet inhabiting the new.\n\n**Your Numbers Explain This:**\n• Destiny ${destinyNum}: Your future self calling\n• Basic ${basicNum}: Your familiar self releasing\n• When these don't match → disconnection\n\n**Current Phase:**\nYour **${dashaName}** dasha is creating distance between who you were and who you are becoming. This liminal space feels empty but it is actually full of potential.\n\n**Why Disconnection Happens:**\n• You have outgrown old patterns but have not claimed new ones\n• Transition between life chapters\n• Soul preparing for quantum leap\n• Protection mechanism during intense change\n\n**How to Reconnect:**\n1. Stop trying to return to old self—that person is gone\n2. Be curious about who is emerging\n3. Trust the void—all creation starts here\n\n${spiritualInsight ? `**Soul Insight:** ${spiritualInsight}` : `**Truth:** ${disconnectionTruth}`}\n\nExplore **"Forecast"** to see when this transition phase completes and **"Advanced Dasha"** to understand the bigger arc.`;
          } else if (emotionalType === 'stuck') {
            const stuckGuidance = "Movement begins with tiny steps, not huge leaps.";
            fallbackMessage = `**Breaking Through Stuckness 🦋**\n\nFeeling stuck is not stagnation—it is resistance meeting necessary change. Your chart shows where the tension lives.\n\n**The Stuck Point:**\nYour Basic ${basicNum} (${coreVibration}) wants to stay safe. Your Destiny ${destinyNum} wants growth. The war between them creates paralysis.\n\n**Current Dasha (${dashaName}) Context:**\nThis planetary period may be forcing a choice you have been avoiding. Stuckness often precedes breakthrough.\n\n**What You Are Actually Stuck Between:**\n• Known suffering vs. unknown possibility\n• Safety vs. aliveness\n• Who you were vs. who you are meant to be\n\n**How to Unstick:**\n• Stuck is stored energy—where does it want to GO?\n• What decision are you avoiding?\n• What truth are you not speaking?\n\n${spiritualInsight ? `**Your Path:** ${spiritualInsight}` : `**Guidance:** ${stuckGuidance}`}\n\n**Action Steps:**\nVisit **"Forecast"** to see optimal timing for making moves, and **"Remedies & Guidance"** for breakthrough practices.`;
          } else {
            // General emotional insight
            fallbackMessage = `**Understanding Your Emotional State 💫**\n\nYour emotions are cosmic messengers. Right now, your inner world is speaking loudly.\n\n**Your Emotional Nature:**\nBasic Number **${basicNum}** (${coreVibration}) is your emotional foundation. This number determines how you feel, process, and express what moves through you.\n\n**Current Influences:**\n• **Destiny ${destinyNum}:** Your soul's direction (sometimes conflicts with emotional comfort)\n• **Current Dasha (${dashaName}):** The planetary energy coloring this period\n• **Natural Sensitivity:** Your chart shows depth of feeling\n\n**Why Emotions Intensify:**\nGrowth phases, dasha transitions, and soul evolution all amplify emotional experience. You're not broken—you're ALIVE.\n\n${spiritualInsight ? `**Soul Wisdom:** ${spiritualInsight}\n\n` : ''}**What Your Emotions Need:**\n• Acknowledgment (not dismissal)\n• Expression (not suppression)\n• Understanding (not judgment)\n\n**Guidance:** Emotions are energy in motion. Where do yours want to flow?\n\nVisit **"Numerology Traits"** for your complete emotional profile, **"Advanced Dasha"** to understand timing, and **"Remedies & Guidance"** for emotional balancing practices.`;
          }
        } else {
          fallbackMessage = `**I Hear Your Emotional Question 💙**\n\nEmotional questions like yours deserve deep, personalized answers. Once your numerology chart is generated, I can provide insights about:\n\n• Why you feel the way you do (Basic Number)\n• How your emotions connect to life purpose (Destiny Number)\n• Which planetary period is influencing your mood (Dasha)\n• Specific practices for emotional balance (Remedies)\n\n**For Now:**\nYour emotions are valid. If you're feeling intense emotions, know that:\n• Feelings are information, not weakness\n• Intensity often signals growth\n• You're not alone in this\n\n**Next Steps:**\nGenerate your chart using the form above, then ask me again. I'll provide personalized emotional insights based on YOUR numbers.\n\nIf you need immediate support, visit the **"Remedies & Guidance"** tab for general calming practices.`;
        }
      } else if (
        // COMPATIBILITY intent - Relationships, connections, bonds, family, friends
        lowerMsg.includes('compatible') || lowerMsg.includes('compatibility') ||
        lowerMsg.includes('connection') || lowerMsg.includes('relationship') ||
        lowerMsg.includes('partner') || lowerMsg.includes('with them') || lowerMsg.includes('with him') || lowerMsg.includes('with her') ||
        lowerMsg.includes('person i') || lowerMsg.includes('this person') ||
        lowerMsg.includes('bond') || lowerMsg.includes('chemistry') ||
        lowerMsg.includes('family') || lowerMsg.includes('parent') || lowerMsg.includes('sibling') || lowerMsg.includes('child') ||
        lowerMsg.includes('friend') || lowerMsg.includes('friendship') ||
        lowerMsg.includes('pull toward') || lowerMsg.includes('drawn to') ||
        lowerMsg.includes('argue') || lowerMsg.includes('clash') || lowerMsg.includes('tension') ||
        lowerMsg.includes('karmic') && (lowerMsg.includes('person') || lowerMsg.includes('relationship')) ||
        lowerMsg.includes('soulful') || lowerMsg.includes('soulmate')
      ) {
        const destinyNum = userContext?.destinyNumber || report?.destinyNumber;
        const basicNum = userContext?.basicNumber || report?.basicNumber;
        const destinyTraits = DATA.destinyTraits?.[destinyNum];
        const basicDetails = DATA.numberDetails?.[basicNum];

        // Detect relationship sub-type
        let relationType = 'general';
        if (lowerMsg.includes('romantic') || lowerMsg.includes('love') || lowerMsg.includes('dating') ||
            lowerMsg.includes('partner') || lowerMsg.includes('spouse') || lowerMsg.includes('boyfriend') ||
            lowerMsg.includes('girlfriend') || lowerMsg.includes('husband') || lowerMsg.includes('wife')) {
          relationType = 'romantic';
        } else if (lowerMsg.includes('new') && (lowerMsg.includes('person') || lowerMsg.includes('connection'))) {
          relationType = 'new';
        } else if (lowerMsg.includes('clash') || lowerMsg.includes('argue') || lowerMsg.includes('tension') ||
                   lowerMsg.includes('difficult') || lowerMsg.includes('challenging') || lowerMsg.includes('conflict')) {
          relationType = 'challenging';
        } else if (lowerMsg.includes('family') || lowerMsg.includes('parent') || lowerMsg.includes('sibling') ||
                   lowerMsg.includes('child') || lowerMsg.includes('household')) {
          relationType = 'family';
        } else if (lowerMsg.includes('friend') || lowerMsg.includes('friendship')) {
          relationType = 'friendship';
        }

        if (destinyNum && basicNum) {
          const coreVibration = basicDetails?.coreVibration?.en || '';
          const spiritualInsight = destinyTraits?.['Spiritual Insights']?.en || '';
          const goodQuality = destinyTraits?.['Good Quality']?.en || '';
          const drawback = destinyTraits?.['Drawback']?.en || '';

          // Build response based on relationship type
          if (relationType === 'romantic') {
            fallbackMessage = `**Understanding Romantic Compatibility 💕**\n\nTo provide accurate compatibility insights, I need BOTH people's birth details. Right now I can see your numbers, but I need theirs too.\n\n**Your Compatibility Blueprint:**\n• **Your Destiny ${destinyNum}:** Shows what you need in partnership\n• **Your Basic ${basicNum}** (${coreVibration}): Your emotional/intimate nature\n• **Your Relationship Patterns:** ${drawback || 'Tendencies in connection'}\n\n**What Makes YOU Compatible:**\n${goodQuality ? `You bring: ${goodQuality}` : 'Natural gifts in relationship'}\n\n**What YOU Need in Partnership:**\nSomeone who honors your Destiny ${destinyNum} path and understands your ${coreVibration} nature.\n\n**To Get Full Compatibility Analysis:**\n1. Visit the **Cosmic Compatibility** page from the homepage\n2. Enter both birth details\n3. Get detailed compatibility score (0-100)\n4. See harmony areas + challenge zones\n5. Receive relationship guidance\n\n${spiritualInsight ? `**Your Relationship Wisdom:** ${spiritualInsight}\n\n` : ''}For now, explore **"Numerology Traits"** to understand your relationship nature, and check **"Forecast"** for optimal relationship timing.`;
          } else if (relationType === 'new') {
            fallbackMessage = `**Evaluating New Connections 🌟**\n\nNew connections carry powerful potential—but also require discernment. Your numbers reveal what to look for.\n\n**Your Connection Criteria:**\n• **Destiny ${destinyNum}:** You need someone aligned with this life path\n• **Basic ${basicNum}** (${coreVibration}): Your emotional compatibility baseline\n• **Current Phase:** Some periods attract certain soul contracts\n\n**What to Notice:**\n✓ Do they respect your ${coreVibration} nature?\n✓ Do they support your Destiny ${destinyNum} growth?\n✓ Does the connection feel expansive or contracting?\n✓ Are you being authentic or performing?\n\n**Red Flags Based on Your Chart:**\n${drawback ? `Watch for: ${drawback} (your growth edge showing up in relationship)` : 'Notice if you are repeating old patterns'}\n\n**Green Flags:**\n${goodQuality ? `Look for someone who appreciates: ${goodQuality}` : 'Mutual respect and growth support'}\n\n**Quick Chemistry Check:**\nVisit **Cosmic Compatibility** page to run their numbers against yours. A score above 70 suggests natural harmony; below 50 means conscious work required.\n\n${spiritualInsight ? `**Soul Guidance:** ${spiritualInsight}` : '**Trust:** Your intuition knows. Numbers confirm what your soul already senses.'}\n\nCheck **"Forecast"** to see if this is a favorable period for new connections.`;
          } else if (relationType === 'challenging') {
            fallbackMessage = `**Navigating Challenging Relationships 🌊**\n\nTension in relationships is not always a red flag—sometimes it is a growth catalyst. Your chart shows your part in the dynamic.\n\n**Your Relationship Challenge Areas:**\n• **Basic ${basicNum}** (${coreVibration}): Your emotional reactivity patterns\n• **Destiny ${destinyNum}:** Life path conflicts (when their needs clash with yours)\n• **Growth Edge:** ${drawback || 'Patterns requiring conscious awareness'}\n\n**Why You Clash:**\n1. **Number Incompatibility:** Some number combinations create natural friction\n2. **Unhealed Patterns:** Your ${drawback || 'shadow aspects'} meeting theirs\n3. **Growth Opportunity:** This person mirrors what you need to integrate\n4. **Karmic Lessons:** Teaching each other through tension\n\n**Can This Be Healed?**\nIf both people are willing to grow, most tensions are workable. BUT—if the relationship consistently drains you, that is information.\n\n**Your Part in the Dynamic:**\n${goodQuality ? `Lead with: ${goodQuality}` : 'Bring your highest self to interactions'}\n\n**Questions to Ask:**\n• Am I being triggered or genuinely harmed?\n• Is this relationship helping me evolve or keeping me stuck?\n• Am I repeating old family patterns here?\n\n**Get Clarity:**\nRun a **Cosmic Compatibility** analysis to see your exact compatibility score and challenge zones.\n\n${spiritualInsight ? `**Wisdom:** ${spiritualInsight}` : '**Truth:** Not every connection is meant to last. Some are meant to teach.'}\n\nVisit **"Remedies & Guidance"** for relationship healing practices.`;
          } else if (relationType === 'family') {
            fallbackMessage = `**Understanding Family Compatibility 👨‍👩‍👧‍👦**\n\nFamily relationships are karmic by nature—you chose each other at soul level, even when it feels difficult.\n\n**Your Family Dynamic:**\n• **Your Destiny ${destinyNum}:** Your life path (may differ from family expectations)\n• **Your Basic ${basicNum}** (${coreVibration}): Your emotional nature (may not match family patterns)\n• **Generational Patterns:** Family karma you are here to heal or continue\n\n**Why Family Feels Hard Sometimes:**\n1. **Different Soul Missions:** Your Destiny ${destinyNum} may not fit family narrative\n2. **Karmic Contracts:** Working out past-life dynamics\n3. **Projection:** Family sees old version of you, not who you are becoming\n4. **Number Clashes:** Natural friction between certain numbers\n\n**Your Role in Family:**\n${spiritualInsight ? spiritualInsight : `You are learning to balance your authentic self with family connection`}\n\n**Healing Family Bonds:**\n• Accept you cannot change them—only yourself\n• Boundaries are love, not rejection\n• Understand their numbers to build compassion\n• Release need for them to understand you fully\n\n**Practical Steps:**\n1. Run **Cosmic Compatibility** for each family member\n2. Understand their core vibrations\n3. Adjust expectations based on their numbers\n4. Honor your own path while respecting theirs\n\n${drawback ? `**Your Growth Edge:** ${drawback} (may show up in family dynamics)` : ''}\n\nVisit **"Numerology Traits"** to understand how your number differs from typical family patterns.`;
          } else if (relationType === 'friendship') {
            fallbackMessage = `**Friendship Compatibility 🤝**\n\nTrue friendships are soul contracts—mutual growth partnerships that last lifetimes (or teach important lessons quickly).\n\n**Your Friendship Nature:**\n• **Basic ${basicNum}** (${coreVibration}): Your friendship style and needs\n• **Destiny ${destinyNum}:** What kind of friends support your growth\n• **Natural Gifts:** ${goodQuality || 'Qualities you bring to friendships'}\n\n**What You Need in Friends:**\n• People who respect your ${coreVibration} nature\n• Support for your Destiny ${destinyNum} path\n• Space to be authentically yourself\n• Mutual growth and inspiration\n\n**Signs of Aligned Friendship:**\n✓ You feel energized after time together\n✓ They celebrate your wins without jealousy\n✓ Comfortable silences and deep conversations\n✓ They see the real you, not the performance\n✓ Natural give-and-take balance\n\n**Signs of Misaligned Friendship:**\n✗ Consistently feeling drained after interactions\n✗ One-sided support or emotional labor\n✗ Competition rather than collaboration\n✗ Judgment of your growth and changes\n✗ Can only connect through gossip or drama\n\n**Friendship Evolution:**\nSome friendships are seasonal—meant for specific chapters. Others are lifelong. Both are valid.\n\n**Check Compatibility:**\nUse **Cosmic Compatibility** to see your friendship score with this person. Scores above 65 indicate natural ease; below 45 suggests different life paths.\n\n${spiritualInsight ? `**Guidance:** ${spiritualInsight}` : '**Remember:** Quality over quantity. A few soul-aligned friends matter more than many surface connections.'}\n\nExplore **"Numerology Traits"** to understand your ideal friendship style.`;
          } else {
            // General compatibility response
            fallbackMessage = `**Understanding Relationship Compatibility 💫**\n\nCompatibility is not about perfection—it is about two people choosing growth together. Your numbers reveal your relationship blueprint.\n\n**Your Connection Style:**\n• **Destiny ${destinyNum}:** What you need in ALL relationships\n• **Basic ${basicNum}** (${coreVibration}): Your core relational nature\n• **Relationship Gifts:** ${goodQuality || 'Natural strengths in connection'}\n• **Growth Areas:** ${drawback || 'Patterns to work with consciously'}\n\n**How Numerology Compatibility Works:**\n1. **Destiny to Destiny:** Life path alignment (where you are both going)\n2. **Basic to Basic:** Emotional compatibility (how you both feel/process)\n3. **Cross-Pattern:** Destiny-to-Basic dynamics (future vs. present self)\n4. **Dasha Influence:** Timing of connection (some periods attract certain people)\n\n**Compatibility Ranges:**\n• **85-100:** Soulmate-level natural harmony\n• **70-84:** Strong compatibility, minor adjustments\n• **55-69:** Workable with conscious effort\n• **40-54:** Challenging, requires significant growth from both\n• **Below 40:** Fundamental misalignment (unless karmic lesson)\n\n**What Creates True Compatibility:**\n✓ Mutual respect for life paths\n✓ Emotional safety and trust\n✓ Shared values and vision\n✓ Willingness to grow together\n✓ Complementary strengths\n\n**Get Detailed Analysis:**\nVisit the **Cosmic Compatibility** page from homepage to:\n• Enter both birth details\n• Get precise compatibility score\n• See harmony and challenge areas\n• Receive relationship guidance\n\n${spiritualInsight ? `**Your Relationship Wisdom:** ${spiritualInsight}\n\n` : ''}For now, explore **"Numerology Traits"** to understand your relationship patterns and **"Forecast"** to see optimal timing for relationship decisions.`;
          }
        } else {
          fallbackMessage = `**I Hear Your Relationship Question 💕**\n\nCompatibility questions deserve detailed, personalized answers. Once your numerology chart is generated, I can provide insights about:\n\n• Your relationship style (Basic Number)\n• What you need in partnerships (Destiny Number)\n• Your compatibility patterns and tendencies\n• Optimal timing for relationship decisions\n\n**For Detailed Compatibility Analysis:**\nKarmAnk has a dedicated **Cosmic Compatibility** feature! Visit the homepage and select the compatibility card to:\n• Compare two birth charts\n• Get a compatibility score (0-100)\n• See harmony and challenge areas\n• Receive relationship guidance\n\n**General Relationship Wisdom:**\n• Compatibility is about growth, not perfection\n• Challenging relationships can be powerful teachers\n• High compatibility does not guarantee success—conscious choice does\n• Your numbers show tendencies, not destiny\n\n**Next Steps:**\n1. Generate your chart using the form above\n2. Visit **Cosmic Compatibility** page for relationship analysis\n3. Ask me specific questions once both charts are available\n\nI am here to help you navigate all your relationships with clarity and wisdom! 💫`;
        }
      } else if (
        // OUT_OF_SCOPE intent - Security blocker for sensitive queries
        lowerMsg.includes('source code') || lowerMsg.includes('api key') || lowerMsg.includes('secret') ||
        lowerMsg.includes('credential') || lowerMsg.includes('database') || lowerMsg.includes('server log') ||
        lowerMsg.includes('algorithm') || lowerMsg.includes('implementation') || lowerMsg.includes('bypass security') ||
        lowerMsg.includes('model weight') || lowerMsg.includes('deployment') || lowerMsg.includes('github repo') ||
        lowerMsg.includes('private key') || lowerMsg.includes('production') && lowerMsg.includes('access')
      ) {
        fallbackMessage = `**I Cannot Help With That 🔒**\n\nFor security and privacy reasons, I cannot provide:\n\n❌ Source code or implementation details\n❌ API keys, secrets, or credentials\n❌ Database access or server logs\n❌ Internal algorithms or calculation methods\n❌ Model weights or deployment configurations\n❌ System infrastructure information\n\n**Why These Limits Exist:**\nProtecting your data, our intellectual property, and platform security requires strict boundaries.\n\n**What I CAN Help With:**\n✅ Understanding your numerology report\n✅ Explaining what your numbers mean\n✅ Compatibility analysis and forecasts\n✅ Emotional insights and guidance\n✅ Navigating the app features\n\n**Need Something Else?**\nAsk me about your chart, relationships, timing, or emotional patterns instead!`;
      } else if (
        // NEGATIVE_ENGAGEMENT intent - Handle user dissatisfaction gracefully
        lowerMsg.includes('wrong') || lowerMsg.includes('inaccurate') || lowerMsg.includes('does not feel right') ||
        lowerMsg.includes('doesn\'t feel right') || lowerMsg.includes('frustrated') || lowerMsg.includes('vague') ||
        lowerMsg.includes('unhelpful') || lowerMsg.includes('nonsense') || lowerMsg.includes('making me anxious') ||
        lowerMsg.includes('upset') || lowerMsg.includes('this seems') && lowerMsg.includes('off') ||
        lowerMsg.includes('don\'t relate') || lowerMsg.includes('dont relate') ||
        lowerMsg.includes('disagree with') || lowerMsg.includes('challenge') && lowerMsg.includes('result')
      ) {
        fallbackMessage = `**I Hear Your Concern 🙏**\n\nI understand this reading may not resonate with you right now. Your feedback is valuable and helps us improve.\n\n**Why Readings Sometimes Feel Off:**\n\n🌙 **Timing:** Some insights reveal themselves later in your journey\n\n🔄 **Context:** Your current state may not match the broader pattern yet\n\n✨ **Interpretation:** Numbers show tendencies and potential, not absolute certainties\n\n🌱 **Growth Phase:** If you are in rapid transformation, your chart reflects both who you were and who you are becoming\n\n**What I Can Do:**\n\n• Explain specific parts you question in a different way\n• Help you find sections that DO resonate with your experience\n• Connect you with human support for deeper clarity\n• Listen to what specifically feels misaligned\n\n**Your Voice Matters:**\nEmail: support@karmank.com with "Reading Concern" in the subject line. A real person will review your case.\n\n**Would you like me to re-explain a specific section?** Tell me which part feels off and I will approach it differently.`;
      } else if (
        // SYSTEM_HELP intent - App navigation and feature guidance
        lowerMsg.includes('how do i') || lowerMsg.includes('where can i') || lowerMsg.includes('where is') ||
        lowerMsg.includes('find my') || lowerMsg.includes('update my') || lowerMsg.includes('change my') ||
        lowerMsg.includes('download') || lowerMsg.includes('export') || lowerMsg.includes('settings') ||
        lowerMsg.includes('blank') || lowerMsg.includes('not loading') || lowerMsg.includes('not showing') ||
        lowerMsg.includes('error') || lowerMsg.includes('refresh') || lowerMsg.includes('regenerate')
      ) {
        // Detect help sub-category
        if (lowerMsg.includes('forecast') || lowerMsg.includes('prediction') || lowerMsg.includes('dasha')) {
          fallbackMessage = `**Finding Your Forecast 🗓️**\n\nYour forecast and dasha information are located in specific tabs:\n\n📍 **"Forecast" Tab:** Life predictions, marriage timing, child birth timing\n📍 **"Advanced Dasha" Tab:** Maha Dasha periods, yearly/monthly cycles\n\n**If Forecast Appears Blank:**\n• Ensure your birth details are complete (name, DOB, gender)\n• Scroll down—some forecasts load below the fold\n• Try refreshing the page (F5)\n• Regenerate your report with the form above\n\n**Still Not Showing?**\nEmail support@karmank.com with:\n• Screenshot of the blank section\n• Your name and DOB (we will verify privately)\n• Browser you are using\n\nWe will resolve it within 24 hours!`;
        } else if (lowerMsg.includes('update') || lowerMsg.includes('change') || lowerMsg.includes('edit') || lowerMsg.includes('correct')) {
          fallbackMessage = `**Updating Your Details ⚙️**\n\nTo update your name, date of birth, or gender:\n\n**Step 1:** Return to the homepage\n**Step 2:** Re-enter your information in the form\n**Step 3:** Click "Generate Report"\n\n**Important Notes:**\n• Changing details creates a NEW analysis (old reports remain unchanged)\n• Your previous reports are not automatically updated\n• If you made a typo, simply regenerate with correct info\n• Name spelling matters for name vibration analysis\n\n**Cannot Find Homepage?**\nClick the "KarmAnk" logo at the top left of the screen, or navigate to the main URL.\n\n**Need to Update Saved Data?**\nIf you need to permanently update stored information, email: support@karmank.com\n\nWe will assist you securely!`;
        } else if (lowerMsg.includes('download') || lowerMsg.includes('export') || lowerMsg.includes('save') || lowerMsg.includes('pdf')) {
          fallbackMessage = `**Saving Your Report 📄**\n\nYou can save your numerology analysis:\n\n**Print/Save as PDF:**\n• Use your browser's Print function (Ctrl+P / Cmd+P)\n• Choose "Save as PDF" as the printer destination\n• Captures all tabs and content\n\n**Screenshot:**\n• Use built-in screenshot tools\n• Windows: Win+Shift+S\n• Mac: Cmd+Shift+4\n\n**Coming Soon:**\nDedicated "Download Full Report" button is in development!\n\n**Need Help?**\nEmail support@karmank.com if you need a formatted PDF version manually sent to you.`;
        } else {
          fallbackMessage = `**App Help & Support 💡**\n\nI am here to help you navigate KarmAnk!\n\n**Common Questions:**\n\n📍 **Find Reports:** Check the 6 tabs at the top of your analysis\n   • Welcome, Foundational Analysis, Advanced Dasha, Forecast, Remedies, Traits\n\n⚙️ **Update Details:** Return to homepage and regenerate report\n\n📄 **Save Report:** Use browser Print (Ctrl+P / Cmd+P) → Save as PDF\n\n🔄 **Refresh Data:** Re-enter info on homepage to create new analysis\n\n❓ **Blank Sections:** Ensure birth details are complete; try refreshing page\n\n🔗 **Compatibility Analysis:** Visit homepage → select "Cosmic Compatibility" card\n\n**Still Stuck?**\nEmail: support@karmank.com with:\n• Clear description of your issue\n• Screenshots if possible\n• Browser and device type\n\n**Response Time:** Within 24 hours\n\nWhat specific feature do you need help with?`;
        }
      } else {
        fallbackMessage = `I'm Ishira, and I'm here to help! While I'm having trouble connecting to my knowledge base right now, you can find answers in the tabs above:\n\n• **Welcome** - Overview of your numbers\n• **Foundational Analysis** - Deep dive into patterns\n• **Advanced Dasha** - Planetary periods\n• **Forecast** - Life predictions\n• **Remedies & Guidance** - Personalized suggestions\n• **Numerology Traits** - Your characteristics\n\nWhat specific aspect would you like to explore?`;
      }

      const errorMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: fallbackMessage,
        timestamp: new Date(),
        source: 'fallback',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeedback = async (messageId, feedback) => {
    const message = messages.find((m) => m.id === messageId);
    if (!message || !message.conversationId) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      await fetch(`${CHAT_API_URL}/chat/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          conversationId: message.conversationId,
          feedback,
        }),
      });

      setMessages((prev) =>
        prev.map((m) =>
          m.id === messageId ? { ...m, userFeedback: feedback } : m
        )
      );
    } catch (err) {
      console.error('Failed to send feedback:', err);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isOpen) {
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(true)}
          className={`fixed top-1/2 right-8 -translate-y-1/2 w-20 h-20 bg-gradient-to-br from-purple-600 via-violet-600 to-indigo-600 rounded-full shadow-[0_0_40px_rgba(147,51,234,0.6)] flex items-center justify-center hover:scale-110 transition-all duration-300 z-[100] group ${
            justMounted ? 'animate-bounce' : ''
          }`}
          aria-label="Open chat"
        >
          <MessageCircle className="w-10 h-10 text-white" />
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white animate-pulse shadow-lg"></div>
          <div className="absolute inset-0 rounded-full bg-purple-400 animate-ping opacity-20"></div>
          <div className="absolute inset-0 rounded-full border-4 border-purple-400 animate-pulse"></div>
        </button>

        {justMounted && (
          <div className="fixed top-1/2 right-32 -translate-y-1/2 bg-gradient-to-r from-purple-600 to-violet-600 text-white px-4 py-2 rounded-lg shadow-xl z-[99] animate-pulse">
            <div className="text-sm font-semibold">💬 Ask me about your numerology!</div>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full w-0 h-0 border-l-8 border-l-purple-600 border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={`fixed top-1/2 right-8 -translate-y-1/2 bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-purple-500/30 z-[100] transition-all duration-300 ${
        isMinimized ? 'w-80 h-16' : 'w-96 h-[600px] max-h-[90vh]'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-purple-500/30 bg-gradient-to-r from-purple-900/50 to-violet-900/50 rounded-t-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-violet-600 rounded-full flex items-center justify-center relative">
            <MessageCircle className="w-5 h-5 text-white" />
            <Sparkles className="w-3 h-3 text-yellow-300 absolute -top-1 -right-1 animate-pulse" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Ishira</h3>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            aria-label={isMinimized ? "Expand" : "Minimize"}
          >
            <Minimize2 className="w-4 h-4 text-purple-300" />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Close chat"
          >
            <X className="w-4 h-4 text-purple-300" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="h-[calc(100%-200px)] overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-slate-800">
            {messages.length === 0 && (
              <div className="text-center py-12 px-4">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-600 to-violet-600 rounded-full flex items-center justify-center relative">
                  <MessageCircle className="w-8 h-8 text-white" />
                  <Sparkles className="w-4 h-4 text-yellow-300 absolute -top-1 -right-1 animate-pulse" />
                </div>
                <h4 className="font-semibold text-white mb-2">Namaste! I'm Ishira ✨</h4>
                <p className="text-sm text-purple-300 mb-4">
                  Your personal numerology guide. I can help you understand your numbers, dashas, and cosmic influences.
                </p>
              </div>
            )}

            {messages.map((message, index) => (
              <div key={message.id}>
                <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.role === 'user'
                        ? 'bg-gradient-to-br from-purple-600 to-violet-600 text-white'
                        : message.isError
                        ? 'bg-red-900/30 border border-red-500/30 text-red-300'
                        : 'bg-slate-800 text-white border border-purple-500/20'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>

                    {message.role === 'assistant' && !message.isError && (
                      <div className="flex items-center gap-2 mt-3 pt-2 border-t border-purple-500/20">
                        <span className="text-xs text-purple-300">Was this helpful?</span>
                        <button
                          onClick={() => handleFeedback(message.id, 'thumbs_up')}
                          className={`p-1 rounded transition-colors ${
                            message.userFeedback === 'thumbs_up'
                              ? 'bg-green-600 text-white'
                              : 'hover:bg-white/10 text-purple-300'
                          }`}
                          aria-label="Thumbs up"
                        >
                          <ThumbsUp className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleFeedback(message.id, 'thumbs_down')}
                          className={`p-1 rounded transition-colors ${
                            message.userFeedback === 'thumbs_down'
                              ? 'bg-red-600 text-white'
                              : 'hover:bg-white/10 text-purple-300'
                          }`}
                          aria-label="Thumbs down"
                        >
                          <ThumbsDown className="w-3 h-3" />
                        </button>
                        {message.source && (
                          <span className="text-xs text-purple-400 ml-auto flex items-center gap-1">
                            {message.source === 'deterministic' ? <Zap className="w-3 h-3" /> : '🤖'}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Show follow-up and generic questions after bot's response */}
                {message.role === 'assistant' &&
                 index === messages.length - 1 &&
                 !isLoading && (
                  <div className="mt-3 space-y-2">
                    {/* Follow-up questions based on context */}
                    {(() => {
                      const followUps = generateFollowUpQuestions(message);
                      return followUps.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {followUps.map((q, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleSuggestedQuestion(q)}
                              className="text-xs bg-purple-900/30 hover:bg-purple-600 border border-purple-500/30 text-purple-200 px-3 py-2 rounded-full transition-colors flex items-center gap-1"
                            >
                              <span>{q.icon}</span>
                              <span>{q.text}</span>
                            </button>
                          ))}
                        </div>
                      );
                    })()}

                    {/* "What else?" section with generic questions */}
                    <div>
                      <p className="text-xs text-cyan-300/70 mb-1.5">What else would you like to know?</p>
                      <div className="flex flex-wrap gap-2">
                        {getGenericQuestions().slice(0, 4).map((q, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSuggestedQuestion(q)}
                            className="text-xs bg-cyan-900/20 hover:bg-cyan-600/50 border border-cyan-500/20 text-cyan-200 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1"
                          >
                            <span>{q.icon}</span>
                            <span className="max-w-[120px] truncate">{q.text}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-800 border border-purple-500/20 rounded-2xl px-4 py-3">
                  <div className="flex gap-1 items-center">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    <span className="ml-2 text-xs text-purple-300">Ishira is thinking...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Questions Section */}
          {messages.length === 0 && (
            <div className="px-4 pb-2 space-y-3">
              {/* Personalized Quick Questions */}
              {suggestedQuestions.length > 0 && (
                <div>
                  <p className="text-xs text-purple-300 mb-2 font-medium">Quick Questions for You</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestedQuestions.map((q, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSuggestedQuestion(q)}
                        className="text-xs bg-gradient-to-r from-purple-600/40 to-pink-600/40 hover:from-purple-600 hover:to-pink-600 border border-purple-400/50 text-white px-3 py-2 rounded-full transition-all duration-200 flex items-center gap-1.5 shadow-md hover:shadow-lg"
                      >
                        <span>{q.icon}</span>
                        <span>{q.text}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Generic Common Questions */}
              <div>
                <p className="text-xs text-cyan-300 mb-2 font-medium">What else can I help with?</p>
                <div className="flex flex-wrap gap-2">
                  {getGenericQuestions().slice(0, 6).map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSuggestedQuestion(q)}
                      className="text-xs bg-cyan-900/30 hover:bg-cyan-600 border border-cyan-500/30 text-cyan-200 px-3 py-2 rounded-full transition-colors flex items-center gap-1"
                    >
                      <span>{q.icon}</span>
                      <span className="max-w-[150px] truncate">{q.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-purple-500/30 bg-slate-900/50">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about your numerology..."
                className="flex-1 bg-slate-800 border border-purple-500/30 rounded-xl px-4 py-3 text-sm text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                disabled={isLoading}
              />
              <button
                onClick={() => sendMessage()}
                disabled={!inputValue.trim() || isLoading}
                className="bg-gradient-to-br from-purple-600 to-violet-600 p-3 rounded-xl hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                aria-label="Send message"
              >
                <Send className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </>
      )}

    </div>
  );
}
