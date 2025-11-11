# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**KarmAnk** is a client-side React SPA that provides Vedic numerology readings and cosmic destiny reports. The application calculates numerological insights based on name, date of birth, and gender, then displays comprehensive analysis through a tabbed interface.

**Key Technologies:** React 18, Vite, Tailwind CSS, Radix UI, TypeScript/JavaScript (mixed)

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (http://localhost:5173)
npm run dev

# Build for production (outputs to dist/)
npm run build

# Build in development mode
npm run build:dev

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Architecture

### Application Flow

1. **Entry Point:** `index.html` → `src/main.tsx` → `src/App.js` → `src/karmank.js`
2. **Main Component:** `KarmAnkApp` in [karmank.js](src/karmank.js) is the central hub managing all state and routing
3. **User Input:** Collects name, DOB, gender via form
4. **Calculation Engine:**
   - Numerology calculations in [src/utils/calculators.js](src/utils/calculators.js)
   - Helper functions in [src/utils/helpers.js](src/utils/helpers.js)
5. **Data Source:** All static content (number meanings, yogas, remedies) in [src/data/data.js](src/data/data.js) (40K+ lines)
6. **Output:** 6 main tabs displaying various aspects of the numerology report

### Core Calculation Functions

**[src/utils/calculators.js](src/utils/calculators.js):**
- `calculateNumerology(dob)` - Main calculation returning basic number, destiny number, kundli grid, yogas, and insights
- `dashaCalculator.calculateMahaDasha()` - 9-year planetary periods
- `dashaCalculator.calculateYearlyDasha()` - Annual cycles (100-year projection)
- `dashaCalculator.calculateMonthlyDasha()` - Pratyantara periods (16-74 days)
- `dashaCalculator.calculateDailyDasha()` - Daily influences

**[src/utils/helpers.js](src/utils/helpers.js):**
- `reduceToSingleDigit(num)` - Handles master numbers (11, 22, 33)
- `getText(obj, lang)` - Multi-language text retrieval
- `analyzeRecurringNumbers()` - Identifies number patterns in chart
- `checkAdvancedYoga()` - Pattern-based yoga detection
- `checkForSpecialRemedies()` - Generates context-aware remedies

### Component Structure

```
src/components/
├── tabs/                    # 6 main application views
│   ├── WelcomeTab.js
│   ├── FoundationalAnalysisTab.js
│   ├── AdvancedDashaTab.js
│   ├── ForecastTab.js
│   ├── RemediesAndGuidanceTab.js
│   └── NumerologyTraitsTab.js
├── Remedies/               # 7 remedy-specific components
│   ├── RudrakshaTab.js
│   ├── MantrasTab.js
│   ├── ChakraTab.js
│   └── ... (4 more)
├── forecasts/              # 6 life event prediction components
│   ├── MarriageForecastTab.js
│   ├── ChildBirthForecastTab.js
│   └── ... (4 more)
└── dasha/                  # Dasha visualization components
    ├── VedicDashaKundli.js
    └── Dynamic*Display.js
```

### State Management Pattern

**Local state in KarmAnkApp:**
```javascript
const [userData, setUserData] = useState({ dob, name, gender })
const [report, setReport] = useState(null)           // Main numerology report
const [dashaReport, setDashaReport] = useState(null) // All 4 dasha timelines
const [activeTab, setActiveTab] = useState('Welcome')
```

**Data Flow:**
1. User submits form → `handleGenerate()`
2. Calculate numerology and dasha reports
3. Store in state
4. Child components receive as props
5. Render appropriate tab content

### Multi-Language Support

All display text uses this pattern:
```javascript
{
  en: "English text",
  hi: "हिंदी पाठ",
  "en-hi": "Roman transliteration"
}
```

Use `getText(textObject, language)` helper to retrieve the appropriate language string.

## Data Structure

**[src/data/data.js](src/data/data.js)** contains:

1. **`combinationInsights`** - Object with keys like "1-1" through "9-9" containing multi-language insights for number pair combinations
2. **`DATA` object:**
   - `yogaDetails` - Yoga definitions with activation rules (arrays of digit patterns)
   - `numberDetails` - Core vibrations and meanings for numbers 1-9
   - `recurringNumberInfluence` - Multi-digit occurrence impacts
   - `rudrakshaRemedies` - Stone associations by number
   - `advancedRudrakshaRemedies` - Detailed remedy information
   - `mantras` - Sacred chanting formulas with Devanagari script
   - `specialRudrakshaRemedies` - Exception cases
   - `destinyBasedRemedies` - Destiny number specific remedies

## Important Implementation Details

### Master Numbers
Numbers 11, 22, and 33 are NOT reduced to single digits in the calculation logic. Check `reduceToSingleDigit()` in [helpers.js](src/utils/helpers.js:1) for implementation.

### Yoga Detection
Yogas are detected through pattern matching against `yogaDetails` activation rules. Rules are arrays of digit arrays that must be present in the kundli grid. Example:
```javascript
activationRules: [[1, 5], [2, 7]] // Requires 1+5 AND 2+7 in chart
```

### Dasha Calculations
- **Maha Dasha:** Cycles through numbers 1-9 based on basic number, with each dasha lasting its own number of years (e.g., dasha 6 lasts 6 years)
- **Yearly Dasha:** Based on birth weekday of each year (Sunday=1, Monday=2, etc.)
- **Monthly Dasha:** Uses `pratyantarDurationMap` for variable-length periods
- **Daily Dasha:** Based on weekday, reduced to single digit

### Kundli Grid
The kundli grid is a 3x3 matrix with numbers 1-9 in specific positions:
```
[4][9][2]
[3][5][7]
[8][1][6]
```
Each cell displays count of that digit appearing in the birth date.

## Styling

- **Framework:** Tailwind CSS with custom cosmic theme
- **Dark Mode:** Class-based via next-themes
- **Custom Colors:** `cosmic-blue`, `nebula-violet`, `auric-gold`, `stardust`
- **Fonts:**
  - Sans: Inter
  - Serif: Cinzel (for titles)
  - Devanagari: Noto Sans Devanagari (for mantras)
- **Component Library:** Radix UI for accessible primitives
- **Animations:** Framer Motion

## TypeScript Configuration

- Path alias: `@/*` maps to `./src/*`
- Lenient settings: `noImplicitAny: false`, `strictNullChecks: false`
- Mixed .js and .tsx files allowed

## Common Development Tasks

### Adding a New Tab
1. Create component in `src/components/tabs/YourTab.js`
2. Add tab button in `KarmAnkApp` tab navigation section
3. Add case to switch statement in tab content renderer
4. Pass required props (report, dashaReport, userData, etc.)

### Adding New Numerology Insights
1. Update `DATA` object in [src/data/data.js](src/data/data.js)
2. Add multi-language text objects for all new content
3. Update relevant tab component to display new data

### Modifying Calculations
1. Edit functions in [src/utils/calculators.js](src/utils/calculators.js)
2. Ensure return object structure matches what components expect
3. Test with various birth dates including:
   - Master numbers (11, 22, 33)
   - Special dates (22nd of any month)
   - Different weekdays for dasha calculations

### Adding Gender-Specific Content
Many components check `userData.gender` for differentiated display. Add male/female variations in the data objects where needed.

## Known Limitations

- **No backend:** All calculations are client-side
- **No persistence:** Reports not saved (no database)
- **No testing:** No test suite currently exists
- **Large data file:** [data.js](src/data/data.js) is 40K+ lines and could benefit from code-splitting
- **No PDF export:** Consider adding in future

## Building for Production

Run `npm run build` to create optimized production build in `dist/` directory. The app is fully static and can be deployed to any static hosting service (Vercel, Netlify, Cloudflare Pages, etc.) without special configuration.
