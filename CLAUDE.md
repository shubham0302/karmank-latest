# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**KarmAnk** is a React SPA that provides Vedic numerology readings and cosmic destiny reports. The application calculates numerological insights based on name, date of birth, and gender, then displays comprehensive analysis through a tabbed interface. Features authentication via Supabase and multiple analysis tools including numerology, name analysis, compatibility checking, and Bhagavad Gita wisdom.

**Key Technologies:** React 18, Vite, Tailwind CSS, Radix UI, Supabase, React Router, TypeScript/JavaScript (mixed)

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

1. **Entry Point:** `index.html` → [src/main.tsx](src/main.tsx) → [src/App.jsx](src/App.jsx)
2. **Authentication:** Supabase OTP-based email authentication wraps all routes via `AuthContext`
3. **Routing:** React Router with protected routes:
   - `/login` - OTP login page
   - `/` - HomePage (landing/dashboard with 6 module cards)
   - `/numerology` - Main KarmAnk numerology tool
   - `/name-analysis` - Name vibration analysis
   - `/compatibility` - Relationship compatibility checker
   - `/asset-vibration` - Property/business/asset compatibility analysis
   - `/gita-gyan` - Bhagavad Gita wisdom integration
   - `/career-path` - Psychometric profiling and career guidance
4. **Main Component:** `KarmAnkApp` in [src/karmank.jsx](src/karmank.jsx) manages numerology state and tab navigation
5. **User Input:** Collects name, DOB, gender via form
6. **Calculation Engine:**
   - Numerology calculations in [src/utils/calculators.js](src/utils/calculators.js)
   - Helper functions in [src/utils/helpers.js](src/utils/helpers.js)
7. **Data Source:** All static content (number meanings, yogas, remedies) in [src/data/data.js](src/data/data.js) (40K+ lines)
8. **Output:** 6 main tabs displaying various aspects of the numerology report

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
src/
├── components/
│   ├── tabs/                   # 6 main numerology views + special cards
│   │   ├── WelcomeTab.jsx
│   │   ├── FoundationalAnalysisTab.jsx
│   │   ├── AdvancedDashaTab.jsx
│   │   ├── ForecastTab.jsx
│   │   ├── RemediesAndGuidanceTab.jsx
│   │   ├── NumerologyTraitsTab.jsx
│   │   ├── NameAnalysisSection.jsx    # Pythagorean name analysis (in Welcome)
│   │   └── AssetVibrationCard.jsx     # Asset compatibility analysis (in Welcome)
│   ├── Remedies/              # 7 remedy-specific components
│   │   ├── RudrakshaTab.jsx
│   │   ├── MantrasTab.jsx
│   │   └── ChakraTab.jsx
│   ├── forecasts/             # Life event prediction components
│   │   ├── MarriageForecastTab.jsx
│   │   └── ChildBirthForecastTab.jsx
│   ├── dasha/                 # Dasha visualization components
│   │   ├── VedicDashaKundli.jsx
│   │   └── Dynamic*Display.jsx
│   └── auth/                  # Authentication components
│       ├── LoginPage.jsx
│       └── ProtectedRoute.jsx
├── pages/                     # Top-level page components
│   ├── HomePage.jsx
│   ├── NameAnalysisPage.jsx
│   ├── CompatibilityPage.jsx
│   ├── AssetVibrationPage.jsx   # Standalone asset compatibility page
│   ├── GitaGyanPage.jsx
│   └── CareerPathPage.jsx       # Psychometric profiling and career guidance
├── contexts/
│   └── AuthContext.jsx        # Supabase auth state management
└── lib/
    ├── supabase.js            # Supabase client configuration
    └── utils.js               # General utilities (cn, etc.)
```

### State Management Pattern

**Authentication (React Context):**
```javascript
// AuthContext provides: user, loading, signInWithOtp, verifyOtp, signOut
const { user, signOut } = useAuth()
```

**Numerology state in KarmAnkApp:**
```javascript
const [userData, setUserData] = useState({ dob, name, gender })
const [report, setReport] = useState(null)           // Main numerology report
const [dashaReport, setDashaReport] = useState(null) // All 4 dasha timelines
const [activeTab, setActiveTab] = useState('Welcome')
```

**Data Flow:**
1. User logs in via OTP → Supabase session stored → Navigate to protected route
2. User submits form → `handleGenerate()`
3. Calculate numerology and dasha reports
4. Store in state
5. Child components receive as props
6. Render appropriate tab content

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
   - `assetCompatibility` - Asset/property number compatibility with destiny numbers (auspicious, good, neutral, avoid)

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

### Authentication Flow
1. User navigates to any protected route → redirected to `/login`
2. User enters email → `signInWithOtp(email)` sends OTP to email
3. User enters 6-digit OTP → `verifyOtp(email, token)` validates
4. On success: Supabase creates session → `AuthContext` sets user state
5. `ProtectedRoute` checks `user` → if authenticated, renders page; else redirects to `/login`
6. Sign out: `signOut()` → clears session → redirects to `/login`

### Special Features in Welcome Tab

The Welcome tab includes one specialized analysis card that appears above the main numerology snapshot:

**Name Analysis Section** ([NameAnalysisSection.jsx](src/components/tabs/NameAnalysisSection.jsx))
- Pythagorean numerology analysis of user's name
- Calculates Expression, Soul Urge, and Personality numbers
- Shows amplified traits from letter repetitions
- Displays Name-Destiny synergy (when DOB provided)
- Uses purple/indigo gradient holo-card styling

### Asset Vibration Page (Standalone)

**Asset Vibration Analysis** ([AssetVibrationPage.jsx](src/pages/AssetVibrationPage.jsx))
- **Independent page** accessible from HomePage via `/asset-vibration` route (5th holo card)
- User enters name + DOB to calculate Destiny & Basic numbers
- Analyzes compatibility of properties, businesses, vehicles, investments with user's destiny
- Uses `DATA.assetCompatibility` for compatibility ratings (no calculation changes)
- Interactive: user selects asset type (6 categories) and enters asset number (1-9)
- Shows status (Auspicious/Good/Neutral/Avoid) with color-coded results
- Includes complete compatibility matrix and remedial suggestions
- Uses purple/violet gradient holo-card styling matching HomePage aesthetic
- **Core Logic:** Preserved from existing `DATA.assetCompatibility` structure

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

## Environment Configuration

**Required Environment Variables:**
```bash
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

These are configured in [src/lib/supabase.js](src/lib/supabase.js) and must be set for authentication to work. Create a `.env` file locally (not committed to git) or configure them in your hosting platform.

## TypeScript Configuration

- Path alias: `@/*` maps to `./src/*`
- Lenient settings: `noImplicitAny: false`, `strictNullChecks: false`
- Mixed `.js`, `.jsx`, `.ts`, and `.tsx` files allowed
- React SWC plugin for fast refresh

## Common Development Tasks

### Adding a New Page Route
1. Create page component in `src/pages/YourPage.jsx`
2. Add route in [src/App.jsx](src/App.jsx) within `<Routes>`
3. Wrap with `<ProtectedRoute>` if authentication required
4. Add navigation link in HomePage or relevant component

### Adding a New Numerology Tab
1. Create component in `src/components/tabs/YourTab.jsx`
2. Add tab name to `tabs` array in `KarmAnkApp`
3. Add case to switch statement in `renderTabContent()`
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

- **Client-side calculations:** All numerology calculations are performed in the browser
- **No report persistence:** Reports are not saved to database (session-only)
- **No testing:** No test suite currently exists
- **Large data file:** [data.js](src/data/data.js) is 40K+ lines and could benefit from code-splitting
- **No PDF export:** Consider adding in future
- **Supabase dependency:** Authentication requires Supabase configuration

## Building for Production

Run `npm run build` to create optimized production build in `dist/` directory.

**Deployment Notes:**
- The app uses React Router with client-side routing
- [vercel.json](vercel.json) configures SPA fallback (rewrites all routes to `/`)
- Set environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) in hosting platform
- Compatible with Vercel, Netlify, Cloudflare Pages, and other static hosting services
- Use `npm run preview` to test production build locally before deploying
