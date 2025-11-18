const fs = require('fs');

// New destiny traits data from the text file
const newDestinyTraits = {
  1: {
    Planet: { en: "Sun", hi: "सूर्य", "en-hi": "Sun (सूर्य)" },
    Finance: {
      en: "You are a lucky person and earn enough, but are extravagant and a spendthrift. You may not amass wealth but will make others believe you are rich.",
      hi: "आप एक भाग्यशाली व्यक्ति हैं और पर्याप्त कमाते हैं, लेकिन आप खर्चीले हैं। हो सकता है आप धन जमा न कर पाएं, लेकिन दूसरों को विश्वास दिला देंगे कि आप अमीर हैं।",
      "en-hi": "Aap ek lucky person hain aur kaafi kamate hain, lekin aap kharchile hain. Ho sakta hai aap daulat na jamma kar paayein, lekin doosron ko vishwas diladenge ki aap ameer hain."
    },
    "Health Defects": {
      en: "Generally good health, but you are susceptible to mental strain or worry, which can lead to nervous disorders or breakdowns.",
      hi: "आम तौर पर अच्छा स्वास्थ्य, लेकिन आप मानसिक तनाव या चिंता के प्रति संवेदनशील हैं, जो तंत्रिका संबंधी विकारों या नर्वस ब्रेकडाउन का कारण बन सकता है।",
      "en-hi": "Aam taur par acchi health, lekin aap mental strain ya chinta ke prati sensitive hain, jo nervous disorders ya breakdown ka kaaran ban sakta hai."
    },
    "Lucky Days": {
      en: "Sundays, Mondays, Thursdays",
      hi: "रविवार, सोमवार, गुरुवार",
      "en-hi": "Ravivar, Somvar, Guruwar"
    },
    "Lucky Colours": {
      en: "All shades of gold, yellow, orange, and purple",
      hi: "सुनहरी, पीली, नारंगी और बैंगनी रंग के सभी शेड",
      "en-hi": "Sunehre, peele, narangi aur baingani rang ke sabhi shades"
    },
    "Lucky Jewels": {
      en: "Ruby, Emerald, Moonstone, Pale green stone",
      hi: "माणिक, पन्ना, चंद्रमणि, हल्का हरा पत्थर",
      "en-hi": "Maanik, Panna, Chandramani, Halka hara patthar"
    },
    "Important Years": {
      en: "1, 19, 28, 37, 46, 55, 64, 73",
      hi: "1, 19, 28, 37, 46, 55, 64, 73",
      "en-hi": "1, 19, 28, 37, 46, 55, 64, 73"
    },
    "Friendly Number": {
      en: "1, 3, 4, 5, 7, 9",
      hi: "1, 3, 4, 5, 7, 9",
      "en-hi": "1, 3, 4, 5, 7, 9"
    },
    "As Wife": {
      en: "Aristocratic by temperament, you are passionate and need a virile husband. You are often disappointed if your partner is not of your choice.",
      hi: "स्वभाव से कुलीन, आप भावुक हैं और आपको एक पुरुषपूर्ण पति की आवश्यकता है। यदि आपका साथी आपकी पसंद का नहीं है तो आप अक्सर निराश होती हैं।",
      "en-hi": "Swabhav se aristocratic, aap passionate hain aur aapko ek virile husband chahiye. Agar partner aapki pasand ka nahi hai toh aap niraash hoti hain."
    },
    "As Husband": {
      en: "You are generous with a kind and loving heart, but you want your family to dance to your tune and will not tolerate disrespect.",
      hi: "आप दयालु और प्रेमपूर्ण हृदय से उदार हैं, लेकिन आप चाहते हैं कि आपका परिवार आपके धुन पर नाचे और आप अनादर बर्दाश्त नहीं करेंगे।",
      "en-hi": "Aap generous aur loving heart waale hain, lekin aap chahte hain ki aapki family aapke ishaaron par chale aur aap disrespect bardaasht nahi karenge."
    },
    "Good Quality": {
      en: "Aspiration, Attack, Authority, Confidence, Determination, Research, Vigour",
      hi: "आकांक्षा, आक्रमण, अधिकार, आत्मविश्वास, दृढ़ संकल्प, अनुसंधान, शक्ति",
      "en-hi": "Aspiration, Attack, Authority, Confidence, Determination, Research, Vigour"
    },
    Drawback: {
      en: "Aloofness, Domination, Impertinence, Inflexibility, Pride, Show, Spendthrift",
      hi: "अलगाव, प्रभुत्व, धृष्टता, अनम्यता, अभिमान, दिखावा, खर्चीला",
      "en-hi": "Aloofness, Domination, Impertinence, Inflexibility, Pride, Show, Spendthrift"
    },
    "Spiritual Insights": {
      en: "Learn to lead with wisdom and understanding, not just your ego.",
      hi: "सिर्फ अहंकार नहीं, बल्कि बुद्धि और समझ के साथ नेतृत्व करना सीखें।",
      "en-hi": "Sirf ahankar nahi, balki buddhi aur samajh ke saath netritva karein."
    }
  },
  2: {
    Planet: { en: "Moon", hi: "चंद्र", "en-hi": "Moon (चंद्र)" },
    Finance: {
      en: "You have a mediocre financial status because you are lethargic and do not like to do any hard work.",
      hi: "आपकी वित्तीय स्थिति mediocre (औसत) है क्योंकि आप सुस्त हैं और कोई भी कठिन काम करना पसंद नहीं करते हैं।",
      "en-hi": "Aapka financial status mediocre hai kyunki aap sust hain aur koi mehnati kaam karna pasand nahi karte."
    },
    "Health Defects": {
      en: "Prone to digestive and bowel issues (colic, constipation, typhoid), poor blood circulation, anaemia, diabetes, and asthmatic trouble.",
      hi: "पाचन और आंत की समस्याएं (पेट दर्द, कब्ज, टाइफाइड), खराब रक्त परिसंचरण, एनीमिया, मधुमेह और अस्थमा की परेशानी के प्रति संवेदनशील।",
      "en-hi": "Pet aur aant ki samasyaon (pet dard, kabz, typhoid), kharaab blood circulation, khoon ki kami, diabetes, aur asthmatic pareshani ho sakti hai."
    },
    "Lucky Days": {
      en: "Mondays, Tuesdays, Fridays",
      hi: "सोमवार, मंगलवार, शुक्रवार",
      "en-hi": "Somvar, Mangalvar, Shukrawar"
    },
    "Lucky Colours": {
      en: "All shades of white, cream, or blue",
      hi: "सफेद, क्रीम या नीले रंग के सभी शेड",
      "en-hi": "Safed, cream ya neele rang ke sabhi shades"
    },
    "Lucky Jewels": {
      en: "Pearls, Diamonds, Moonstone, Agate",
      hi: "मोती, हीरा, चंद्रमणि, अगेट",
      "en-hi": "Moti, Heera, Chandramani, Agate"
    },
    "Important Years": {
      en: "2, 11, 20, 29, 38, 47, 56, 65, 74",
      hi: "2, 11, 20, 29, 38, 47, 56, 65, 74",
      "en-hi": "2, 11, 20, 29, 38, 47, 56, 65, 74"
    },
    "Friendly Number": {
      en: "2, 4, 6, 9",
      hi: "2, 4, 6, 9",
      "en-hi": "2, 4, 6, 9"
    },
    "As Wife": {
      en: "You are sympathetic, affectionate, and devoted, but also moody, changeable, and sensitive. You are not much interested in the kitchen and are somewhat cold, lacking a fire of passion.",
      hi: "आप सहानुभूतिपूर्ण, स्नेही और समर्पित हैं, लेकिन मूडी, परिवर्तनशील और संवेदनशील भी हैं। आपको रसोई में ज्यादा दिलचस्पी नहीं है और आप कुछ हद तक ठंडी हैं, आप में जुनून की कमी है।",
      "en-hi": "Aap sympathetic, affectionate, aur devoted hain, lekin moody, changeable, aur sensitive bhi hain. Aapko kitchen mein zyada interest nahi hai aur aap thodi cold hain, passion ki kami hai."
    },
    "As Husband": {
      en: "There are two types: one is dominating, exacting, and fault-finding. The other type is passive, lazy, indulgent, and will marry for the sake of money.",
      hi: "दो प्रकार हैं: एक है दबंग, सख्त और गलतियां निकालने वाला। दूसरा प्रकार निष्क्रिय, आलसी, भोगी है और पैसे के लिए शादी करेगा।",
      "en-hi": "Do type hain: ek hai dominating, strict, aur galtiyan nikalne wala. Doosra type passive, lazy, indulgent hai aur paise ke liye shaadi karega."
    },
    "Good Quality": {
      en: "Sympathy, Fellowship, Honesty, Imagination, Simplicity, Ideality",
      hi: "सहानुभूति, साहचर्य, ईमानदारी, कल्पना, सादगी, आदर्शवादिता",
      "en-hi": "Sympathy, Fellowship, Honesty, Imagination, Simplicity, Ideality"
    },
    Drawback: {
      en: "Coldness, Envy, Haste, Intervention, Shyness, Whimsicality",
      hi: "शीतलता, ईर्ष्या, जल्दबाजी, हस्तक्षेप, शर्म, मनमौजीपन",
      "en-hi": "Coldness, Envy, Haste, Intervention, Shyness, Whimsicality"
    },
    "Spiritual Insights": {
      en: "Follow your gut feeling (intuition) rather than just relying on logic.",
      hi: "सिर्फ तर्क पर निर्भर न रहें, अपनी सहज अनुभूति (intuition) का पालन करें।",
      "en-hi": "Follow gut feeling, intuition over logic"
    }
  },
  3: {
    Planet: { en: "Jupiter", hi: "बृहस्पति", "en-hi": "Jupiter (बृहस्पति)" },
    Finance: {
      en: "You are lucky in financial matters, get opportunities for high-grade positions, and thereby earn quite a lot.",
      hi: "आप वित्तीय मामलों में भाग्यशाली हैं, उच्च-श्रेणी के पदों के अवसर प्राप्त करते हैं, और इस प्रकार बहुत कुछ अर्जित करते हैं।",
      "en-hi": "Aap financial maamlon mein lucky hain, high-grade positions ke mauke milte hain, aur is tarah kaafi kuch kamate hain."
    },
    "Health Defects": {
      en: "Has a major influence on the blood and the arterial system. Also governs the sense of smell, the lumbar region, the skin, and the kidneys.",
      hi: "रक्त और धमनी प्रणाली पर एक बड़ा प्रभाव डालता है। यह गंध की भावना, काठ का क्षेत्र, त्वचा और गुर्दे को भी नियंत्रित करता है।",
      "en-hi": "Blood aur arterial system par bada prabhav daalta hai. Yeh soonghne ki shakti, kamar ke hisse, skin, aur kidneys ko bhi control karta hai."
    },
    "Lucky Days": {
      en: "Tuesdays, Thursdays, Fridays",
      hi: "मंगलवार, गुरुवार, शुक्रवार",
      "en-hi": "Mangalvar, Guruwar, Shukrawar"
    },
    "Lucky Colours": {
      en: "All shades of yellow, violet, purple, and green",
      hi: "पीले, बैंगनी (violet), बैंगनी (purple), और हरे रंग के सभी शेड",
      "en-hi": "Peele, baingani (violet), baingani (purple), aur hare rang ke sabhi shades"
    },
    "Lucky Jewels": {
      en: "Topaz, Amethyst, Cat's eye",
      hi: "पुखराज, एमिथिस्ट, लहसुनिया",
      "en-hi": "Topaz, Amethyst, Cat's eye"
    },
    "Important Years": {
      en: "3, 12, 21, 30, 39, 48, 57, 66, 75",
      hi: "3, 12, 21, 30, 39, 48, 57, 66, 75",
      "en-hi": "3, 12, 21, 30, 39, 48, 57, 66, 75"
    },
    "Friendly Number": {
      en: "1, 3, 5, 6, 7",
      hi: "1, 3, 5, 6, 7",
      "en-hi": "1, 3, 5, 6, 7"
    },
    "As Wife": {
      en: "You're a caring and supportive partner who helps in your husband's work and manages the home well. You have a positive attitude towards love and family, and your approach to relationships is joyful and graceful.",
      hi: "आप देखभाल करने वाली और सहायक जीवनसाथी हैं जो अपने पति के कार्य में मदद करती हैं और घर का प्रबंधन अच्छी तरह करती हैं। आप प्रेम और परिवार के प्रति सकारात्मक दृष्टिकोण रखती हैं, और आपके संबंधों का तरीका आनंददायक और सुरुचिपूर्ण है।",
      "en-hi": "Aap caring aur supportive partner hain, husband ke kaam mein madad karti hain, relationship mein joyful aur graceful approach"
    },
    "As Husband": {
      en: "You tend to marry early and have big dreams, which can lead to expecting too much from your wife. You want a smart, charming, and confident partner, and you're most compatible with someone who's a number 3 or 6.",
      hi: "आप आमतौर पर जल्दी शादी करते हैं और बड़े सपने देखते हैं, जिससे पत्नी से बहुत अधिक अपेक्षा हो सकती है। आप एक स्मार्ट, आकर्षक और आत्मविश्वासी साथी चाहते हैं और आप सबसे अधिक संख्या 3 या 6 वाले व्यक्ति के साथ संगत हैं।",
      "en-hi": "Aap early marry karte hain, big dreams, expect zyada from wife, compatible with 3 or 6"
    },
    "Good Quality": {
      en: "Ambition, Dignity, Individuality, Philosophy, Prestige",
      hi: "महत्वाकांक्षा, गरिमा, व्यक्तित्व, दर्शन, प्रतिष्ठा",
      "en-hi": "Ambition, Dignity, Individuality, Philosophy, Prestige"
    },
    Drawback: {
      en: "Cruelty, Dictatorship, Hypocrisy, Spendthrift, Vanity",
      hi: "क्रूरता, तानाशाही, पाखंड, खर्चीला, घमंड",
      "en-hi": "Cruelty, Dictatorship, Hypocrisy, Spendthrift, Vanity"
    },
    "Spiritual Insights": {
      en: "Use your wisdom to help others, not just to feed your own pride.",
      hi: "अपनी बुद्धिमानी का उपयोग दूसरों की मदद करने के लिए करें, सिर्फ अपने अहंकार को बढ़ावा देने के लिए नहीं।",
      "en-hi": "Use wisdom to help others, not just feed ego"
    }
  },
  4: {
    Planet: { en: "Uranus", hi: "यूरेनस", "en-hi": "Uranus" },
    Finance: {
      en: "Usually well settled, but you experience delays and difficulties. Financial prosperity usually starts after the age of 40.",
      hi: "आमतौर पर अच्छी तरह से बसे हैं, लेकिन आपको देरी और कठिनाइयों का अनुभव होता है। वित्तीय समृद्धि आमतौर पर 40 साल की उम्र के बाद शुरू होती है।",
      "en-hi": "Aam taur par well-settled, lekin aapko deri aur mushkilon ka anubhav hota hai. Financial prosperity 40 saal ki umar ke baad shuru hoti hai."
    },
    "Health Defects": {
      en: "Trouble with the kidney or bladder, a weak respiratory system (breathlessness), and issues with the knees, shanks, and feet.",
      hi: "गुर्दे या मूत्राशय में परेशानी, एक कमजोर श्वसन प्रणाली (सांस फूलना), और घुटनों, पिंडलियों और पैरों के साथ समस्याएं।",
      "en-hi": "Kidney ya bladder mein pareshani, kamzor respiratory system (saans phoolna), aur ghutnon, pindliyon aur pairon mein samasya."
    },
    "Lucky Days": {
      en: "Sundays, Mondays, Saturdays",
      hi: "रविवार, सोमवार, शनिवार",
      "en-hi": "Ravivar, Somvar, Shanivar"
    },
    "Lucky Colours": {
      en: "Electric blue, Electric grey, White, Maroon",
      hi: "इलेक्ट्रिक नीला, इलेक्ट्रिक ग्रे, सफेद, मैरून",
      "en-hi": "Electric blue, Electric grey, Safed, Maroon"
    },
    "Lucky Jewels": {
      en: "Diamond, Coral, Pearl",
      hi: "हीरा, मूंगा, मोती",
      "en-hi": "Heera, Moonga, Moti"
    },
    "Important Years": {
      en: "4, 13, 22, 31, 40, 49, 58, 67, 76",
      hi: "4, 13, 22, 31, 40, 49, 58, 67, 76",
      "en-hi": "4, 13, 22, 31, 40, 49, 58, 67, 76"
    },
    "Friendly Number": {
      en: "1, 2, 4, 5, 7, 8, 9",
      hi: "1, 2, 4, 5, 7, 8, 9",
      "en-hi": "1, 2, 4, 5, 7, 8, 9"
    },
    "As Wife": {
      en: "You are smart and attractive with a strong will, but aim at several things and hardly succeed at one. You can be dictatorial, moody, headstrong, and sometimes cruel.",
      hi: "आप मजबूत इच्छाशक्ति के साथ स्मार्ट और आकर्षक हैं, लेकिन एक कई चीजों का लक्ष्य रखती हैं और शायद ही किसी एक में सफल होती हैं। आप तानाशाही, मूडी, हठी और कभी-कभी क्रूर हो सकती हैं।",
      "en-hi": "Aap strong will ke saath smart aur attractive hain, lekin kayi cheezon ka aim rakhti hain aur mushkil se hi ek mein safal hoti hain. Aap dictatorial, moody, ziddi aur kabhi-kabhi cruel ho sakti hain."
    },
    "As Husband": {
      en: "You are affectionate, emotional, and generous, but also quite possessive and dominating. You are shrewd, intelligent, and want all affairs to run as you desire.",
      hi: "आप स्नेही, भावुक और उदार हैं, लेकिन साथ ही काफी अधिकार जमाने वाले और दबंग भी हैं। आप चतुर, बुद्धिमान हैं और चाहते हैं कि सभी मामले आपकी इच्छानुसार चलें।",
      "en-hi": "Aap affectionate, emotional aur generous hain, lekin kaafi possessive aur dominating bhi hain. Aap chatur, intelligent hain aur chahte hain ki sabhi maamle aapki iccha se chalen."
    },
    "Good Quality": {
      en: "Activity, Endurance, Energy, Reliability, Method and system",
      hi: "गतिविधि, धैर्य, ऊर्जा, विश्वसनीयता, विधि और व्यवस्था",
      "en-hi": "Activity, Endurance, Energy, Reliability, Method and system"
    },
    Drawback: {
      en: "Changeable, Dominating, Stubborn, Vindictive, Jealous",
      hi: "परिवर्तनशील, दबंग, जिद्दी, प्रतिशोधी, ईर्ष्यालु",
      "en-hi": "Changeable, Dominating, Stubborn, Vindictive, Jealous"
    },
    "Spiritual Insights": {
      en: "Build your life on a foundation of good morals and principles.",
      hi: "अपनी जीवन यात्रा को अच्छे नैतिक और सिद्धांतों की नींव पर बनाएं।",
      "en-hi": "Life foundation on good morals aur principles"
    }
  },
  5: {
    Planet: { en: "Mercury", hi: "बुध", "en-hi": "Mercury (बुध)" },
    Finance: {
      en: "Number 5 is a business number, so you can expect opulence. You are lucky in your financial position.",
      hi: "नंबर 5 एक व्यापारिक नंबर है, इसलिए आप समृद्धि की उम्मीद कर सकते हैं। आप अपनी वित्तीय स्थिति में भाग्यशाली हैं।",
      "en-hi": "Number 5 ek business number hai, isliye aap opulence expect kar sakte hain. Aap apni financial position mein lucky hain."
    },
    "Health Defects": {
      en: "Your basic defect is biliousness and nervousness. This number rules over the nerves, neck, arms, ears, and the respiratory system.",
      hi: "आपका मूल दोष पित्त और घबराहट है। यह संख्या तंत्रिकाओं, गर्दन, बाहों, कानों और श्वसन प्रणाली पर शासन करती है।",
      "en-hi": "Aapka basic defect biliousness (pitt) aur nervousness hai. Yeh number nerves, gardan, baahon, kaanon aur respiratory system par shaasan karta hai."
    },
    "Lucky Days": {
      en: "Wednesdays, Fridays, Saturdays",
      hi: "बुधवार, शुक्रवार, शनिवार",
      "en-hi": "Budhwar, Shukrawar, Shanivar"
    },
    "Lucky Colours": {
      en: "White and green. You should not use red.",
      hi: "सफेद और हरा। आपको लाल रंग का प्रयोग नहीं करना चाहिए।",
      "en-hi": "Safed aur hara. Aapko laal rang ka istemaal nahi karna chahiye."
    },
    "Lucky Jewels": {
      en: "Emerald, Diamond, Sapphire (can also be used)",
      hi: "पन्ना, हीरा, नीलम (भी इस्तेमाल किया जा सकता है)",
      "en-hi": "Panna, Heera, Neelam (bhi istemaal kar sakte hain)"
    },
    "Important Years": {
      en: "5, 14, 23, 32, 41, 50, 59, 68, 77",
      hi: "5, 14, 23, 32, 41, 50, 59, 68, 77",
      "en-hi": "5, 14, 23, 32, 41, 50, 59, 68, 77"
    },
    "Friendly Number": {
      en: "1, 3, 4, 5, 7, 8",
      hi: "1, 3, 4, 5, 7, 8",
      "en-hi": "1, 3, 4, 5, 7, 8"
    },
    "As Wife": {
      en: "You have interest at home as well as outside and manage them well. You like tidiness and get it done through your commanding personality.",
      hi: "आपको घर के साथ-साथ बाहर भी दिलचस्पी है और आप उन्हें अच्छी तरह से प्रबंधित करती हैं। आपको साफ-सफाई पसंद है और आप इसे अपनी दबंग व्यक्तित्व के माध्यम से करवाती हैं।",
      "en-hi": "Aapko ghar ke saath-saath baahar bhi interest hai aur aap unhein acchi tarah manage karti hain. Aapko safai pasand hai aur aap ise apni commanding personality se karwa leti hain."
    },
    "As Husband": {
      en: "You are lucky and successful in married life. You love your partner, are proud of your wife, love children, are fond of home, and are liberal in spending.",
      hi: "आप शादीशुदा जीवन में भाग्यशाली और सफल हैं। आप अपने साथी से प्यार करते हैं, अपनी पत्नी पर गर्व करते हैं, बच्चों से प्यार करते हैं, और घर के शौकीन हैं और खर्च करने में उदार हैं।",
      "en-hi": "Aap shaadi-shuda zindagi mein lucky aur safal hain. Aap apne partner se pyaar karte hain, apni patni par garv karte hain, bachhon se pyaar karte hain, ghar ke shaukeen hain aur kharch karne mein liberal hain."
    },
    "Good Quality": {
      en: "Co-operation, Practicability, Shrewdness, Vigilance",
      hi: "सहयोग, व्यावहारिकता, चतुराई, सतर्कता",
      "en-hi": "Co-operation, Practicability, Shrewdness, Vigilance"
    },
    Drawback: {
      en: "Lack of perseverance, Scepticism, Unreliability",
      hi: "दृढ़ता की कमी, संदेहवाद, अविश्वसनीयता",
      "en-hi": "Lack of perseverance, Scepticism, Unreliability"
    },
    "Spiritual Insights": {
      en: "Focus on being truthful, not just on being clever or witty.",
      hi: "सिर्फ चालाक या बुद्धिमान बनने पर ध्यान न दें, बल्कि सच्चाई पर ध्यान केंद्रित करें।",
      "en-hi": "Sirf clever ya witty banne par nahi, truth par focus karein"
    }
  },
  6: {
    Planet: { en: "Venus", hi: "शुक्र", "en-hi": "Venus (शुक्र)" },
    Finance: {
      en: "You are not attracted towards money and opulence is a rarity for you. You prefer spending to saving.",
      hi: "आप पैसे की प्रति आकर्षित नहीं हैं और समृद्धि आपके लिए एक दुर्लभ वस्तु है। आप बचत करने से ज्यादा खर्च करना पसंद करते हैं।",
      "en-hi": "Aap paise ki taraf attract nahi hote aur dhan-daulat aapke liye rare hai. Aap bachat se zyada kharch karna pasand karte hain."
    },
    "Health Defects": {
      en: "On the whole you are a healthy person, but you are susceptible to epidemic fever, influenza, and are prone to nervousness.",
      hi: "कुल मिलाकर आप एक स्वस्थ व्यक्ति हैं, लेकिन आप महामारी बुखार, इन्फ्लूएंजा के प्रति संवेदनशील हैं, और घबराहट से ग्रस्त हैं।",
      "en-hi": "Aap ek healthy insaan hain, lekin aapko epidemic fever, influenza ho sakta hai, aur aap nervousness se grast rehte hain."
    },
    "Lucky Days": {
      en: "Mondays, Tuesdays, Thursdays, Fridays",
      hi: "सोमवार, मंगलवार, गुरुवार, शुक्रवार",
      "en-hi": "Somvar, Mangalvar, Guruwar, Shukrawar"
    },
    "Lucky Colours": {
      en: "All shades of blue, rose, and pink. It is advised that you avoid yellow.",
      hi: "नीले, गुलाब और गुलाबी रंग के सभी शेड। आपको पीले रंग से बचने की सलाह दी जाती है।",
      "en-hi": "Neele, gulab aur gulabi rang ke sabhi shades. Aapko peele rang se bachne ki salah di jaati hai."
    },
    "Lucky Jewels": {
      en: "Turquoise, Emerald, Pearl, Diamond",
      hi: "फ़िरोज़ा, पन्ना, मोती, हीरा",
      "en-hi": "Firoza, Panna, Moti, Heera"
    },
    "Important Years": {
      en: "6, 15, 24, 33, 42, 51, 60, 69, 78",
      hi: "6, 15, 24, 33, 42, 51, 60, 69, 78",
      "en-hi": "6, 15, 24, 33, 42, 51, 60, 69, 78"
    },
    "Friendly Number": {
      en: "2, 3, 6, 9",
      hi: "2, 3, 6, 9",
      "en-hi": "2, 3, 6, 9"
    },
    "As Wife": {
      en: "You are a devoted mother and a loving wife; a perfect housewife. You never resort to divorce and will endure extreme hardship.",
      hi: "आप एक समर्पित मां और एक प्यारी पत्नी हैं; एक आदर्श गृहिणी। आप कभी भी तलाक का सहारा नहीं लेती हैं और अत्यधिक कठिनाई सहन करेंगी।",
      "en-hi": "Aap ek devoted maa aur ek loving patni hain; ek perfect housewife. Aap kabhi divorce nahi leti hain aur atyadhik kathinai sahengi."
    },
    "As Husband": {
      en: "You usually marry early, and are a kind, generous, and devoted husband. You are impractical in not understanding material values.",
      hi: "आप आमतौर पर जल्दी शादी करते हैं, और एक दयालु, उदार और समर्पित पति होते हैं। आप भौतिक मूल्यों को न समझने में अव्यावहारिक हैं।",
      "en-hi": "Aap aam taur par jaldi shaadi karte hain, aur ek dayalu, udaar aur devoted pati hote hain. Aap material values ko na samajhne mein impractical hain."
    },
    "Good Quality": {
      en: "Harmony, Love, Peace, Strong memory",
      hi: "सद्भाव, प्रेम, शांति, मजबूत याददाश्त",
      "en-hi": "Harmony, Love, Peace, Strong memory"
    },
    Drawback: {
      en: "Absence of foresight, Interference, Moodiness, Timidity",
      hi: "दूरदर्शिता का अभाव, हस्तक्षेप, उदासी, डरपोकपन",
      "en-hi": "Absence of foresight, Interference, Moodiness, Timidity"
    },
    "Spiritual Insights": {
      en: "Don't let physical pleasures and worldly desires control your life.",
      hi: "शारीरिक सुख और सांसारिक इच्छाओं को अपने जीवन पर नियंत्रण न करने दें।",
      "en-hi": "Physical pleasures aur worldly desires se life control na hone dein"
    }
  },
  7: {
    Planet: { en: "Neptune", hi: "नेपच्यून", "en-hi": "Neptune" },
    Finance: {
      en: "It is difficult for you to amass wealth due to changes in life, but you can be a wealthy person if you find a job of your choice.",
      hi: "जीवन में बदलावों के कारण आपके लिए धन जमा करना मुश्किल है, लेकिन अगर आपको अपनी पसंद की नौकरी मिल जाए तो आप एक अमीर व्यक्ति बन सकते हैं।",
      "en-hi": "Life mein changes ke kaaran aapke liye daulat ikattha karna mushkil hai, lekin agar aapko apni pasand ki naukri mil jaaye toh aap ek ameer insaan ban sakte hain."
    },
    "Health Defects": {
      en: "Your main trouble is your nervous constitution. You are liable to suffer from faulty blood circulation, stomach disorders, and fever.",
      hi: "आपकी मुख्य परेशानी आपकी घबराहट है। आप खराब रक्त परिसंचरण, पेट की खराबी और बुखार से पीड़ित हो सकते हैं।",
      "en-hi": "Aapki main pareshani aapki nervous constitution hai. Aap kharaab blood circulation, pet ki kharabi aur bukhar se pareshan ho sakte hain."
    },
    "Lucky Days": {
      en: "Sundays, Mondays, Wednesdays, Thursdays",
      hi: "रविवार, सोमवार, बुधवार, गुरुवार",
      "en-hi": "Ravivar, Somvar, Budhwar, Guruwar"
    },
    "Lucky Colours": {
      en: "All shades of green and yellow",
      hi: "हरे और पीले रंग के सभी शेड",
      "en-hi": "Hare aur peele rang ke sabhi shades"
    },
    "Lucky Jewels": {
      en: "Topaz, Emerald, Moonstone, Cat's eye",
      hi: "पुखराज, पन्ना, चंद्रमणि, लहसुनिया",
      "en-hi": "Topaz, Panna, Moonstone, Cat's eye"
    },
    "Important Years": {
      en: "7, 16, 25, 34, 43, 52, 61, 70, 79",
      hi: "7, 16, 25, 34, 43, 52, 61, 70, 79",
      "en-hi": "7, 16, 25, 34, 43, 52, 61, 70, 79"
    },
    "Friendly Number": {
      en: "1, 3, 4, 5, 7, 8, 9",
      hi: "1, 3, 4, 5, 7, 8, 9",
      "en-hi": "1, 3, 4, 5, 7, 8, 9"
    },
    "As Wife": {
      en: "You are very moody and your behaviour is unpredictable. You get easily disturbed over small matters and expect your husband to look after you all the time.",
      hi: "आप बहुत मूडी हैं और आपका व्यवहार अप्रत्याशित है। आप छोटी-छोटी बातों पर आसानी से परेशान हो जाती हैं और उम्मीद करती हैं कि आपके पति हर समय आपकी देखभाल करें।",
      "en-hi": "Aap bahut moody hain aur aapka behaviour unpredictable hai. Aap chhoti-chhoti baaton par aasani se pareshan ho jaati hain aur expect karti hain ki aapke pati har samay aapki dekhbhaal karein."
    },
    "As Husband": {
      en: "You are very emotional and understand your wife's feelings. You are liberal, fond of picnics, travels, and the cinema, and are a spendthrift.",
      hi: "आप बहुत भावुक हैं और अपनी पत्नी की भावनाओं को समझते हैं। आप उदार हैं, पिकनिक, यात्रा और सिनेमा के शौकीन हैं, और एक खर्चीले व्यक्ति हैं।",
      "en-hi": "Aap bahut emotional hain aur apni patni ki feelings ko samajhte hain. Aap liberal hain, picnics, travels, aur cinema ke shaukeen hain, aur ek spendthrift (kharchile) hain."
    },
    "Good Quality": {
      en: "Austerity, Peace, Reflection, Serenity, Tolerance",
      hi: "तपस्या, शांति, चिंतन, शांति, सहिष्णुता",
      "en-hi": "Austerity, Peace, Reflection, Serenity, Tolerance"
    },
    Drawback: {
      en: "Despondency, Diffidence, Restlessness, Whimsicality",
      hi: "निराशा, संकोच, बेचैनी, मनमौजीपन",
      "en-hi": "Despondency, Diffidence, Restlessness, Whimsicality"
    },
    "Spiritual Insights": {
      en: "When you need time alone, use it for personal growth, not just to run away from problems.",
      hi: "जब आपको अकेले समय की आवश्यकता हो, इसका उपयोग व्यक्तिगत विकास के लिए करें, केवल समस्याओं से भागने के लिए नहीं।",
      "en-hi": "Alone time ka use personal growth ke liye karein, sirf problems se run karne ke liye nahi"
    }
  },
  8: {
    Planet: { en: "Saturn", hi: "शनि", "en-hi": "Saturn (शनि)" },
    Finance: {
      en: "You experience delay in all matters. Stability is achieved at a very late age, and you rarely succeed in getting opulence.",
      hi: "आपको सभी मामलों में देरी का अनुभव होता है। स्थिरता बहुत देर की उम्र में हासिल होती है, और आप शायद ही कभी समृद्धि प्राप्त करने में सफल होते हैं।",
      "en-hi": "Aapko sabhi maamlon mein deri ka anubhav hota hai. Stability bahut late age mein haasil hoti hai, aur aap shaayad hi kabhi opulence (samriddhi) paate hain."
    },
    "Health Defects": {
      en: "Prone to nervousness, irritation, trouble with legs, teeth, and ears. Paralysis, rheumatism, varicose veins, and hemorrhoids are likely.",
      hi: "घबराहट, चिड़चिड़ापन, पैरों, दांतों और कानों में परेशानी से ग्रस्त। पक्षाघात, गठिया, वेरिकोज़ नसें और बवासीर की संभावना है।",
      "en-hi": "Nervousness, irritation, pairon, daanton aur kaanon mein pareshani se grast. Paralysis, rheumatism (gathiya), varicose veins aur hemorrhoids (bawasir) ki sambhavna hai."
    },
    "Lucky Days": {
      en: "Wednesdays, Thursdays, Saturdays",
      hi: "बुधवार, गुरुवार, शनिवार",
      "en-hi": "Budhwar, Guruwar, Shanivar"
    },
    "Lucky Colours": {
      en: "Dark grey, Dark blue, Purple, Black",
      hi: "गहरा ग्रे, गहरा नीला, बैंगनी, काला",
      "en-hi": "Gehra Grey, Gehra Blue, Baingani, Kala"
    },
    "Lucky Jewels": {
      en: "Sapphire, Black pearl, Black diamond, Cat's eye, Amethyst",
      hi: "नीलम, काला मोती, काला हीरा, लहसुनिया, एमिथिस्ट",
      "en-hi": "Neelam, Kaala moti, Kaala heera, Cat's eye, Amethyst"
    },
    "Important Years": {
      en: "8, 17, 26, 35, 44, 53, 62, 71",
      hi: "8, 17, 26, 35, 44, 53, 62, 71",
      "en-hi": "8, 17, 26, 35, 44, 53, 62, 71"
    },
    "Friendly Number": {
      en: "3, 4, 5, 7, 8",
      hi: "3, 4, 5, 7, 8",
      "en-hi": "3, 4, 5, 7, 8"
    },
    "As Wife": {
      en: "You have a masculine personality and are capable and systematic. Your fault is that you lack feminine warmth, sentiment, and delicacy.",
      hi: "आपका व्यक्तित्व मर्दाना है और आप सक्षम और व्यवस्थित हैं। आपकी गलती यह है कि आप में स्त्रीण गर्मजोशी, भावुकता और कोमलता की कमी है।",
      "en-hi": "Aapki personality masculine hai aur aap kaabil aur systematic hain. Aapki galti yeh hai ki aap mein feminine warmth, sentiment aur nazakat ki kami hai."
    },
    "As Husband": {
      en: "You have a weak desire to get married and prefer loneliness; you may marry at a very late stage. You are very orthodox and can make married life miserable.",
      hi: "आप में शादी करने की इच्छा कमजोर है और आप अकेला रहना पसंद करते हैं; आप बहुत लेट से शादी कर सकते हैं। आप बहुत रूढ़िवादी हैं और शादीशुदा जीवन को दयनीय बना सकते हैं।",
      "en-hi": "Aap mein shaadi karne ki iccha kamzor hai aur aap akela rehna pasand karte hain; aap bahut late stage mein shaadi kar sakte hain. Aap bahut orthodox hain aur shaadi-shuda zindagi ko miserable bana sakte hain."
    },
    "Good Quality": {
      en: "Authority, Methodical, Practical, Steady, Systematic",
      hi: "अधिकार, व्यवस्थित, व्यावहारिक, स्थिर, स्व्यवस्थित",
      "en-hi": "Authority, Methodical, Practical, Steady, Systematic"
    },
    Drawback: {
      en: "Cynicism, Delay, Vindictiveness, Nervousness, Laziness",
      hi: "निंदक, देरी, प्रतिशोध, घबराहट, आलस्य",
      "en-hi": "Cynicism, Delay, Vindictiveness, Nervousness, Laziness"
    },
    "Spiritual Insights": {
      en: "Achieve your goals through patience and hard work, not by taking the easy way out.",
      hi: "धैर्य और कड़ी मेहनत के माध्यम से अपने लक्ष्यों को प्राप्त करें, आसान रास्ता अपनाने से नहीं।",
      "en-hi": "Dharya aur hard work ke through goals achieve karein, easy way se nahi"
    }
  },
  9: {
    Planet: { en: "Mars", hi: "मंगल", "en-hi": "Mars (मंगल)" },
    Finance: {
      en: "You are lucky in monetary affairs and earn far more than an average person. You are also very liberal while spending.",
      hi: "आप मौद्रिक मामलों में भाग्यशाली हैं और एक औसत व्यक्ति से कहीं अधिक कमाते हैं। आप खर्च करते समय भी बहुत उदार होते हैं।",
      "en-hi": "Aap monetary maamlon mein lucky hain aur ek average insaan se kahin zyada kamate hain. Aap kharch karte waqt bhi bahut liberal rehte hain."
    },
    "Health Defects": {
      en: "Your main health defect arises from heat; susceptible to piles, fevers, small pox, kidney or bladder stone problems, and throat trouble.",
      hi: "आपका मुख्य स्वास्थ्य दोष गर्मी से उत्पन्न होता है; बवासीर, बुखार, छोटी, गुर्दे या मूत्राशय की पथरी की समस्याओं और गले की परेशानी के प्रति संवेदनशील।",
      "en-hi": "Aapka main health defect garmi se hota hai; piles (bawasir), bukhar, small pox, kidney ya bladder stone ki samasyaon aur gale ki pareshani ho sakti hai."
    },
    "Lucky Days": {
      en: "Mondays, Tuesdays, Fridays",
      hi: "सोमवार, मंगलवार, शुक्रवार",
      "en-hi": "Somvar, Mangalvar, Shukrawar"
    },
    "Lucky Colours": {
      en: "All shades of red, white, and yellow",
      hi: "लाल, सफेद और पीले रंग के सभी शेड",
      "en-hi": "Laal, safed aur peele rang ke sabhi shades"
    },
    "Lucky Jewels": {
      en: "Topaz, Pearl, Ruby, Blood-stones, Garnet",
      hi: "पुखराज, मोती, माणिक, ब्लड-स्टोन, गार्नेट",
      "en-hi": "Topaz, Moti, Maanik, Blood-stones, Garnet"
    },
    "Important Years": {
      en: "9, 18, 27, 36, 45, 54, 63, 72",
      hi: "9, 18, 27, 36, 45, 54, 63, 72",
      "en-hi": "9, 18, 27, 36, 45, 54, 63, 72"
    },
    "Friendly Number": {
      en: "1, 2, 3, 4, 6, 7, 9",
      hi: "1, 2, 3, 4, 6, 7, 9",
      "en-hi": "1, 2, 3, 4, 6, 7, 9"
    },
    "As Wife": {
      en: "You are a wonderful wife for an ambitious person; a witty and clever conversationalist. You assist your husband in his business and may start your own activity.",
      hi: "आप एक महत्वाकांक्षी व्यक्ति के लिए एक अद्भुत पत्नी हैं; एक मजाकिया और चतुर वार्तालाप करने वाली। आप अपने पति के व्यवसाय में सहायता करती हैं और अपनी खुद की गतिविधि शुरू कर सकती हैं।",
      "en-hi": "Aap ek ambitious insaan ke liye ek wonderful patni hain; ek witty aur clever conversationalist. Aap apne pati ke business mein help karti hain aur apna khud ka kaam shuru kar sakti hain."
    },
    "As Husband": {
      en: "You are passionate, enthusiastic, and fond of family. You have a hot-tempered nature and are usually suspicious about your wife.",
      hi: "आप भावुक, उत्साही और परिवार के शौकीन हैं। आपका स्वभाव गर्म-मिजाज है और आप आमतौर पर अपनी पत्नी पर शक करते हैं।",
      "en-hi": "Aap passionate, enthusiastic aur family ke shaukeen hain. Aapka nature gusse wala hai aur aap aam taur par apni patni par shak karte hain."
    },
    "Good Quality": {
      en: "Activity, Courage, Dash, Energy, Enthusiasm",
      hi: "गतिविधि, साहस, तेज, ऊर्जा, उत्साह",
      "en-hi": "Activity, Courage, Dash, Energy, Enthusiasm"
    },
    Drawback: {
      en: "Destruction, Erratic, Hot-tempered, Impatient, Quarrelsome",
      hi: " विनाश, अनियमित, गर्म-मिजाज, अधीर, झगड़ालू",
      "en-hi": "Destruction, Erratic, Hot-tempered, Impatient, Quarrelsome"
    },
    "Spiritual Insights": {
      en: "Use your powerful energy for something meaningful and positive.",
      hi: "अपनी शक्तिशाली ऊर्जा का उपयोग किसी सार्थक और सकारात्मक चीज़ के लिए करें।",
      "en-hi": "Apni powerful energy ka use meaningful aur positive kaam ke liye karein"
    }
  }
};

console.log('Reading data.js file...');
const content = fs.readFileSync('src/data/data.js', 'utf8');

// Find the destinyTraits section
const destinyTraitsStart = content.indexOf('destinyTraits: {');
if (destinyTraitsStart === -1) {
  console.error('Could not find destinyTraits section!');
  process.exit(1);
}

// Find the end of destinyTraits (look for the closing brace before destinyProfessions)
const destinyProfessionsStart = content.indexOf('destinyProfessions: {', destinyTraitsStart);
if (destinyProfessionsStart === -1) {
  console.error('Could not find destinyProfessions section!');
  process.exit(1);
}

// Find the actual end of destinyTraits (before the comment for destinyProfessions)
const commentBeforeProfessions = content.lastIndexOf('// D) Professions', destinyProfessionsStart);
const destinyTraitsEnd = commentBeforeProfessions !== -1 ? commentBeforeProfessions : destinyProfessionsStart;

// Extract the parts before and after destinyTraits
const beforeDestinyTraits = content.substring(0, destinyTraitsStart);
const afterDestinyTraits = content.substring(destinyTraitsEnd);

// Build the new destinyTraits section
const newDestinyTraitsString = `destinyTraits: ${JSON.stringify(newDestinyTraits, null, 4)},\n\n  `;

// Combine all parts
const newContent = beforeDestinyTraits + newDestinyTraitsString + afterDestinyTraits;

// Write the updated content back to the file
fs.writeFileSync('src/data/data.js', newContent, 'utf8');

console.log('✅ Successfully updated destinyTraits section!');
console.log('📝 File updated: src/data/data.js');
console.log('\n📊 Updated destiny traits for all 9 numbers with comprehensive data including:');
console.log('  - Planet associations');
console.log('  - Finance traits');
console.log('  - Health defects');
console.log('  - Lucky days, colors, jewels');
console.log('  - Important years');
console.log('  - Friendly numbers');
console.log('  - As Wife / As Husband descriptions');
console.log('  - Good qualities');
console.log('  - Drawbacks');
console.log('  - Spiritual insights');
